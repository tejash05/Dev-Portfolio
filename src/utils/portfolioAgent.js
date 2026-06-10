// Local rule-based Portfolio Agent (V1).
// No external AI API. Pure intent detection + response building from portfolio
// data. Returns a response object: { text, actions, copyText }.
//
// actions is a list of { type, ... } descriptors that the UI executes via
// agentActions.js. Keeping logic here (and execution in the component) keeps the
// engine pure and testable, and makes it easy to swap in a real LLM in V2.

import {
  CONTACT,
  RESEARCH_PAPER,
  getProjectIdsByCategory,
} from "./portfolioContext";
import { isLikelyJobDescription, matchJobDescription } from "./jdMatcher";

const has = (text, ...words) => words.some((w) => text.includes(w));

const navigate = (sectionId) => ({ type: "navigate", sectionId });
const filter = (categoryId) => ({ type: "filter", categoryId });
const highlight = (projectIds) => ({ type: "highlight", projectIds });

// ---------------------------------------------------------------------------
// Role summaries
// ---------------------------------------------------------------------------
const ROLE_SUMMARIES = {
  fullstack: {
    label: "Full Stack Developer",
    text: "Yes — Tejash is a strong full-stack fit. He works across React, Next.js, Node.js, Express.js, REST APIs, authentication, dashboards, and database design (MSSQL, PostgreSQL, MongoDB). Relevant projects: nTRACK Executive, The Insights, XenoCRM, and HR Dashboard, plus full-stack internship experience at NDL Power Limited.",
    actions: [navigate("experience")],
  },
  "software-engineer": {
    label: "Software Engineer",
    text: "Tejash fits a software engineering role well: experience across the SDLC, building scalable apps, REST APIs, database work, and performance optimization with clean engineering practices. Experience at NDL Power Limited and SmartInternz, plus an IEEE publication, a HackSRM AIML win, and Smart India Hackathon (SIH) National Finalist recognition.",
    actions: [navigate("experience")],
  },
  aiml: {
    label: "AI/ML Engineer",
    text: "For AI/ML, Tejash has hands-on projects: SafeClick (XGBoost phishing detection), NeuroWell (Gemini/LLaMA/LangChain chatbot), and an IEEE-published Fall Detection research project using Gradient Boosting. He works with XGBoost, Gradient Boosting, Gemini, LangChain, LLaMA, and RAG pipelines — capped by the IEEE ETAACT 2026 paper and a HackSRM AIML win.",
    actions: [filter("aiml"), navigate("projects"), highlight(getProjectIdsByCategory("aiml"))],
  },
  genai: {
    label: "GenAI Developer",
    text: "For GenAI, Tejash built XenoCRM (AI message generation) and NeuroWell (emotion-aware chatbot), working with OpenAI, Gemini, LangChain, LLaMA, and RAG pipelines. This Portfolio Agent itself is built as a GenAI-ready feature, structured so real LLM/RAG can be added safely.",
    actions: [filter("aiml"), navigate("projects")],
  },
  frontend: {
    label: "Frontend Developer",
    text: "Yes — Tejash is a strong frontend fit. He builds responsive, modern UIs with React, Next.js, TypeScript, JavaScript, and TailwindCSS, including dashboards, charts, and auth flows. Relevant projects: The Insights (analytics dashboards), HR Dashboard (filters, charts, dark mode), and XenoCRM (campaign UI).",
    actions: [filter("fullstack"), navigate("projects"), highlight(getProjectIdsByCategory("fullstack"))],
  },
  backend: {
    label: "Backend Developer",
    text: "Yes — Tejash fits a backend role well. He builds REST APIs and services with Node.js, Express.js, and FastAPI, with authentication (JWT, OAuth), and performance work like pagination, query optimization, and indexing. Relevant work: nTRACK Executive (MSSQL-backed automation at NDL Power), The Insights (webhook ingestion + multi-tenant data), and XenoCRM (campaign delivery APIs).",
    actions: [navigate("experience")],
  },
  database: {
    label: "Database Developer",
    text: "For database-focused roles, Tejash works across MSSQL, PostgreSQL, MongoDB, and MySQL, with Prisma ORM, multi-tenant data isolation, and query optimization/indexing for performance. Proof points: nTRACK Executive (MSSQL workflows), The Insights (Prisma + PostgreSQL, tenant isolation), and XenoCRM (MongoDB). He's also a MongoDB Certified Associate Developer.",
    actions: [navigate("experience")],
  },
};

