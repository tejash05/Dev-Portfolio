// Read-only data layer for the Portfolio Agent.
// Centralizes access to the portfolio constants so the agent logic stays
// decoupled from how/where the data is stored. When V2 (RAG) is added, this is
// the single place that would also expose retrieved/embedded context.

import {
  ACHIEVEMENTS,
  CONTACT,
  EXPERIENCES,
  HACKATHONS,
  PROFILE,
  PROJECTS,
  PROJECT_CATEGORIES,
  RESEARCH_PAPER,
  SKILLS,
} from "../constants";

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

// Stable category ids defined in constants.
export const CATEGORY_IDS = {
  industry: "industry",
  fullstack: "fullstack",
  aiml: "aiml",
};

export const getCategoryName = (categoryId) =>
  PROJECT_CATEGORIES.find((c) => c.id === categoryId)?.name || categoryId;

// Flatten all projects and attach their categoryId for easy lookup.
export const getAllProjects = () =>
  Object.entries(PROJECTS).flatMap(([categoryId, list]) =>
    list.map((project) => ({ ...project, categoryId }))
  );

export const getProjectsByCategory = (categoryId) =>
  (PROJECTS[categoryId] || []).map((project) => ({ ...project, categoryId }));

export const findProjectById = (id) =>
  getAllProjects().find((project) => project.id === id);

export const getProjectIdsByCategory = (categoryId) =>
  getProjectsByCategory(categoryId).map((project) => project.id);

// Flat, de-duplicated list of skills the candidate actually has.
export const getFlatSkills = () => {
  const fromSkills = SKILLS.flatMap((group) => group.items);
  const fromProjects = getAllProjects().flatMap(
    (project) => project.technologies || []
  );
  return Array.from(new Set([...fromSkills, ...fromProjects]));
};

export {
  ACHIEVEMENTS,
  CONTACT,
  EXPERIENCES,
  HACKATHONS,
  PROFILE,
  PROJECT_CATEGORIES,
  RESEARCH_PAPER,
  SKILLS,
};
