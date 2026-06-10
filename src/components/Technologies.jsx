import { motion } from "framer-motion";
import { SKILLS } from "../constants";

const Technologies = () => {
  return (
    <div className="pb-24">
      <motion.h2
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 1.5 }}
        className="my-20 text-center text-4xl"
      >
        Technologies
      </motion.h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SKILLS.map((group, index) => (
          <motion.div
            key={group.category}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-card p-6"
          >
            <h3 className="mb-4 text-lg font-semibold text-white">
              {group.category}
            </h3>
            <div className="flex flex-wrap">
              {group.items.map((item, idx) => (
                <span className="tech-tag" key={idx}>
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Technologies;