const detectRole = (text) => {
  if (has(text, "full stack", "fullstack", "full-stack")) return "fullstack";
  if (has(text, "genai", "generative")) return "genai";
  if (has(text, "ai/ml", "ai / ml", "machine learning", "ml engineer", "ai engineer", "data scientist"))
    return "aiml";
  if (has(text, "frontend", "front end", "front-end", "ui developer", "ui/ux", "react developer"))
    return "frontend";
  if (has(text, "backend", "back end", "back-end", "api developer", "server-side", "server side"))
    return "backend";
  if (has(text, "database", "dba", "sql developer", "data engineer"))
    return "database";
  if (has(text, "software engineer", "sde", "software developer")) return "software-engineer";
  return null;
};

// ---------------------------------------------------------------------------
// Recruiter message
// ---------------------------------------------------------------------------
const RECRUITER_MESSAGE =
  "Hi, I'm Tejash Tarun, a Software Engineer and Full Stack Developer with hands-on experience in React, Next.js, Node.js, Express.js, FastAPI, SQL, MongoDB, and AI/GenAI integrations. I've built industry-level workflow automation at NDL Power, full-stack dashboards and CRM systems, and AI/ML projects including SafeClick and an IEEE-published fall detection research project. I'd be happy to discuss relevant software engineering or AI/full-stack opportunities.";

const LOCAL_FALLBACK_PREFIX = "I'm Tejash Tarun's Portfolio Agent.";

const JD_ROUTING_SIGNALS = [
  "job description",
  "requirements",
  "responsibilities",
  "qualification",
  "qualifications",
  "role overview",
  "must have",
  "good to have",
  "experience required",
  "experience with",
];

const HIRING_EVALUATION_SIGNALS = [
  "should i hire",
  "should we hire",
  "hire him",
  "worth hiring",
  "shortlist",
  "interview him",
  "candidate fit",
  "good fit",
  "fit for this role",
  "strengths and gaps",
  "weakness",
  "weaknesses",
  "why should we select",
  "why should we reject",
  "recommend him",
  "worth shortlisting",
  "worth interviewing",
];

const LOCAL_INTENT_SIGNALS = {
  resume: ["resume", "cv", "download"],
  contact: ["contact", "email", "linkedin", "github", "connect"],
  navigation: ["show", "open", "navigate", "take me", "go to"],
  projects: ["project", "projects", "ai/ml projects", "full stack projects", "industry projects"],
  achievements: ["achievement", "achievements", "award", "certification"],
  research: ["research", "publication", "paper", "ieee"],
  skills: ["strongest skills", "skills", "tech stack"],
};

export const LOCAL_HIRING_FALLBACK =
  "Yes — Tejash is worth shortlisting for Software Engineer, Full Stack Developer, and AI/GenAI-oriented fresher roles. He has hands-on experience with React, Next.js, Node.js, Express, REST APIs, databases, dashboards, automation workflows, and AI integrations, supported by internship work, strong projects, hackathon achievements, and an IEEE research publication. For senior roles, he may need more production-scale ownership, but for fresher/junior full-stack or AI-enabled software roles, he is a strong fit.";

// ---------------------------------------------------------------------------
// JD match formatting
// ---------------------------------------------------------------------------
const formatJdMatch = (result) => {
  const lines = [
    `Overall match: ${result.level} (basic keyword-based match)`,
    `Matched skills: ${result.matchedSkills.length ? result.matchedSkills.join(", ") : "None detected"}`,
    `Missing or less visible skills: ${result.missingSkills.length ? result.missingSkills.join(", ") : "None — strong coverage"}`,
    `Best matching projects: ${result.bestProjects.length ? result.bestProjects.join(", ") : "See the Projects section"}`,
  ];
  if (result.improvements.length) {
    lines.push(`Suggested improvements: ${result.improvements.join(" ")}`);
  }
  return lines.join("\n");
};

