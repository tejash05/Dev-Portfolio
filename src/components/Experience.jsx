import { useEffect, useState } from "react";
import { EXPERIENCES } from "../constants";
import { motion } from "framer-motion";

const CompanyLogo = ({ experience }) => {
  const [failed, setFailed] = useState(false);
  const fallback = experience.logoFallback || experience.company.slice(0, 2).toUpperCase();

  useEffect(() => {
    setFailed(false);
  }, [experience.logo]);

  return (
    <div className="group/logo flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] p-3 shadow-lg shadow-black/20 transition-all duration-300 hover:border-white/25 hover:bg-white/[0.12] hover:shadow-cyan-500/10 sm:h-24 sm:w-24 lg:h-28 lg:w-28">
      {experience.logo && !failed ? (
        <img
          src={experience.logo}
          alt={`${experience.company} logo`}
          onError={() => setFailed(true)}
          className="max-h-full max-w-full rounded-xl object-contain"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center rounded-xl border border-white/10 bg-stone-950/80 text-lg font-semibold tracking-[0.2em] text-stone-200 sm:text-xl">
          {fallback}
        </span>
      )}
    </div>
  );
};

const Experience = () => {
  return (
    <div className="pb-4">
      <motion.h2
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.5 }}
        className="my-20 text-center text-4xl"
      >
        Experience
      </motion.h2>
      <div className="space-y-6">
        {EXPERIENCES.map((experience, index) => (
          <motion.div
            key={index}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-card flex flex-col gap-6 p-6 lg:flex-row lg:gap-8"
          >
            <div className="flex w-full items-start gap-4 sm:gap-5 lg:w-1/4 lg:flex-col">
              <CompanyLogo experience={experience} />
              <div className="pt-1 lg:pt-0">
                <p className="text-sm text-stone-400">{experience.year}</p>
                {experience.location && (
                  <p className="mt-1 text-xs text-stone-500">
                    {experience.location}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full lg:w-3/4">
              <h3 className="mb-1 text-lg font-semibold text-white">
                {experience.role}{" "}
                <span className="text-sm text-stone-500">
                  {experience.company}
                </span>
              </h3>
              <p className="mb-4 text-stone-400">{experience.description}</p>

              {experience.highlights?.length > 0 && (
                <ul className="mb-4 space-y-1.5">
                  {experience.highlights.map((highlight, idx) => (
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

              <div className="flex flex-wrap">
                {experience.technologies.map((tech, idx) => (
                  <span className="tech-tag" key={idx}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Experience;
