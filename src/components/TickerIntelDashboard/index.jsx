/**
 * TickerIntelDashboard - Overview Dashboard Component
 *
 * Displays comprehensive ticker overview with:
 * - Analysis metadata
 * - Fundamental valuation placeholders (Gathering Intel...)
 * - Technical indicators from context (premium gauge style)
 * - Quick navigation to other analysis tabs
 *
 * @component
 * @param {string} ticker - Ticker symbol
 * @param {string} timeframe - Current timeframe (1H, 1D, 1W)
 * @param {Object} analysisData - Analysis metadata
 * @param {number} daysToShow - Number of days in analysis
 * @param {Function} onNavigateToTab - Callback to navigate to a specific tab
 */

import React from "react";
import { useTickerIntel } from "@site/src/hooks/useTickerIntel";
import { useTickerConfig } from "@site/src/hooks/useTickerConfig";
import styles from "./styles.module.css";

// ============================================================================
// ICONS
// ============================================================================

const SearchIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const BarChartIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
);

const TrendingUpIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const CalculatorIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="8" y1="10" x2="8" y2="10" />
    <line x1="12" y1="10" x2="12" y2="10" />
    <line x1="16" y1="10" x2="16" y2="10" />
    <line x1="8" y1="14" x2="8" y2="14" />
    <line x1="12" y1="14" x2="12" y2="14" />
    <line x1="16" y1="14" x2="16" y2="14" />
    <line x1="8" y1="18" x2="8" y2="18" />
    <line x1="12" y1="18" x2="12" y2="18" />
    <line x1="16" y1="18" x2="16" y2="18" />
  </svg>
);

const GlobeIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const TableIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="3" y1="15" x2="21" y2="15" />
    <line x1="9" y1="3" x2="9" y2="21" />
    <line x1="15" y1="3" x2="15" y2="21" />
  </svg>
);

const GaugeIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2a10 10 0 0 1 10 10" />
    <path d="M12 2a10 10 0 0 0-10 10" />
    <path d="M12 12l4-4" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

// ============================================================================
// NAVIGATION CARD ICONS - Component Identity Icons
// ============================================================================

// Elliott Wave Icon - 5-wave impulse pattern (WaveCountAnalysis identity)
const ElliottWaveIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M2 18 L5 12 L7 14 L12 4 L15 10 L20 2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="2" cy="18" r="1.5" fill="currentColor" opacity="0.6" />
    <circle cx="5" cy="12" r="1.5" fill="currentColor" opacity="0.6" />
    <circle cx="7" cy="14" r="1.5" fill="currentColor" opacity="0.6" />
    <circle cx="12" cy="4" r="1.5" fill="currentColor" opacity="0.6" />
    <circle cx="15" cy="10" r="1.5" fill="currentColor" opacity="0.6" />
    <circle cx="20" cy="2" r="1.5" fill="currentColor" opacity="0.6" />
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

// Moving Average Icon - Smooth trend lines (MovingAveragesDashboard identity)
const MovingAverageIcon = ({ size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12c2-3 4-6 6-4s4 8 6 6 4-6 6-4" />
    <circle cx="4" cy="10" r="1.5" fill="currentColor" />
    <circle cx="12" cy="14" r="1.5" fill="currentColor" />
    <circle cx="20" cy="10" r="1.5" fill="currentColor" />
  </svg>
);

// Oscillator/Gauge Icon - Semi-circle gauge (OscillatorsDashboard identity)
const OscillatorIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path
      d="M6 22C6 14.268 12.268 8 20 8C23.713 8 27.083 9.464 29.536 11.88"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M2 22C2 12.059 10.059 4 20 4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.4"
    />
    <path
      d="M16 22L22 12"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="16" cy="22" r="2.5" fill="currentColor" />
    <circle cx="6" cy="22" r="1.5" fill="currentColor" opacity="0.5" />
    <circle cx="26" cy="22" r="1.5" fill="currentColor" opacity="0.5" />
    <circle cx="16" cy="10" r="1.5" fill="currentColor" opacity="0.5" />
  </svg>
);

