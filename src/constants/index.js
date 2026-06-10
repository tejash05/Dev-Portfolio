import project1 from "../assets/projects/project-1.webp";
import project2 from "../assets/projects/project-2.webp";
import project3 from "../assets/projects/project-3.webp";
import project4 from "../assets/projects/project-4.webp";

export const PROFILE = {
  name: "Tejash Tarun",
  title: "Software Engineer | Full Stack Developer | AI/GenAI Builder",
  resume: "/TejashTarunAl_resume.pdf",
};

// Two resume variants. `available` controls whether the download button is
// active. The full-stack PDF is not in /public yet — keep available:false until
// the file is added. TODO: add /public/TejashTarun_resume.pdf, then flip to true.
export const RESUMES = [
  {
    id: "fullstack",
    label: "Full Stack Resume",
    path: "/TejashTarun_resume.pdf",
    available: false,
  },
  {
    id: "ai-core",
    label: "AI/ML Resume",
    path: "/TejashTarunAl_resume.pdf",
    available: true,
  },
];

export const HERO_CONTENT = `I build scalable full-stack and AI-powered web applications using React, Next.js, Node.js, Express, FastAPI, SQL, MongoDB, and GenAI tools. I have hands-on experience building production-style dashboards, automation workflows, REST APIs, and AI-integrated systems across internships, hackathons, and personal projects.`;

export const HERO_STATS = [
  { label: "270+ DSA Problems" },
  { label: "Full Stack Intern @ NDL Power" },
  { label: "HackSRM AIML Winner" },
  { label: "Smart India Hackathon (SIH) National Finalist" },
  { label: "IEEE Research Publication" },
];

// Set href to a valid path/URL to enable a button. Leave null/empty to keep it
// hidden or rendered in a disabled TODO state.
export const PROJECT_CATEGORIES = [
  {
    id: "industry",
    name: "Industry-Level Projects",
    description: "Real-world business workflow and automation systems.",
    count: "1 Project",
  },
  {
    id: "fullstack",
    name: "Full Stack Projects",
    description: "End-to-end products with dashboards, APIs, auth, and databases.",
    count: "3 Projects",
  },
  {
    id: "aiml",
    name: "Core AI/ML Projects",
    description: "Machine learning, GenAI, research, and intelligent systems.",
    count: "3 Projects",
  },
];

export const DEFAULT_PROJECT_CATEGORY = "industry";

