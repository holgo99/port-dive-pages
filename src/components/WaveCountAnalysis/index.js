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

import React from "react";
import { WaveCountSelector } from "@site/src/components/WaveCountSelector";
import { VerdictPanel } from "@site/src/components/VerdictPanel";
import { ChartCanvasWrapper } from "@site/src/components/ChartCanvas";
import { useWaveCount } from "../../hooks/useWaveCount";
import { useOHLCVData } from "../../hooks/useOHLCVData";
import { useTickerConfig } from "../../hooks/useTickerConfig";
import styles from "./styles.module.css";

export function WaveCountAnalysis() {
  // Get config from context (if available)
  const tickerConfig = useTickerConfig();
  const ohlcvContext = useOHLCVData();
  const waveCounts = useWaveCount();

  return (
    <>
      <WaveCountSelector
        showProbability={true}
        onScenarioChange={(id) => {
          console.log("Selected:", id);
        }}
      />
      <ChartCanvasWrapper />
      {waveCounts.activeScenario.verdict.length > 0 && (
        <VerdictPanel
          verdict={waveCounts.activeScenario.verdict}
          isCorrective={waveCounts.activeScenario.verdict === "CORRECTIVE"}
        />
      )}
    </>
  );
}
