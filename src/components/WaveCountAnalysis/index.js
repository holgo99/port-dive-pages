// src/pages/wave-analysis.jsx
import React from "react";
import { DataSelectorProvider } from "@site/src/hooks/useDataSelector";
import { WaveCountSelector } from "@site/src/components/WaveCountSelector";
import { fetchWaveCountData } from "@site/src/config/dataLoaders";
import { waveCountDataConfig } from "@site/src/config/dataStructures";
import NBISElliottWaveChartWrapper from "@site/docs/nbis/assets/20260122/NBISElliottWaveChartWrapper.jsx";
import { TickerHeader } from "@site/src/components/TickerHeader";
import { ShareElliotWave } from "@site/src/components/ShareElliotWave.jsx";
import { AnalysisCard } from "@site/src/components/AnalysisCard";
import { PORTDIVE_THEME } from "@site/src/components/PortDiveTheme";
import styles from "./styles.module.css";

export function WaveCountAnalysis() {
  const [scenarios, setScenarios] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetchWaveCountData().then((data) => {
      setScenarios(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DataSelectorProvider
      items={scenarios}
      defaultActiveId={waveCountDataConfig.defaultScenarioId}
      onActiveChange={(id) => {
        console.log("Scenario changed to:", id);
      }}
    >
      <div style={{ padding: "2rem" }}>
        <ShareElliotWave />
        <WaveCountSelector
          variant="tabs"
          showProbability={true}
          onScenarioChange={(id) => {
            console.log("Selected:", id);
          }}
          theme={PORTDIVE_THEME}
        />
        <TickerHeader
          tickerIconUrl="/portdive-pages/img/nbis/nbis-icon.svg"
          ticker="NBIS"
          tickerName="Nebius Group N.V."
          title="Elliott Wave Analysis"
          badge="1D"
          subtitle="Apr 2025 → Jun 2026 (Projection) | ATH: $141.10"
        />
        {/* <NBISElliottWaveChartWrapper /> */}
        <AnalysisCard
          title="NBIS - Elliott Wave Analysis"
          description="Complete wave count analysis with target levels and risk management"
          symbol="NBIS"
          attribution={`XX daily candles • Projection to Jun 2026 • Last updated: Jan 26, 2026`}
          analysisDate="2026-01-22"
        />
        {/* Display component goes here */}
      </div>
    </DataSelectorProvider>
  );
}
