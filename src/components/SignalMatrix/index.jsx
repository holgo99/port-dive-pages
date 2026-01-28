/**
 * SignalMatrix Component - PREMIUM REDESIGN
 *
 * Trading signal decision matrices with BUY/ADD and SELL/TRIM signals.
 * Includes AI Contradiction Resolution logic for conflicting indicators.
 *
 * Uses Context + Composition pattern via TickerConfigProvider + OHLCVDataProvider
 *
 * @component
 * @example
 * <TickerConfigProvider config={nbisConfig}>
 *   <OHLCVDataProvider ticker="NBIS" timeframe="1D">
 *     <SignalMatrix />
 *   </OHLCVDataProvider>
 * </TickerConfigProvider>
 */

import React, { useMemo, memo } from "react";
import { useTickerConfig } from "@site/src/hooks/useTickerConfig";
import { useOHLCVData } from "@site/src/hooks/useOHLCVData";
import styles from "./styles.module.css";

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

/**
 * Signal weight distribution for BUY/ADD signals
 * Volume + RSI = 60% (PRIMARY)
 * MACD + Williams %R = 40% (CONFIRMATION)
 */
const BUY_SIGNAL_WEIGHTS = {
  rsi: 0.3, // 30% - Part of primary (RSI)
  williamsR: 0.2, // 20% - Confirmation
  macd: 0.2, // 20% - Confirmation
  volume: 0.3, // 30% - Part of primary (Volume)
};

/**
 * Signal weight distribution for SELL/TRIM signals
 * RSI + Williams %R + Volume = 70% (PRIMARY)
 * MACD + Stochastic = 30% (CONFIRMATION)
 */
const SELL_SIGNAL_WEIGHTS = {
  rsi: 0.25, // 25% - Primary
  williamsR: 0.25, // 25% - Primary
  macd: 0.15, // 15% - Confirmation
  volume: 0.2, // 20% - Primary
  stochastic: 0.15, // 15% - Confirmation
};

/**
 * Elliott Wave hierarchy weights for contradiction resolution
 */
const HIERARCHY_WEIGHTS = {
  elliottWave: 0.4, // 40% - Primary decision driver
  momentum: 0.35, // 35% - RSI, Williams %R, MACD
  trend: 0.15, // 15% - ADX, DI
  volatility: 0.1, // 10% - ATR, volume spikes
};

// ============================================================================
// SVG ICONS
// ============================================================================

const SignalMatrixIcon = ({ size = 24 }) => (
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
    {/* Grid pattern representing decision matrix */}
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    {/* Check marks for confirmed signals */}
    <path d="M5 6l2 2 3-3" strokeWidth="1.5" />
    <path d="M16 6l2 2 3-3" strokeWidth="1.5" />
  </svg>
);

const CheckCircleIcon = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle
      cx="24"
      cy="24"
      r="20"
      stroke="currentColor"
      strokeWidth="2.5"
      fill="none"
    />
    <path
      d="M15 24l6 6 12-12"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const XCircleIcon = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle
      cx="24"
      cy="24"
      r="20"
      stroke="currentColor"
      strokeWidth="2.5"
      fill="none"
    />
    <path
      d="M16 16l16 16M32 16l-16 16"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

const BrainIcon = ({ size = 20 }) => (
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
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.54" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.54" />
  </svg>
);

const TrendUpIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const TrendDownIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);

const ScaleIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 3v18" />
    <path d="M5 6l7-3 7 3" />
    <path d="M5 6v4c0 1.1.9 2 2 2h2" />
    <path d="M19 6v4c0 1.1-.9 2-2 2h-2" />
    <circle cx="5" cy="17" r="2" />
    <circle cx="19" cy="17" r="2" />
  </svg>
);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if RSI is in oversold recovery (for BUY signal)
 * RSI <40, recovered from oversold
 */
