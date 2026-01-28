// src/hooks/useTickerIntel.js
/**
 * Ticker Intel Context and Hook
 *
 * Aggregates data from multiple sources for the AITickerIntel component:
 * - useTickerConfig: Company metadata
 * - useOHLCVData: Price, volume, computed ranges
 * - useWaveCount: Elliott Wave targets and scenarios
 * - useActionSignalMatrix: Signal summary and risk indicators
 *
 * @example
 * <TickerConfigProvider config={nbisConfig}>
 *   <OHLCVDataProvider ticker="NBIS" timeframe="1D">
 *     <WaveCountProvider>
 *       <ActionSignalMatrixProvider>
 *         <TickerIntelProvider>
 *           <AITickerIntel />
 *         </TickerIntelProvider>
 *       </ActionSignalMatrixProvider>
 *     </WaveCountProvider>
 *   </OHLCVDataProvider>
 * </TickerConfigProvider>
 */

import { createContext, useContext, useMemo } from "react";
import { useTickerConfig } from "./useTickerConfig";
import { useOHLCVData } from "./useOHLCVData";
import { useWaveCount } from "./useWaveCount";
import { useActionSignalMatrix } from "./useActionSignalMatrix";

// ============================================================================
// CONTEXT
// ============================================================================

const TickerIntelContext = createContext(null);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Compute 52-week high/low from OHLCV data
 * @param {Array} data - OHLCV data array
 * @param {string} timeframe - Current timeframe (1H, 1D, 1W)
 * @returns {Object} { high, low }
 */
function compute52WeekRange(data, timeframe) {
  if (!data || data.length === 0) return { high: null, low: null };

  // Determine number of candles for ~52 weeks based on timeframe
  const candlesFor52Weeks =
    timeframe === "1D"
      ? 252 // ~252 trading days per year
      : timeframe === "1W"
        ? 52 // 52 weeks
        : timeframe === "1H"
          ? 252 * 7 // ~7 trading hours per day
          : 252;

  const relevantData = data.slice(-candlesFor52Weeks);

  let high = -Infinity;
  let low = Infinity;

  for (const candle of relevantData) {
    if (candle.high > high) high = candle.high;
    if (candle.low < low) low = candle.low;
  }

  return {
    high: high === -Infinity ? null : high,
    low: low === Infinity ? null : low,
  };
}

/**
 * Format large numbers with K/M/B/T suffixes
 * @param {number} num - Number to format
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted number string
 */
export function formatNumber(num, decimals = 2) {
  if (num === null || num === undefined || isNaN(num)) return "—";
  if (num >= 1e12) return `${(num / 1e12).toFixed(decimals)}T`;
  if (num >= 1e9) return `${(num / 1e9).toFixed(decimals)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(decimals)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(decimals)}K`;
  return num.toLocaleString();
}

/**
 * Calculate price change and percentage
 * @param {number} current - Current price
 * @param {number} previous - Previous price
 * @returns {Object} { change, changePercent, direction }
 */
function calculatePriceChange(current, previous) {
  if (!current || !previous) return { change: null, changePercent: null, direction: null };

  const change = current - previous;
  const changePercent = ((change / previous) * 100).toFixed(2);
  const direction = change > 0 ? "up" : change < 0 ? "down" : "unchanged";

  return { change, changePercent: parseFloat(changePercent), direction };
}

// ============================================================================
// PROVIDER
// ============================================================================

