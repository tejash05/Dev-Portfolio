// Structured research knowledge for RAG Lite (V2-A).
//
// IMPORTANT: Do NOT use /NeuroWell-Research-Paper.pdf for this paper. The Fall
// Detection paper PDF is not available yet; the chunks below are derived from
// portfolio data and the confirmed IEEE publication link only.
//
// TODO (V2-B): Replace these chunks with full server-side PDF parsing once the
// correct Fall Detection paper PDF is provided.

export const RESEARCH_KNOWLEDGE = {
  title:
    "Efficient Fall Detection Using Lightweight Geometric Features and Gradient Boosting Classifiers",
  venue: "IEEE ETAACT 2026",
  topic: "Fall detection using lightweight geometric features and machine learning.",
  methods: [
    "Lightweight geometric feature extraction",
    "Gradient Boosting classification",
    "Efficiency-focused, real-world oriented ML pipeline",
  ],
  technologies: ["Python", "Machine Learning", "Gradient Boosting", "Geometric Features"],
  summary:
    "Published at IEEE ETAACT 2026, this research presents an efficient fall detection approach using lightweight geometric features and Gradient Boosting classifiers, prioritizing low-overhead feature extraction suitable for real-world deployment.",
  publication: "https://ieeexplore.ieee.org/document/11541755",
};

export const RESEARCH_CHUNKS = [
  {
    id: "research-overview",
    sourceType: "research",
    priorityRole: ["ai-ml", "research", "genai"],
    section: "Research Overview",
    text: `${RESEARCH_KNOWLEDGE.title} (${RESEARCH_KNOWLEDGE.venue}). ${RESEARCH_KNOWLEDGE.summary} Publication: ${RESEARCH_KNOWLEDGE.publication}`,
  },
  {
    id: "research-methods",
    sourceType: "research",
    priorityRole: ["ai-ml", "research"],
    section: "Research Methods",
    text: `Methods: ${RESEARCH_KNOWLEDGE.methods.join("; ")}. Technologies: ${RESEARCH_KNOWLEDGE.technologies.join(", ")}.`,
  },
];