const checkRSIOversoldRecovery = (data, daysBack = 5) => {
  if (!data || data.length < daysBack) return { met: false, value: null };

  const latest = data[data.length - 1];
  const rsi = latest?.RSI;

  if (rsi == null) return { met: false, value: null };

  // Check if RSI is below 40 and was previously below 30 (oversold)
  const wasOversold = data
    .slice(-daysBack)
    .some((d) => d.RSI != null && d.RSI < 30);
  const isRecovering = rsi < 40 && rsi > 30;
  const met = isRecovering && wasOversold;

  return { met, value: rsi, wasOversold, isRecovering };
};

/**
 * Check if Williams %R is extremely oversold (for BUY signal)
 * Williams %R < -80
 */
const checkWilliamsROversold = (data) => {
  if (!data || data.length === 0) return { met: false, value: null };

  const latest = data[data.length - 1];
  const williamsR = latest?.Williams_R;

  if (williamsR == null) return { met: false, value: null };

  const met = williamsR < -80;
  return { met, value: williamsR };
};

/**
 * Check for MACD bullish crossover with positive histogram
 * MACD bullish crossover + histogram positive 2+ days
 */
const checkMACDBullishCrossover = (data, daysPositive = 2) => {
  if (!data || data.length < daysPositive + 1)
    return { met: false, value: null };

  const recent = data.slice(-daysPositive - 1);
  const histValues = recent.map((d) => d["MACD.hist"]).filter((v) => v != null);

  if (histValues.length < daysPositive) return { met: false, value: null };

  // Check if histogram has been positive for required days
  const recentPositive = histValues
    .slice(-daysPositive)
    .every((h) => h != null && h > 0);

  // Check for crossover (previous was negative, now positive)
  const hadCrossover =
    histValues.length > daysPositive && histValues[0] != null && histValues[0] <= 0;

  const latest = data[data.length - 1];
  const met = recentPositive && hadCrossover;

  return {
    met,
    value: latest?.["MACD.hist"],
    daysPositive: recentPositive ? daysPositive : 0,
  };
};

/**
 * Check for volume spike (accumulation confirmed)
 * Volume spike >150% ADV on bounce day
 */
const checkVolumeSpike = (data, threshold = 1.5) => {
  if (!data || data.length === 0) return { met: false, value: null };

  const latest = data[data.length - 1];
  const volume = latest?.volume;
  const volumeMA = latest?.Volume_20_MA;

  if (volume == null || volumeMA == null || volumeMA === 0)
    return { met: false, value: null };

  const ratio = volume / volumeMA;
  const met = ratio > threshold;

  return { met, value: ratio, volume, avgVolume: volumeMA };
};

/**
 * Check for bullish candlestick pattern
 * Simplified check: price closed higher than open with significant body
 */
const checkBullishCandlestick = (data) => {
  if (!data || data.length === 0) return { met: false, value: null };

  const latest = data[data.length - 1];
  const open = latest?.open;
  const close = latest?.close;
  const high = latest?.high;
  const low = latest?.low;

  if (open == null || close == null || high == null || low == null)
    return { met: false, value: null };

  const bodySize = Math.abs(close - open);
  const totalRange = high - low;

  if (totalRange === 0) return { met: false, value: "No range" };

  // Check for hammer pattern: small body at top, long lower wick
  const lowerWick = Math.min(open, close) - low;
  const upperWick = high - Math.max(open, close);
  const isHammer =
    lowerWick > bodySize * 2 && upperWick < bodySize && close > open;

  // Check for bullish engulfing: current body engulfs previous
  const prev = data.length > 1 ? data[data.length - 2] : null;
  const isEngulfing =
    prev &&
    close > open &&
    prev.close < prev.open &&
    close > prev.open &&
    open < prev.close;

  // Check for dragonfly doji: small body, long lower shadow
  const isDragonfly =
    bodySize / totalRange < 0.1 && lowerWick > totalRange * 0.6;

  const met = isHammer || isEngulfing || isDragonfly;
  const pattern = isHammer
    ? "Hammer"
    : isEngulfing
      ? "Bullish Engulfing"
      : isDragonfly
        ? "Dragonfly Doji"
        : "None";

  return { met, value: pattern };
};

/**
 * Check if RSI is overbought for consecutive days (for SELL signal)
 * RSI >75 for 2+ consecutive daily closes
 */
