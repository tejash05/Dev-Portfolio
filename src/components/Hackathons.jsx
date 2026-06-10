import { motion } from "framer-motion";
import { HACKATHONS } from "../constants";

const statusStyles = {
  Winner: "text-green-400",
  Finalist: "text-yellow-400",
  Participant: "text-stone-400",
};

const Hackathons = () => {
  return (
    <div className="flex flex-col items-center px-4 pb-4">
      <motion.h2
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
        className="my-20 text-center text-4xl"
      >
        Hackathons
      </motion.h2>

      <div className="flex w-full max-w-4xl flex-col items-center space-y-6">
        {HACKATHONS.map((hack, index) => (
          <motion.div
            key={index}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="glass-card w-full p-6 text-left"
          >
            <h3 className="text-xl font-bold text-white">
              {hack.title}{" "}
              <span
                className={`text-sm font-semibold ${
                  statusStyles[hack.status] || "text-stone-400"
                }`}
              >
                ({hack.status})
              </span>
            </h3>
            <p className="mt-2 text-stone-400">{hack.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Hackathons;
