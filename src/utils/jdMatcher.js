// Local, in-browser job-description matcher (V1).
// No external AI calls. Pure keyword-based matching against portfolio data.
// The pasted JD never leaves the browser.

import { getAllProjects, getFlatSkills } from "./portfolioContext";

// Canonical skill -> aliases that might appear in a JD.
const KEYWORD_CATALOG = {
  "Programming Languages": {
    JavaScript: ["javascript", "js"],
    TypeScript: ["typescript", "ts"],
    Python: ["python"],
    "C++": ["c++", "cpp"],
    SQL: ["sql"],
  },
  Frontend: {
    React: ["react"],
    "Next.js": ["next.js", "nextjs", "next js"],
    HTML5: ["html5", "html"],
    CSS3: ["css3", "css"],
    TailwindCSS: ["tailwind", "tailwindcss"],
    "Responsive UI": ["responsive ui", "responsive design", "mobile responsive"],
    "Component-Based UI": ["component based", "component-based", "component ui", "components"],
    "Frontend Testing": ["frontend testing", "ui testing", "react testing", "component testing"],
  },
  Backend: {
    "Node.js": ["node.js", "nodejs", "node"],
    "Express.js": ["express.js", "express"],
    FastAPI: ["fastapi", "fast api"],
    Flask: ["flask"],
    "REST APIs": ["rest api", "rest apis", "restful", "rest", "api", "apis", "backend"],
    "Authentication/JWT": ["authentication", "auth", "jwt", "json web token"],
    "API Testing": ["api testing", "postman testing", "endpoint testing"],
    "Integration Testing": ["integration testing", "integration tests"],
  },
  Databases: {
    MSSQL: ["mssql", "sql server"],
    PostgreSQL: ["postgresql", "postgres"],
    MongoDB: ["mongodb", "mongo"],
    MySQL: ["mysql"],
    Prisma: ["prisma"],
  },
  "AI / ML / GenAI": {
    OpenAI: ["openai", "gpt"],
    Gemini: ["gemini"],
    LangChain: ["langchain"],
    RAG: ["rag", "retrieval augmented", "retrieval-augmented"],
    LLM: ["llm", "llms", "large language model"],
    GenAI: ["genai", "generative ai"],
    AI: ["artificial intelligence", "ai"],
    ML: ["machine learning", "ml"],
    XGBoost: ["xgboost"],
    HuggingFace: ["huggingface", "hugging face"],
  },
  Tools: {
    Git: ["git"],
    GitHub: ["github"],
    Docker: ["docker"],
    Postman: ["postman"],
    Vercel: ["vercel"],
    AWS: ["aws"],
    Render: ["render"],
    Railway: ["railway"],
  },
};

const JD_SIGNAL_WORDS = [
  "responsibilities",
  "requirements",
  "qualifications",
  "experience",
  "preferred",
  "must have",
  "nice to have",
  "we are looking",
  "you will",
  "the role",
  "job description",
  "ctc",
  "stipend",
];

const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

// Build the set of normalized skills the candidate actually has, plus a few
// generic capabilities that the portfolio clearly demonstrates.
const buildPortfolioSkillSet = () => {
  const set = new Set(getFlatSkills().map(normalize));
  ["backend", "api", "rest", "ai", "ml", "genai", "rag", "llm"].forEach((s) =>
    set.add(normalize(s))
  );
  return set;
};

const containsAlias = (text, alias) => {
  // Word-ish boundary match so short aliases don't match inside other words.
  const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");
  return pattern.test(text);
};

export const isLikelyJobDescription = (text) => {
  if (!text) return false;
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();
  const signalHits = JD_SIGNAL_WORDS.filter((w) => lower.includes(w)).length;
  const isLong = trimmed.length > 280 || trimmed.split(/\s+/).length > 45;
  return signalHits >= 2 || (isLong && signalHits >= 1);
};

// Find best matching projects for a set of matched skills.
const bestMatchingProjects = (matchedSkills) => {
  const matchedNorm = matchedSkills.map(normalize);
  return getAllProjects()
    .map((project) => {
      const techNorm = (project.technologies || []).map(normalize);
      const score = matchedNorm.filter((m) =>
        techNorm.some((t) => t.includes(m) || m.includes(t))
      ).length;
      return { title: project.title, score };
    })
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((p) => p.title);
};

const improvementFor = (skill) => {
  const map = {
    AWS: "Add a deployment note or project that mentions AWS.",
    Docker: "Surface Docker usage more prominently in project highlights.",
    TypeScript: "Highlight TypeScript usage across more projects.",
    GraphQL: "Consider adding a small GraphQL example if relevant.",
    Kubernetes: "Mention any container orchestration exposure if applicable.",
  };
  return map[skill] || `Make ${skill} experience more visible in the portfolio.`;
};

export const matchJobDescription = (jobDescription) => {
  const text = (jobDescription || "").toLowerCase();
  const portfolioSkills = buildPortfolioSkillSet();

  const detected = [];
  const matched = [];
  const missing = [];

  Object.values(KEYWORD_CATALOG).forEach((group) => {
    Object.entries(group).forEach(([canonical, aliases]) => {
      const found = aliases.some((alias) => containsAlias(text, alias));
      if (!found) return;
      detected.push(canonical);
      const hasSkill = portfolioSkills.has(normalize(canonical));
      if (hasSkill) {
        matched.push(canonical);
      } else {
        missing.push(canonical);
      }
    });
  });

  const dedupe = (arr) => Array.from(new Set(arr));
  const matchedSkills = dedupe(matched);
  const missingSkills = dedupe(missing);
  const detectedCount = dedupe(detected).length;

  const ratio = detectedCount === 0 ? 0 : matchedSkills.length / detectedCount;
  let level = "Low";
  if (matchedSkills.length >= 3 && ratio >= 0.7) level = "Strong";
  else if (matchedSkills.length >= 2 && ratio >= 0.4) level = "Moderate";

  return {
    level,
    ratio,
    detectedCount,
    matchedSkills,
    missingSkills,
    bestProjects: bestMatchingProjects(matchedSkills),
    improvements: missingSkills.slice(0, 3).map(improvementFor),
  };
};