const checkRSIOverbought = (data, consecutiveDays = 2) => {
  if (!data || data.length < consecutiveDays)
    return { met: false, value: null };

  const recent = data.slice(-consecutiveDays);
  const allOverbought = recent.every((d) => d.RSI != null && d.RSI > 75);

  const latest = data[data.length - 1];
  return { met: allOverbought, value: latest?.RSI, consecutiveDays };
};

/**
 * Check if Williams %R exited extreme overbought (for SELL signal)
 * Williams %R > -20
 */
const checkWilliamsROverbought = (data) => {
  if (!data || data.length === 0) return { met: false, value: null };

  const latest = data[data.length - 1];
  const williamsR = latest?.Williams_R;

  if (williamsR == null) return { met: false, value: null };

  const met = williamsR > -20;
  return { met, value: williamsR };
};

/**
 * Check for MACD histogram shrinking (for SELL signal)
 * MACD histogram shrinking 3+ days (momentum declining)
 */
const checkMACDHistogramShrinking = (data, days = 3) => {
  if (!data || data.length < days + 1) return { met: false, value: null };

  const recent = data.slice(-(days + 1));
  const histValues = recent.map((d) => d["MACD.hist"]).filter((v) => v != null);

  if (histValues.length < days + 1) return { met: false, value: null };

  // Check if histogram is consistently shrinking (decreasing absolute value or turning negative)
  let shrinkingCount = 0;
  for (let i = 1; i < histValues.length; i++) {
    if (histValues[i] < histValues[i - 1]) {
      shrinkingCount++;
    }
  }

  const met = shrinkingCount >= days;
  const latest = data[data.length - 1];

  return { met, value: latest?.["MACD.hist"], shrinkingDays: shrinkingCount };
};

/**
 * Check for volume declining on new highs (for SELL signal)
 * Distribution warning
 */
const checkVolumeDeclining = (data, days = 5) => {
  if (!data || data.length < days) return { met: false, value: null };

  const recent = data.slice(-days);

  // Check if price is making highs while volume is declining
  const priceRising = recent[recent.length - 1]?.close > recent[0]?.close;
  const volumeDecline =
    recent[recent.length - 1]?.volume < recent[0]?.volume * 0.8;

  const latest = data[data.length - 1];
  const volumeMA = latest?.Volume_20_MA;
  const currentVolume = latest?.volume;

  const met = priceRising && volumeDecline;

  return {
    met,
    value: currentVolume,
    avgVolume: volumeMA,
    ratio: volumeMA ? currentVolume / volumeMA : null,
  };
};

/**
 * Check for Stochastic overbought (for SELL signal)
 * Stochastic K + D > 80 for 2+ days
 */
const checkStochasticOverbought = (data, consecutiveDays = 2) => {
  if (!data || data.length < consecutiveDays)
    return { met: false, value: null };

  const recent = data.slice(-consecutiveDays);
  const allOverbought = recent.every(
    (d) =>
      d.Stoch_K != null && d.Stoch_D != null && d.Stoch_K > 80 && d.Stoch_D > 80
  );

  const latest = data[data.length - 1];
  return {
    met: allOverbought,
    value: `K:${latest?.Stoch_K?.toFixed(0)}/D:${latest?.Stoch_D?.toFixed(0)}`,
    stochK: latest?.Stoch_K,
    stochD: latest?.Stoch_D,
  };
};

/**
 * Calculate total weight of confirmed signals
 */
const calculateTotalWeight = (signals, weights) => {
  return signals.reduce((total, signal, idx) => {
    const weightKey = Object.keys(weights)[idx];
    return total + (signal.met ? weights[weightKey] || 0 : 0);
  }, 0);
};

/**
 * Determine BUY action based on signals and weights
 */
