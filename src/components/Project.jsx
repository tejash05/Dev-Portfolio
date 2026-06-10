import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS, PROJECT_CATEGORIES } from "../constants";
import { usePortfolioUI } from "../context/portfolioUI";

const ProjectLink = ({ link }) => {
  const disabled = !link.href;
  const label = link.private
    ? `${link.label} Private`
    : link.todo && disabled
    ? `${link.label} Coming Soon`
    : link.label;

  if (disabled) {
    return (
      <span
        title={
          link.private
            ? "Private / internal project"
            : "Link coming soon"
        }
        aria-disabled="true"
        className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-stone-500 shadow-inner shadow-black/20"
      >
        {label}
      </span>
    );
  }

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-full border border-white/20 bg-white px-4 py-2 text-xs font-semibold text-stone-900 transition-all hover:scale-105 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      {label}
    </a>
  );
};

const ProjectCard = ({ project, categoryName, isHighlighted }) => {
  return (
    <motion.div
      id={project.id ? `project-${project.id}` : undefined}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className={`glass-card flex flex-col gap-6 p-6 transition-all duration-500 lg:flex-row ${
        isHighlighted
          ? "border-cyan-200/50 ring-2 ring-cyan-300/60 shadow-2xl shadow-cyan-500/20"
          : ""
      }`}
    >
      <div className="w-full lg:w-1/3">
        <img
          src={project.image}
          alt={project.title}
          className="h-48 w-full rounded-xl object-cover lg:h-full"
        />
      </div>

      <div className="flex w-full flex-col lg:w-2/3">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <h3 className="text-2xl font-semibold text-white">
            {project.title}
          </h3>
          <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-stone-300">
            {categoryName}
          </span>
        </div>

        {project.subtitle && (
          <p className="mb-3 text-sm font-medium text-stone-400">
            {project.subtitle}
          </p>
        )}

        <p className="mb-4 text-stone-400">{project.description}</p>

        {project.highlights?.length > 0 && (
          <ul className="mb-4 space-y-1.5">
            {project.highlights.slice(0, 3).map((highlight, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-stone-300"
              >
                <span className="mt-1 text-stone-500">▹</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mb-5 flex flex-wrap">
          {project.technologies.map((tech, idx) => (
            <span className="tech-tag" key={idx}>
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap gap-3">
          {project.links?.map((link, idx) => (
            <ProjectLink key={idx} link={link} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const {
    selectedProjectCategory: active,
    setSelectedProjectCategory: setActive,
    highlightedProjectIds,
  } = usePortfolioUI();
  const activeCategory = PROJECT_CATEGORIES.find((c) => c.id === active);
  const activeProjects = PROJECTS[active] || [];

  return (
    <div className="pb-12">
      <motion.h2
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.5 }}
        className="my-20 text-center text-4xl"
      >
        Projects
      </motion.h2>

      <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECT_CATEGORIES.map((category) => {
          const isActive = category.id === active;
          return (
            <motion.button
              key={category.id}
              type="button"
              onClick={() => setActive(category.id)}
              aria-pressed={isActive}
              whileHover={{ y: -6, scale: isActive ? 1.03 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.4 }}
              className={`group relative cursor-pointer overflow-hidden rounded-2xl border bg-white/5 p-6 text-left shadow-lg backdrop-blur-md outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                isActive
                  ? "scale-[1.02] border-white/40 bg-gradient-to-br from-white/[0.16] via-white/[0.08] to-cyan-400/[0.08] shadow-2xl shadow-cyan-500/15 ring-1 ring-cyan-200/40"
                  : "border-white/10 hover:border-white/30 hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-cyan-500/10"
              }`}
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-300/10 blur-2xl" />
              </div>
              <div className="relative mb-3 flex items-start justify-between gap-4">
                <h3 className="text-lg font-semibold text-white">
                  {category.name}
                </h3>
                {isActive && (
                  <span className="rounded-full border border-cyan-200/30 bg-cyan-200/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-100">
                    Selected
                  </span>
                )}
              </div>
              <p className="mb-4 text-sm text-stone-400">
                {category.description}
              </p>
              <div className="relative flex flex-wrap items-center justify-between gap-3">
                <span
                  className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${
                    isActive
                      ? "border-cyan-200/40 bg-cyan-200/15 text-cyan-50"
                      : "border-white/10 bg-white/10 text-stone-300"
                  }`}
                >
                  {category.count}
                </span>
                <span className="text-xs font-medium text-stone-500 transition-colors duration-300 group-hover:text-stone-200">
                  View projects
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="space-y-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {activeProjects.map((project, index) => (
              <ProjectCard
                key={project.id || index}
                project={project}
                categoryName={activeCategory?.name}
                isHighlighted={highlightedProjectIds.includes(project.id)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Projects;
