/**
 * TickerAnalysisPage - REFACTORED
 *
 * New Architecture:
 * - Tab-based navigation for analysis sections
 * - Split layout: 61.4% Tabs + 38.6% TickerDetails
 * - MainDashboard, WaveCountAnalysis, MovingAveragesDashboard, OscillatorsDashboard, SignalMatrix tabs
 * - Dynamic ticker details sidebar
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
import { TickerHeader } from "@site/src/components/TickerHeader";
import { TabsContainer } from "@site/src/components/TabsContainer";
import { TickerDetails } from "@site/src/components/TickerDetails";
import { AnalysisCard } from "@site/src/components/AnalysisCard";

// Import config
import { useTickerConfig } from "@site/src/hooks/useTickerConfig";
import nbisConfig from "@site/data/tickers/nbis.json";

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
 * Main Page Component
 */
export default function TickerAnalysisPage() {
  const [selectedTicker, setSelectedTicker] = useState("NBIS");
  const [timeframe, setTimeframe] = useState("1D");
  const [activeTab, setActiveTab] = useState("main");
  const [analysisData] = useState({
    title: "Full Analysis",
    subtitle: "Apr 2025 → Jun 2026 (Projection) | ATH: $141.10",
    athPrice: 141.1,
    projectionEnd: "Jun 2026",
    lastUpdated: "Jan 26, 2026",
    analysisDate: "2026-01-22",
  });

  const daysToShow = 30;
  const timeframeOptions = ["1H", "1D", "1W"];
  const tickerConfig = nbisConfig;

  const handleTickerChange = (e) => {
    setSelectedTicker(e.target.value);
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
        {/* Control Panel */}
        <div className={styles.controlPanel}>
          <div className={styles.controlGroup}>
            <label htmlFor="ticker-select">Select Ticker:</label>
            <input
              id="ticker-select"
              type="text"
              value={selectedTicker}
              onChange={handleTickerChange}
              placeholder="Enter ticker symbol"
              className={styles.tickerInput}
            />
          </div>
          <div className={styles.timeframeButtons}>
            <label>Timeframe:</label>
            <div className={styles.buttonGroup}>
              {timeframeOptions.map((tf) => (
                <button
                  key={tf}
                  className={`${styles.timeframeBtn} ${
                    timeframe === tf ? styles.active : ""
                  }`}
                  onClick={() => handleTimeframeChange(tf)}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Analysis Layout */}
        <TickerLayout config={tickerConfig} timeframe={timeframe}>
          {/* Header Section */}
          <div className={styles.headerSection}>
            <TickerHeader
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
