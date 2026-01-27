// src/components/WaveCountAnalysis/index.js
/**
 * Main Wave Count Analysis page component
 * Uses Context + Composition pattern for ticker config
 *
 * Combines selector, chart, and analysis card within
 * a TickerConfigProvider context
 */

import React from "react";
import { TickerConfigProvider } from "@site/src/hooks/useTickerConfig";
import { WaveCountSelector } from "@site/src/components/WaveCountSelector";
import { TickerHeader } from "@site/src/components/TickerHeader";
import { ShareElliotWave } from "@site/src/components/ShareElliotWave.jsx";
import { AnalysisCard } from "@site/src/components/AnalysisCard";
// import NBISElliottWaveChartWrapper from "@site/docs/nbis/assets/20260122/NBISElliottWaveChartWrapper.jsx";

export function WaveCountAnalysis(config) {
  return (
    <TickerConfigProvider config={config}>
      <div style={{ padding: "2rem" }}>
        <ShareElliotWave />
        <TickerHeader
          title="Elliott Wave Analysis"
          subtitle="Apr 2025 → Jun 2026 (Projection) | ATH: $141.10"
        />
        <WaveCountSelector
          showProbability={true}
          onScenarioChange={(id) => {
            console.log("Selected:", id);
          }}
        />
        {/* <NBISElliottWaveChartWrapper /> */}
        <AnalysisCard
          title="Elliott Wave Analysis"
          description="Complete wave count analysis with target levels and risk management"
          attribution="XX daily candles • Projection to Jun 2026 • Last updated: Jan 26, 2026"
          analysisDate="2026-01-22"
        />
      </div>
    </TickerConfigProvider>
  );
}
