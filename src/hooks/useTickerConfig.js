// src/hooks/useTickerConfig.js
/**
 * Ticker Configuration Context and Hook
 *
 * Provides ticker-specific configuration to child components
 * Uses Context + Composition pattern for clean data flow
 *
 * @example
 * // In parent component
 * import { TickerConfigProvider } from '@site/src/hooks/useTickerConfig';
 * import nbisConfig from '@site/data/tickers/nbis.json';
 *
 * <TickerConfigProvider config={nbisConfig}>
 *   <WaveCountSelector />
 *   <AnalysisCard />
 * </TickerConfigProvider>
 *
 * // In child component
 * import { useTickerConfig } from '@site/src/hooks/useTickerConfig';
 *
 * const { ticker, tickerName, tickerIconUrl } = useTickerConfig();
 */

import { createContext, useContext, useMemo } from "react";

// Import ticker configs
import nbisTickerConfig from "@site/data/tickers/nbis.json";

//  Default config shape for type safety
const defaultTickerConfig = {
  ticker: "",
  tickerName: "",
  tickerIconUrl: "",
  exchange: "",
  sector: "",
  industry: "",
  currency: "USD",
  analysisConfig: {
    timeframe: "1D",
    projectionEnd: "",
    ath: null,
    athDate: "",
  },
};

// Create context with default value
const TickerConfigContext = createContext(defaultTickerConfig);

/**
 * Provider component for ticker configuration
 *
 * @param {Object} props
 * @param {Object} props.config - Ticker configuration object
 * @param {React.ReactNode} props.children - Child components
 */
export const TickerConfigProvider = ({ config, children }) => {
  // Merge provided config with defaults
  const mergedConfig = useMemo(() => {
    if (!config) config = nbisTickerConfig;

    return {
      ...defaultTickerConfig,
      ...config,
      analysisConfig: {
        ...defaultTickerConfig.analysisConfig,
        ...config.analysisConfig,
      },
    };
  }, [config]);

  return (
    <TickerConfigContext.Provider value={mergedConfig}>
      {children}
    </TickerConfigContext.Provider>
  );
};

/**
 * Hook to access ticker configuration from context
 *
 * @returns {Object} Ticker configuration
 * @throws {Error} If used outside TickerConfigProvider
 */
export const useTickerConfig = () => {
  const context = useContext(TickerConfigContext);

  if (!context.ticker) {
    console.warn(
      "useTickerConfig: No ticker config found. " +
        "Wrap component tree with TickerConfigProvider.",
    );
  }

  return context;
};

/**
 * Hook to get formatted display strings from ticker config
 *
 * @returns {Object} Formatted display values
 */
export const useTickerDisplay = () => {
  const config = useTickerConfig();

  return useMemo(() => {
    const { analysisConfig } = config;

    return {
      ...config,
      // Formatted subtitle for headers
      subtitle: analysisConfig.projectionEnd
        ? `Projection to ${analysisConfig.projectionEnd}${analysisConfig.ath ? ` | ATH: $${analysisConfig.ath.toFixed(2)}` : ""}`
        : "",
      // Badge text (timeframe)
      badge: analysisConfig.timeframe || "1D",
    };
  }, [config]);
};

export default TickerConfigProvider;
