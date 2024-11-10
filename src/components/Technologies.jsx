import { SiPython, SiFlask, SiFastapi, SiMysql, SiReact } from "react-icons/si";
import { animate, motion } from "framer-motion";
const iconVariants = (duration) => ({
  initial: { y: -10 },
  animate: {
    y: [10, -10],
    transition: {
      duration: duration,
      ease: "linear",
      repeatType: "reverse",
      repeat: Infinity // Added to make the animation loop continuously
    }
  }
});

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
        <motion.div
          initial="initial"
          animate="animate"
          variants={iconVariants(2.5)}
          className="p-4"
        >
          <SiPython className="text-7xl text-blue-400" />
        </motion.div>
        <motion.div
          initial="initial"
          animate="animate"
          variants={iconVariants(3)}
          className="p-4"
        >
          <SiFlask className="text-7xl text-gray-500" />
        </motion.div>
        <motion.div 
        initial="initial"
        animate="animate"
        variants={iconVariants(5)}className="p-4">
          <SiFastapi className="text-7xl text-green-400" />
        </motion.div>
        <motion.div
        initial="initial"
        animate="animate"
        variants={iconVariants(2)}
        className="p-4">
          <SiMysql className="text-7xl text-blue-600" /> {/* Representing SQL */}
        </motion.div>
        <motion.div 
          initial="initial"
          animate="animate"
          variants={iconVariants(6)}className="p-4">   
          <SiReact className="text-7xl text-cyan-400" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Technologies;