// ---------------------------------------------------------------------------
// Main entry
// ---------------------------------------------------------------------------
export const runPortfolioAgent = (rawMessage) => {
  const message = (rawMessage || "").trim();
  const text = message.toLowerCase();

  if (!message) {
    return {
      text: "Ask me about Tejash's projects, skills, experience, research, or paste a job description for a quick match.",
      actions: [],
    };
  }

  // 1) Job description detection (highest priority).
  if (isLikelyJobDescription(message)) {
    const result = matchJobDescription(message);
    return {
      text: `Here's a basic keyword-based match against Tejash's portfolio:\n\n${formatJdMatch(result)}`,
      actions: [navigate("projects")],
    };
  }

  // 2) Explicit "compare with a job description" prompt (no JD pasted yet).
  if (
    has(text, "job description", "compare") &&
    !has(text, "react", "node", "python")
  ) {
    return {
      text: "Sure — paste the full job description here and I'll run a basic keyword-based match: overall fit, matched skills, gaps, and best-fit projects.",
      actions: [],
    };
  }

  // 3) Contact.
  if (has(text, "resume", "cv", "download")) {
    return {
      text: "You can download Tejash's main recruiter-facing resume from the hero section. Taking you to the top of the portfolio.",
      actions: [navigate("home")],
    };
  }

  // 4) Contact.
  if (has(text, "contact", "email", "reach", "get in touch", "connect", "linkedin", "github")) {
    return {
      text: `You can reach Tejash at ${CONTACT.email}. LinkedIn: ${CONTACT.linkedin} · GitHub: ${CONTACT.github}. Taking you to the contact section.`,
      actions: [navigate("contact")],
    };
  }

  // 5) Research.
  if (has(text, "research", "paper", "publication", "ieee", "fall detection")) {
    const link = RESEARCH_PAPER.publication
      ? ` IEEE publication: ${RESEARCH_PAPER.publication}.`
      : "";
    return {
      text: `Taking you to Research & Publications. Tejash published "${RESEARCH_PAPER.title}" at IEEE ETAACT 2026.${link}`,
      actions: [navigate("research")],
    };
  }

  // 6) Recruiter message / summary draft.
  if (has(text, "recruiter", "draft", "summary", "message", "cover letter", "intro")) {
    return {
      text: `Here's a short recruiter-friendly summary you can copy:\n\n${RECRUITER_MESSAGE}`,
      copyText: RECRUITER_MESSAGE,
      actions: [],
    };
  }

  // 7) Role-fit summary (only when the message is about fit/role, not "show projects").
  const wantsRoleSummary = has(
    text,
    "suitable",
    "fit",
    "good for",
    "role",
    "hire",
    "right candidate",
    "is tejash"
  );
  const role = detectRole(text);
  if (role && wantsRoleSummary) {
    const summary = ROLE_SUMMARIES[role];
    return {
      text: summary.text,
      actions: summary.actions,
    };
  }

  // 8) Strongest skills.
  if (has(text, "skill", "strength", "strong", "tech stack", "stack", "good at")) {
    return {
      text: "Tejash's strongest areas: full-stack development (React, Next.js, responsive component-based UI, frontend testing), backend & APIs (Node.js, Express.js, FastAPI, REST APIs, authentication/JWT, API and integration testing), databases (MSSQL, PostgreSQL, MongoDB, MySQL), and AI/ML/GenAI (XGBoost, Gemini, LangChain, RAG). Opening the Technologies section.",
      actions: [navigate("technologies")],
    };
  }

  // 9) AI/ML projects.
  if (has(text, "ai", "ml", "machine learning", "artificial intelligence") && has(text, "project", "show", "work")) {
    return {
      text: "Opening Core AI/ML Projects and highlighting Tejash's AI/ML work including SafeClick, NeuroWell, and Fall Detection Research.",
      actions: [filter("aiml"), navigate("projects"), highlight(getProjectIdsByCategory("aiml"))],
    };
  }

  // 10) Industry experience project.
  if (has(text, "industry", "industrial", "real-world", "real world", "production", "company project", "proves")) {
    return {
      text: "Opening Industry-Level Projects and highlighting nTRACK Executive — built for NDL Power field workflow automation: job orders, transformer sampling, QR tagging, GPS/selfie check-in, expenses, receipts, and offline sync.",
      actions: [filter("industry"), navigate("projects"), highlight(["ntrack"])],
    };
  }

  // 11) Full stack projects.
  if (has(text, "full stack", "fullstack", "full-stack", "dashboard", "crm", "web app")) {
    return {
      text: "Opening Full Stack Projects — The Insights (Shopify analytics), XenoCRM (AI campaign CRM), and HR Dashboard (employee analytics).",
      actions: [filter("fullstack"), navigate("projects"), highlight(getProjectIdsByCategory("fullstack"))],
    };
  }

  // 12) Experience.
  if (has(text, "experience", "intern", "internship", "work history", "ndl", "smartinternz", "salesforce")) {
    return {
      text: "Opening Experience. Tejash worked as a Full Stack Developer Intern at NDL Power Limited and as a Salesforce Developer at SmartInternz.",
      actions: [navigate("experience")],
    };
  }

  // 13) Hackathons.
  if (has(text, "hackathon", "hacksrm", "sih", "smart india", "won", "win")) {
    return {
      text: "Opening Hackathons. Highlights: HackSRM 6.0 AIML Track Winner and Smart India Hackathon (SIH) National Finalist.",
      actions: [navigate("hackathons")],
    };
  }

  // 14) Achievements.
  if (has(text, "achievement", "award", "certification", "certified", "accomplishment")) {
    return {
      text: "Opening Achievements: IEEE research publication, HackSRM AIML win, Smart India Hackathon (SIH) National Finalist, 270+ DSA problems, and MongoDB certification.",
      actions: [navigate("achievements")],
    };
  }

  // 15) Generic projects.
  if (has(text, "project", "portfolio", "build", "built")) {
    return {
      text: "Opening Projects. You can explore Industry-Level, Full Stack, and Core AI/ML categories. Ask me to show a specific category, like \"show his AI/ML projects\".",
      actions: [navigate("projects")],
    };
  }

  // 16) Fallback.
  return {
    text: `${LOCAL_FALLBACK_PREFIX} I can summarize his fit for a role, show full-stack or AI/ML projects, open his research, draft a recruiter message, or match a pasted job description. What would you like to explore?`,
    actions: [],
  };
};

