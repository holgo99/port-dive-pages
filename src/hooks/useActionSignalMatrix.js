// src/hooks/useActionSignalMatrix.js
/**
 * Action Signal Matrix Context and Hook
 *
 * Provides computed trading signals (BUY/SELL/HOLD) and contradiction analysis
 * to child components. Consumes OHLCV data from OHLCVDataProvider.
 *
 * @example
 * // In TickerLayout (wrap inside OHLCVDataProvider):
 * <TickerConfigProvider config={nbisConfig}>
 *   <OHLCVDataProvider ticker="NBIS" timeframe="1D">
 *     <ActionSignalMatrixProvider daysToShow={30}>
 *       <ActionSignalMatrix />
 *       <AIActionSignalMatrixContradictionResolver />
 *     </ActionSignalMatrixProvider>
 *   </OHLCVDataProvider>
 * </TickerConfigProvider>
 *
 * // In child component:
 * const { buySignals, sellSignals, contradictions } = useActionSignalMatrix();
 */

import { createContext, useContext, useMemo } from "react";
import { useOHLCVData } from "./useOHLCVData";

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

/**
 * Signal weight distribution for BUY/ADD signals
 * Volume + RSI = 60% (PRIMARY)
 * MACD + Williams %R = 40% (CONFIRMATION)
 */
