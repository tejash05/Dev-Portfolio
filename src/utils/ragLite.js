// RAG Lite retrieval (V2-A) — shared by the frontend and the serverless API.
// Plain JS only (no React, no asset imports) so it is safe in the Node runtime.
//
// Strategy: chunk resume/research/project knowledge, score chunks by keyword
// overlap with the query, boost chunks whose resume variant matches the detected
// role/JD category, and return the top N chunks. No vector DB yet.
//
// TODO (V2-B): replace keyword overlap with embeddings + vector search for
// semantic retrieval, and add better role scoring.

import { RESUME_CHUNKS } from "../data/resumeChunks.js";
import { RESEARCH_CHUNKS } from "../data/researchChunks.js";
import { PROJECT_FACTS } from "../data/portfolioKnowledge.js";

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "to", "of", "for", "in", "on", "with", "is",
  "are", "be", "as", "at", "by", "his", "him", "he", "she", "they", "you",
  "your", "we", "our", "i", "me", "my", "this", "that", "it", "do", "does",
  "can", "will", "would", "should", "what", "which", "who", "how", "tejash",
]);

// Keyword sets used to detect whether a query/JD leans full-stack or AI/ML.
const FULLSTACK_SIGNALS = [
  "react", "next.js", "nextjs", "node", "node.js", "express", "frontend",
  "front-end", "backend", "back-end", "fullstack", "full stack", "full-stack",
  "api", "apis", "rest", "dashboard", "javascript", "typescript", "tailwind",
  "sql", "postgresql", "postgres", "mongodb", "mysql", "mssql", "prisma",
  "database", "crm", "web app", "software engineer", "mern",
];
const AI_SIGNALS = [
  "ai", "ml", "machine learning", "deep learning", "llm", "llms", "rag",
  "langchain", "xgboost", "gradient boosting", "gemini", "llama", "openai",
  "genai", "generative", "huggingface", "nlp", "research", "data scientist",
  "model", "embedding", "vector",
];

export const tokenize = (text) =>
  (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s.+/#-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));

const countSignals = (text, signals) => {
  const lower = (text || "").toLowerCase();
  return signals.reduce((acc, s) => (lower.includes(s) ? acc + 1 : acc), 0);
};

// "fullstack" | "ai-core" | "unclear"
export const classifyIntent = (text) => {
  const fs = countSignals(text, FULLSTACK_SIGNALS);
  const ai = countSignals(text, AI_SIGNALS);
  if (fs === 0 && ai === 0) return "unclear";
  if (ai > fs) return "ai-core";
  if (fs > ai) return "fullstack";
  return "unclear";
};

// Convert project facts into retrievable chunks.
const projectChunks = () =>
  PROJECT_FACTS.map((project) => ({
    id: `project-${project.id}`,
    sourceType: "project",
    resumeType: project.categoryId === "aiml" ? "ai-core" : "fullstack",
    priorityRole: [],
    section: `Project: ${project.title}`,
    text: `${project.title} — ${project.summary} Technologies: ${project.technologies.join(", ")}.`,
  }));

export const buildAllChunks = () => [
  ...RESUME_CHUNKS,
  ...RESEARCH_CHUNKS,
  ...projectChunks(),
];

const scoreChunk = (chunk, queryTokens, intent) => {
  const chunkTokens = new Set(tokenize(chunk.text));
  let overlap = 0;
  queryTokens.forEach((t) => {
    if (chunkTokens.has(t)) overlap += 1;
  });

  let score = overlap;

  // Boost chunks matching the detected resume/JD category.
  if (intent !== "unclear") {
    if (chunk.resumeType === intent) score += 2;
    if (chunk.resumeType === "shared") score += 1;
    if (Array.isArray(chunk.priorityRole)) {
      const roleMatch =
        (intent === "ai-core" &&
          chunk.priorityRole.some((r) => ["ai-ml", "genai", "research"].includes(r))) ||
        (intent === "fullstack" &&
          chunk.priorityRole.some((r) =>
            ["full-stack", "software-engineer", "frontend", "backend", "database"].includes(r)
          ));
      if (roleMatch) score += 1;
    }
  }

  return score;
};

export const retrieveChunks = (query, { topK = 7 } = {}) => {
  const intent = classifyIntent(query);
  const queryTokens = tokenize(query);
  const chunks = buildAllChunks();

  const scored = chunks
    .map((chunk) => ({ chunk, score: scoreChunk(chunk, queryTokens, intent) }))
    .sort((a, b) => b.score - a.score);

  // Keep chunks with any signal; if nothing scored, fall back to a sensible set.
  let selected = scored.filter((s) => s.score > 0).slice(0, topK);
  if (selected.length === 0) {
    selected = scored.slice(0, Math.min(5, scored.length));
  }

  return {
    intent,
    chunks: selected.map((s) => s.chunk),
  };
};

export const buildSafeContext = (chunks) =>
  chunks.map((c) => `[${c.section}] ${c.text}`).join("\n\n");
