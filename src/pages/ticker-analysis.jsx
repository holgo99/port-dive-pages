/**
 * TickerAnalysisPage - REFACTORED
 *
 * New Architecture:
 * - Tab-based navigation for analysis sections
 * - Split layout: 61.4% Tabs + 38.6% TickerDetails
 * - MainDashboard, WaveCountAnalysis, MovingAveragesDashboard, OscillatorsDashboard, SignalMatrix tabs
 * - Dynamic ticker details sidebar
 * - TickerSelector component for unified ticker/timeframe selection
 *
 * @component
 */

import React, { useState } from "react";
import Layout from "@theme/Layout";
import styles from "./ticker-analysis.module.css";

// Import tab components
import { MainDashboard } from "@site/src/components/MainDashboard";
import { WaveCountAnalysis } from "@site/src/components/WaveCountAnalysis";
import { MovingAveragesDashboard } from "@site/src/components/MovingAveragesDashboard";
import { OscillatorsDashboard } from "@site/src/components/OscillatorsDashboard";
import { SignalMatrix } from "@site/src/components/SignalMatrix";

// Import layout components
import { TickerLayout } from "@site/src/components/TickerLayout";
import { TickerSelector } from "@site/src/components/TickerSelector";
import { TabsContainer } from "@site/src/components/TabsContainer";
import { TickerDetails } from "@site/src/components/TickerDetails";
import { AnalysisCard } from "@site/src/components/AnalysisCard";

// Import ticker configs
import nbisConfig from "@site/data/tickers/nbis.json";
import nvoConfig from "@site/data/tickers/nvo.json";
import zetaConfig from "@site/data/tickers/zeta.json";

/**
 * All available ticker configurations
 */
const TICKER_CONFIGS = {
  NBIS: nbisConfig,
  NVO: nvoConfig,
  ZETA: zetaConfig,
};

/**
 * Available tickers for dropdown (derived from configs)
 */
const AVAILABLE_TICKERS = Object.values(TICKER_CONFIGS).map((config) => ({
  ticker: config.ticker,
  tickerName: config.tickerName,
  tickerIconUrl: config.tickerIconUrl,
}));

/**
 * Tab definitions
 */
const ANALYSIS_TABS = [
  { id: "main", label: "MainDashboard" },
  { id: "wave", label: "WaveCountAnalysis" },
  { id: "ma", label: "MovingAveragesDashboard" },
  { id: "oscillators", label: "OscillatorsDashboard" },
  { id: "signals", label: "SignalMatrix" },
];

/**
 * Available timeframe options
 */
const TIMEFRAME_OPTIONS = ["1H", "1D", "1W"];

/**
 * Main Page Component
 */
export default function TickerAnalysisPage() {
  const [selectedTicker, setSelectedTicker] = useState("NBIS");
  const [timeframe, setTimeframe] = useState("1D");
  const [activeTab, setActiveTab] = useState("main");

  const daysToShow = 30;

  // Get the current ticker's config
  const tickerConfig = TICKER_CONFIGS[selectedTicker] || nbisConfig;

  // Derive analysis data from the selected ticker's config
  const analysisData = {
    title: "Full Analysis",
    subtitle: `Apr 2025 → ${tickerConfig.analysisConfig?.projectionEnd || "Jun 2026"} (Projection) | ATH: $${tickerConfig.analysisConfig?.ath?.toFixed(2) || "0.00"}`,
    athPrice: tickerConfig.analysisConfig?.ath || 0,
    projectionEnd: tickerConfig.analysisConfig?.projectionEnd || "Jun 2026",
    lastUpdated: "Jan 26, 2026",
    analysisDate: "2026-01-22",
  };

  const handleTickerChange = (newTicker) => {
    setSelectedTicker(newTicker);
  };

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  /**
   * Render active tab content
   */
  const renderTabContent = () => {
    const props = {
      ticker: selectedTicker,
      timeframe: timeframe,
      daysToShow: daysToShow,
    };

    switch (activeTab) {
      case "main":
        return <MainDashboard {...props} analysisData={analysisData} />;
      case "wave":
        return <WaveCountAnalysis {...props} />;
      case "ma":
        return <MovingAveragesDashboard {...props} />;
      case "oscillators":
        return <OscillatorsDashboard {...props} />;
      case "signals":
        return <SignalMatrix {...props} />;
      default:
        return <MainDashboard {...props} analysisData={analysisData} />;
    }
  };

  return (
    <Layout
      title="Ticker Analysis Dashboard"
      description="Complete technical analysis with Elliott Wave, moving averages, oscillators, and signal matrix"
    >
      <div className={styles.pageContainer}>
        {/* Analysis Layout */}
        <TickerLayout config={tickerConfig} timeframe={timeframe}>
          {/* Header Section with TickerSelector */}
          <div className={styles.headerSection}>
            <TickerSelector
              ticker={selectedTicker}
              tickerIconUrl={tickerConfig.tickerIconUrl}
              tickerName={tickerConfig.tickerName}
              availableTickers={AVAILABLE_TICKERS}
              timeframe={timeframe}
              timeframeOptions={TIMEFRAME_OPTIONS}
              onTickerChange={handleTickerChange}
              onTimeframeChange={handleTimeframeChange}
              title={analysisData.title}
              subtitle={analysisData.subtitle}
            />
          </div>

          {/* Split Layout: Tabs (61.4%) + TickerDetails (38.6%) */}
          <div className={styles.splitContainer}>
            {/* Left Column - Tabs Container (61.4%) */}
            <div className={styles.tabsColumn}>
              <TabsContainer
                tabs={ANALYSIS_TABS}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              >
                {renderTabContent()}
              </TabsContainer>

              {/* Full Width Analysis Card */}
              <div className={styles.fullWidthSection}>
                <AnalysisCard
                  title="Comprehensive Analysis"
                  description="Complete analysis with target levels and risk management strategies"
                  attribution={`${daysToShow} daily candles • Projection to ${analysisData.projectionEnd} • Last updated: ${analysisData.lastUpdated}`}
                  analysisDate={analysisData.analysisDate}
                  ticker={selectedTicker}
                  timeframe={timeframe}
                />
              </div>
            </div>

            {/* Right Column - Ticker Details (38.6%) */}
            <div className={styles.detailsColumn}>
              <TickerDetails ticker={selectedTicker} />
            </div>
          </div>

          {/* Metadata Section - Full Width */}
          <div className={styles.metadataSection}>
            <div className={styles.metadataCard}>
              <div className={styles.metadataLabel}>ATH Price</div>
              <div className={styles.metadataValue}>
                ${analysisData.athPrice.toFixed(2)}
              </div>
            </div>
            <div className={styles.metadataCard}>
              <div className={styles.metadataLabel}>Projection Period</div>
              <div className={styles.metadataValue}>
                {analysisData.projectionEnd}
              </div>
            </div>
            <div className={styles.metadataCard}>
              <div className={styles.metadataLabel}>Last Analysis</div>
              <div className={styles.metadataValue}>
                {analysisData.analysisDate}
              </div>
            </div>
            <div className={styles.metadataCard}>
              <div className={styles.metadataLabel}>Analysis Scope</div>
              <div className={styles.metadataValue}>{daysToShow} days</div>
            </div>
          </div>
        </TickerLayout>
      </div>
    </Layout>
  );
}
