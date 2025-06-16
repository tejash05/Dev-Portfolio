import project1 from "../assets/projects/project-1.webp";
import project2 from "../assets/projects/project-2.webp";
import project3 from "../assets/projects/project-3.webp";
import project4 from "../assets/projects/project-4.webp";

export const HERO_CONTENT = `I am a passionate full stack developer with a knack for crafting robust and scalable web applications. With 5 years of hands-on experience, I have honed my skills in front-end technologies like React and Next.js, as well as back-end technologies like Node.js, MySQL, PostgreSQL, and MongoDB. My goal is to leverage my expertise to create innovative solutions that drive business growth and deliver exceptional user experiences.`;

export const ABOUT_TEXT = `I am a dedicated and versatile full stack developer with a passion for creating efficient and user-friendly web applications. With 5 years of professional experience, I have worked with a variety of technologies, including React, Next.js, Node.js, MySQL, PostgreSQL, and MongoDB. My journey in web development began with a deep curiosity for how things work, and it has evolved into a career where I continuously strive to learn and adapt to new challenges. I thrive in collaborative environments and enjoy solving complex problems to deliver high-quality solutions. Outside of coding, I enjoy staying active, exploring new technologies, and contributing to open-source projects.`;

export const EXPERIENCES = [
  {
    year: "2023 - 2024",
    role: "Intern",
    company: "Salesforce",
    description: `Assisted in the development and maintenance of Salesforce applications, using Apex, Lightning components, and Visualforce. Contributed to implementing custom workflows, automations, and data integrations with external systems. Collaborated with team members and stakeholders to gather requirements and ensure project alignment with business needs.`,
    technologies: ["Javascript", "React.js", "Next.js", "mongoDB"],
  },
];

export const PROJECTS = [
  
  {
  title: "SafeClick",
  image: project1, // replace with actual image import or path
  description:
    "SafeClick is an AI-powered phishing detection system that analyzes over 1 million URLs in real-time using XGBoost. It won a national hackathon in 2025 by achieving 92% accuracy and reducing false positives by 35%. The system integrates SSIM-based clone detection, WHOIS data analysis, and HTML structural scanning. A Chrome extension alerts users of threats instantly, while a MERN-stack dashboard visualizes threat trends and user activity.",
  technologies: [
    "MERN",
    "XGBoost",
    "Chrome Extension",
    "SSIM",
    "WHOIS",
    "HTML",
    "CSS",
    "JavaScript"
  ],
  github: "https://github.com/tejash05/SafeClick",
},

  {
  title: "NeuroWell",
  image: project2, // replace with the correct image path or import
  description:
    "An AI-first mental wellness chatbot that uses Gemini 1.5 Pro and LLaMA3 to detect emotional patterns and respond empathetically. It provides real-time chat summarization, concern extraction, and connects users with counselors. The system also generates detailed emotional insight reports in PDF format and supports vector-based document retrieval via LangChain and HuggingFace embeddings.",
  technologies: [
    "Python",
    "FastAPI",
    "Gemini API",
    "LLaMA3",
    "LangChain",
    "MongoDB",
    "ReportLab"
  ],
  github: "https://github.com/tejash05/NeuroWell",
},

  {
  title: "FitTrack",
  image: project3, // replace with the correct image import or path
  description:
    "A fitness tracking web application that allows users to log workouts, monitor dietary habits, and visualize progress through 10+ interactive charts. Built using React.js and Chart.js, the platform includes goal-setting, analytics, and a responsive dashboard that boosted user retention by 25% and engagement by 30%.",
  technologies: ["React.js", "Chart.js", "Material-UI", "JavaScript", "HTML", "CSS"],
  github: "https://github.com/tejash05/FitTrack",
}
];

export const CONTACT = {
  Location: "Patna, Bihar ",
  email: "Tejashtarunofficial@gmail.com",
};
