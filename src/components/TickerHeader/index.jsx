/**
 * TickerHeader Component
 * Reusable header with ticker icon/name and customizable content section
 *
 * Supports Context + Composition pattern via TickerConfigProvider
 * Falls back to props if context not available
 *
 * @component
 * @example
 * // With context (preferred):
 * <TickerConfigProvider config={nbisConfig}>
 *   <TickerHeader title="Elliott Wave Analysis" />
 * </TickerConfigProvider>
 *
 * // Or with props (backwards compatible):
 * <TickerHeader
 *   tickerIconUrl="/img/nbis/nbis-icon.svg"
 *   ticker="NBIS"
 *   tickerName="Nebius Group N.V."
 *   title="Elliott Wave Analysis"
 *   badge="1D"
 *   subtitle="Apr 2025 → Jun 2026 (Projection)"
 * />
 */

import React from "react";
import { TickerIcon } from "@site/src/components/TickerIcon";
import { PORTDIVE_THEME } from "@site/src/components/PortDiveTheme";
import { useTickerConfig } from "@site/src/hooks/useTickerConfig";
import { useOHLCVData } from "@site/src/hooks/useOHLCVData";
import styles from "./styles.module.css";

export function TickerHeader({
  // Props override context values
  tickerIconUrl: tickerIconUrlProp,
  ticker: tickerProp,
  tickerName: tickerNameProp,
  theme = PORTDIVE_THEME,
  // Content props
  title,
  badge: badgeProp,
  subtitle,
  // Or pass custom content as children
  children,
}) {
  // Get config from context (if available)
  const tickerConfig = useTickerConfig();
  const ohlcvData = useOHLCVData();

  // Merge context with props (props take precedence)
  const ticker = tickerProp || tickerConfig.ticker;
  const tickerName = tickerNameProp || tickerConfig.tickerName;
  const tickerIconUrl = tickerIconUrlProp || tickerConfig.tickerIconUrl;
  const badge = badgeProp || ohlcvData.timeframe;
  return (
    <header className={styles.tickerHeader}>
      {/* Left side: Ticker Icon and Name */}
      {/* Desktop version - with wordmark */}
      <div className={`${styles.tickerInfo} ${styles.tickerInfoDesktop}`}>
        <TickerIcon
          tickerIconUrl={tickerIconUrl}
          ticker={ticker}
          tickerName={tickerName}
          showWordmark={true}
          theme={theme}
        />
      </div>
      {/* Mobile/Tablet version - without wordmark */}
      <div className={`${styles.tickerInfo} ${styles.tickerInfoMobile}`}>
        <TickerIcon
          tickerIconUrl={tickerIconUrl}
          ticker={ticker}
          tickerName={tickerName}
          showWordmark={false}
          theme={theme}
        />
      </div>

      {/* Right side: Content section with divider */}
      {(title || children) && (
        <div className={styles.contentSection}>
          {children ? (
            children
          ) : (
            <>
              <div className={styles.titleRow}>
                <h1 className={styles.title}>{title}</h1>
                {badge && <span className={styles.badge}>{badge}</span>}
              </div>
              {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </>
          )}
        </div>
      )}
    </header>
  );
}
