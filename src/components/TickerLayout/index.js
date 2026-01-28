// src/components/TickerLayout/index.js
/**
 * Ticker Layout Components
 *
 * Provides ticker-specific context wrappers for documentation pages.
 * Each ticker gets a pre-configured layout that wraps content with
 * the appropriate TickerConfigProvider and OHLCVDataProvider.
 *
 * @example
 * // In docs/nbis/some-page.mdx:
 * import { NBISLayout } from '@site/src/components/TickerLayout';
 *
 * // Default: 1D timeframe
 * <NBISLayout>
 *   <TickerHeader title="My Analysis" />
 *   <OscillatorsDashboard />
 * </NBISLayout>
 *
 * // Custom timeframe:
 * <NBISLayout timeframe="1H">
 *   <OscillatorsDashboard />
 * </NBISLayout>
 */

import React from "react";
import { TickerConfigProvider } from "@site/src/hooks/useTickerConfig";
import {
  OHLCVDataProvider,
  DEFAULT_TIMEFRAME,
} from "@site/src/hooks/useOHLCVData";
import { WaveCountProvider } from "@site/src/hooks/useWaveCount";
import { MovingAveragesSignalsProvider } from "@site/src/hooks/useMovingAveragesSignals";
import { ActionSignalMatrixProvider } from "@site/src/hooks/useActionSignalMatrix";

// Import ticker configs
import nbisConfig from "@site/data/tickers/nbis.json";

// ============================================================================
// NBIS LAYOUT
// ============================================================================

/**
 * Layout wrapper for all NBIS documentation pages.
 * Provides NBIS ticker config and OHLCV data to all children via context.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Page content
 * @param {string} [props.timeframe="1D"] - OHLCV data timeframe (1H, 1D, 1W)
 * @param {string} [props.className] - Optional CSS class
 */
export function NBISLayout({
  children,
  timeframe = DEFAULT_TIMEFRAME,
  className,
}) {
  return (
    <TickerConfigProvider config={nbisConfig}>
      <OHLCVDataProvider ticker={nbisConfig.ticker} timeframe={timeframe}>
        <WaveCountProvider>
          <MovingAveragesSignalsProvider>
            <ActionSignalMatrixProvider>
              <div className={className}>{children}</div>
            </ActionSignalMatrixProvider>
          </MovingAveragesSignalsProvider>
        </WaveCountProvider>
      </OHLCVDataProvider>
    </TickerConfigProvider>
  );
}

// ============================================================================
// GENERIC TICKER LAYOUT (for future tickers)
// ============================================================================

/**
 * Generic layout wrapper that accepts any ticker config.
 * Use this for one-off pages or new tickers without dedicated layouts.
 *
 * @param {Object} props
 * @param {Object} props.config - Ticker configuration object
 * @param {string} [props.timeframe="1D"] - OHLCV data timeframe
 * @param {React.ReactNode} props.children - Page content
 * @param {string} [props.className] - Optional CSS class
 */
export function TickerLayout({
  config,
  timeframe = DEFAULT_TIMEFRAME,
  children,
  className,
}) {
  return (
    <TickerConfigProvider config={config}>
      <OHLCVDataProvider ticker={config.ticker} timeframe={timeframe}>
        <WaveCountProvider>
          <MovingAveragesSignalsProvider>
            <ActionSignalMatrixProvider>
              <div className={className}>{children}</div>
            </ActionSignalMatrixProvider>
          </MovingAveragesSignalsProvider>
        </WaveCountProvider>
      </OHLCVDataProvider>
    </TickerConfigProvider>
  );
}

// Re-export for convenience
export { nbisConfig };
export { DEFAULT_TIMEFRAME, TIMEFRAMES } from "@site/src/hooks/useOHLCVData";
