import { motion } from "framer-motion";
import { RESEARCH_PAPER } from "../constants";

const ResearchPaper = () => {
  return (
    <div className="flex flex-col items-center px-4 py-10 text-center">
      <motion.h2
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4 mt-20 text-center text-4xl"
      >
        Research & Publications
      </motion.h2>
      <p className="mb-12 max-w-2xl text-sm text-stone-400 md:text-base">
        {RESEARCH_PAPER.subtitle}
      </p>

      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.5 }}
        className="glass-card max-w-2xl p-8"
      >
        <h3 className="mb-4 text-xl font-semibold text-white">
          {RESEARCH_PAPER.title}
        </h3>
        <p className="mb-6 text-stone-400">{RESEARCH_PAPER.description}</p>

        {RESEARCH_PAPER.publication ? (
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={RESEARCH_PAPER.publication}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-stone-900 shadow transition-all hover:shadow-lg"
          >
            View Publication
          </motion.a>
        ) : (
          <span className="inline-block cursor-not-allowed rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-stone-500">
            Publication link coming soon
          </span>
        )}
      </motion.div>
    </div>
  );
};

export default ResearchPaper;