// Signal Matrix Icon - Grid with checkmarks (ActionSignalMatrix identity)
const SignalMatrixIcon = ({ size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <path d="M5 6l2 2 3-3" strokeWidth="1.5" />
    <path d="M16 6l2 2 3-3" strokeWidth="1.5" />
  </svg>
);

// Arrow Right Icon for navigation
const ArrowRightIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// ============================================================================
// GATHERING INTEL PLACEHOLDER
// ============================================================================

const GatheringIntelPlaceholder = ({ title, description, icon: Icon }) => (
  <div className={styles.placeholderCard}>
    <div className={styles.placeholderHeader}>
      {Icon && (
        <div className={styles.placeholderIconWrapper}>
          <Icon size={18} />
        </div>
      )}
      <span className={styles.placeholderSectionTitle}>{title}</span>
    </div>
    <div className={styles.placeholderContent}>
      <div className={styles.placeholderIconLarge}>
        <SearchIcon size={32} />
      </div>
      <div className={styles.placeholderTitle}>Gathering Intel...</div>
      <div className={styles.placeholderSubtitle}>{description}</div>
      <div className={styles.placeholderLoader}>
        <div className={styles.loaderDot} />
        <div className={styles.loaderDot} />
        <div className={styles.loaderDot} />
      </div>
    </div>
  </div>
);

// ============================================================================
// TABLE SKELETON
// ============================================================================

const TableSkeleton = ({ rows = 6, columns = 5 }) => (
  <div className={styles.tableSkeletonWrapper}>
    <div className={styles.tableSkeletonHeader}>
      {Array.from({ length: columns }).map((_, i) => (
        <div key={i} className={styles.skeletonHeaderCell} />
      ))}
    </div>
    <div className={styles.tableSkeletonBody}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className={styles.skeletonRow}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className={`${styles.skeletonCell} ${colIndex === 0 ? styles.skeletonCellWide : ""}`}
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);

// ============================================================================
// TECHNICAL INDICATOR GAUGE CARD (OscillatorsDashboard style)
// ============================================================================

const getIndicatorStatus = (key, value) => {
  if (value == null) return { status: "—", color: "blue" };

  if (key === "RSI") {
    if (value >= 70) return { status: "OVERBOUGHT", color: "coral" };
    if (value <= 30) return { status: "OVERSOLD", color: "teal" };
    return { status: "NEUTRAL", color: "blue" };
  }

  if (key === "MACD") {
    if (value > 0.5) return { status: "BULLISH", color: "teal" };
    if (value < -0.5) return { status: "BEARISH", color: "coral" };
    return { status: "NEUTRAL", color: "blue" };
  }

  if (key === "ADX") {
    if (value >= 25) return { status: "STRONG TREND", color: "teal" };
    if (value >= 20) return { status: "WEAK TREND", color: "blue" };
    return { status: "NO TREND", color: "coral" };
  }

  if (key === "Williams_R") {
    if (value >= -20) return { status: "OVERBOUGHT", color: "coral" };
    if (value <= -80) return { status: "OVERSOLD", color: "teal" };
    return { status: "NEUTRAL", color: "blue" };
  }

  return { status: "NEUTRAL", color: "blue" };
};

const TechnicalGaugeCard = ({ label, value, indicatorKey }) => {
  const { status, color } = getIndicatorStatus(indicatorKey, value);
  const displayValue = value != null ? value.toFixed(1) : "—";

  return (
    <div className={`${styles.gaugeCard} ${styles[color]}`}>
      <div className={styles.gaugeLabel}>{label}</div>
      <div className={`${styles.gaugeValue} ${styles[color]}`}>
        {displayValue}
      </div>
      <div className={`${styles.gaugeStatusBadge} ${styles[color]}`}>
        {status}
      </div>
    </div>
  );
};

// ============================================================================
// NAVIGATION CARDS CONFIG
// ============================================================================

const NAVIGATION_CARDS = [
  {
    id: "wave",
    tabId: "wave",
    title: "WaveCountAnalysis",
    description: "Elliott Wave pattern analysis with probability projections",
    Icon: ElliottWaveIcon,
    colorClass: "waveCount",
  },
  {
    id: "ma",
    tabId: "ma",
    title: "MovingAveragesDashboard",
    description: "Trend analysis with SMA/EMA crossover signals",
    Icon: MovingAverageIcon,
    colorClass: "movingAverages",
  },
  {
    id: "oscillators",
    tabId: "oscillators",
    title: "OscillatorsDashboard",
    description: "Momentum oscillators and overbought/oversold signals",
    Icon: OscillatorIcon,
    colorClass: "oscillators",
  },
  {
    id: "signals",
    tabId: "signals",
    title: "ActionSignalMatrix",
    description: "Combined trading signals with AI contradiction resolution",
    Icon: SignalMatrixIcon,
    colorClass: "actionSignals",
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function TickerIntelDashboard({
  ticker,
  timeframe,
  analysisData,
  daysToShow,
  onNavigateToTab,
}) {
  // Consume context for real data
  const intel = useTickerIntel();
  const config = useTickerConfig();

  // Get technical data from context (if available)
  const technical = intel?.technical;

  // Determine ticker display name
  const tickerDisplay = config?.ticker || ticker;
  const athPrice = analysisData?.athPrice || config?.analysis?.athPrice;

  // Handle navigation card click
  const handleNavigationClick = (tabId) => {
    if (onNavigateToTab) {
      onNavigateToTab(tabId);
    } else {
      // Fallback: Try to find and click the tab button
      const tabButton = document.getElementById(`tab-${tabId}`);
      if (tabButton) {
        tabButton.click();
      }
    }
  };

  return (
    <div className={styles.TickerIntelDashboard}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <div className={styles.headerLeft}>
          <h2 className={styles.dashboardTitle}>
            {tickerDisplay} Analysis Overview
          </h2>
          <p className={styles.dashboardSubtitle}>
            Analysis Date: {analysisData?.analysisDate || "N/A"}
          </p>
        </div>
      </div>

      {/* Comparable Multiples Section */}
      <div className={styles.section}>
        <GatheringIntelPlaceholder
          title="Comparable Multiples"
          description="Searching for peer companies and comparing P/S, P/E, and EV/EBITDA multiples"
          icon={BarChartIcon}
        />
      </div>

      {/* Fair Value Calculation Section */}
      <div className={styles.section}>
        <GatheringIntelPlaceholder
          title="Fair Value Calculation"
          description="Calculating P/S and EV/EBITDA based fair value estimates"
          icon={CalculatorIcon}
        />
      </div>

      {/* DCF Valuation Section */}
      <div className={styles.section}>
        <GatheringIntelPlaceholder
          title="DCF Valuation"
          description="Projecting free cash flows and calculating discounted present value"
          icon={TrendingUpIcon}
        />
      </div>

      {/* TAM-Based Valuation Section */}
      <div className={styles.section}>
        <GatheringIntelPlaceholder
          title="TAM-Based Valuation"
          description="Analyzing total addressable market and market share scenarios"
          icon={GlobeIcon}
        />
      </div>

      {/* Valuation Summary Table Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <TableIcon size={14} />
          Valuation Summary
        </h3>
        <div className={styles.valuationSummaryCard}>
          <div className={styles.summaryHeader}>
            <div className={styles.summaryTitle}>
              Combined Valuation Methods
            </div>
            <div className={styles.summarySubtitle}>
              Weighted fair value across multiple methodologies
            </div>
          </div>
          <TableSkeleton rows={6} columns={5} />
          <div className={styles.summaryFooter}>
            <div className={styles.summaryFooterText}>
              <SearchIcon size={14} />
              <span>Gathering valuation data...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Indicators - Premium Gauge Style */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <GaugeIcon size={14} />
          Technical Indicators
        </h3>
        <div className={styles.gaugesGrid}>
          <TechnicalGaugeCard
            label="RSI(14)"
            value={technical?.rsi}
            indicatorKey="RSI"
          />
          <TechnicalGaugeCard
            label="MACD"
            value={technical?.macd}
            indicatorKey="MACD"
          />
          <TechnicalGaugeCard
            label="ADX(14)"
            value={technical?.adx}
            indicatorKey="ADX"
          />
          <TechnicalGaugeCard
            label="Williams %R"
            value={technical?.williamsR}
            indicatorKey="Williams_R"
          />
        </div>
      </div>

      {/* Quick Analysis Navigation - Premium Cards */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Quick Analysis Navigation</h3>
        <div className={styles.navigationGrid}>
          {NAVIGATION_CARDS.map((card) => (
            <button
              key={card.id}
              className={`${styles.navigationCard} ${styles[card.colorClass]}`}
              onClick={() => handleNavigationClick(card.tabId)}
              type="button"
            >
              <div className={styles.navCardHeader}>
                <div
                  className={`${styles.navCardIcon} ${styles[card.colorClass]}`}
                >
                  <card.Icon size={28} />
                </div>
                <div className={styles.navCardArrow}>
                  <ArrowRightIcon size={18} />
                </div>
              </div>
              <div className={styles.navCardContent}>
                <div className={styles.navCardTitle}>{card.title}</div>
                <p className={styles.navCardDesc}>{card.description}</p>
              </div>
              <div
                className={`${styles.navCardAccent} ${styles[card.colorClass]}`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
