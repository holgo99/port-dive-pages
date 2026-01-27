// src/config/dataLoaders.js
/**
 * Pure functions for loading, transforming, and preparing wave count data
 * No React dependencies - fully testable
 */

import { waveCountDataConfig, mockWaveCountData } from "./dataStructures";

/**
 * Main function: Fetch wave count data from public endpoint
 */
export const fetchWaveCountData = async (
  url = waveCountDataConfig.fetchUrl,
) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const data = await response.json();

    if (!validateWaveCountData(data)) {
      throw new Error("Invalid data structure");
    }

    return data;
  } catch (error) {
    console.error("Wave data fetch error:", error);
    return mockWaveCountData;
  }
};

/**
 * Validate data structure
 */
export const validateWaveCountData = (data) => {
  if (!data || typeof data !== "object") return false;

  const requiredFields = ["id", "label", "probability", "mode"];

  return Object.values(data).every((scenario) =>
    requiredFields.every((field) => field in scenario),
  );
};

/**
 * Transform raw scenario data into display-friendly format
 */
export const prepareScenarioData = (scenario) => {
  if (!scenario) return null;

  const metrics = (scenario.metrics || []).map((metric) => ({
    ...metric,
    isNegative: metric.isNegative || metric.value?.startsWith("-"),
    indicator: metric.indicator || false,
  }));

  const waves = (scenario.waves || []).map((wave, index) => ({
    ...wave,
    order: index + 1,
    isActive: wave.status === "IN PROGRESS",
    isComplete: wave.status === "COMPLETE",
  }));

  return {
    ...scenario,
    metrics,
    waves,
    displayMode: scenario.mode === "MOTIVE" ? "Bullish" : "Corrective",
    probabilityPercent: parseFloat(scenario.probability),
    hasProjection: scenario.projected && scenario.projected.length > 0,
    hasTargetBand: !!scenario.projectedTargetBand,
    __prepared: true,
    __preparedAt: new Date().toISOString(),
  };
};

/**
 * Get all available scenario IDs
 */
export const getScenarioIds = (data) => {
  return Object.keys(data || {});
};

/**
 * Get scenario by ID with preparation
 */
export const getScenario = (data, scenarioId) => {
  const scenario = data?.[scenarioId];
  return scenario ? prepareScenarioData(scenario) : null;
};

/**
 * Sort scenarios by probability (highest first)
 */
export const getScenariosRankedByProbability = (data) => {
  return getScenarioIds(data)
    .map((id) => ({ id, ...data[id] }))
    .sort((a, b) => {
      const probA = parseFloat(a.probability);
      const probB = parseFloat(b.probability);
      return probB - probA;
    });
};

/**
 * Calculate weighted metrics across all scenarios
 */
export const calculateWeightedMetrics = (data) => {
  const scenarios = getScenariosRankedByProbability(data);

  let totalEV = 0;
  let totalWeight = 0;

  scenarios.forEach((scenario) => {
    const prob = parseFloat(scenario.probability) / 100;
    const evMetric = scenario.metrics?.find(
      (m) => m.label === "Expected Value",
    );

    if (evMetric) {
      const ev = parseFloat(evMetric.value);
      totalEV += ev * prob;
      totalWeight += prob;
    }
  });

  return {
    weightedEV: totalWeight > 0 ? totalEV / totalWeight : 0,
    scenarioCount: scenarios.length,
  };
};

/**
 * Format for caching/storage with metadata
 */
export const wrapWithMetadata = (data) => {
  return {
    data,
    metadata: {
      version: "1.0",
      fetchedAt: new Date().toISOString(),
      expiresAt: new Date(
        Date.now() + waveCountDataConfig.cacheStrategy.maxAge,
      ).toISOString(),
    },
  };
};

/**
 * Check if cached data is still fresh
 */
export const isCacheFresh = (wrapped) => {
  if (!wrapped?.metadata?.expiresAt) return false;
  return new Date() < new Date(wrapped.metadata.expiresAt);
};
