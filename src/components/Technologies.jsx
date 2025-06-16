import React from "react";
import {
  SiPython,
  SiFlask,
  SiFastapi,
  SiMysql,
  SiMongodb,
  SiReact,
  SiExpress,
  SiNodedotjs,
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiGithub,
  SiTypescript,
  SiOpenai,
  SiGoogle,
} from "react-icons/si";
import { motion } from "framer-motion";

const iconVariants = (duration) => ({
  initial: { y: -10 },
  animate: {
    y: [10, -10],
    transition: {
      duration: duration,
      ease: "linear",
      repeatType: "reverse",
      repeat: Infinity,
    },
  },
});

const technologies = [
  { name: "Python", icon: <SiPython className="text-7xl text-blue-400" />, delay: 2.5 },
  { name: "Flask", icon: <SiFlask className="text-7xl text-gray-500" />, delay: 3 },
  { name: "FastAPI", icon: <SiFastapi className="text-7xl text-green-400" />, delay: 2 },
  { name: "MySQL", icon: <SiMysql className="text-7xl text-blue-600" />, delay: 2.8 },
  { name: "MongoDB", icon: <SiMongodb className="text-7xl text-green-500" />, delay: 3.2 },
  { name: "Express", icon: <SiExpress className="text-7xl text-white" />, delay: 2.3 },
  { name: "Node.js", icon: <SiNodedotjs className="text-7xl text-green-600" />, delay: 2.6 },
  { name: "React", icon: <SiReact className="text-7xl text-cyan-400" />, delay: 2.7 },
  { name: "TypeScript", icon: <SiTypescript className="text-7xl text-blue-500" />, delay: 3.3 },
  { name: "JavaScript", icon: <SiJavascript className="text-7xl text-yellow-400" />, delay: 2.9 },
  { name: "HTML5", icon: <SiHtml5 className="text-7xl text-orange-500" />, delay: 2.4 },
  { name: "CSS3", icon: <SiCss3 className="text-7xl text-blue-500" />, delay: 2.2 },
  { name: "GitHub", icon: <SiGithub className="text-7xl text-white" />, delay: 3.5 },
  { name: "OpenAI", icon: <SiOpenai className="text-7xl text-emerald-500" />, delay: 3.6 },
  { name: "Gemini", icon: <SiGoogle className="text-7xl text-blue-400" />, delay: 3.7 },
];

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

      <motion.div
        whileInView={{ opacity: 1, x: 0 }}
        initial={{ opacity: 0, x: -100 }}
        transition={{ duration: 1.5 }}
        className="flex flex-wrap items-center justify-center gap-4"
      >
        {technologies.map(({ icon, delay, name }, index) => (
          <motion.div
            key={index}
            initial="initial"
            animate="animate"
            variants={iconVariants(delay)}
            className="p-4"
            title={name} // 👈 Tooltip on hover
          >
            {icon}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Technologies;
