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

const ChartIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M3 3v18h18" />
    <path d="M18 9l-5 5-4-4-3 3" />
  </svg>
);

const SelectorIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M3 3v18h18" />
    <path d="M18 9l-5 5-4-4-3 3" />
  </svg>
);

const VerdictIcon = ({ size = 16 }) => (
  <svg
    className={styles.logoIcon}
    width="24"
    height="24"
    viewBox="0 0 32 32"
    fill="none"
  >
    <path
      d="M16 4L4 10L16 16L28 10L16 4Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 22L16 28L28 22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 16L16 22L28 16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
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
      <div className={styles.waveCountWrapper}>
        {/* Logo Header */}
        <div className={styles.logoHeader}>
          <ElliottWaveIcon size={24} />
          <span className={styles.logoText}>WaveCountAnalysis</span>
        </div>

        {/* Chart Container */}
        <section className={styles.wcaSection}>
          <div className={styles.sectionHeader}>
            <ChartIcon size={18} />
            <h2 className={styles.sectionTitle}>Chart Overlay</h2>
          </div>
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
        </section>

        {/* Wave Count Selector */}
        <section className={styles.wcaSection}>
          <div className={styles.sectionHeader}>
            <SelectorIcon size={18} />
            <h2 className={styles.sectionTitle}>Wave Count Selector</h2>
          </div>
          <WaveCountSelector showProbability={true} />
        </section>

        {/* Verdict Panel (if available) */}
        <section className={styles.wcaSection}>
          <div className={styles.sectionHeader}>
            <VerdictIcon size={18} />
            <h2 className={styles.sectionTitle}>Verdict</h2>
          </div>
          <VerdictPanel
            verdict={waveCounts.activeScenario.verdict}
            isCorrective={waveCounts.activeScenario.mode === "CORRECTIVE"}
            variant="embedded"
          />
        </section>

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
