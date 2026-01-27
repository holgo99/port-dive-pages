// src/config/dataStructures.js
/**
 * Configuration for wave count data structures
 * Defines where/how to fetch and default settings
 */

export const waveCountDataConfig = {
  // Data source - stored in public/ for daily updates
  fetchUrl: "/data/wave-counts/nbis-wave-counts.json",

  // Default selection when component loads
  defaultScenarioId: "primary",

  // Metadata about available scenarios
  scenarios: [
    {
      id: "primary",
      label: "Bullish continuation (weakened)",
      displayLabel: "Primary",
      probability: "35%",
      priority: 1,
    },
    {
      id: "alt1",
      label: "Corrective regime (C/Y down favored)",
      displayLabel: "Alternative 1",
      probability: "45%",
      priority: 2,
    },
    {
      id: "alt2",
      label: "Secondary corrective scenario",
      displayLabel: "Alternative 2",
      probability: "20%",
      priority: 3,
    },
  ],

  // Cache configuration for daily updates
  cacheStrategy: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    staleWhileRevalidate: true,
  },

  // UI display options
  displayOptions: {
    showProbability: true,
    showMetrics: true,
    showVerdict: true,
  },
};

// Mock data for SSR/fallback
export const mockWaveCountData = {
  primary: {
    id: "primary",
    label: "Bullish continuation (weakened)",
    probability: "35%",
    mode: "MOTIVE",
    description: "Primary scenario: Wave (5) still possible.",
    waves: [],
    metrics: [],
  },
};