export const BUY_SIGNAL_WEIGHTS = {
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
export const SELL_SIGNAL_WEIGHTS = {
  rsi: 0.25, // 25% - Primary
  williamsR: 0.25, // 25% - Primary
  macd: 0.15, // 15% - Confirmation
  volume: 0.2, // 20% - Primary
  stochastic: 0.15, // 15% - Confirmation
};

/**
 * Elliott Wave hierarchy weights for contradiction resolution
 */
export const HIERARCHY_WEIGHTS = {
  elliottWave: 0.4, // 40% - Primary decision driver
  momentum: 0.35, // 35% - RSI, Williams %R, MACD
  trend: 0.15, // 15% - ADX, DI
  volatility: 0.1, // 10% - ATR, volume spikes
};

// ============================================================================
// SIGNAL CHECK FUNCTIONS - BUY SIGNALS
// ============================================================================

/**
 * Check if RSI is in oversold recovery (for BUY signal)
 * RSI <40, recovered from oversold
 */
export function checkRSIOversoldRecovery(data, daysBack = 5) {
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
}

/**
 * Check if Williams %R is extremely oversold (for BUY signal)
 * Williams %R < -80
 */
export function checkWilliamsROversold(data) {
  if (!data || data.length === 0) return { met: false, value: null };

  const latest = data[data.length - 1];
  const williamsR = latest?.Williams_R;

  if (williamsR == null) return { met: false, value: null };

  const met = williamsR < -80;
  return { met, value: williamsR };
}

/**
 * Check for MACD bullish crossover with positive histogram
 * MACD bullish crossover + histogram positive 2+ days
 */
export function checkMACDBullishCrossover(data, daysPositive = 2) {
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
    histValues.length > daysPositive &&
    histValues[0] != null &&
    histValues[0] <= 0;

  const latest = data[data.length - 1];
  const met = recentPositive && hadCrossover;

  return {
    met,
    value: latest?.["MACD.hist"],
    daysPositive: recentPositive ? daysPositive : 0,
  };
}

/**
 * Check for volume spike (accumulation confirmed)
 * Volume spike >150% ADV on bounce day
 */
export function checkVolumeSpike(data, threshold = 1.5) {
  if (!data || data.length === 0) return { met: false, value: null };

  const latest = data[data.length - 1];
  const volume = latest?.volume;
  const volumeMA = latest?.Volume_20_MA;

  if (volume == null || volumeMA == null || volumeMA === 0)
    return { met: false, value: null };

  const ratio = volume / volumeMA;
  const met = ratio > threshold;

  return { met, value: ratio, volume, avgVolume: volumeMA };
}

/**
 * Check for bullish candlestick pattern
 * Simplified check: price closed higher than open with significant body
 */
export function checkBullishCandlestick(data) {
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
}

// ============================================================================
// SIGNAL CHECK FUNCTIONS - SELL SIGNALS
// ============================================================================

/**
 * Check if RSI is overbought for consecutive days (for SELL signal)
 * RSI >75 for 2+ consecutive daily closes
 */
export function checkRSIOverbought(data, consecutiveDays = 2) {
  if (!data || data.length < consecutiveDays)
    return { met: false, value: null };

  const recent = data.slice(-consecutiveDays);
  const allOverbought = recent.every((d) => d.RSI != null && d.RSI > 75);

  const latest = data[data.length - 1];
  return { met: allOverbought, value: latest?.RSI, consecutiveDays };
}

/**
 * Check if Williams %R exited extreme overbought (for SELL signal)
 * Williams %R > -20
 */
export function checkWilliamsROverbought(data) {
  if (!data || data.length === 0) return { met: false, value: null };

  const latest = data[data.length - 1];
  const williamsR = latest?.Williams_R;

  if (williamsR == null) return { met: false, value: null };

  const met = williamsR > -20;
  return { met, value: williamsR };
}

/**
 * Check for MACD histogram shrinking (for SELL signal)
 * MACD histogram shrinking 3+ days (momentum declining)
 */
export function checkMACDHistogramShrinking(data, days = 3) {
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
}

/**
 * Check for volume declining on new highs (for SELL signal)
 * Distribution warning
 */
export function checkVolumeDeclining(data, days = 5) {
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
}

/**
 * Check for Stochastic overbought (for SELL signal)
 * Stochastic K + D > 80 for 2+ days
 */
export function checkStochasticOverbought(data, consecutiveDays = 2) {
  if (!data || data.length < consecutiveDays)
    return { met: false, value: null };

  const recent = data.slice(-consecutiveDays);
  const allOverbought = recent.every(
    (d) =>
      d.Stoch_K != null &&
      d.Stoch_D != null &&
      d.Stoch_K > 80 &&
      d.Stoch_D > 80
  );

  const latest = data[data.length - 1];
  return {
    met: allOverbought,
    value: `K:${latest?.Stoch_K?.toFixed(0)}/D:${latest?.Stoch_D?.toFixed(0)}`,
    stochK: latest?.Stoch_K,
    stochD: latest?.Stoch_D,
  };
}

// ============================================================================
// ACTION DETERMINATION FUNCTIONS
// ============================================================================

/**
 * Determine BUY action based on signals and weights
 */
export function determineBuyAction(confirmedCount, totalWeight, fibLevel = null) {
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
}

/**
 * Determine SELL action based on signals and weights
 */
export function determineSellAction(
  confirmedCount,
  totalWeight,
  elliottContext = null
) {
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
}

/**
 * Determine HOLD action based on buy/sell signal balance
 * HOLD when neither BUY nor SELL signals are strong, or when they're balanced
 */
export function determineHoldAction(
  buyConfirmed,
  sellConfirmed,
  buyWeight,
  sellWeight
) {
  const buyActive = buyConfirmed >= 3 && buyWeight >= 0.5;
  const sellActive = sellConfirmed >= 3 && sellWeight >= 0.5;

  // Both signals active - balanced/conflicting
  if (buyActive && sellActive) {
    const weightDiff = Math.abs(buyWeight - sellWeight);
    if (weightDiff < 0.15) {
      return {
        action: "HOLD - BALANCED",
        reason:
          "Buy and sell signals are equally weighted. Wait for clearer direction.",
        color: "blue",
        status: "balanced",
        confidence: 100 - Math.round(weightDiff * 100),
      };
    }
    return {
      action: "HOLD - CONFLICTING",
      reason:
        "Mixed signals detected. Indicators are giving opposing readings.",
      color: "blue",
      status: "conflicting",
      confidence: Math.round(50 + weightDiff * 50),
    };
  }

  // Neither signal active - neutral market
  if (!buyActive && !sellActive) {
    const maxConfirmed = Math.max(buyConfirmed, sellConfirmed);
    if (maxConfirmed <= 1) {
      return {
        action: "HOLD - NEUTRAL",
        reason: "No significant signals. Market in consolidation phase.",
        color: "blue",
        status: "neutral",
        confidence: 85,
      };
    }
    return {
      action: "HOLD - DEVELOPING",
      reason: "Signals building but not yet confirmed. Monitor closely.",
      color: "blue",
      status: "developing",
      confidence: 65,
    };
  }

  // One side active - not a hold condition, return null to indicate
  return null;
}

// ============================================================================
// CONTRADICTION ANALYSIS
// ============================================================================

/**
 * Analyze contradictions between indicators
 */
export function analyzeContradictions(data, buySignals, sellSignals) {
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
  const priceChange =
    data.length > 5 ? close / data[data.length - 5]?.close - 1 : 0;

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
}

// ============================================================================
// CONTEXT
// ============================================================================

const ActionSignalMatrixContext = createContext(null);

// ============================================================================
// PROVIDER
// ============================================================================

/**
 * Provider component for Action Signal Matrix signals
 *
 * Must be wrapped inside OHLCVDataProvider to access OHLCV data.
 *
 * @param {Object} props
 * @param {number} [props.daysToShow=30] - Number of recent days to analyze
 * @param {React.ReactNode} props.children - Child components
 */
export function ActionSignalMatrixProvider({ daysToShow = 30, children }) {
  const ohlcvContext = useOHLCVData();
  const { data } = ohlcvContext;

  const contextValue = useMemo(() => {
    // Handle no data case
    if (!data || data.length === 0) {
      return {
        buySignals: [],
        sellSignals: [],
        buyMetrics: { confirmedCount: 0, totalWeight: 0, action: null },
        sellMetrics: { confirmedCount: 0, totalWeight: 0, action: null },
        holdMetrics: { action: null },
        contradictions: null,
        recentData: [],
        latestData: null,
        daysToShow,
        isLoading: !ohlcvContext.error,
      };
    }

    // Get recent data slice
    const recentData = data.slice(-daysToShow);
    const latestData = data[data.length - 1];

    // Calculate BUY signals
    const rsiCheck = checkRSIOversoldRecovery(recentData);
    const williamsCheckBuy = checkWilliamsROversold(recentData);
    const macdCheckBuy = checkMACDBullishCrossover(recentData);
    const volumeCheckBuy = checkVolumeSpike(recentData);
    const candleCheck = checkBullishCandlestick(recentData);

    const buySignals = [
      {
        label: "RSI <40",
        description: "Recovered from oversold, momentum turning",
        ...rsiCheck,
      },
      {
        label: "Williams %R <-80",
        description: "Extreme oversold, reversal setup",
        ...williamsCheckBuy,
      },
      {
        label: "MACD Bullish",
        description: "Bullish crossover + histogram positive 2+ days",
        ...macdCheckBuy,
      },
      {
        label: "Volume Spike",
        description: ">150% ADV on bounce day (accumulation)",
        met: volumeCheckBuy.met,
        value: volumeCheckBuy.ratio
          ? `${(volumeCheckBuy.ratio * 100).toFixed(0)}%`
          : "—",
      },
      {
        label: "Bullish Candle",
        description: "Hammer, Engulfing, or Dragonfly Doji",
        ...candleCheck,
      },
    ];

    // Calculate SELL signals
    const rsiCheckSell = checkRSIOverbought(recentData);
    const williamsCheckSell = checkWilliamsROverbought(recentData);
    const macdCheckSell = checkMACDHistogramShrinking(recentData);
    const volumeCheckSell = checkVolumeDeclining(recentData);
    const stochCheck = checkStochasticOverbought(recentData);

    const sellSignals = [
      {
        label: "RSI >75",
        description: "Overbought for 2+ consecutive closes",
        ...rsiCheckSell,
      },
      {
        label: "Williams %R >-20",
        description: "Exited extreme overbought zone",
        ...williamsCheckSell,
      },
      {
        label: "MACD Shrinking",
        description: "Histogram shrinking 3+ days (declining momentum)",
        ...macdCheckSell,
      },
      {
        label: "Volume Declining",
        description: "Volume declining on new highs (distribution)",
        met: volumeCheckSell.met,
        value: volumeCheckSell.ratio
          ? `${(volumeCheckSell.ratio * 100).toFixed(0)}% of avg`
          : "—",
      },
      {
        label: "Stoch >80",
        description: "K + D > 80 for 2+ days (overbought)",
        ...stochCheck,
      },
    ];

    // Calculate buy metrics
    const buyConfirmedCount = buySignals.filter((s) => s.met).length;
    const buyWeights = [
      BUY_SIGNAL_WEIGHTS.rsi,
      BUY_SIGNAL_WEIGHTS.williamsR,
      BUY_SIGNAL_WEIGHTS.macd,
      BUY_SIGNAL_WEIGHTS.volume,
      0, // Candlestick pattern doesn't have explicit weight
    ];
    const buyTotalWeight = buySignals.reduce(
      (sum, signal, idx) => sum + (signal.met ? buyWeights[idx] : 0),
      0
    );
    const buyAction = determineBuyAction(buyConfirmedCount, buyTotalWeight);
    const buyMetrics = {
      confirmedCount: buyConfirmedCount,
      totalWeight: buyTotalWeight,
      action: buyAction,
    };

    // Calculate sell metrics
    const sellConfirmedCount = sellSignals.filter((s) => s.met).length;
    const sellWeights = [
      SELL_SIGNAL_WEIGHTS.rsi,
      SELL_SIGNAL_WEIGHTS.williamsR,
      SELL_SIGNAL_WEIGHTS.macd,
      SELL_SIGNAL_WEIGHTS.volume,
      SELL_SIGNAL_WEIGHTS.stochastic,
    ];
    const sellTotalWeight = sellSignals.reduce(
      (sum, signal, idx) => sum + (signal.met ? sellWeights[idx] : 0),
      0
    );
    const sellAction = determineSellAction(sellConfirmedCount, sellTotalWeight);
    const sellMetrics = {
      confirmedCount: sellConfirmedCount,
      totalWeight: sellTotalWeight,
      action: sellAction,
    };

    // Calculate hold metrics
    const holdAction = determineHoldAction(
      buyConfirmedCount,
      sellConfirmedCount,
      buyTotalWeight,
      sellTotalWeight
    );
    const holdMetrics = { action: holdAction };

    // Analyze contradictions
    const contradictions = analyzeContradictions(
      recentData,
      buySignals,
      sellSignals
    );

    return {
      buySignals,
      sellSignals,
      buyMetrics,
      sellMetrics,
      holdMetrics,
      contradictions,
      recentData,
      latestData,
      daysToShow,
      isLoading: false,
    };
  }, [data, daysToShow, ohlcvContext.error]);

  return (
    <ActionSignalMatrixContext.Provider value={contextValue}>
      {children}
    </ActionSignalMatrixContext.Provider>
  );
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook to access Action Signal Matrix signals from context
 *
 * Returns null if used outside of ActionSignalMatrixProvider.
 * This allows components to fall back to props when no provider is present.
 *
 * @returns {Object|null} Signals context or null if outside provider
 */
export function useActionSignalMatrix() {
  return useContext(ActionSignalMatrixContext);
}

/**
 * Hook to access Action Signal Matrix with required provider
 *
 * Throws an error if used outside of ActionSignalMatrixProvider.
 * Use this when the provider is required for the component to function.
 *
 * @returns {Object} Signals context
 * @throws {Error} If used outside of ActionSignalMatrixProvider
 */
export function useActionSignalMatrixRequired() {
  const context = useContext(ActionSignalMatrixContext);

  if (context === null) {
    throw new Error(
      "useActionSignalMatrixRequired must be used within an ActionSignalMatrixProvider. " +
        "Wrap your component tree with <ActionSignalMatrixProvider>."
    );
  }

  return context;
}

export default ActionSignalMatrixProvider;
