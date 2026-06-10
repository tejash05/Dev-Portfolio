// Placeholder hooks for the V2 AI/RAG upgrade.
// V1 is fully local and rule-based — nothing here is wired up or called yet.
// These stubs document the intended architecture so real AI can be added
// safely later WITHOUT exposing any API keys in the frontend.
//
// SECURITY: All real LLM/embedding calls must go through a secure
// serverless/backend endpoint. Never call external AI APIs directly from the
// browser, and never ship secrets in client code.

// TODO: Add secure serverless endpoint for LLM calls (e.g. /api/agent).
export const callAgentBackend = async (/* { message, context } */) => {
  // TODO: POST to /api/agent with the user message + lightweight context.
  // The server holds the API key and performs the LLM call + RAG.
  throw new Error("V2 not implemented: secure /api/agent endpoint required.");
};

// TODO: Add resume parser.
// Resume path: "/TejashTarunAl_resume.pdf"
export const parseResume = async (/* url */) => {
  // TODO: Fetch + parse the resume PDF into clean text.
  throw new Error("V2 not implemented: resume parser.");
};

// TODO: Add research paper parser.
// IMPORTANT: Do NOT use "/NeuroWell-Research-Paper.pdf" for the Fall Detection
// paper. Use the correct Fall Detection PDF only when provided.
// Current IEEE publication link: https://ieeexplore.ieee.org/document/11541755
export const parseResearchPaper = async (/* url */) => {
  // TODO: Fetch + parse the correct research PDF into clean text.
  throw new Error("V2 not implemented: research paper parser.");
};

// TODO: Add embedding generation.
export const generateEmbeddings = async (/* chunks */) => {
  // TODO: Generate embeddings via the secure backend.
  throw new Error("V2 not implemented: embedding generation.");
};

// TODO: Add vector search.
export const vectorSearch = async (/* query, embeddings */) => {
  // TODO: Retrieve the most relevant chunks for a query.
  throw new Error("V2 not implemented: vector search.");
};

// TODO: Add semantic JD matching (replaces keyword matching with a match %).
export const semanticJobMatch = async (/* jobDescription */) => {
  // TODO: Use embeddings + backend LLM for a semantic match score.
  throw new Error("V2 not implemented: semantic JD matching.");
};

// TODO: Add role-specific resume suggestions.
export const suggestResumeImprovements = async (/* roleOrJD */) => {
  // TODO: Generate targeted resume/keyword/ordering suggestions via backend.
  throw new Error("V2 not implemented: resume improvement suggestions.");
};

// ---------------------------------------------------------------------------
// V2-B roadmap (NOT implemented yet — comments only)
// V2-A (current) is "RAG Lite": hand-authored chunks + keyword overlap +
// Groq via the secure /api/agent endpoint. V2-B upgrades the retrieval quality
// and hardens limits:
//
// TODO (V2-B): Full server-side PDF parsing of the real resume files
//              (/TejashTarun_resume.pdf full-stack, /TejashTarunAl_resume.pdf AI)
//              and the correct Fall Detection paper PDF (NOT the NeuroWell PDF).
// TODO (V2-B): Generate embeddings for all chunks via the secure backend.
// TODO (V2-B): Add a vector database (Pinecone / pgvector / Vercel-friendly).
// TODO (V2-B): Replace keyword overlap with semantic vector retrieval.
// TODO (V2-B): Better role scoring (weighted skills, seniority, recency).
// TODO (V2-B): Research paper full-text RAG once the correct PDF is provided.
// TODO (V2-B): Secure backend rate limiting with Redis / Vercel KV / Upstash
//              (replace the localStorage soft-limit used in V2-A).
// ---------------------------------------------------------------------------
