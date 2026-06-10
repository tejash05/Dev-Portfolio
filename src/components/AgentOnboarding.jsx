import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaRobot, FaTimes } from "react-icons/fa";

// First-time spotlight tour for the "Ask Portfolio Agent" button.
// Shows once per browser/device via localStorage. Purely presentational + a
// localStorage flag — does not touch assistant/RAG/routing logic.
const STORAGE_KEY = "portfolioAgentOnboardingSeen";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const AgentOnboarding = ({ onTryAgent }) => {
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Render only after mount so it never blocks initial page load.
  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      seen = false;
    }
    if (seen) return;

    setReducedMotion(prefersReducedMotion());
    const timer = setTimeout(() => setVisible(true), 900);
    return () => clearTimeout(timer);
  }, []);

  const markSeen = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Ignore storage errors (private mode, etc.).
    }
  };

  const handleSkip = () => {
    markSeen();
    setVisible(false);
  };

  const handleTryAgent = () => {
    markSeen();
    setVisible(false);
    onTryAgent?.();
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Soft spotlight glow around the floating agent button. */}
          <motion.div
            key="agent-spotlight"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.4 }}
            aria-hidden="true"
            className="pointer-events-none fixed bottom-2 right-2 z-40 h-24 w-24 rounded-full sm:bottom-3 sm:right-3"
          >
            <span
              className={`absolute inset-0 rounded-full bg-cyan-400/20 blur-2xl ${
                reducedMotion ? "" : "animate-pulse"
              }`}
            />
          </motion.div>

          {/* Premium tooltip/card above the floating button. */}
          <motion.div
            key="agent-onboarding"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: reducedMotion ? 0 : 0.28 }}
            role="dialog"
            aria-label="Portfolio Agent introduction"
            className="fixed bottom-20 right-4 z-50 w-[calc(100vw-2rem)] max-w-xs rounded-2xl border border-white/15 bg-stone-950/85 p-4 shadow-2xl shadow-black/60 backdrop-blur-xl sm:bottom-24 sm:right-6 sm:w-80"
          >
            <button
              type="button"
              onClick={handleSkip}
              aria-label="Dismiss introduction"
              className="absolute right-2 top-2 rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <FaTimes className="text-xs" />
            </button>

            <div className="flex items-start gap-3 pr-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-200/30 bg-cyan-200/10 text-cyan-200">
                <FaRobot />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Meet Tejash&apos;s Portfolio Agent
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-stone-400">
                  Ask about projects, skills, experience, research, or paste a
                  job description to check role fit.
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleSkip}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-stone-300 transition-colors hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={handleTryAgent}
                className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-stone-900 transition-all hover:scale-105 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Try Agent
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AgentOnboarding;
