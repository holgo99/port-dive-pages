// src/components/TickerLayout/index.js
/**
 * Ticker Layout Components
 *
 * Provides ticker-specific context wrappers for documentation pages.
 * Each ticker gets a pre-configured layout that wraps content with
 * the appropriate TickerConfigProvider.
 *
 * @example
 * // In docs/nbis/some-page.mdx:
 * import { NBISLayout } from '@site/src/components/TickerLayout';
 *
 * <NBISLayout>
 *   <TickerHeader title="My Analysis" />
 *   <OscillatorsDashboard data={data} />
 * </NBISLayout>
 */

import React from "react";
import { TickerConfigProvider } from "@site/src/hooks/useTickerConfig";

// Import ticker configs
import nbisConfig from "@site/data/tickers/nbis.json";

// ============================================================================
// NBIS LAYOUT
// ============================================================================

/**
 * Layout wrapper for all NBIS documentation pages.
 * Provides NBIS ticker config to all children via context.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Page content
 * @param {string} [props.className] - Optional CSS class
 */
export function NBISLayout({ children, className }) {
  return (
    <TickerConfigProvider config={nbisConfig}>
      <div className={className}>{children}</div>
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
 * @param {React.ReactNode} props.children - Page content
 * @param {string} [props.className] - Optional CSS class
 */
export function TickerLayout({ config, children, className }) {
  return (
    <TickerConfigProvider config={config}>
      <div className={className}>{children}</div>
    </TickerConfigProvider>
  );
}

// Re-export for convenience
export { nbisConfig };
