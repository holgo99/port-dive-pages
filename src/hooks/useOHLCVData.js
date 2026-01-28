// src/hooks/useOHLCVData.js
/**
 * OHLCV + Indicators Data Context and Hook
 *
 * Provides OHLCV data with technical indicators to child components.
 * Supports multiple timeframes (1H, 1D, 1W) per ticker.
 * Integrates with TickerConfigProvider for ticker-aware data loading.
 *
 * @example
 * // In TickerLayout (provides both ticker config and OHLCV data):
 * <TickerConfigProvider config={nbisConfig}>
 *   <OHLCVDataProvider ticker="NBIS" timeframe="1D">
 *     <OscillatorsDashboard />
 *   </OHLCVDataProvider>
 * </TickerConfigProvider>
 *
 * // In child component:
 * const { data, timeframe, isLoading } = useOHLCVData();
 */

import { createContext, useContext, useMemo } from "react";

// ============================================================================
// DATA REGISTRY - Import all available datasets
// ============================================================================

// NBIS datasets
import nbis1d from "@site/data/ohlcv-indicators/nbis/nbis-nasdaq-1d-ohlcv_indicators-20260128-2211.json";
import nbis1h from "@site/data/ohlcv-indicators/nbis/nbis-nasdaq-1h-ohlcv_indicators-20260128-2211.json";
import nbis1w from "@site/data/ohlcv-indicators/nbis/nbis-nasdaq-1w-ohlcv_indicators-20260128-2211.json";

// NVO datasets
import nvo1d from "@site/data/ohlcv-indicators/nvo/nvo-nyse-1d-ohlcv_indicators-20260128-2211.json";
import nvo1h from "@site/data/ohlcv-indicators/nvo/nvo-nyse-1h-ohlcv_indicators-20260128-2211.json";
import nvo1w from "@site/data/ohlcv-indicators/nvo/nvo-nyse-1w-ohlcv_indicators-20260128-2212.json";

// ZETA datasets
import zeta1d from "@site/data/ohlcv-indicators/zeta/zeta-nyse-1d-ohlcv_indicators-20260128-2212.json";
import zeta1h from "@site/data/ohlcv-indicators/zeta/zeta-nyse-1h-ohlcv_indicators-20260128-2212.json";
import zeta1w from "@site/data/ohlcv-indicators/zeta/zeta-nyse-1w-ohlcv_indicators-20260128-2212.json";

/**
 * Registry of all available OHLCV datasets
 * Structure: { [ticker]: { [timeframe]: data } }
 */
const OHLCV_REGISTRY = {
  NBIS: {
    "1D": nbis1d,
    "1H": nbis1h,
    "1W": nbis1w,
  },
  NVO: {
    "1D": nvo1d,
    "1H": nvo1h,
    "1W": nvo1w,
  },
  ZETA: {
    "1D": zeta1d,
    "1H": zeta1h,
    "1W": zeta1w,
  },
};

/**
 * Available timeframes in order of granularity
 */
export const TIMEFRAMES = ["1H", "1D", "1W"];

/**
 * Default timeframe when none specified
 */
export const DEFAULT_TIMEFRAME = "1D";

// ============================================================================
// CONTEXT
// ============================================================================

const defaultOHLCVContext = {
  data: [],
  ticker: "",
  timeframe: DEFAULT_TIMEFRAME,
  availableTimeframes: [],
  isLoading: false,
  error: null,
};

const OHLCVDataContext = createContext(defaultOHLCVContext);

// ============================================================================
// PROVIDER
// ============================================================================

/**
 * Provider component for OHLCV data
 *
 * @param {Object} props
 * @param {string} props.ticker - Ticker symbol (e.g., "NBIS")
 * @param {string} [props.timeframe="1D"] - Timeframe (1H, 1D, 1W)
 * @param {Array} [props.data] - Optional direct data override
 * @param {React.ReactNode} props.children - Child components
 */
export function OHLCVDataProvider({
  ticker,
  timeframe = DEFAULT_TIMEFRAME,
  data: dataProp,
  children,
}) {
  const contextValue = useMemo(() => {
    // If direct data provided, use it
    if (dataProp) {
      return {
        data: dataProp,
        ticker,
        timeframe,
        availableTimeframes: [timeframe],
        isLoading: false,
        error: null,
      };
    }

    // Otherwise, look up from registry
    const tickerData = OHLCV_REGISTRY[ticker?.toUpperCase()];

    if (!tickerData) {
      return {
        data: [],
        ticker,
        timeframe,
        availableTimeframes: [],
        isLoading: false,
        error: `No data available for ticker: ${ticker}`,
      };
    }

    const availableTimeframes = Object.keys(tickerData);
    const data = tickerData[timeframe];

    if (!data) {
      return {
        data: [],
        ticker,
        timeframe,
        availableTimeframes,
        isLoading: false,
        error: `Timeframe ${timeframe} not available for ${ticker}. Available: ${availableTimeframes.join(", ")}`,
      };
    }

    return {
      data,
      ticker,
      timeframe,
      availableTimeframes,
      isLoading: false,
      error: null,
    };
  }, [ticker, timeframe, dataProp]);

  return (
    <OHLCVDataContext.Provider value={contextValue}>
      {children}
    </OHLCVDataContext.Provider>
  );
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook to access OHLCV data from context
 *
 * @returns {Object} OHLCV data context
 */
export function useOHLCVData() {
  const context = useContext(OHLCVDataContext);

  if (!context.ticker && context.data.length === 0) {
    console.warn(
      "useOHLCVData: No OHLCV data found. " +
        "Wrap component tree with OHLCVDataProvider.",
    );
  }

  return context;
}

/**
 * Hook to get filtered/sliced OHLCV data
 *
 * @param {Object} options
 * @param {number} [options.daysToShow] - Number of recent days to include
 * @param {number} [options.startIndex] - Start index for slicing
 * @param {number} [options.endIndex] - End index for slicing
 * @returns {Object} Filtered data with metadata
 */
export function useOHLCVSlice({ daysToShow, startIndex, endIndex } = {}) {
  const { data, ticker, timeframe, error } = useOHLCVData();

  return useMemo(() => {
    if (!data || data.length === 0) {
      return {
        data: [],
        latestData: null,
        dateRange: null,
        ticker,
        timeframe,
        error,
      };
    }

    let slicedData = data;

    // Apply slicing
    if (daysToShow) {
      slicedData = data.slice(-daysToShow);
    } else if (startIndex !== undefined || endIndex !== undefined) {
      slicedData = data.slice(startIndex || 0, endIndex);
    }

    const latestData = slicedData[slicedData.length - 1];
    const firstData = slicedData[0];

    // Format date range
    const formatDate = (timestamp) => {
      const date = new Date(timestamp * 1000);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };

    const dateRange =
      firstData && latestData
        ? {
            start: formatDate(firstData.timestamp),
            end: formatDate(latestData.timestamp),
            label: `${formatDate(firstData.timestamp)} - ${formatDate(latestData.timestamp)}`,
          }
        : null;

    return {
      data: slicedData,
      latestData,
      dateRange,
      totalDataPoints: data.length,
      shownDataPoints: slicedData.length,
      ticker,
      timeframe,
      error,
    };
  }, [data, daysToShow, startIndex, endIndex, ticker, timeframe, error]);
}

/**
 * Utility to get available tickers and their timeframes
 */
export function getAvailableData() {
  return Object.entries(OHLCV_REGISTRY).map(([ticker, timeframes]) => ({
    ticker,
    timeframes: Object.keys(timeframes),
  }));
}

export default OHLCVDataProvider;