export const PROJECTS = {
  industry: [
    {
      id: "ntrack",
      title: "nTRACK Executive",
      subtitle: "Field Sampling & Workflow Automation App",
      image: project1,
      description:
        "Mobile-first PWA built for NDL Power field executives to manage assigned job orders, transformer sampling, QR tagging, GPS/selfie check-in, expenses, receipt signatures, and offline sync.",
      highlights: [
        "Built production-style modules for job orders, transformer sampling, QR tagging, expenses, and receipts.",
        "Designed offline-first sync for field executives working in low-network conditions.",
        "Used REST APIs and MSSQL-backed workflows for business automation.",
      ],
      technologies: [
        "React",
        "TypeScript",
        "Node.js",
        "Express.js",
        "MSSQL",
        "TailwindCSS",
        "IndexedDB",
        "Docker",
      ],
      // Private / internal project — no public links.
      links: [
        { label: "Case Study", href: null, private: true },
        { label: "Tech Overview", href: null, private: true },
      ],
    },
  ],
  fullstack: [
    {
      id: "the-insights",
      title: "The Insights",
      subtitle: "Shopify Analytics Platform",
      image: project2,
      description:
        "Multi-tenant Shopify analytics dashboard that syncs customers, orders, and products using webhooks and visualizes business insights like revenue trends, customer rankings, and order analytics.",
      highlights: [
        "Built webhook-based Shopify data ingestion across multiple data models.",
        "Implemented JWT authentication and tenant-level data isolation.",
        "Created analytics dashboards with revenue trends and date-based filtering.",
      ],
      technologies: ["Next.js", "Node.js", "Prisma", "PostgreSQL", "Recharts", "JWT"],
      links: [
        { label: "GitHub", href: "https://github.com/tejash05/TheInsights" },
        { label: "Live Demo", href: null, todo: true },
      ],
    },
    {
      id: "xenocrm",
      title: "XenoCRM",
      subtitle: "AI-Powered Campaign CRM",
      image: project3,
      description:
        "AI-powered mini CRM for customer segmentation, campaign creation, AI-generated messages, authentication, and campaign delivery tracking.",
      highlights: [
        "Integrated OpenAI for campaign message generation.",
        "Implemented Google OAuth and JWT-based authentication.",
        "Built delivery logs for tracking campaign message status.",
      ],
      technologies: ["React", "Node.js", "Express.js", "MongoDB", "OpenAI", "Passport.js", "JWT"],
      links: [
        {
          label: "GitHub",
          href: "https://github.com/tejash05/XenoCRM",
        },
        { label: "Live Demo", href: null, todo: true },
      ],
    },
    {
      id: "hr-dashboard",
      title: "HR Dashboard",
      subtitle: "Employee Analytics System",
      image: project4,
      description:
        "Full-stack HR dashboard for managing employee records, filtering data, authentication, pagination, bookmarking, and performance analytics.",
      highlights: [
        "Managed 50+ employee records with search, filters, and pagination.",
        "Integrated NextAuth.js for authentication and protected routes.",
        "Visualized department-wise performance using charts.",
      ],
      technologies: ["Next.js", "TailwindCSS", "Zustand", "Chart.js", "NextAuth.js"],
      links: [
        { label: "GitHub", href: "https://github.com/tejash05/hr-dashboard-next" },
        { label: "Live Demo", href: null, todo: true },
      ],
    },
  ],
  aiml: [
    {
      id: "safeclick",
      title: "SafeClick",
      subtitle: "AI Phishing Detection System",
      image: project1,
      description:
        "AI-powered phishing detection system that analyzes URLs using XGBoost, SSIM-based clone detection, WHOIS analysis, and Chrome Extension alerts.",
      highlights: [
        "Won HackSRM 6.0 AIML Track.",
        "Achieved 92% accuracy in phishing detection.",
        "Built Chrome Extension alerts and MERN dashboard for threat visualization.",
      ],
      technologies: ["XGBoost", "Chrome Extension", "SSIM", "WHOIS", "MERN", "JavaScript"],
      links: [
        { label: "GitHub", href: "https://github.com/tejash05/SafeClick" },
        { label: "Case Study", href: null, todo: true },
      ],
    },
    {
      id: "neurowell",
      title: "NeuroWell",
      subtitle: "AI Mental Wellness Chatbot",
      image: project2,
      description:
        "Emotion-aware AI chatbot that detects emotional patterns, responds empathetically, summarizes chats, and generates PDF-based emotional insight reports.",
      highlights: [
        "Used Gemini, LLaMA, and LangChain for AI-powered responses and retrieval.",
        "Built FastAPI backend with MongoDB storage.",
        "Generated emotional insight reports in PDF format.",
      ],
      technologies: ["Python", "FastAPI", "Gemini", "LLaMA", "LangChain", "MongoDB", "ReportLab"],
      links: [
        { label: "GitHub", href: "https://github.com/tejash05/NeuroWell" },
        { label: "Live Demo", href: null, todo: true },
      ],
    },
    {
      id: "fall-detection",
      title: "Fall Detection Research",
      subtitle: "IEEE ETAACT 2026",
      image: project3,
      description:
        "Research project on efficient fall detection using lightweight geometric features and Gradient Boosting classifiers.",
      highlights: [
        "Published at IEEE ETAACT 2026.",
        "Focused on lightweight feature extraction for fall detection.",
        "Used machine learning classification with Gradient Boosting.",
        "Demonstrates applied ML research with lightweight features and classification.",
      ],
      technologies: ["Python", "Machine Learning", "Gradient Boosting", "Geometric Features"],
      links: [
        {
          label: "Publication",
          href: "https://ieeexplore.ieee.org/document/11541755",
        },
        {
          label: "GitHub",
          href: "https://github.com/tejash05/Fall_detection_UROP",
        },
        { label: "Research Summary", href: null, todo: true },
      ],
    },
  ],
};

