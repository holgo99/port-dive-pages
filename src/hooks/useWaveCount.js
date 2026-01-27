// src/hooks/useWaveCount.js
/**
 * Hook for wave count scenario selection
 * Self-contained state management with URL hash sync
 * Supports sharing via URL anchors (e.g., #wave-alt1)
 */

import { useState, useCallback, useMemo, useEffect } from "react";
import waveCountData from "@site/data/wave-counts/nbis-wave-counts.json";
import { PORTDIVE_THEME } from "@site/src/components/PortDiveTheme";

// Hash prefix for wave count URLs
const HASH_PREFIX = "wave-";

// Resolve color references to actual values
const resolveColor = (colorRef) => {
  if (!colorRef) return PORTDIVE_THEME.primary;
  if (colorRef.startsWith("PORTDIVE_THEME.")) {
    const key = colorRef.replace("PORTDIVE_THEME.", "");
    return PORTDIVE_THEME[key] || colorRef;
  }
  return colorRef;
};

// Prepare scenario data for display
const prepareScenario = (scenario) => {
  if (!scenario) return null;
  return {
    ...scenario,
    color: resolveColor(scenario.color),
    displayMode: scenario.mode === "MOTIVE" ? "Bullish" : "Corrective",
    probabilityPercent: parseFloat(scenario.probability),
  };
};

// Parse scenario ID from URL hash
const getScenarioFromHash = () => {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.slice(1); // Remove #
  if (hash.startsWith(HASH_PREFIX)) {
    const scenarioId = hash.slice(HASH_PREFIX.length);
    return waveCountData[scenarioId] ? scenarioId : null;
  }
  return null;
};

// Update URL hash without triggering navigation
const updateHash = (scenarioId) => {
  if (typeof window === "undefined") return;
  const newHash = `#${HASH_PREFIX}${scenarioId}`;
  if (window.location.hash !== newHash) {
    window.history.replaceState(null, "", newHash);
  }
};

/**
 * Hook for managing wave count scenarios
 * Syncs selection with URL hash for shareable links
 *
 * @param {string} defaultId - Initial active scenario ID (default: "primary")
 * @returns {Object} - { activeId, activeScenario, items, switchScenario }
 */
export const useWaveCount = (defaultId = "primary") => {
  // Initialize from URL hash if present, otherwise use default
  const [activeId, setActiveId] = useState(() => {
    return getScenarioFromHash() || defaultId;
  });

  // Sync URL hash on mount and listen for hash changes
  useEffect(() => {
    // Update hash on initial mount if not already set
    if (!window.location.hash) {
      updateHash(activeId);
    }

    // Handle browser back/forward navigation
    const handleHashChange = () => {
      const scenarioId = getScenarioFromHash();
      if (scenarioId && scenarioId !== activeId) {
        setActiveId(scenarioId);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [activeId]);

  // Prepare all scenarios once
  const items = useMemo(() => {
    return Object.values(waveCountData).map(prepareScenario);
  }, []);

  // Get active scenario
  const activeScenario = useMemo(() => {
    const scenario = waveCountData[activeId];
    return prepareScenario(scenario);
  }, [activeId]);

  // Switch scenario and update URL hash
  const switchScenario = useCallback((scenarioId) => {
    if (waveCountData[scenarioId]) {
      setActiveId(scenarioId);
      updateHash(scenarioId);
    } else {
      console.warn(`Invalid scenario ID: ${scenarioId}`);
    }
  }, []);

  return {
    activeId,
    activeScenario,
    items,
    switchScenario,
    // No loading/error states needed with direct import
    isLoading: false,
    error: null,
  };
};
