/**
 * MainDashboard - Overview Dashboard Component
 *
 * Displays comprehensive ticker overview with:
 * - Performance metrics
 * - Key technical indicators summary
 * - Analysis metadata
 * - Quick links to other analysis tabs
 *
 * @component
 * @param {string} ticker - Ticker symbol
 * @param {string} timeframe - Current timeframe (1H, 1D, 1W)
 * @param {Object} analysisData - Analysis metadata
 * @param {number} daysToShow - Number of days in analysis
 */

import React from "react";
import styles from "./styles.module.css";

export function MainDashboard({ ticker, timeframe, analysisData, daysToShow }) {
  // Mock performance metrics
  const performanceMetrics = {
    ytdReturn: "+8.42%",
    volatility: "24.3%",
    sharpeRatio: 1.42,
    maxDrawdown: "-12.5%",
    winRate: "62.4%",
    profitFactor: 2.15,
  };

  // Mock technical indicators summary
  const technicalSummary = {
    rsi: { value: 58.2, signal: "Neutral" },
    macd: { value: 0.42, signal: "Bullish" },
    stochastic: { value: 72.1, signal: "Overbought" },
    bollingerBands: { position: "Mid-band", signal: "Consolidation" },
    ichimoku: { signal: "Bullish", trend: "Uptrend" },
  };

  // Mock support/resistance
  const levels = {
    resistance1: 145.3,
    resistance2: 152.1,
    support1: 135.8,
    support2: 128.5,
    pivot: 140.2,
  };

  return (
    <div className={styles.mainDashboard}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <div className={styles.headerLeft}>
          <h2 className={styles.dashboardTitle}>{ticker} Analysis Overview</h2>
          <p className={styles.dashboardSubtitle}>
            {timeframe} • {daysToShow} days • Analysis Date:{" "}
            {analysisData.analysisDate}
          </p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.ath}>
            <span className={styles.athLabel}>ATH</span>
            <span className={styles.athValue}>${analysisData.athPrice}</span>
          </div>
        </div>
      </div>

      {/* Performance Metrics Grid */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Performance Metrics</h3>
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>YTD Return</div>
            <div className={`${styles.metricValue} ${styles.positive}`}>
              {performanceMetrics.ytdReturn}
            </div>
            <div className={styles.metricBar}>
              <div className={styles.metricBarFill} style={{ width: "58%" }} />
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Volatility</div>
            <div className={styles.metricValue}>
              {performanceMetrics.volatility}
            </div>
            <div className={styles.metricBar}>
              <div className={styles.metricBarFill} style={{ width: "68%" }} />
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Sharpe Ratio</div>
            <div className={`${styles.metricValue} ${styles.neutral}`}>
              {performanceMetrics.sharpeRatio.toFixed(2)}
            </div>
            <div className={styles.metricBar}>
              <div className={styles.metricBarFill} style={{ width: "71%" }} />
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Max Drawdown</div>
            <div className={`${styles.metricValue} ${styles.negative}`}>
              {performanceMetrics.maxDrawdown}
            </div>
            <div className={styles.metricBar}>
              <div className={styles.metricBarFill} style={{ width: "45%" }} />
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Win Rate</div>
            <div className={`${styles.metricValue} ${styles.positive}`}>
              {performanceMetrics.winRate}
            </div>
            <div className={styles.metricBar}>
              <div className={styles.metricBarFill} style={{ width: "62%" }} />
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Profit Factor</div>
            <div className={`${styles.metricValue} ${styles.positive}`}>
              {performanceMetrics.profitFactor.toFixed(2)}
            </div>
            <div className={styles.metricBar}>
              <div className={styles.metricBarFill} style={{ width: "75%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Technical Indicators Summary */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Technical Indicators</h3>
        <div className={styles.indicatorsGrid}>
          {Object.entries(technicalSummary).map(([key, data]) => (
            <div key={key} className={styles.indicatorCard}>
              <div className={styles.indicatorName}>
                {key.replace(/([A-Z])/g, " $1").toUpperCase()}
              </div>
              <div className={styles.indicatorValue}>{data.value}</div>
              <div className={styles.indicatorSignal}>
                <span
                  className={`${styles.signal} ${styles[data.signal.toLowerCase()]}`}
                >
                  {data.signal}
                </span>
              </div>
              {data.trend && (
                <div className={styles.indicatorTrend}>{data.trend}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Support & Resistance Levels */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Key Levels</h3>
        <div className={styles.levelsGrid}>
          <div className={styles.levelCard}>
            <div className={styles.levelLabel}>Resistance 2</div>
            <div className={`${styles.levelValue} ${styles.resistance}`}>
              ${levels.resistance2.toFixed(2)}
            </div>
          </div>

          <div className={styles.levelCard}>
            <div className={styles.levelLabel}>Resistance 1</div>
            <div className={`${styles.levelValue} ${styles.resistance}`}>
              ${levels.resistance1.toFixed(2)}
            </div>
          </div>

          <div className={styles.levelCard}>
            <div className={styles.levelLabel}>Pivot</div>
            <div className={`${styles.levelValue} ${styles.pivot}`}>
              ${levels.pivot.toFixed(2)}
            </div>
          </div>

          <div className={styles.levelCard}>
            <div className={styles.levelLabel}>Support 1</div>
            <div className={`${styles.levelValue} ${styles.support}`}>
              ${levels.support1.toFixed(2)}
            </div>
          </div>

          <div className={styles.levelCard}>
            <div className={styles.levelLabel}>Support 2</div>
            <div className={`${styles.levelValue} ${styles.support}`}>
              ${levels.support2.toFixed(2)}
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
