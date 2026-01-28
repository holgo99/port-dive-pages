/**
 * TickerIntelDashboard - Overview Dashboard Component
 *
 * Displays comprehensive ticker overview with:
 * - Analysis metadata
 * - Fundamental valuation placeholders (Gathering Intel...)
 * - Technical indicators from context
 * - Quick links to other analysis tabs
 *
 * @component
 * @param {string} ticker - Ticker symbol
 * @param {string} timeframe - Current timeframe (1H, 1D, 1W)
 * @param {Object} analysisData - Analysis metadata
 * @param {number} daysToShow - Number of days in analysis
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
// MAIN COMPONENT
// ============================================================================

export function TickerIntelDashboard({
  ticker,
  timeframe,
  analysisData,
  daysToShow,
}) {
  // Consume context for real data
  const intel = useTickerIntel();
  const config = useTickerConfig();

  // Get technical data from context (if available)
  const technical = intel?.technical;

  // Determine ticker display name
  const tickerDisplay = config?.ticker || ticker;
  const athPrice = analysisData?.athPrice || config?.analysis?.athPrice;

  return (
    <div className={styles.TickerIntelDashboard}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <div className={styles.headerLeft}>
          <h2 className={styles.dashboardTitle}>
            {tickerDisplay} Analysis Overview
          </h2>
          <p className={styles.dashboardSubtitle}>
            {timeframe} • {daysToShow} days • Analysis Date:{" "}
            {analysisData?.analysisDate || "N/A"}
          </p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.ath}>
            <span className={styles.athLabel}>ATH</span>
            <span className={styles.athValue}>
              ${athPrice || "—"}
            </span>
          </div>
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
            <div className={styles.summaryTitle}>Combined Valuation Methods</div>
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

      {/* Technical Indicators - Connected to Context */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Technical Indicators</h3>
        <div className={styles.indicatorsGrid}>
          <div className={styles.indicatorCard}>
            <div className={styles.indicatorName}>RSI</div>
            <div className={styles.indicatorValue}>
              {technical?.rsi?.toFixed(1) || "—"}
            </div>
            <div className={styles.indicatorSignal}>
              <span
                className={`${styles.signal} ${
                  technical?.rsi < 30
                    ? styles.oversold
                    : technical?.rsi > 70
                      ? styles.overbought
                      : styles.neutral
                }`}
              >
                {technical?.rsi < 30
                  ? "Oversold"
                  : technical?.rsi > 70
                    ? "Overbought"
                    : "Neutral"}
              </span>
            </div>
          </div>

          <div className={styles.indicatorCard}>
            <div className={styles.indicatorName}>MACD</div>
            <div className={styles.indicatorValue}>
              {technical?.macd?.toFixed(2) || "—"}
            </div>
            <div className={styles.indicatorSignal}>
              <span
                className={`${styles.signal} ${
                  technical?.macdHist > 0 ? styles.bullish : styles.bearish
                }`}
              >
                {technical?.macdHist > 0 ? "Bullish" : "Bearish"}
              </span>
            </div>
          </div>

          <div className={styles.indicatorCard}>
            <div className={styles.indicatorName}>ADX</div>
            <div className={styles.indicatorValue}>
              {technical?.adx?.toFixed(1) || "—"}
            </div>
            <div className={styles.indicatorSignal}>
              <span
                className={`${styles.signal} ${
                  technical?.adx > 25 ? styles.bullish : styles.neutral
                }`}
              >
                {technical?.adx > 25 ? "Strong Trend" : "Weak Trend"}
              </span>
            </div>
          </div>

          <div className={styles.indicatorCard}>
            <div className={styles.indicatorName}>Williams %R</div>
            <div className={styles.indicatorValue}>
              {technical?.williamsR?.toFixed(1) || "—"}
            </div>
            <div className={styles.indicatorSignal}>
              <span
                className={`${styles.signal} ${
                  technical?.williamsR < -80
                    ? styles.oversold
                    : technical?.williamsR > -20
                      ? styles.overbought
                      : styles.neutral
                }`}
              >
                {technical?.williamsR < -80
                  ? "Oversold"
                  : technical?.williamsR > -20
                    ? "Overbought"
                    : "Neutral"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Quick Analysis Navigation</h3>
        <div className={styles.quickActions}>
          <div className={styles.actionCard}>
            <div className={styles.actionIcon}>📊</div>
            <div className={styles.actionTitle}>Wave Count Analysis</div>
            <p className={styles.actionDesc}>
              Elliott Wave pattern analysis and projections
            </p>
          </div>
          <div className={styles.actionCard}>
            <div className={styles.actionIcon}>📈</div>
            <div className={styles.actionTitle}>Moving Averages</div>
            <p className={styles.actionDesc}>
              Trend analysis with multiple MA periods
            </p>
          </div>
          <div className={styles.actionCard}>
            <div className={styles.actionIcon}>⚙️</div>
            <div className={styles.actionTitle}>Oscillators</div>
            <p className={styles.actionDesc}>
              Momentum and overbought/oversold indicators
            </p>
          </div>
          <div className={styles.actionCard}>
            <div className={styles.actionIcon}>🎯</div>
            <div className={styles.actionTitle}>Signal Matrix</div>
            <p className={styles.actionDesc}>
              Combined trading signals and confidence levels
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
