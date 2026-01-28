import React, { useState, useEffect } from "react";
import Layout from "@theme/Layout";
//import { useTheme } from "@docusaurus/theme-common";
import styles from "./ticker-analysis.module.css";

// Import your custom components
import { TickerLayout } from "@site/src/components/TickerLayout";
import { TickerHeader } from "@site/src/components/TickerHeader";
import { WaveCountAnalysis } from "@site/src/components/WaveCountAnalysis";
import { MovingAveragesDashboard } from "@site/src/components/MovingAveragesDashboard";
import { OscillatorsDashboard } from "@site/src/components/OscillatorsDashboard";
import { SignalMatrix } from "@site/src/components/SignalMatrix";
import { AnalysisCard } from "@site/src/components/AnalysisCard";
import { useTickerConfig } from "@site/src/hooks/useTickerConfig";
import nbisConfig from "@site/data/tickers/nbis.json";

/**
 * TickerAnalysisPage
 *
 * Complete ticker analysis dashboard with:
 * - Wave count analysis
 * - Moving averages
 * - Oscillators
 * - Signal matrix
 * - Comprehensive analysis card
 */
export default function TickerAnalysisPage() {
  //const { isDarkMode } = useTheme().isDark;

  const [selectedTicker, setSelectedTicker] = useState("AAPL");
  const [timeframe, setTimeframe] = useState("1D");
  const [analysisData, setAnalysisData] = useState({
    title: "Full Analysis",
    subtitle: "Apr 2025 → Jun 2026 (Projection) | ATH: $141.10",
    athPrice: 141.1,
    projectionEnd: "Jun 2026",
    lastUpdated: "Jan 26, 2026",
    analysisDate: "2026-01-22",
  });

  const daysToShow = 30;
  const timeframeOptions = ["1H", "1D", "1W"];

  // Handle ticker selection
  const handleTickerChange = (e) => {
    setSelectedTicker(e.target.value);
  };

  // Handle timeframe change
  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  //const tickerConfig = useTickerConfig();
  const tickerConfig = nbisConfig;

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
                  className={`${styles.timeframeBtn} ${timeframe === tf ? styles.active : ""}`}
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

          {/* Grid Container - 2 columns on desktop, 1 on mobile */}
          <div className={styles.gridContainer}>
            {/* Left Column - Wave Analysis */}
            <div className={styles.column}>
              <WaveCountAnalysis
                ticker={selectedTicker}
                timeframe={timeframe}
              />
              {/* Signal Matrix */}
              <SignalMatrix daysToShow={daysToShow} ticker={selectedTicker} />
            </div>

            {/* Right Column - Technical Indicators */}
            <div className={styles.column}>
              {/* Moving Averages */}
              <MovingAveragesDashboard
                daysToShow={daysToShow}
                ticker={selectedTicker}
              />

              {/* Oscillators */}
              <OscillatorsDashboard
                daysToShow={daysToShow}
                ticker={selectedTicker}
              />
            </div>
          </div>

          {/* Analysis Card - Full Width */}
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

          {/* Metadata Section */}
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
