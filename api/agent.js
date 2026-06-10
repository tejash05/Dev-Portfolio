// Vercel serverless function: POST /api/agent
// V2-A "RAG Lite": builds safe portfolio context, retrieves relevant chunks,
// and calls Groq for the final recruiter-friendly answer.
//
// SECURITY:
// - GROQ_API_KEY is read from the environment only. It is NEVER sent to or
//   exposed in the frontend.
// - Only the user's question + selected safe chunks + safe portfolio facts are
//   sent to Groq. No internal source code is sent.
//
// If GROQ_API_KEY is missing or Groq fails, this returns { fallback: true } so
// the frontend gracefully uses the local V1 assistant.
//
// TODO (V2-B): secure backend rate limiting (Redis / Vercel KV / Upstash),
// embeddings + vector search, and full PDF parsing of the resume/research files.

import { retrieveChunks, buildSafeContext, classifyIntent } from "../src/utils/ragLite.js";
import {
  PROFILE_FACTS,
  PROJECT_FACTS,
  CATEGORY_FACTS,
  SECTION_IDS,
} from "../src/data/portfolioKnowledge.js";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
// Centralized model config so it can be swapped via env without code changes.
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

const VALID_CATEGORY_IDS = CATEGORY_FACTS.map((c) => c.id);
const VALID_PROJECT_IDS = PROJECT_FACTS.map((p) => p.id);

const JD_SIGNALS = [
  "responsibilities", "requirements", "qualifications", "must have",
  "nice to have", "we are looking", "you will", "job description",
];

const looksLikeJd = (text) => {
  const lower = (text || "").toLowerCase();
  const hits = JD_SIGNALS.filter((w) => lower.includes(w)).length;
  const long = text.length > 280 || text.split(/\s+/).length > 45;
  return hits >= 2 || (long && hits >= 1);
};

const safePortfolioFacts = () => {
  const projects = PROJECT_FACTS.map((p) => {
    const linkNotes = [];
    if (p.links?.github) linkNotes.push("has public GitHub");
    if (p.links?.publication) linkNotes.push("has IEEE publication");
    if (p.links?.private) linkNotes.push("private/internal, no public links");
    if (!p.links?.demo) linkNotes.push("no live demo link");
    return `- ${p.title} (${p.categoryId}): ${p.summary} [${linkNotes.join("; ")}]`;
  }).join("\n");

  return `Candidate: ${PROFILE_FACTS.name} — ${PROFILE_FACTS.title}.\nContact: ${PROFILE_FACTS.email}, ${PROFILE_FACTS.linkedin}, ${PROFILE_FACTS.github}.\n\nProjects:\n${projects}`;
};

const buildSystemPrompt = (isJd) => `You are "Tejash's Portfolio Agent", a concise, recruiter-friendly assistant embedded in Tejash Tarun's portfolio website.

Rules:
- Answer ONLY using the provided CONTEXT and PORTFOLIO FACTS. Do not invent facts.
- Never invent or guess URLs. Only mention links that appear in the context.
- Do not claim a project has a live demo unless the facts say a demo link exists.
- Keep answers short and recruiter-friendly (2-5 sentences). Avoid heavy jargon unless asked.
- This is a local/portfolio assistant. Do not claim to be GPT/Gemini/Claude.
${isJd ? `- The user pasted a job description. Provide: Overall fit (Strong/Moderate/Low), why it fits, best matching projects, missing/weaker areas, and 1-2 portfolio/resume improvement suggestions. End with: "AI-assisted analysis based on portfolio and resume context."` : ""}

You may optionally suggest UI actions. Respond as STRICT JSON only, no markdown:
{
  "answer": "string",
  "actions": [
    { "type": "navigate", "sectionId": "one of: ${SECTION_IDS.join(", ")}" },
    { "type": "filterProjects", "categoryId": "one of: ${VALID_CATEGORY_IDS.join(", ")}" },
    { "type": "highlightProjects", "projectIds": ["subset of: ${VALID_PROJECT_IDS.join(", ")}"] }
  ]
}
"actions" may be an empty array. Only include actions that are clearly helpful.`;

const sanitizeActions = (actions) => {
  if (!Array.isArray(actions)) return [];
  const clean = [];
  for (const a of actions) {
    if (!a || typeof a !== "object") continue;
    if (a.type === "navigate" && SECTION_IDS.includes(a.sectionId)) {
      clean.push({ type: "navigate", sectionId: a.sectionId });
    } else if (a.type === "filterProjects" && VALID_CATEGORY_IDS.includes(a.categoryId)) {
      clean.push({ type: "filterProjects", categoryId: a.categoryId });
    } else if (a.type === "highlightProjects" && Array.isArray(a.projectIds)) {
      const ids = a.projectIds.filter((id) => VALID_PROJECT_IDS.includes(id));
      if (ids.length) clean.push({ type: "highlightProjects", projectIds: ids });
    }
  }
  return clean;
};

const parseModelJson = (content) => {
  if (!content) return null;
  try {
    return JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    // No key configured — tell the frontend to use local mode.
    res.status(200).json({ fallback: true, reason: "missing-api-key" });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  const message = (body?.message || "").toString().trim();
  if (!message) {
    res.status(400).json({ error: "Missing message" });
    return;
  }

  const isJd = looksLikeJd(message);
  const { chunks } = retrieveChunks(message, { topK: 8 });
  const context = buildSafeContext(chunks);
  const intent = classifyIntent(message);

  const userContent = `PORTFOLIO FACTS:\n${safePortfolioFacts()}\n\nCONTEXT (retrieved chunks, intent=${intent}):\n${context}\n\nUSER QUESTION:\n${message}`;

  try {
    const groqRes = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.3,
        max_tokens: 700,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: buildSystemPrompt(isJd) },
          { role: "user", content: userContent },
        ],
      }),
    });

    if (!groqRes.ok) {
      res.status(200).json({ fallback: true, reason: `groq-${groqRes.status}` });
      return;
    }

    const data = await groqRes.json();
    const content = data?.choices?.[0]?.message?.content;
    const parsed = parseModelJson(content);

    if (!parsed || typeof parsed.answer !== "string") {
      // Could not parse JSON — return answer text only, let local rules handle actions.
      res.status(200).json({
        answer: (content || "").toString().slice(0, 2000) || "I couldn't generate a response. Try the local assistant.",
        actions: [],
        mode: "groq-rag-lite",
      });
      return;
    }

    res.status(200).json({
      answer: parsed.answer,
      actions: sanitizeActions(parsed.actions),
      mode: "groq-rag-lite",
    });
  } catch {
    res.status(200).json({ fallback: true, reason: "network-error" });
  }
}
