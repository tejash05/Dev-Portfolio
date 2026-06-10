import { CONTACT } from "../constants";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import ContactForm from "./ContactForm";

const Contact = () => {
  return (
    <div className="border-t border-stone-900 pb-20">
      <motion.h2
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.5 }}
        className="my-10 text-center text-4xl"
      >
        Get in Touch
      </motion.h2>

      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="mb-6 text-lg text-stone-400">{CONTACT.cta}</p>

        <div className="mb-8 space-y-2 tracking-tight">
          <p className="text-stone-300">{CONTACT.location}</p>
          <a
            href={`mailto:${CONTACT.email}`}
            className="text-stone-300 underline-offset-4 hover:underline"
          >
            {CONTACT.email}
          </a>
        </div>

        <div className="mb-10 flex items-center justify-center gap-6 text-2xl text-stone-300">
          <a
            href={`mailto:${CONTACT.email}`}
            aria-label="Email"
            className="transition-all hover:scale-110 hover:text-white"
          >
            <FaEnvelope />
          </a>
          <a
            href={CONTACT.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="transition-all hover:scale-110 hover:text-white"
          >
            <FaGithub />
          </a>
          <a
            href={CONTACT.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="transition-all hover:scale-110 hover:text-white"
          >
            <FaLinkedin />
          </a>
        </div>

        <ContactForm source="contact-section" />
      </motion.div>
    </div>
  );
};

export default Contact;
