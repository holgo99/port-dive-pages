// src/components/WaveCountAnalysis/index.js
/**
 * Wave Count Analysis Component
 *
 * Displays Elliott Wave analysis with selector, chart, and analysis card.
 * Consumes ticker config from parent TickerConfigProvider context.
 *
 * @example
 * // Wrap with NBISLayout (or TickerConfigProvider) in MDX:
 * <NBISLayout>
 *   <WaveCountAnalysis />
 * </NBISLayout>
 */

import React, { useRef, useState, useEffect } from "react";
import { WaveCountSelector } from "@site/src/components/WaveCountSelector";
import { VerdictPanel } from "@site/src/components/VerdictPanel";
import { ChartCanvas } from "@site/src/components/ChartCanvas";
import { WaveCountChartOverlay } from "@site/src/components/WaveCountChartOverlay";
import { useWaveCount } from "../../hooks/useWaveCount";
import { useOHLCVData } from "../../hooks/useOHLCVData";
import { useTickerConfig } from "../../hooks/useTickerConfig";
import { useColorMode } from "@docusaurus/theme-common";
import { PORTDIVE_THEME } from "@site/src/components/PortDiveTheme";
import styles from "./styles.module.css";

export function WaveCountAnalysis() {
  // Get config from context (if available)
  const tickerConfig = useTickerConfig();
  const ohlcvContext = useOHLCVData();
  const waveCounts = useWaveCount();
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";
  const theme = isDarkMode ? PORTDIVE_THEME.dark : PORTDIVE_THEME.light;

  // Track container width for responsive chart
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(1000);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <div ref={containerRef}>
      <WaveCountSelector
        showProbability={true}
        onScenarioChange={(id) => {
          console.log("Selected:", id);
        }}
      />
      <ChartCanvas
        data={ohlcvContext.data}
        theme={theme}
        isDarkMode={isDarkMode}
        containerWidth={containerWidth}
      >
        <WaveCountChartOverlay
          activeCount={waveCounts.activeScenario}
          activeWaveCountId={waveCounts.activeId}
          analysisState={waveCounts.analysisState}
        />
      </ChartCanvas>
      {waveCounts.activeScenario?.verdict?.length > 0 && (
        <VerdictPanel
          verdict={waveCounts.activeScenario.verdict}
          isCorrective={waveCounts.activeScenario.mode === "CORRECTIVE"}
        />
      )}
    </div>
  );
}
