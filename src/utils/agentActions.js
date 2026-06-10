// Executes agent action descriptors against the live UI.
// Keeps DOM/navigation side-effects out of the pure agent engine.
//
// controller shape:
//   {
//     navigate: (sectionId) => void,        // optional, defaults to scroll
//     setCategory: (categoryId) => void,
//     highlight: (projectIds) => void,
//   }

import { SECTION_IDS } from "./portfolioContext";

export const navigateToSection = (sectionId) => {
  if (!SECTION_IDS.includes(sectionId)) return;
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

export const executeActions = (actions, controller) => {
  if (!Array.isArray(actions)) return;

  actions.forEach((action) => {
    switch (action.type) {
      case "filter":
        controller.setCategory?.(action.categoryId);
        break;
      case "highlight":
        controller.highlight?.(action.projectIds);
        break;
      case "navigate":
        // Defer navigation slightly so any category/highlight state change has
        // rendered before we scroll.
        window.setTimeout(() => {
          (controller.navigate || navigateToSection)(action.sectionId);
        }, 80);
        break;
      default:
        break;
    }
  });
};
