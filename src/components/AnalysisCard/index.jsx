/**
 * AnalysisCard Component
 * Displays chart analysis metadata with PortDive design system
 *
 * @component
 * @example
 * import { AnalysisCard } from '@site/src/components/AnalysisCard';
 *
 * <AnalysisCard
 *   title="NBIS - Elliott Wave Analysis"
 *   description="Complete wave count analysis with target levels and risk management"
 *   symbol="NBIS"
 *   analysisDate="2026-01-22"
 *   attribution="201 daily candles • Projection to Jun 2026 • Last updated: Jan 23, 2026"
 * />
 */

import styles from "./index.module.css";

export function AnalysisCard({
  title,
  description,
  symbol,
  analysisDate,
  attribution,
}) {
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
            {symbol}
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
