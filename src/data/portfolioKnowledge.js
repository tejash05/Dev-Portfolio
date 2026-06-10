// Asset-free portfolio facts, safe to import from BOTH the browser and the
// Node serverless function (api/agent.js).
//
// IMPORTANT: Do NOT import this from anything that pulls in image assets, and do
// NOT import src/constants/index.js here — that file imports .webp images which
// would crash the Node serverless runtime. Keep this module plain data only.

export const PROFILE_FACTS = {
  name: "Tejash Tarun",
  title: "Software Engineer | Full Stack Developer | AI/GenAI Builder",
  location: "Patna, Bihar",
  email: "tejashtarunofficial@gmail.com",
  github: "https://github.com/tejash05",
  linkedin: "https://www.linkedin.com/in/tejashtarunofficial",
};

// Resume sources. The full-stack PDF file does not exist yet (TODO), but its
// textual knowledge is still represented for retrieval.
export const RESUME_SOURCES = {
  fullstack: {
    resumeType: "fullstack",
    label: "Full Stack Resume",
    path: "/TejashTarun_resume.pdf", // TODO: add this PDF to /public.
    available: false,
    priorityRole: ["full-stack", "software-engineer", "frontend", "backend", "database"],
  },
  "ai-core": {
    resumeType: "ai-core",
    label: "AI/ML Resume",
    path: "/TejashTarunAl_resume.pdf", // Existing file in /public.
    available: true,
    priorityRole: ["ai-ml", "genai", "research"],
  },
};

export const PROJECT_FACTS = [
  {
    id: "ntrack",
    title: "nTRACK Executive",
    categoryId: "industry",
    technologies: ["React", "TypeScript", "Node.js", "Express.js", "MSSQL", "TailwindCSS", "IndexedDB", "Docker"],
    summary:
      "Mobile-first PWA for NDL Power field executives: job orders, transformer sampling, QR tagging, GPS/selfie check-in, expenses, receipt signatures, and offline sync. REST APIs with MSSQL-backed workflow automation.",
    links: { github: null, demo: null, private: true },
  },
  {
    id: "the-insights",
    title: "The Insights",
    categoryId: "fullstack",
    technologies: ["Next.js", "Node.js", "Prisma", "PostgreSQL", "Recharts", "JWT"],
    summary:
      "Multi-tenant Shopify analytics dashboard with webhook-based ingestion, JWT auth, tenant-level data isolation, and revenue/customer analytics.",
    links: { github: "https://github.com/tejash05/TheInsights", demo: null },
  },
  {
    id: "xenocrm",
    title: "XenoCRM",
    categoryId: "fullstack",
    technologies: ["React", "Node.js", "Express.js", "MongoDB", "OpenAI", "Passport.js", "JWT"],
    summary:
      "AI-powered mini CRM for customer segmentation, AI-generated campaign messages, Google OAuth/JWT auth, and delivery tracking logs.",
    links: { github: "https://github.com/tejash05/XenoCRM", demo: null },
  },
  {
    id: "hr-dashboard",
    title: "HR Dashboard",
    categoryId: "fullstack",
    technologies: ["Next.js", "TailwindCSS", "Zustand", "Chart.js", "NextAuth.js"],
    summary:
      "Full-stack HR dashboard with employee records, search/filter/pagination, NextAuth authentication, bookmarking, and department analytics.",
    links: { github: "https://github.com/tejash05/hr-dashboard-next", demo: null },
  },
  {
    id: "safeclick",
    title: "SafeClick",
    categoryId: "aiml",
    technologies: ["XGBoost", "Chrome Extension", "SSIM", "WHOIS", "MERN", "JavaScript"],
    summary:
      "AI phishing detection system using XGBoost, SSIM-based clone detection, and WHOIS analysis with Chrome Extension alerts. Won HackSRM 6.0 AIML Track with 92% accuracy.",
    links: { github: "https://github.com/tejash05/SafeClick", demo: null },
  },
  {
    id: "neurowell",
    title: "NeuroWell",
    categoryId: "aiml",
    technologies: ["Python", "FastAPI", "Gemini", "LLaMA", "LangChain", "MongoDB", "ReportLab"],
    summary:
      "Emotion-aware AI mental wellness chatbot using Gemini, LLaMA, and LangChain, with a FastAPI backend and PDF emotional insight reports.",
    links: { github: "https://github.com/tejash05/NeuroWell", demo: null },
  },
  {
    id: "fall-detection",
    title: "Fall Detection Research",
    categoryId: "aiml",
    technologies: ["Python", "Machine Learning", "Gradient Boosting", "Geometric Features"],
    summary:
      "IEEE-published research on efficient fall detection using lightweight geometric features and Gradient Boosting classifiers.",
    links: {
      github: "https://github.com/tejash05/Fall_detection_UROP",
      publication: "https://ieeexplore.ieee.org/document/11541755",
    },
  },
];

export const CATEGORY_FACTS = [
  { id: "industry", name: "Industry-Level Projects" },
  { id: "fullstack", name: "Full Stack Projects" },
  { id: "aiml", name: "Core AI/ML Projects" },
];

export const SECTION_IDS = [
  "home",
  "technologies",
  "projects",
  "experience",
  "research",
  "hackathons",
  "achievements",
  "contact",
];
