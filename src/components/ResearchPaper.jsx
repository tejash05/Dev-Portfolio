import { motion } from "framer-motion";

const ResearchPaper = () => {
  return (
    <div className="py-10 px-4 flex flex-col items-center text-center">
      <motion.h2
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="my-20 text-center text-4xl"
      >
        Research Paper
      </motion.h2>
      <p className="text-stone-400 max-w-xl mb-6">
        I authored a research paper titled <strong>“AI-Powered Mental Wellness Chatbot: Enhancing Accessibility to Psychological Support”</strong> based on my project <em>NeuroWell</em>. It was developed as part of an undergraduate initiative using FastAPI, Gemini 1.5, and LLaMA3 to bridge the gap between AI and real mental health support.
      </p>

      <motion.a
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        href="/NeuroWell-Research-Paper.pdf"
        target="_blank"
        rel="noopener noreferrer"
        download
        className="bg-white rounded-full px-6 py-3 text-sm text-stone-800 shadow hover:shadow-lg transition-all"
      >
        Download Research Paper
      </motion.a>
    </div>
  );
};

export default ResearchPaper;
