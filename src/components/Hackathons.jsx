import React from 'react';
import { motion } from 'framer-motion';

const hackathons = [
  {
    title: 'HackSRM 6.0 (AIML Track)',
    result: 'Winner',
    description: 'Built SafeClick — a phishing detection system with XGBoost and Chrome Extension. Won the AIML track with 92% accuracy.',
  },
  {
    title: 'Bharatiya Antariksh Hackathon 2024',
    result: 'Participant',
    description: 'Worked on satellite data analysis and predictive AI modeling for ISRO datasets.',
  },
  {
    title: 'HP Power Lab Hackathon',
    result: 'Participant',
    description: 'Created a sustainable energy dashboard for real-time power optimization using IoT simulation.',
  },
];

const Hackathons = () => {
  return (
    <div className="pb-4 flex flex-col items-center px-4">
      <motion.h2
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
        className="my-20 text-center text-4xl"
      >
        Hackathons
      </motion.h2>

      <div className="flex flex-col items-center space-y-6 w-full max-w-4xl">
        {hackathons.map((hack, index) => (
          <motion.div
            key={index}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="w-full bg-stone-900 p-6 rounded-lg shadow-lg text-left"
          >
            <h3 className="text-xl font-bold text-white">
              {hack.title}{' '}
              <span className="text-sm font-semibold text-green-400">
                ({hack.result})
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
