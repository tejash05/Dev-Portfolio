// Frontend client for the V2-A RAG Lite endpoint (/api/agent).
// Handles the daily soft-limit, network/endpoint failures, and maps API action
// types to the internal executeActions() shape. Any failure signals the caller
// to fall back to the local V1 assistant.
//
// This is a localStorage-based soft limit, so it applies per browser/device and
// is not a secure global limit.
// TODO (V2-B): for stronger production rate limiting, use backend-side
// IP/session-based limits with Redis, Vercel KV, or Upstash.

export const DAILY_LIMIT = 10;
const STORAGE_KEY = "portfolioAgent.usage";

const today = () => new Date().toISOString().slice(0, 10);

const readUsage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: today(), count: 0 };
    const parsed = JSON.parse(raw);
    if (parsed.date !== today()) return { date: today(), count: 0 };
    return { date: parsed.date, count: Number(parsed.count) || 0 };
  } catch {
    return { date: today(), count: 0 };
  }
};

const writeUsage = (usage) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
  } catch {
    // Ignore storage errors (private mode, etc.).
  }
};

export const getRemaining = () => Math.max(0, DAILY_LIMIT - readUsage().count);

const consume = () => {
  const usage = readUsage();
  writeUsage({ date: today(), count: usage.count + 1 });
};

// Map API action types -> internal executeActions() types.
const mapActions = (actions) => {
  if (!Array.isArray(actions)) return [];
  return actions
    .map((a) => {
      if (a.type === "navigate") return { type: "navigate", sectionId: a.sectionId };
      if (a.type === "filterProjects") return { type: "filter", categoryId: a.categoryId };
      if (a.type === "highlightProjects") return { type: "highlight", projectIds: a.projectIds };
      return null;
    })
    .filter(Boolean);
};

// Returns one of:
//   { status: "ok", answer, actions, mode }
//   { status: "limited" }
//   { status: "fallback", reason }
export const askAgent = async (message) => {
  if (getRemaining() <= 0) {
    return { status: "limited" };
  }

  try {
    const res = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      return { status: "fallback", reason: `http-${res.status}` };
    }

    const data = await res.json();
    if (data?.fallback || typeof data?.answer !== "string") {
      if (data?.reason?.startsWith("groq-")) {
        consume();
      }
      return { status: "fallback", reason: data?.reason || "no-answer" };
    }

    consume();
    return {
      status: "ok",
      answer: data.answer,
      actions: mapActions(data.actions),
      mode: data.mode || "groq-rag-lite",
    };
  } catch {
    return { status: "fallback", reason: "network-error" };
  }
};