export const EXPERIENCES = [
  {
    year: "Nov 2025 - Apr 2026",
    role: "Full Stack Developer Intern",
    company: "NDL Power Limited",
    location: "Remote",
    logo: "/LOGO_NDL.jpeg",
    logoFallback: "NDL",
    description: `Built scalable full-stack applications using React.js, TypeScript, Node.js, Express.js, and MSSQL for power and utility operations. Worked on asset management, transformer sampling, QR tagging, expense tracking, REST APIs, workflow automation, and performance optimization.`,
    highlights: [
      "Developed scalable modules for asset management, transformer sampling, QR tagging, and expense tracking.",
      "Integrated REST APIs and MSSQL-backed workflows for automation and business operations.",
      "Improved backend performance using pagination, query optimization, and database indexing.",
    ],
    technologies: ["React", "TypeScript", "Node.js", "Express.js", "MSSQL", "REST APIs", "Docker"],
  },
  {
    year: "Nov 2023 - Jan 2024",
    role: "Salesforce Developer",
    company: "SmartInternz",
    location: "Remote",
    logo: "/smartinternz_logo.jpeg",
    logoFallback: "SI",
    description: `Worked on Salesforce development using Apex, automation tools, workflows, process builders, and approval processes. Improved query performance and delivered multiple mini-project features with clean code and Git workflows.`,
    highlights: [
      "Applied Apex, testing, and debugging across Salesforce mini-projects.",
      "Built automations using Workflow, Process Builder, and Approval Processes.",
      "Improved query performance and maintained clean Git-based workflows.",
    ],
    technologies: ["Salesforce", "Apex", "SOQL", "Workflow", "Process Builder", "Approval Process"],
  },
];

export const SKILLS = [
  {
    category: "Programming Languages",
    items: ["JavaScript", "TypeScript", "Python", "C++", "SQL"],
  },
  {
    category: "Frontend & UI",
    items: [
      "React",
      "Next.js",
      "HTML5",
      "CSS3",
      "TailwindCSS",
      "Responsive UI",
      "Component-Based UI",
      "Frontend Testing",
    ],
  },
  {
    category: "Backend & APIs",
    items: [
      "Node.js",
      "Express.js",
      "Flask",
      "FastAPI",
      "REST APIs",
      "Authentication/JWT",
      "API Testing",
      "Integration Testing",
    ],
  },
  {
    category: "Databases",
    items: ["MSSQL", "PostgreSQL", "MongoDB", "MySQL"],
  },
  {
    category: "AI / ML / GenAI",
    items: ["OpenAI", "Gemini", "LangChain", "XGBoost", "HuggingFace", "RAG Pipelines"],
  },
  {
    category: "Tools & Deployment",
    items: ["Git", "GitHub Actions", "Docker", "Postman", "Vercel", "AWS", "Render", "Railway", "Cursor"],
  },
];

export const HACKATHONS = [
  {
    title: "HackSRM 6.0 — AIML Track Winner",
    status: "Winner",
    description:
      "Built SafeClick, an AI-powered phishing detection system using XGBoost, SSIM-based clone detection, WHOIS analysis, and Chrome Extension alerts. Won the AIML track with 92% accuracy.",
  },
  {
    title: "Smart India Hackathon (SIH) National Finalist",
    status: "Finalist",
    description:
      "Selected as a national finalist for building an innovation-driven software solution and collaborating under real-world problem-solving constraints.",
  },
  {
    title: "Bharatiya Antariksh Hackathon 2024",
    status: "Participant",
    description:
      "Worked on satellite data analysis and predictive AI modeling for space-tech datasets.",
  },
];

export const ACHIEVEMENTS = [
  {
    title: "IEEE Research Publication",
    description: "Published research work at IEEE ETAACT 2026.",
  },
  {
    title: "HackSRM 6.0 AIML Winner",
    description: "Won the AIML track for SafeClick, an AI phishing detection system.",
  },
  {
    title: "Smart India Hackathon (SIH) National Finalist",
    description: "Selected as a national finalist in Smart India Hackathon.",
  },
  {
    title: "270+ Coding Problems Solved",
    description: "Solved problems across LeetCode and CodeChef using DSA and algorithms.",
  },
  {
    title: "MongoDB Certified Associate Developer",
    description: "Certified by MongoDB in 2025.",
  },
];

// Set `publication` to a valid PDF path or URL to reveal the "View Publication"
// button. Do NOT point this at the old NeuroWell PDF.
export const RESEARCH_PAPER = {
  title:
    "Efficient Fall Detection Using Lightweight Geometric Features and Gradient Boosting Classifiers",
  subtitle:
    "Published research and applied machine learning work focused on real-world problem solving.",
  description:
    "Published at IEEE ETAACT 2026, this research focuses on lightweight geometric feature extraction and machine learning-based fall detection using Gradient Boosting classifiers.",
  publication: "https://ieeexplore.ieee.org/document/11541755",
};

export const CONTACT = {
  name: "Tejash Tarun",
  email: "tejashtarunofficial@gmail.com",
  location: "Patna, Bihar",
  github: "https://github.com/tejash05",
  linkedin: "https://www.linkedin.com/in/tejashtarunofficial",
  cta: "Interested in working together or discussing an opportunity? Let's connect.",
};
