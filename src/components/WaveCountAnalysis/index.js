// src/components/WaveCountAnalysis/index.js
/**
 * Wave Count Analysis Component - PREMIUM REDESIGN
 *
 * Displays Elliott Wave analysis with selector, chart, and analysis card.
 * Uses premium panel design with logo header and chart container.
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
import { WaveCountChart } from "@site/src/components/WaveCountChart";
import { useWaveCount, WaveCountProvider } from "@site/src/hooks/useWaveCount";
import { useOHLCVData } from "@site/src/hooks/useOHLCVData";
import { useTickerConfig } from "@site/src/hooks/useTickerConfig";
import { useColorMode } from "@docusaurus/theme-common";
import { PORTDIVE_THEME } from "@site/src/components/PortDiveTheme";
import styles from "./styles.module.css";

/**
 * Elliott Wave Icon - 5-wave impulse pattern
 */
const ElliottWaveIcon = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={styles.logoIcon}
  >
    {/* 5-wave impulse pattern: 1-2-3-4-5 */}
    <path
      d="M2 18 L5 12 L7 14 L12 4 L15 10 L20 2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Wave labels as small dots */}
    <circle cx="2" cy="18" r="1.5" fill="currentColor" opacity="0.6" />
    <circle cx="5" cy="12" r="1.5" fill="currentColor" opacity="0.6" />
    <circle cx="7" cy="14" r="1.5" fill="currentColor" opacity="0.6" />
    <circle cx="12" cy="4" r="1.5" fill="currentColor" opacity="0.6" />
    <circle cx="15" cy="10" r="1.5" fill="currentColor" opacity="0.6" />
    <circle cx="20" cy="2" r="1.5" fill="currentColor" opacity="0.6" />
    {/* Projection dashed line */}
    <path
      d="M20 2 L22 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeDasharray="2,2"
      opacity="0.5"
    />
  </svg>
);

// Inner component that consumes the WaveCount context
function WaveCountAnalysisInner() {
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
    <>
      {/* Wave Count Selector */}
      <WaveCountSelector showProbability={true} />

      <div className={styles.waveCountWrapper}>
        {/* Logo Header */}
        <div className={styles.logoHeader}>
          <ElliottWaveIcon size={24} />
          <span className={styles.logoText}>WaveCountChart</span>
        </div>

        {/* Chart Container */}
        <div className={styles.chartContainer} ref={containerRef}>
          <div className={styles.chartWrapper}>
            <ChartCanvas
              data={ohlcvContext.data}
              theme={theme}
              isDarkMode={isDarkMode}
              containerWidth={containerWidth - 80}
            >
              <WaveCountChart
                activeCount={waveCounts.activeScenario}
                activeWaveCountId={waveCounts.activeId}
                analysisState={waveCounts.analysisState}
              />
            </ChartCanvas>
          </div>
        </div>

        {/* Footer Badge */}
        <div className={styles.footer}>
          <span
            className={`${styles.footerBadge} ${styles["footerBadge--glow"]}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Elliott Wave Analysis</span>
          </span>
        </div>
      </div>
      {/* Verdict Panel (if available) */}
      {waveCounts.activeScenario?.verdict?.length > 0 && (
        <VerdictPanel
          verdict={waveCounts.activeScenario.verdict}
          isCorrective={waveCounts.activeScenario.mode === "CORRECTIVE"}
        />
      )}
    </>
  );
}

// Main component that provides the WaveCount context
export function WaveCountAnalysis() {
  return (
    <WaveCountProvider>
      <WaveCountAnalysisInner />
    </WaveCountProvider>
  );
}