const determineBuyAction = (confirmedCount, totalWeight, fibLevel = null) => {
  // Fibonacci context adjustment
  if (fibLevel === 61.8) {
    return {
      action: "DO NOT BUY",
      reason: "At 61.8% Fib (invalidation level)",
      color: "coral",
      percentage: 0,
    };
  }

  if (confirmedCount >= 5) {
    const percentage = fibLevel === 38.2 ? 40 : fibLevel === 50 ? 35 : 40;
    return {
      action: `ADD ${percentage}%`,
      reason: "All signals confirmed - Aggressive reload",
      color: "teal",
      percentage,
    };
  }

  if (confirmedCount >= 4 && totalWeight > 0.7) {
    const percentage = fibLevel === 38.2 ? 40 : 35;
    return {
      action: `ADD ${percentage - 5}-${percentage}%`,
      reason: "Strong entry, reload position",
      color: "teal",
      percentage,
    };
  }

  if (confirmedCount >= 3 && totalWeight > 0.6) {
    return {
      action: "ADD 25-40%",
      reason: "Good signal confluence",
      color: "teal",
      percentage: 32,
    };
  }

  if (confirmedCount === 3 && totalWeight >= 0.5) {
    return {
      action: "ADD 15%",
      reason: "Cautious add - test entry",
      color: "blue",
      percentage: 15,
    };
  }

  return {
    action: "HOLD",
    reason: "Insufficient signals",
    color: "blue",
    percentage: 0,
  };
};

/**
 * Determine SELL action based on signals and weights
 */
const determineSellAction = (
  confirmedCount,
  totalWeight,
  elliottContext = null
) => {
  // Elliott Wave context adjustment
  if (elliottContext === "wave5Complete") {
    return {
      action: "TRIM 60-75%",
      reason: "Wave 5 completion - Exit majority",
      color: "coral",
      percentage: 67,
    };
  }

  if (elliottContext === "wave3Complete") {
    return {
      action: "TRIM 40-50%",
      reason: "Wave 3 completion - Profit taking",
      color: "coral",
      percentage: 45,
    };
  }

  if (elliottContext === "wave4Expected") {
    return {
      action: "TRIM 25-30%",
      reason: "Wave 4 pullback expected",
      color: "blue",
      percentage: 27,
    };
  }

  if (confirmedCount >= 5) {
    return {
      action: "TRIM 50-60%",
      reason: "All signals confirmed - Near peak warning",
      color: "coral",
      percentage: 55,
    };
  }

  if (confirmedCount >= 4 && totalWeight > 0.7) {
    return {
      action: "TRIM 40-50%",
      reason: "Strong sell - Reduce exposure",
      color: "coral",
      percentage: 45,
    };
  }

  if (confirmedCount >= 3 && totalWeight > 0.6) {
    return {
      action: "TRIM 25-50%",
      reason: "Good signal confluence",
      color: "coral",
      percentage: 37,
    };
  }

  if (confirmedCount === 3 && totalWeight >= 0.5) {
    return {
      action: "TRIM 25%",
      reason: "Cautious trim - Hold core",
      color: "blue",
      percentage: 25,
    };
  }

  if (confirmedCount >= 2) {
    return {
      action: "WATCH CLOSELY",
      reason: "Some warning signs",
      color: "blue",
      percentage: 0,
    };
  }

  return {
    action: "HOLD",
    reason: "Insufficient sell signals",
    color: "teal",
    percentage: 0,
  };
};

/**
 * Analyze contradictions between indicators
 */
