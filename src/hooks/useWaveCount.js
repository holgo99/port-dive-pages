// src/hooks/useWaveCount.js
/**
 * Hook for wave count scenario selection
 * Self-contained state management - no external context needed
 */

import { useState, useCallback, useMemo } from "react";
import waveCountData from "@site/data/wave-counts/nbis-wave-counts.json";
import { PORTDIVE_THEME } from "@site/src/components/PortDiveTheme";

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

/**
 * Hook for managing wave count scenarios
 *
 * @param {string} defaultId - Initial active scenario ID (default: "primary")
 * @returns {Object} - { activeId, activeScenario, items, switchScenario }
 */
export const useWaveCount = (defaultId = "primary") => {
  const [activeId, setActiveId] = useState(defaultId);

  // Prepare all scenarios once
  const items = useMemo(() => {
    return Object.values(waveCountData).map(prepareScenario);
  }, []);

  // Get active scenario
  const activeScenario = useMemo(() => {
    const scenario = waveCountData[activeId];
    return prepareScenario(scenario);
  }, [activeId]);

  // Switch scenario
  const switchScenario = useCallback((scenarioId) => {
    if (waveCountData[scenarioId]) {
      setActiveId(scenarioId);
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
