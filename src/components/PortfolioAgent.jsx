import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaRobot, FaTimes, FaPaperPlane, FaRegCopy, FaCheck } from "react-icons/fa";
import { usePortfolioUI } from "../context/portfolioUI";
import { executeActions, navigateToSection } from "../utils/agentActions";
import {
  AGENT_GREETING,
  LOCAL_HIRING_FALLBACK,
  STARTER_QUESTIONS,
  getAssistantRoute,
  runPortfolioAgent,
} from "../utils/portfolioAgent";
import { askAgent, getRemaining, DAILY_LIMIT } from "../utils/agentApiClient";
import {
  CONTACT_FALLBACK_EMAIL,
  submitContactMessage,
} from "../utils/contactApiClient";
import AgentOnboarding from "./AgentOnboarding";

const ONBOARDING_KEY = "portfolioAgentOnboardingSeen";
const CONTACT_FLOW_INITIAL = {
  status: "idle",
  name: "",
  email: "",
  company: "",
  message: "",
};
const CONTACT_FLOW_SIGNALS = [
  "contact tejash",
  "send message",
  "send him a message",
  "message him",
  "message tejash",
  "i want to reach out",
  "i want to contact him",
  "reach out to",
  "get in touch",
  "can i send a message",
  "can i contact him",
  "can i contact tejash",
  "contact inquiry",
  "hire/contact",
  "hiring inquiry",
  "recruiting inquiry",
  "recruitment inquiry",
];
const CONTACT_FLOW_ACTIVE_STATES = new Set([
  "collect_name",
  "collect_email",
  "collect_company",
  "collect_message",
  "confirm",
  "submitting",
]);
const CONFIRM_WORDS = new Set(["send", "yes", "confirm", "submit"]);
const CANCEL_WORDS = new Set(["cancel", "stop", "nevermind", "never mind"]);
const SKIP_COMPANY_WORDS = new Set(["skip", "none", "n/a", "na", "no"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let messageId = 0;
const nextId = () => {
  messageId += 1;
  return messageId;
};

const isContactFlowIntent = (value) => {
  const text = value.toLowerCase();
  return CONTACT_FLOW_SIGNALS.some((signal) => text.includes(signal));
};

const isCancelMessage = (value) => CANCEL_WORDS.has(value.trim().toLowerCase());

const formatContactSummary = ({ name, email, company, message }) =>
  [
    "Please confirm the details before I send this to Tejash:",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Company/Role: ${company || "Not provided"}`,
    `Message: ${message}`,
    "",
    "Reply 'send' to submit or 'cancel' to stop.",
  ].join("\n");

const getContactInputPlaceholder = (status) => {
  if (status === "collect_name") return "Enter your name...";
  if (status === "collect_email") return "Enter your email...";
  if (status === "collect_company") return "Company/Role, or type skip...";
  if (status === "collect_message") return "Write your message to Tejash...";
  if (status === "confirm") return "Type send to submit, or cancel...";
  return "Ask about Tejash, or paste a job description…";
};

const getEmptyContactPrompt = (status) => {
  if (status === "collect_name") return "Please enter your name so Tejash knows who is reaching out.";
  if (status === "collect_email") return "Please enter a valid email address so Tejash can reply.";
  if (status === "collect_company") return "You can enter a company/role, or type 'skip'.";
  if (status === "collect_message") return "Please enter a short message before I send it.";
  if (status === "confirm") return "Please reply 'send' to submit this message, or 'cancel' to stop.";
  return "";
};

const PortfolioAgent = () => {
  const { setSelectedProjectCategory, highlightProjects } = usePortfolioUI();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [sending, setSending] = useState(false);
  const [mode, setMode] = useState("local");
  const [remaining, setRemaining] = useState(DAILY_LIMIT);
  const [contactFlow, setContactFlow] = useState(CONTACT_FLOW_INITIAL);
  const [messages, setMessages] = useState([
    { id: nextId(), role: "agent", text: AGENT_GREETING },
  ]);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setRemaining(getRemaining());
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, sending]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Opening the assistant counts as having seen the onboarding tour.
  const openAgent = () => {
    try {
      localStorage.setItem(ONBOARDING_KEY, "true");
    } catch {
      // Ignore storage errors (private mode, etc.).
    }
    setOpen(true);
  };

  const controller = {
    navigate: navigateToSection,
    setCategory: setSelectedProjectCategory,
    highlight: highlightProjects,
  };

  const runLocal = (
    value,
    note,
    response = runPortfolioAgent(value),
    nextMode = "local"
  ) => {
    setMode(nextMode);
    setMessages((prev) => [
      ...prev,
      {
        id: nextId(),
        role: "agent",
        text: response.text,
        copyText: response.copyText,
        note,
      },
    ]);
    executeActions(response.actions, controller);
  };

  const addAgentMessage = (text, extra = {}) => {
    setMessages((prev) => [
      ...prev,
      {
        id: nextId(),
        role: "agent",
        text,
        ...extra,
      },
    ]);
  };

  const startContactFlow = () => {
    setMode("local");
    setContactFlow({ ...CONTACT_FLOW_INITIAL, status: "collect_name" });
    addAgentMessage("Sure — I can send a message to Tejash. What is your name?");
  };

  const cancelContactFlow = () => {
    setMode("local");
    setContactFlow(CONTACT_FLOW_INITIAL);
    addAgentMessage("No problem — I cancelled the contact flow.");
  };

  const handleContactFlowInput = async (value) => {
    if (isCancelMessage(value)) {
      cancelContactFlow();
      return;
    }

    setMode("local");
    const current = contactFlow;

    if (current.status === "collect_name") {
      if (!value.trim()) {
        addAgentMessage("Please enter your name so Tejash knows who is reaching out.");
        return;
      }
      setContactFlow((prev) => ({
        ...prev,
        status: "collect_email",
        name: value.trim(),
      }));
      addAgentMessage("Thanks. What email should Tejash reply to?");
      return;
    }

    if (current.status === "collect_email") {
      const email = value.trim().toLowerCase();
      if (!EMAIL_RE.test(email)) {
        addAgentMessage("Please enter a valid email address so Tejash can reply.");
        return;
      }
      setContactFlow((prev) => ({
        ...prev,
        status: "collect_company",
        email,
      }));
      addAgentMessage("Got it. What company or role is this about? You can type 'skip' if not applicable.");
      return;
    }

    if (current.status === "collect_company") {
      const company = SKIP_COMPANY_WORDS.has(value.trim().toLowerCase())
        ? ""
        : value.trim();
      setContactFlow((prev) => ({
        ...prev,
        status: "collect_message",
        company,
      }));
      addAgentMessage("Great. What message would you like to send to Tejash?");
      return;
    }

    if (current.status === "collect_message") {
      const message = value.trim();
      if (message.length < 10) {
        addAgentMessage("Please enter a short message with a little more detail before I send it.");
        return;
      }
      if (message.length > 2000) {
        addAgentMessage("Please keep your message under 2000 characters.");
        return;
      }
      const nextFlow = {
        ...current,
        status: "confirm",
        message,
      };
      setContactFlow(nextFlow);
      addAgentMessage(formatContactSummary(nextFlow));
      return;
    }

    if (current.status === "confirm") {
      const command = value.trim().toLowerCase();
      if (!CONFIRM_WORDS.has(command)) {
        addAgentMessage("Please reply 'send' to submit this message, or 'cancel' to stop.");
        return;
      }

      setContactFlow((prev) => ({ ...prev, status: "submitting" }));
      setSending(true);
      try {
        const result = await submitContactMessage({
          name: current.name,
          email: current.email,
          company: current.company,
          message: current.message,
          source: "portfolio-agent",
          website: "",
        });

        if (result.ok) {
          setContactFlow((prev) => ({ ...prev, status: "done" }));
          addAgentMessage(
            "Thanks — your message has been sent to Tejash. He can reply to you at the email you provided."
          );
        } else {
          setContactFlow((prev) => ({ ...prev, status: "error" }));
          addAgentMessage(
            `Sorry, I could not send the message right now. You can email Tejash directly at ${CONTACT_FALLBACK_EMAIL}.`,
            { copyText: CONTACT_FALLBACK_EMAIL }
          );
        }
      } catch {
        setContactFlow((prev) => ({ ...prev, status: "error" }));
        addAgentMessage(
          `Sorry, I could not send the message right now. You can email Tejash directly at ${CONTACT_FALLBACK_EMAIL}.`,
          { copyText: CONTACT_FALLBACK_EMAIL }
        );
      } finally {
        setSending(false);
      }
    }
  };

  const handleSend = async (rawText) => {
    const value = (rawText ?? input).trim();
    if (sending) return;
    if (!value) {
      if (CONTACT_FLOW_ACTIVE_STATES.has(contactFlow.status)) {
        addAgentMessage(getEmptyContactPrompt(contactFlow.status));
        setInput("");
      }
      return;
    }

    setMessages((prev) => [...prev, { id: nextId(), role: "user", text: value }]);
    setInput("");

    if (CONTACT_FLOW_ACTIVE_STATES.has(contactFlow.status)) {
      await handleContactFlowInput(value);
      return;
    }

    if (isContactFlowIntent(value)) {
      startContactFlow();
      return;
    }

    const localResponse = runPortfolioAgent(value);
    const routeInfo = getAssistantRoute(value, localResponse);

    if (routeInfo.route === "local") {
      runLocal(value, undefined, localResponse, "local");
      return;
    }

    setSending(true);

    try {
      const result = await askAgent(value);
      setRemaining(getRemaining());

      if (result.status === "ok") {
        setMode("groq-rag-lite");
        setMessages((prev) => [
          ...prev,
          { id: nextId(), role: "agent", text: result.answer },
        ]);
        executeActions(result.actions, controller);
      } else if (result.status === "limited") {
        const fallbackResponse =
          routeInfo.reason === "hiring_evaluation"
            ? { text: LOCAL_HIRING_FALLBACK, actions: [] }
            : localResponse;
        runLocal(
          value,
          "You've reached today's AI limit. Local Portfolio Agent is still available.",
          fallbackResponse,
          "local-fallback"
        );
      } else {
        const fallbackResponse =
          routeInfo.reason === "hiring_evaluation"
            ? { text: LOCAL_HIRING_FALLBACK, actions: [] }
            : localResponse;
        runLocal(
          value,
          "Using local portfolio mode.",
          fallbackResponse,
          "local-fallback"
        );
      }
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleCopy = async (message) => {
    if (!message.copyText) return;
    try {
      await navigator.clipboard.writeText(message.copyText);
      setCopiedId(message.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Clipboard may be unavailable; fail silently.
    }
  };

  const showStarters = messages.filter((m) => m.role === "user").length === 0;

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            key="agent-fab"
            type="button"
            onClick={openAgent}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            aria-label="Ask Portfolio Agent"
            className="group fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 backdrop-blur-md transition-all hover:border-cyan-200/40 hover:bg-white/[0.16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:bottom-6 sm:right-6"
          >
            <span className="absolute inset-0 -z-10 animate-pulse rounded-full bg-cyan-400/10 blur-md" />
            <FaRobot className="text-base text-cyan-200" />
            <span className="hidden sm:inline">Ask Portfolio Agent</span>
            <span className="sm:hidden">Agent</span>
          </motion.button>
        )}
      </AnimatePresence>

      {!open && <AgentOnboarding onTryAgent={openAgent} />}

      <AnimatePresence>
        {open && (
          <motion.div
            key="agent-panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            role="dialog"
            aria-label="Agentic Portfolio Assistant"
            className="fixed bottom-4 right-4 z-50 flex max-h-[80vh] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-white/15 bg-stone-950/80 shadow-2xl shadow-black/60 backdrop-blur-xl sm:bottom-6 sm:right-6 sm:h-[600px] sm:max-h-[80vh] sm:w-[400px]"
          >
            <div className="flex items-start justify-between gap-3 border-b border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-200/30 bg-cyan-200/10 text-cyan-200">
                  <FaRobot />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Agentic Portfolio Assistant
                  </h3>
                  <p className="mt-0.5 text-xs text-stone-400">
                    Ask about projects, skills, experience, research, or JD match.
                  </p>
                  {/* Mode indicator:
                      - Local Mode: no API key; works with `npm run dev` (V1 fallback).
                      - Groq RAG Lite: requires the `/api/agent` serverless function
                        and a `GROQ_API_KEY` (run `vercel dev` locally or deploy). */}
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                        mode === "groq-rag-lite"
                          ? "border-cyan-200/40 bg-cyan-200/10 text-cyan-100"
                          : "border-white/15 bg-white/5 text-stone-400"
                      }`}
                    >
                      {mode === "groq-rag-lite"
                        ? "Groq RAG Lite"
                        : mode === "local-fallback"
                        ? "Local Fallback"
                        : "Local Mode"}
                    </span>
                    <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-stone-400">
                      AI left: {remaining}/{DAILY_LIMIT}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close Portfolio Agent"
                className="rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <FaTimes />
              </button>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto p-4"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm ${
                      message.role === "user"
                        ? "rounded-br-sm bg-white text-stone-900"
                        : "rounded-bl-sm border border-white/10 bg-white/[0.06] text-stone-200"
                    }`}
                  >
                    {message.note && (
                      <p className="mb-1.5 text-[11px] font-medium text-cyan-200/80">
                        {message.note}
                      </p>
                    )}
                    {message.text}
                    {message.copyText && (
                      <button
                        type="button"
                        onClick={() => handleCopy(message)}
                        className="mt-2 flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-medium text-stone-300 transition-colors hover:border-cyan-200/40 hover:text-white"
                      >
                        {copiedId === message.id ? (
                          <>
                            <FaCheck className="text-cyan-300" /> Copied
                          </>
                        ) : (
                          <>
                            <FaRegCopy /> Copy message
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {sending && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.06] px-3.5 py-2.5">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400 [animation-delay:-0.2s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400 [animation-delay:-0.1s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400" />
                  </div>
                </div>
              )}

              {showStarters && (
                <div className="space-y-2 pt-1">
                  <p className="px-1 text-xs font-medium uppercase tracking-wider text-stone-500">
                    Try asking
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {STARTER_QUESTIONS.map((question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() => handleSend(question)}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-left text-xs text-stone-300 transition-colors hover:border-cyan-200/40 hover:bg-white/[0.08] hover:text-white"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-white/10 bg-white/[0.03] p-3">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder={getContactInputPlaceholder(contactFlow.status)}
                  aria-label="Message the Portfolio Agent"
                  className="max-h-28 min-h-[42px] flex-1 resize-none rounded-xl border border-white/10 bg-stone-900/80 px-3 py-2.5 text-sm text-stone-200 placeholder:text-stone-500 focus:border-cyan-200/40 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={!input.trim() || sending}
                  aria-label="Send message"
                  className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-white text-stone-900 transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                >
                  <FaPaperPlane className="text-sm" />
                </button>
              </div>
              <p className="mt-2 px-1 text-[10px] text-stone-500">
                {mode === "groq-rag-lite"
                  ? "Groq RAG Lite · only your question + safe portfolio context is sent"
                  : mode === "local-fallback"
                  ? "Local Fallback · Groq was unavailable or skipped after an attempted AI route"
                  : "Local Portfolio Assistant · runs in your browser · no data sent"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PortfolioAgent;
