import { createContext, useContext } from "react";

export const PortfolioUIContext = createContext(null);

export const usePortfolioUI = () => {
  const ctx = useContext(PortfolioUIContext);
  if (!ctx) {
    throw new Error("usePortfolioUI must be used within a PortfolioUIProvider");
  }
  return ctx;
};