const matchesAny = (text, signals) => signals.some((signal) => text.includes(signal));

const getLocalReason = (text) => {
  if (matchesAny(text, LOCAL_INTENT_SIGNALS.resume)) return "resume";
  if (matchesAny(text, LOCAL_INTENT_SIGNALS.contact)) return "contact";
  if (matchesAny(text, LOCAL_INTENT_SIGNALS.research)) return "research";
  if (matchesAny(text, LOCAL_INTENT_SIGNALS.achievements)) return "achievements";
  if (
    matchesAny(text, LOCAL_INTENT_SIGNALS.projects) ||
    matchesAny(text, LOCAL_INTENT_SIGNALS.navigation)
  ) {
    return "navigation";
  }
  if (matchesAny(text, LOCAL_INTENT_SIGNALS.skills)) return "skills";
  return "local_confident";
};

// Smart Local-first routing saves Groq quota and keeps deterministic portfolio
// actions fast. Hiring/evaluation and JD intent are checked before local contact
// rules so prompts like "should I hire him?" reach Groq instead of being treated
// as contact/navigation.
export const getAssistantRoute = (message, localResponse) => {
  const value = (message || "").trim();
  const text = value.toLowerCase();
  const isStarterQuestion = STARTER_QUESTIONS.some(
    (question) => question.toLowerCase() === text
  );
  const isLocalFallback = localResponse?.text?.startsWith(LOCAL_FALLBACK_PREFIX);
  const hasConfidentLocalResponse =
    Boolean(localResponse?.copyText) ||
    (localResponse?.actions?.length || 0) > 0 ||
    !isLocalFallback;

  if (isLikelyJobDescription(value) || value.length > 300) {
    return { route: "groq", reason: "jd_match" };
  }
  if (matchesAny(text, JD_ROUTING_SIGNALS)) {
    return { route: "groq", reason: "jd_match" };
  }
  if (matchesAny(text, HIRING_EVALUATION_SIGNALS)) {
    return { route: "groq", reason: "hiring_evaluation" };
  }
  if (isStarterQuestion) return { route: "local", reason: "predefined_chip" };

  const localReason = getLocalReason(text);
  if (localReason !== "local_confident") {
    return { route: "local", reason: localReason };
  }
  if (hasConfidentLocalResponse) {
    return { route: "local", reason: "local_confident" };
  }
  return { route: "groq", reason: "low_confidence" };
};

export const STARTER_QUESTIONS = [
  "Is Tejash suitable for a full-stack role?",
  "Show me his AI/ML projects.",
  "Which project proves industry experience?",
  "Compare his profile with a job description.",
  "Draft a recruiter summary.",
  "What are his strongest skills?",
  "Show me his research work.",
  "How can I contact him?",
];

export const AGENT_GREETING =
  "Hi, I'm Tejash's Portfolio Agent. I can help you explore his full-stack work, AI/ML projects, industry experience, research, achievements, and JD fit.";
