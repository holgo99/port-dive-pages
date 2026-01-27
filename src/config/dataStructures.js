// src/config/dataStructures.js
/**
 * Configuration constants and type definitions
 */

// ============================================================================
// WAVE COUNT CONFIG
// ============================================================================

export const waveCountConfig = {
  // Default selection when component loads
  defaultScenarioId: "primary",

  // UI display options
  displayOptions: {
    showProbability: true,
    showMetrics: true,
    showVerdict: true,
  },
};

// ============================================================================
// TICKER CONFIG SHAPE
// ============================================================================

/**
 * Default ticker configuration structure
 * Used as fallback and for type reference
 */
export const defaultTickerConfig = {
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

// ============================================================================
// SUPPORTED TICKERS
// ============================================================================

/**
 * Registry of available ticker configs
 * Add new tickers here when expanding coverage
 */
export const SUPPORTED_TICKERS = ["NBIS"];