const analyzeContradictions = (data, buySignals, sellSignals) => {
  if (!data || data.length === 0) return null;

  const latest = data[data.length - 1];
  const contradictions = [];

  // Example 1: RSI Overbought BUT ADX Strong
  const rsi = latest?.RSI;
  const adx = latest?.ADX;
  if (rsi > 70 && adx > 25) {
    contradictions.push({
      type: "RSI_vs_ADX",
      description: "RSI Overbought BUT ADX Shows Strong Trend",
      momentum: "SELL",
      trend: "HOLD",
      resolution:
        "Elliott Wave takes precedence. If Wave 3 markup continues, TRIM 15-20% only",
      action: "TRIM 15-20%",
      color: "blue",
      weights: { momentum: 0.35, trend: 0.15, elliott: 0.4 },
    });
  }

  // Example 2: Volume Spike BUT Price Below MA(20)
  const close = latest?.close;
  const ma20 = latest?.SMA_20;
  const volume = latest?.volume;
  const volumeMA = latest?.Volume_20_MA;
  if (volume > volumeMA * 1.5 && close < ma20) {
    contradictions.push({
      type: "Volume_vs_Trend",
      description: "Volume Spike BUT Price Below MA(20)",
      volume: "BUY (accumulation)",
      trend: "SELL (downtrend)",
      resolution:
        "Only buy if at Fibonacci support. Could be dead cat bounce otherwise",
      action: "WAIT FOR SUPPORT",
      color: "blue",
      weights: { volume: 0.1, trend: 0.15, fib: 0.4 },
    });
  }

  // Example 3: MACD Bearish BUT Strong Price Momentum
  const macdHist = latest?.["MACD.hist"];
  const macdPrevHist =
    data.length > 1 ? data[data.length - 2]?.["MACD.hist"] : null;
  const priceChange = data.length > 5 ? close / data[data.length - 5]?.close - 1 : 0;

  if (macdHist < macdPrevHist && priceChange > 0.05) {
    contradictions.push({
      type: "MACD_vs_Price",
      description: "MACD Bearish Crossover BUT Price Rising",
      macd: "SELL",
      price: "HOLD",
      resolution:
        "Elliott Wave (40%) + Trend (15%) = 55% says HOLD. MACD lags price",
      action: "HOLD or TRIM 10%",
      color: "teal",
      weights: { macd: 0.35, elliott: 0.4, trend: 0.15 },
    });
  }

  return contradictions.length > 0 ? contradictions : null;
};

// ============================================================================
// SIGNAL CARD COMPONENT
// ============================================================================

const SignalCard = memo(({ signal, index }) => {
  const { label, description, met, value, details } = signal;

  return (
    <div
      className={`${styles.signalCard} ${met ? styles.confirmed : styles.notMet}`}
    >
      <div className={styles.signalCardHeader}>
        <span className={styles.signalNumber}>#{index + 1}</span>
        <span className={styles.signalLabel}>{label}</span>
      </div>

      <div className={styles.signalIconContainer}>
        <div
          className={`${styles.signalIcon} ${met ? styles.confirmed : styles.notMet}`}
        >
          {met ? <CheckCircleIcon size={40} /> : <XCircleIcon size={40} />}
        </div>
      </div>

      <div className={styles.signalCardBody}>
        <span className={styles.signalDescription}>{description}</span>
        <span
          className={`${styles.signalStatus} ${met ? styles.confirmed : styles.notMet}`}
        >
          {met ? "CONFIRMED" : "NOT MET"}
        </span>
      </div>

      <div className={styles.signalCardFooter}>
        <span className={styles.signalValueLabel}>Current:</span>
        <span
          className={`${styles.signalValue} ${met ? styles.confirmed : styles.notMet}`}
        >
          {typeof value === "number" ? value.toFixed(2) : value ?? "—"}
        </span>
      </div>
    </div>
  );
});

// ============================================================================
// SIGNAL MATRIX SECTION COMPONENT
// ============================================================================

