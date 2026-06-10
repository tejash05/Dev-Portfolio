import profilePic from "../assets/Pic.png";
import { HERO_CONTENT, HERO_STATS, PROFILE } from "../constants";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, x: -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.4,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

const Hero = () => {
  return (
    <div className="pb-4 lg:mb-36">
      <div className="flex flex-wrap lg:flex-row-reverse">
        <div className="w-full lg:w-1/2">
          <div className="flex justify-center lg:p-8">
            <motion.img
              src={profilePic}
              alt="Tejash Tarun"
              className="rounded-3xl border border-stone-900"
              width={650}
              height={650}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 1.3 }}
            />
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mt-10 flex flex-col items-center lg:items-start"
          >
            <motion.h2
              variants={childVariants}
              className="mb-2 text-4xl tracking-tighter lg:text-8xl"
            >
              {PROFILE.name}
            </motion.h2>
            <motion.span
              variants={childVariants}
              className="bg-gradient-to-r from-stone-300 to-stone-600 bg-clip-text text-2xl tracking-tight text-transparent lg:text-3xl"
            >
              {PROFILE.title}
            </motion.span>
            <motion.p
              variants={childVariants}
              className="my-2 max-w-lg py-6 text-xl leading-relaxed tracking-tighter"
            >
              {HERO_CONTENT}
            </motion.p>

            <motion.div
              variants={childVariants}
              className="mb-6 flex flex-wrap justify-center gap-3 lg:justify-start"
            >
              {HERO_STATS.map((stat, idx) => (
                <span
                  key={idx}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-stone-300 backdrop-blur-md"
                >
                  {stat.label}
                </span>
              ))}
            </motion.div>

            <motion.div
              variants={childVariants}
              className="mb-10 flex flex-wrap justify-center gap-4 lg:justify-start"
            >
              <a
                href="/TejashTarun_resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-stone-900 transition-all hover:scale-105 hover:shadow-lg"
              >
                Download Resume
              </a>
              <a
                href="#projects"
                className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-stone-200 backdrop-blur-md transition-all hover:scale-105 hover:bg-white/10"
              >
                View Projects
              </a>
              <a
                href="#contact"
                className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-stone-200 backdrop-blur-md transition-all hover:scale-105 hover:bg-white/10"
              >
                Contact Me
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
