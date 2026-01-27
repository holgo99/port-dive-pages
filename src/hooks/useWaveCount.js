// src/hooks/useWaveCount.js
/**
 * Elliott Wave count specific hook
 * Composes useDataSelector + domain-specific logic
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { useDataSelector } from "./useDataSelector";
import {
  fetchWaveCountData,
  getScenario,
  getScenariosRankedByProbability,
  calculateWeightedMetrics,
  wrapWithMetadata,
  isCacheFresh,
} from "../config/dataLoaders";
import { waveCountDataConfig } from "../config/dataStructures";

/**
 * Hook for managing wave count data and scenario selection
 *
 * Usage:
 * const { activeScenario, scenariosRanked, switchScenario } = useWaveCount();
 */
export const useWaveCount = (dataUrl = waveCountDataConfig.fetchUrl) => {
  const { activeId, activeItem, items, setActive } = useDataSelector();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Memoized prepared active scenario
  const activeScenario = useMemo(() => {
    return activeItem?.__prepared ? activeItem : null;
  }, [activeItem]);

  // Memoized metrics across all scenarios
  const weightedMetrics = useMemo(() => {
    return calculateWeightedMetrics(items);
  }, [items]);

  // Scenarios ranked by probability
  const scenariosRanked = useMemo(() => {
    return getScenariosRankedByProbability(items);
  }, [items]);

  // Validation helper
  const isValidScenario = useCallback(
    (scenarioId) => {
      return items?.hasOwnProperty(scenarioId);
    },
    [items],
  );

  // Switch scenario with validation
  const switchScenario = useCallback(
    (scenarioId) => {
      if (isValidScenario(scenarioId)) {
        setActive(scenarioId);
      } else {
        console.warn(`Invalid scenario ID: ${scenarioId}`);
      }
    },
    [isValidScenario, setActive],
  );

  // Fetch and load data on mount
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check cache first
        const cached =
          typeof window !== "undefined"
            ? localStorage?.getItem("waveCountData")
            : null;
        const wrapped = cached ? JSON.parse(cached) : null;

        let data;
        if (wrapped && isCacheFresh(wrapped)) {
          data = wrapped.data;
        } else {
          // Fetch fresh data
          data = await fetchWaveCountData(dataUrl);

          // Cache with metadata
          if (typeof window !== "undefined" && localStorage) {
            const wrapped = wrapWithMetadata(data);
            localStorage.setItem("waveCountData", JSON.stringify(wrapped));
          }
        }

        if (isMounted) {
          setLastUpdated(new Date());
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [dataUrl]);

  return {
    // Data
    activeScenario,
    items: Object.values(items),
    scenariosRanked,
    activeId,

    // Metrics
    weightedMetrics,

    // State
    isLoading,
    error,
    lastUpdated,

    // Actions
    switchScenario,

    // Utilities
    isValidScenario,
  };
};
