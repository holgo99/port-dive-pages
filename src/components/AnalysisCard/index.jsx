/**
 * AnalysisCard Component
 * Displays chart analysis metadata with PortDive design system
 *
 * Supports Context + Composition pattern via TickerConfigProvider
 * Falls back to props if context not available
 *
 * @component
 * @example
 * // With context (preferred):
 * <TickerConfigProvider config={nbisConfig}>
 *   <AnalysisCard
 *     title="Elliott Wave Analysis"
 *     description="Complete wave count analysis"
 *     analysisDate="2026-01-22"
 *   />
 * </TickerConfigProvider>
 *
 * // Or with props (backwards compatible):
 * <AnalysisCard
 *   ticker="NBIS"
 *   title="Elliott Wave Analysis"
 *   description="Complete wave count analysis"
 *   analysisDate="2026-01-22"
 * />
 */

import { useTickerConfig } from "@site/src/hooks/useTickerConfig";
import styles from "./styles.module.css";

export function AnalysisCard({
  // Props override context values
  ticker: tickerProp,
  tickerName: tickerNameProp,
  title,
  description,
  analysisDate,
  attribution,
}) {
  // Get config from context (if available)
  const config = useTickerConfig();

  // Merge context with props (props take precedence)
  const ticker = tickerProp || config.ticker;
  return (
    <div className={styles.analysisCard}>
      {/* Header */}
      <div className={styles.analysisHeader}>
        <h2 className={styles.analysisTitle}>{title}</h2>
        <p className={styles.analysisDescription}>{description}</p>
      </div>

      {/* Metadata */}
      <div className={styles.analysisMetadata}>
        <div className={styles.metadataItem}>
          <span className={styles.metadataLabel}>Symbol:</span>
          <span className={`${styles.metadataValue} ${styles.symbolValue}`}>
            {ticker}
          </span>
        </div>
        <div className={styles.metadataItem}>
          <span className={styles.metadataLabel}>Analysis Date:</span>
          <span className={styles.metadataValue}>{analysisDate}</span>
        </div>
        <div className={styles.metadataItem}>
          <span className={styles.metadataLabel}>Attribution:</span>
          <span className={styles.metadataValue}>{attribution}</span>
        </div>
      </div>
    </div>
  );
}
