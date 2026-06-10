// Structured resume knowledge for RAG Lite (V2-A).
// Manually authored chunks (no PDF parsing yet). Two resume variants are
// represented as separate sources so retrieval can prioritize the right one.
//
// TODO (V2-B): Replace these hand-authored chunks with real server-side PDF
// parsing of the actual resume files:
//   - Full Stack: /TejashTarun_resume.pdf  (TODO: add file to /public)
//   - AI/Core:    /TejashTarunAl_resume.pdf (existing)

const FULLSTACK_PRIORITY = ["full-stack", "software-engineer", "frontend", "backend", "database"];
const AI_PRIORITY = ["ai-ml", "genai", "research"];

export const RESUME_CHUNKS = [
  // ----------------------------- Full Stack resume -----------------------------
  {
    id: "fs-summary",
    sourceType: "resume",
    resumeType: "fullstack",
    priorityRole: FULLSTACK_PRIORITY,
    section: "Summary",
    text: "Tejash Tarun is a Software Engineer and Full Stack Developer who builds scalable, production-style web applications with React, Next.js, Node.js, Express.js, FastAPI, SQL, and MongoDB. Strong on REST APIs, authentication, dashboards, and workflow automation.",
  },
  {
    id: "fs-experience",
    sourceType: "resume",
    resumeType: "fullstack",
    priorityRole: FULLSTACK_PRIORITY,
    section: "Experience",
    text: "Full Stack Developer Intern at NDL Power Limited (Nov 2025 - Apr 2026, Remote): built scalable modules for asset management, transformer sampling, QR tagging, and expense tracking using React, TypeScript, Node.js, Express.js, and MSSQL. Integrated REST APIs and MSSQL-backed workflows, and improved backend performance with pagination, query optimization, and indexing.",
  },
  {
    id: "fs-projects",
    sourceType: "resume",
    resumeType: "fullstack",
    priorityRole: FULLSTACK_PRIORITY,
    section: "Projects",
    text: "Full-stack projects: nTRACK Executive (NDL Power field workflow automation PWA, MSSQL, offline sync), The Insights (multi-tenant Shopify analytics with Next.js, Prisma, PostgreSQL, JWT), XenoCRM (MERN CRM with OAuth and campaign delivery), and HR Dashboard (Next.js, NextAuth, Chart.js analytics).",
  },
  {
    id: "fs-skills",
    sourceType: "resume",
    resumeType: "fullstack",
    priorityRole: FULLSTACK_PRIORITY,
    section: "Skills",
    text: "Programming languages: JavaScript, TypeScript, Python, C++, SQL. Frontend & UI: React, Next.js, HTML5, CSS3, TailwindCSS, responsive UI, component-based UI, and frontend testing. Backend & APIs: Node.js, Express.js, Flask, FastAPI, REST APIs, Authentication/JWT, API testing, and integration testing. Databases: MSSQL, PostgreSQL, MongoDB, MySQL, Prisma. Tools & deployment: Git, GitHub Actions, Docker, Postman, Vercel, AWS, Render, Railway, Cursor.",
  },

  // ------------------------------ AI/Core resume ------------------------------
  {
    id: "ai-summary",
    sourceType: "resume",
    resumeType: "ai-core",
    priorityRole: AI_PRIORITY,
    section: "Summary",
    text: "Tejash Tarun is an AI/ML and GenAI builder with hands-on experience in machine learning, LLM/GenAI integrations, and applied research. He works with XGBoost, Gradient Boosting, Gemini, LLaMA, LangChain, and RAG pipelines, backed by an IEEE publication.",
  },
  {
    id: "ai-projects",
    sourceType: "resume",
    resumeType: "ai-core",
    priorityRole: AI_PRIORITY,
    section: "Projects",
    text: "AI/ML projects: SafeClick (XGBoost phishing detection, SSIM clone detection, WHOIS, Chrome extension; HackSRM 6.0 AIML winner, 92% accuracy), NeuroWell (emotion-aware chatbot using Gemini, LLaMA, LangChain with FastAPI backend and PDF reports), and Fall Detection Research (lightweight geometric features + Gradient Boosting, IEEE-published).",
  },
  {
    id: "ai-skills",
    sourceType: "resume",
    resumeType: "ai-core",
    priorityRole: AI_PRIORITY,
    section: "Skills",
    text: "AI / ML / GenAI: OpenAI, Gemini, LangChain, XGBoost, Gradient Boosting, LLaMA, HuggingFace, RAG pipelines. Backend for AI: Python, FastAPI, MongoDB. Also experienced with full-stack delivery for AI products.",
  },
  {
    id: "ai-research",
    sourceType: "resume",
    resumeType: "ai-core",
    priorityRole: AI_PRIORITY,
    section: "Research",
    text: "Research publication: 'Efficient Fall Detection Using Lightweight Geometric Features and Gradient Boosting Classifiers', IEEE ETAACT 2026. Focuses on lightweight feature extraction and Gradient Boosting classification. Publication: https://ieeexplore.ieee.org/document/11541755",
  },

  // ------------------------- Shared (both resumes) -------------------------
  {
    id: "shared-experience-smartinternz",
    sourceType: "resume",
    resumeType: "shared",
    priorityRole: [...FULLSTACK_PRIORITY, ...AI_PRIORITY],
    section: "Experience",
    text: "Salesforce Developer at SmartInternz (Nov 2023 - Jan 2024, Remote): applied Apex, testing, and debugging; built automations with Workflow, Process Builder, and Approval Processes; improved query performance with clean Git-based workflows.",
  },
  {
    id: "shared-achievements",
    sourceType: "resume",
    resumeType: "shared",
    priorityRole: [...FULLSTACK_PRIORITY, ...AI_PRIORITY],
    section: "Achievements",
    text: "Achievements: IEEE research publication (ETAACT 2026), HackSRM 6.0 AIML Track Winner, Smart India Hackathon (SIH) National Finalist, 270+ DSA problems solved, MongoDB Certified Associate Developer.",
  },
  {
    id: "shared-certifications",
    sourceType: "resume",
    resumeType: "shared",
    priorityRole: [...FULLSTACK_PRIORITY, ...AI_PRIORITY],
    section: "Certifications",
    text: "Certifications: MongoDB Certified Associate Developer (2025).",
  },
  {
    id: "shared-education",
    sourceType: "resume",
    resumeType: "shared",
    priorityRole: [...FULLSTACK_PRIORITY, ...AI_PRIORITY],
    section: "Education",
    text: "Education: undergraduate engineering studies with a strong focus on software engineering, data structures and algorithms (270+ problems), and applied AI/ML research.",
  },
];