const SignalMatrixSection = memo(
  ({ title, signals, weights, action, totalWeight, confirmedCount, type }) => {
    const progressPercent = (confirmedCount / signals.length) * 100;
    const isBuy = type === "BUY";

    return (
      <div
        className={`${styles.matrixSection} ${isBuy ? styles.buySection : styles.sellSection}`}
      >
        <div className={styles.matrixHeader}>
          <div className={styles.matrixHeaderLeft}>
            <div
              className={`${styles.matrixIcon} ${isBuy ? styles.teal : styles.coral}`}
            >
              {isBuy ? <TrendUpIcon size={18} /> : <TrendDownIcon size={18} />}
            </div>
            <h3 className={styles.matrixTitle}>{title}</h3>
          </div>
          <span className={styles.matrixSubtitle}>Need 3/5 Confirmed</span>
        </div>

        <div className={styles.signalGrid}>
          {signals.map((signal, idx) => (
            <SignalCard key={signal.label} signal={signal} index={idx} />
          ))}
        </div>

        <div className={styles.weightSection}>
          <div className={styles.weightHeader}>
            <span className={styles.weightLabel}>Weight Distribution</span>
          </div>
          <div className={styles.weightBars}>
            <div className={styles.weightBar}>
              <span className={styles.weightBarLabel}>
                {isBuy ? "Volume + RSI" : "RSI + Williams + Volume"}
              </span>
              <div className={styles.weightBarTrack}>
                <div
                  className={`${styles.weightBarFill} ${styles.primary}`}
                  style={{ width: isBuy ? "60%" : "70%" }}
                />
              </div>
              <span className={styles.weightBarValue}>
                {isBuy ? "60%" : "70%"} PRIMARY
              </span>
            </div>
            <div className={styles.weightBar}>
              <span className={styles.weightBarLabel}>
                {isBuy ? "MACD + Williams" : "MACD + Stoch"}
              </span>
              <div className={styles.weightBarTrack}>
                <div
                  className={`${styles.weightBarFill} ${styles.secondary}`}
                  style={{ width: isBuy ? "40%" : "30%" }}
                />
              </div>
              <span className={styles.weightBarValue}>
                {isBuy ? "40%" : "30%"} CONFIRMATION
              </span>
            </div>
          </div>
        </div>

        <div className={styles.summaryContainer}>
          <div className={styles.summaryStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Signals</span>
              <span
                className={`${styles.statValue} ${confirmedCount >= 3 ? (isBuy ? styles.teal : styles.coral) : styles.blue}`}
              >
                {confirmedCount}/{signals.length}
              </span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Weight</span>
              <span
                className={`${styles.statValue} ${totalWeight >= 0.6 ? (isBuy ? styles.teal : styles.coral) : styles.blue}`}
              >
                {(totalWeight * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div
                className={`${styles.progressFill} ${confirmedCount >= 3 ? (isBuy ? styles.teal : styles.coral) : styles.blue}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className={styles.progressLabel}>
              {progressPercent.toFixed(0)}%
            </span>
          </div>

          <div className={styles.actionContainer}>
            <span className={styles.actionLabel}>ACTION:</span>
            <span className={`${styles.actionValue} ${styles[action.color]}`}>
              {action.action}
            </span>
          </div>
        </div>

        {action.reason && (
          <div className={styles.reasonContainer}>
            <span className={styles.reasonText}>{action.reason}</span>
          </div>
        )}
      </div>
    );
  }
);

// ============================================================================
// AI CONTRADICTION RESOLUTION COMPONENT
// ============================================================================

const ContradictionResolution = memo(({ contradictions }) => {
  const hasContradictions = contradictions && contradictions.length > 0;

  return (
    <div className={styles.contradictionSection}>
      <div className={styles.contradictionHeader}>
        <div className={`${styles.matrixIcon} ${styles.blue}`}>
          <BrainIcon size={18} />
        </div>
        <h3 className={styles.contradictionTitle}>AI Contradiction Resolution</h3>
      </div>

      <div className={styles.contradictionIntro}>
        <p className={styles.contradictionDescription}>
          When signals disagree, the following hierarchy determines action:
        </p>
        <div className={styles.hierarchyList}>
          <div className={styles.hierarchyItem}>
            <span className={styles.hierarchyWeight}>40%</span>
            <span className={styles.hierarchyLabel}>Elliott Wave Structure</span>
          </div>
          <div className={styles.hierarchyItem}>
            <span className={styles.hierarchyWeight}>35%</span>
            <span className={styles.hierarchyLabel}>Momentum (RSI, Williams, MACD)</span>
          </div>
          <div className={styles.hierarchyItem}>
            <span className={styles.hierarchyWeight}>15%</span>
            <span className={styles.hierarchyLabel}>Trend Context (ADX, DI)</span>
          </div>
          <div className={styles.hierarchyItem}>
            <span className={styles.hierarchyWeight}>10%</span>
            <span className={styles.hierarchyLabel}>Volatility/Volume</span>
          </div>
        </div>
      </div>

      {hasContradictions ? (
        <div className={styles.contradictionCards}>
          {contradictions.map((contradiction, idx) => (
            <div key={idx} className={styles.contradictionCard}>
              <div className={styles.contradictionCardHeader}>
                <ScaleIcon size={16} />
                <span className={styles.contradictionType}>
                  {contradiction.description}
                </span>
              </div>

              <div className={styles.conflictSignals}>
                {Object.entries(contradiction)
                  .filter(
                    ([key]) =>
                      !["type", "description", "resolution", "action", "color", "weights"].includes(
                        key
                      )
                  )
                  .map(([key, value]) => (
                    <div key={key} className={styles.conflictSignal}>
                      <span className={styles.conflictKey}>{key}:</span>
                      <span className={styles.conflictValue}>{value}</span>
                    </div>
                  ))}
              </div>

              <div className={styles.resolutionBox}>
                <span className={styles.resolutionLabel}>Resolution:</span>
                <span className={styles.resolutionText}>
                  {contradiction.resolution}
                </span>
              </div>

              <div
                className={`${styles.contradictionAction} ${styles[contradiction.color]}`}
              >
                <span className={styles.contradictionActionLabel}>Action:</span>
                <span className={styles.contradictionActionValue}>
                  {contradiction.action}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noContradictions}>
          <div className={styles.noContradictionsIcon}>
            <CheckCircleIcon size={32} />
          </div>
          <span className={styles.noContradictionsText}>
            No conflicting signals detected. Indicators are aligned.
          </span>
        </div>
      )}

      <div className={styles.defaultRule}>
        <strong>DEFAULT RULE:</strong> Elliott Wave wins in 40% weight conflicts.
        Wave structure is more reliable than indicators. Indicators lag price,
        waves predict structure.
      </div>
    </div>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function SignalMatrix({
  // Props override context values
  ticker: tickerProp,
  tickerName: tickerNameProp,
  data: dataProp,
  daysToShow = 30,
}) {
  // Get config from context (if available)
  const tickerConfig = useTickerConfig();
  const ohlcvContext = useOHLCVData();

  // Merge context with props (props take precedence)
  const ticker = tickerProp || tickerConfig.ticker;
  const tickerName = tickerNameProp || tickerConfig.tickerName;
  const data = dataProp || ohlcvContext.data || [];

  // Get recent data for analysis
  const recentData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.slice(-daysToShow);
  }, [data, daysToShow]);

  // Calculate BUY signals
  const buySignals = useMemo(() => {
    if (recentData.length === 0) return [];

    const rsiCheck = checkRSIOversoldRecovery(recentData);
    const williamsCheck = checkWilliamsROversold(recentData);
    const macdCheck = checkMACDBullishCrossover(recentData);
    const volumeCheck = checkVolumeSpike(recentData);
    const candleCheck = checkBullishCandlestick(recentData);

    return [
      {
        label: "RSI <40",
        description: "Recovered from oversold, momentum turning",
        ...rsiCheck,
      },
      {
        label: "Williams %R <-80",
        description: "Extreme oversold, reversal setup",
        ...williamsCheck,
      },
      {
        label: "MACD Bullish",
        description: "Bullish crossover + histogram positive 2+ days",
        ...macdCheck,
      },
      {
        label: "Volume Spike",
        description: ">150% ADV on bounce day (accumulation)",
        met: volumeCheck.met,
        value: volumeCheck.ratio ? `${(volumeCheck.ratio * 100).toFixed(0)}%` : "—",
      },
      {
        label: "Bullish Candle",
        description: "Hammer, Engulfing, or Dragonfly Doji",
        ...candleCheck,
      },
    ];
  }, [recentData]);

  // Calculate SELL signals
  const sellSignals = useMemo(() => {
    if (recentData.length === 0) return [];

    const rsiCheck = checkRSIOverbought(recentData);
    const williamsCheck = checkWilliamsROverbought(recentData);
    const macdCheck = checkMACDHistogramShrinking(recentData);
    const volumeCheck = checkVolumeDeclining(recentData);
    const stochCheck = checkStochasticOverbought(recentData);

    return [
      {
        label: "RSI >75",
        description: "Overbought for 2+ consecutive closes",
        ...rsiCheck,
      },
      {
        label: "Williams %R >-20",
        description: "Exited extreme overbought zone",
        ...williamsCheck,
      },
      {
        label: "MACD Shrinking",
        description: "Histogram shrinking 3+ days (declining momentum)",
        ...macdCheck,
      },
      {
        label: "Volume Declining",
        description: "Volume declining on new highs (distribution)",
        met: volumeCheck.met,
        value: volumeCheck.ratio
          ? `${(volumeCheck.ratio * 100).toFixed(0)}% of avg`
          : "—",
      },
      {
        label: "Stoch >80",
        description: "K + D > 80 for 2+ days (overbought)",
        ...stochCheck,
      },
    ];
  }, [recentData]);

  // Calculate buy metrics
  const buyMetrics = useMemo(() => {
    const confirmedCount = buySignals.filter((s) => s.met).length;
    const weights = [
      BUY_SIGNAL_WEIGHTS.rsi,
      BUY_SIGNAL_WEIGHTS.williamsR,
      BUY_SIGNAL_WEIGHTS.macd,
      BUY_SIGNAL_WEIGHTS.volume,
      0, // Candlestick pattern doesn't have explicit weight
    ];
    const totalWeight = buySignals.reduce(
      (sum, signal, idx) => sum + (signal.met ? weights[idx] : 0),
      0
    );
    const action = determineBuyAction(confirmedCount, totalWeight);

    return { confirmedCount, totalWeight, action };
  }, [buySignals]);

  // Calculate sell metrics
  const sellMetrics = useMemo(() => {
    const confirmedCount = sellSignals.filter((s) => s.met).length;
    const weights = [
      SELL_SIGNAL_WEIGHTS.rsi,
      SELL_SIGNAL_WEIGHTS.williamsR,
      SELL_SIGNAL_WEIGHTS.macd,
      SELL_SIGNAL_WEIGHTS.volume,
      SELL_SIGNAL_WEIGHTS.stochastic,
    ];
    const totalWeight = sellSignals.reduce(
      (sum, signal, idx) => sum + (signal.met ? weights[idx] : 0),
      0
    );
    const action = determineSellAction(confirmedCount, totalWeight);

    return { confirmedCount, totalWeight, action };
  }, [sellSignals]);

  // Analyze contradictions
  const contradictions = useMemo(() => {
    return analyzeContradictions(recentData, buySignals, sellSignals);
  }, [recentData, buySignals, sellSignals]);

  if (!data || data.length === 0) {
    return (
      <div className={styles.signalMatrixWrapper}>
        <div className={styles.noData}>No data available for signal analysis</div>
      </div>
    );
  }

  return (
    <div className={styles.signalMatrixWrapper}>
      {/* Logo Header */}
      <div className={styles.logoHeader}>
        <SignalMatrixIcon size={24} />
        <span className={styles.logoText}>SignalMatrix</span>
      </div>

      {/* BUY/ADD Signal Matrix */}
      <SignalMatrixSection
        title="BUY/ADD Signal Matrix"
        signals={buySignals}
        weights={BUY_SIGNAL_WEIGHTS}
        action={buyMetrics.action}
        totalWeight={buyMetrics.totalWeight}
        confirmedCount={buyMetrics.confirmedCount}
        type="BUY"
      />

      {/* SELL/TRIM Signal Matrix */}
      <SignalMatrixSection
        title="SELL/TRIM Signal Matrix"
        signals={sellSignals}
        weights={SELL_SIGNAL_WEIGHTS}
        action={sellMetrics.action}
        totalWeight={sellMetrics.totalWeight}
        confirmedCount={sellMetrics.confirmedCount}
        type="SELL"
      />

      {/* AI Contradiction Resolution */}
      <ContradictionResolution contradictions={contradictions} />

      {/* Footer */}
      <footer className={styles.signalMatrixFooter}>
        <span className={styles.footerBadge}>
          <ScaleIcon size={14} />
          Decision Matrix Analysis
        </span>
      </footer>
    </div>
  );
}

export default SignalMatrix;
