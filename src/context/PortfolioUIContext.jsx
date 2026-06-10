import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_PROJECT_CATEGORY } from "../constants";
import { PortfolioUIContext } from "./portfolioUI";

const HIGHLIGHT_DURATION_MS = 6000;

export const PortfolioUIProvider = ({ children }) => {
  const [selectedProjectCategory, setSelectedProjectCategory] = useState(
    DEFAULT_PROJECT_CATEGORY
  );
  const [highlightedProjectIds, setHighlightedProjectIds] = useState([]);
  const clearTimer = useRef(null);

  const highlightProjects = useCallback((ids) => {
    const list = Array.isArray(ids) ? ids : [ids].filter(Boolean);
    setHighlightedProjectIds(list);

    if (clearTimer.current) {
      clearTimeout(clearTimer.current);
    }
    if (list.length > 0) {
      clearTimer.current = setTimeout(() => {
        setHighlightedProjectIds([]);
      }, HIGHLIGHT_DURATION_MS);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (clearTimer.current) {
        clearTimeout(clearTimer.current);
      }
    };
  }, []);

  return (
    <PortfolioUIContext.Provider
      value={{
        selectedProjectCategory,
        setSelectedProjectCategory,
        highlightedProjectIds,
        setHighlightedProjectIds,
        highlightProjects,
      }}
    >
      {children}
    </PortfolioUIContext.Provider>
  );
};
