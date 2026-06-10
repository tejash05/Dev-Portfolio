import { motion } from "framer-motion";
import { ACHIEVEMENTS } from "../constants";

const Achievements = () => {
  return (
    <div className="pb-4">
      <motion.h2
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
        className="my-20 text-center text-4xl"
      >
        Achievements
      </motion.h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ACHIEVEMENTS.map((item, index) => (
          <motion.div
            key={index}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-card p-6"
          >
            <h3 className="mb-2 text-lg font-semibold text-white">
              {item.title}
            </h3>
            <p className="text-sm text-stone-400">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
