// src/config/dataLoaders.js
/**
 * Utility functions for wave count data transformation
 * Pure functions - no side effects
 */

/**
 * Validate wave count data structure
 */
export const validateWaveCountData = (data) => {
  if (!data || typeof data !== "object") return false;

  const requiredFields = ["id", "label", "probability", "mode"];

  return Object.values(data).every((scenario) =>
    requiredFields.every((field) => field in scenario),
  );
};

/**
 * Sort scenarios by probability (highest first)
 */
export const getScenariosRankedByProbability = (scenarios) => {
  if (!scenarios || !Array.isArray(scenarios)) return [];

  return [...scenarios].sort((a, b) => {
    const probA = parseFloat(a.probability);
    const probB = parseFloat(b.probability);
    return probB - probA;
  });
};

/**
 * Calculate weighted expected value across all scenarios
 */
export const calculateWeightedEV = (scenarios) => {
  if (!scenarios || !Array.isArray(scenarios)) return 0;

  let totalEV = 0;
  let totalWeight = 0;

  scenarios.forEach((scenario) => {
    const prob = parseFloat(scenario.probability) / 100;
    const evMetric = scenario.metrics?.find((m) => m.label === "Expected Value");

    if (evMetric) {
      const ev = parseFloat(evMetric.value);
      totalEV += ev * prob;
      totalWeight += prob;
    }
  });

  return totalWeight > 0 ? totalEV / totalWeight : 0;
};
