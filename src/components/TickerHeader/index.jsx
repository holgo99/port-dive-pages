/**
 * TickerHeader Component
 * Reusable header with ticker icon/name and customizable content section
 *
 * @component
 * @example
 * import { TickerHeader } from '@site/src/components/TickerHeader';
 *
 * <TickerHeader
 *   tickerIconUrl="/img/nbis/nbis-icon.svg"
 *   ticker="NBIS"
 *   tickerName="Nebius Group N.V."
 *   title="Elliott Wave Analysis"
 *   badge="1D"
 *   subtitle="Apr 2025 → Jun 2026 (Projection) | Target: $150.13 | ATH: $141.10"
 * />
 *
 * // Or with custom content via children:
 * <TickerHeader
 *   tickerIconUrl="/img/nbis/nbis-icon.svg"
 *   ticker="NBIS"
 *   tickerName="Nebius Group N.V."
 * >
 *   <CustomContent />
 * </TickerHeader>
 */

import React from "react";
import { TickerIcon } from "@site/src/components/TickerIcon";
import { PORTDIVE_THEME } from "@site/src/components/PortDiveTheme";
import styles from "./styles.module.css";

export function TickerHeader({
  tickerIconUrl,
  ticker = "NBIS",
  tickerName = "Nebius Group N.V.",
  theme = PORTDIVE_THEME,
  // Content props
  title,
  badge,
  subtitle,
  // Or pass custom content as children
  children,
}) {
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
