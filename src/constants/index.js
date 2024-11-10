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
    title: "Movie Recommendation System",
    image: project1,
    description:
      "An intelligent system providing tailored film suggestions, user feedback integration, and seamless navigation, utilizing advanced algorithms for personalized movie recommendations.",
    technologies: ["Python", "Flask", "NLP", "API", "HTML","CSS","JS"],
  },
  {
    title: "Forest Fire Pridiction",
    image: project2,
    description:
      "Built a model predicting forest fires using machine learning, analyzing environmental conditions for early risk alerts.",
    technologies: ["Python","Flask","Ridge Regression","HTML", "CSS"],
  },
  {
    title: "Portfolio Website",
    image: project3,
    description:
      "A personal portfolio website showcasing projects, skills, and contact information.",
    technologies: ["HTML", "CSS", "React", "Bootstrap"],
  },
  {
    title: "Blogging Platform",
    image: project4,
    description:
      "A platform for creating and publishing blog posts, with features like rich text editing, commenting, and user profiles.",
    technologies: ["HTML", "CSS", "Vue.js", "Express", "mySQL"],
  },
];

export const CONTACT = {
  Location: "Patna, Bihar ",
  email: "Tejashtarunofficial@gmail.com",
};