/**
 * Provider component for Ticker Intel
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export function TickerIntelProvider({ children }) {
  const tickerConfig = useTickerConfig();
  const ohlcvContext = useOHLCVData();

  // WaveCount throws if no provider, so we need to catch that
  let waveCountContext = null;
  try {
    waveCountContext = useWaveCount();
  } catch (e) {
    // WaveCountProvider not available, wave data will be null
  }

  // ActionSignalMatrix returns null if no context
  const actionSignalContext = useActionSignalMatrix();

  const contextValue = useMemo(() => {
    const { data, timeframe, isLoading: ohlcvLoading, error: ohlcvError } = ohlcvContext;
    const latestCandle = data?.[data.length - 1] || null;
    const previousCandle = data?.[data.length - 2] || null;
    const fiftyTwoWeekRange = compute52WeekRange(data, timeframe);

    // Core company data from ticker config
    const companyData = {
      symbol: tickerConfig.ticker,
      company: tickerConfig.tickerName,
      sector: tickerConfig.sector,
      industry: tickerConfig.industry,
      exchange: tickerConfig.exchange,
      currency: tickerConfig.currency,
      iconUrl: tickerConfig.tickerIconUrl,
      // Extended metadata (may be null if not in config)
      country: tickerConfig.country || null,
      isin: tickerConfig.isin || null,
      website: tickerConfig.website || null,
      founded: tickerConfig.founded || null,
      employees: tickerConfig.employees || null,
    };

    // Price change calculations
    const priceChange = calculatePriceChange(latestCandle?.close, previousCandle?.close);

    // Price data from OHLCV
    const priceData = latestCandle
      ? {
          currentPrice: latestCandle.close,
          dayHigh: latestCandle.high,
          dayLow: latestCandle.low,
          dayOpen: latestCandle.open,
          previousClose: previousCandle?.close || null,
          change: priceChange.change,
          changePercent: priceChange.changePercent,
          direction: priceChange.direction,
          fiftyTwoWeekHigh: fiftyTwoWeekRange.high,
          fiftyTwoWeekLow: fiftyTwoWeekRange.low,
          ath: tickerConfig.analysisConfig?.ath || null,
          athDate: tickerConfig.analysisConfig?.athDate || null,
        }
      : null;

    // Trading data from OHLCV
    const tradingData = latestCandle
      ? {
          volume: latestCandle.volume,
          volumeFormatted: formatNumber(latestCandle.volume),
          avgVolume: latestCandle.Volume_20_MA,
          avgVolumeFormatted: formatNumber(latestCandle.Volume_20_MA),
          volumeRatio: latestCandle.Volume_20_MA
            ? (latestCandle.volume / latestCandle.Volume_20_MA).toFixed(2)
            : null,
        }
      : null;

    // Technical indicators summary from OHLCV
    const technicalSummary = latestCandle
      ? {
          rsi: latestCandle.RSI,
          adx: latestCandle.ADX,
          williamsR: latestCandle.Williams_R,
          macd: latestCandle.MACD,
          macdSignal: latestCandle["MACD.signal"],
          macdHist: latestCandle["MACD.hist"],
          stochK: latestCandle.Stoch_K,
          stochD: latestCandle.Stoch_D,
          sma50: latestCandle["50_MA"],
          sma200: latestCandle["200_MA"],
          ema50: latestCandle["50_EMA"],
          ema200: latestCandle["200_EMA"],
        }
      : null;

    // Wave count data
    const waveData = waveCountContext
      ? {
          activeScenario: waveCountContext.activeScenario,
          scenarios: waveCountContext.items,
          probability: waveCountContext.activeScenario?.probabilityPercent,
          mode: waveCountContext.activeScenario?.mode,
          displayMode: waveCountContext.activeScenario?.displayMode,
          targets: waveCountContext.activeScenario?.projectedTargetBand,
          label: waveCountContext.activeScenario?.label,
        }
      : null;

    // Signal summary from action signal matrix
    const signalSummary = actionSignalContext
      ? {
          buySignals: actionSignalContext.buySignals,
          sellSignals: actionSignalContext.sellSignals,
          buyMetrics: actionSignalContext.buyMetrics,
          sellMetrics: actionSignalContext.sellMetrics,
          holdMetrics: actionSignalContext.holdMetrics,
          contradictions: actionSignalContext.contradictions,
        }
      : null;

    // Fundamentals - placeholder for Phase 2 (external API)
    const fundamentals = {
      pe: tickerConfig.fundamentals?.pe || null,
      pb: tickerConfig.fundamentals?.pb || null,
      ps: tickerConfig.fundamentals?.ps || null,
      revenue: tickerConfig.fundamentals?.revenue || null,
      ebitda: tickerConfig.fundamentals?.ebitda || null,
      grossMargin: tickerConfig.fundamentals?.grossMargin || null,
      operatingMargin: tickerConfig.fundamentals?.operatingMargin || null,
      marketCap: tickerConfig.marketCap || null,
    };

    return {
      // Aggregated data
      company: companyData,
      price: priceData,
      trading: tradingData,
      technical: technicalSummary,
      wave: waveData,
      signals: signalSummary,
      fundamentals,

      // Loading states
      isLoading: ohlcvLoading,
      error: ohlcvError,

      // Raw data access (for advanced use cases)
      rawOHLCV: data,
      latestCandle,
      timeframe,

      // Utility functions
      formatNumber,
    };
  }, [tickerConfig, ohlcvContext, waveCountContext, actionSignalContext]);

  return (
    <TickerIntelContext.Provider value={contextValue}>
      {children}
    </TickerIntelContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook to access Ticker Intel context
 *
 * @returns {Object|null} Ticker intel data or null if outside provider
 */
export function useTickerIntel() {
  const context = useContext(TickerIntelContext);

  if (context === null) {
    console.warn(
      "useTickerIntel: No context found. " +
        "Wrap component tree with TickerIntelProvider or ensure parent providers exist.",
    );
  }

  return context;
}

export default TickerIntelProvider;
