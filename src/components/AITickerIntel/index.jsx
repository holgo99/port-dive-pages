/**
 * AITickerIntel - AI-PREMIUM Sidebar Component
 *
 * Color Identity: Blue/Teal "Data Intelligence" theme
 * - Primary: Blue (#3d72ff) - Represents data/intelligence
 * - Secondary: Teal (#1fa39b) - PortDive brand, positive signals
 *
 * Displays comprehensive ticker intelligence:
 * - Company fundamentals from context
 * - Live price data from OHLCV
 * - Wave count targets and probability
 * - Signal summary from action matrix
 *
 * Features:
 * - Animated gradient border
 * - Logo header with shimmer animation
 * - Premium badge with pulse animation
 * - Golden ratio spacing system
 * - Standalone/embedded variants
 *
 * @component
 * @param {string} ticker - Ticker symbol (legacy prop, used as fallback)
 * @param {string} variant - "standalone" | "embedded" (default: "standalone")
 * @param {string} className - Additional CSS classes
 */

import React from "react";
import { useTickerIntel, formatNumber } from "@site/src/hooks/useTickerIntel";
import styles from "./styles.module.css";

// ============================================================================
// AI-PREMIUM ICONS
// ============================================================================

/**
 * AITickerIntelIcon - Data Intelligence icon
 * Chart with neural connection dots
 */
const AITickerIntelIcon = ({ size = 24 }) => (
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
    <path d="M3 3v18h18" />
    <path d="M18 9l-5-6-4 8-3-2" />
    <circle cx="18" cy="9" r="2" />
    <circle cx="13" cy="3" r="2" />
    <circle cx="9" cy="11" r="2" />
    <circle cx="6" cy="9" r="2" />
  </svg>
);

/**
 * SparklesIcon - Premium indicator
 */
const SparklesIcon = ({ size = 16 }) => (
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
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    <path d="M5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" />
    <path d="M19 13l1 2 1-2 2-1-2-1-1-2-1 2-2 1 2 1z" />
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
    strokeLinecap="round"
    strokeLinejoin="round"
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
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);

const WaveIcon = ({ size = 16 }) => (
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
    <path d="M2 12c1.5-3 3-4 4.5-4s3 2 4.5 4 3 4 4.5 4 3-1 4.5-4" />
  </svg>
);

const SignalIcon = ({ size = 16 }) => (
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
    <path d="M2 20h.01" />
    <path d="M7 20v-4" />
    <path d="M12 20v-8" />
    <path d="M17 20V8" />
    <path d="M22 4v16" />
  </svg>
);

const TargetIcon = ({ size = 16 }) => (
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
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

// ============================================================================
// LOADING SKELETON
// ============================================================================

const LoadingSkeleton = ({ isEmbedded }) => (
  <div
    className={`${styles.AITickerIntel} ${isEmbedded ? styles.embedded : ""}`}
  >
    {!isEmbedded && (
      <div className={styles.logoHeader}>
        <div className={styles.logoHeaderIcon}>
          <AITickerIntelIcon size={24} />
        </div>
        <span className={styles.logoText}>AITickerIntel</span>
        <span className={styles.premiumBadge}>
          <SparklesIcon size={12} />
          PREMIUM
        </span>
      </div>
    )}
    <div className={styles.mainContent}>
      <div className={styles.companyHeader}>
        <div className={`${styles.skeleton} ${styles.skeletonBadge}`} />
        <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
        <div className={`${styles.skeleton} ${styles.skeletonMeta}`} />
      </div>
      <div className={styles.priceSection}>
        <div className={`${styles.skeleton} ${styles.skeletonPrice}`} />
        <div className={styles.priceRange}>
          <div className={`${styles.skeleton} ${styles.skeletonRangeItem}`} />
          <div className={`${styles.skeleton} ${styles.skeletonRangeItem}`} />
        </div>
      </div>
      <div className={styles.detailSection}>
        <div className={`${styles.skeleton} ${styles.skeletonSectionTitle}`} />
        <div className={styles.rangeGrid}>
          <div className={`${styles.skeleton} ${styles.skeletonCard}`} />
          <div className={`${styles.skeleton} ${styles.skeletonCard}`} />
        </div>
      </div>
    </div>
    {!isEmbedded && (
      <div className={styles.footer}>
        <span className={styles.footerBadge}>
          <AITickerIntelIcon size={14} />
          AI-Powered Intelligence
        </span>
      </div>
    )}
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function AITickerIntel({ ticker, variant = "standalone", className = "" }) {
  const intelContext = useTickerIntel();
  const isEmbedded = variant === "embedded";

  // Loading state
  if (intelContext?.isLoading) {
    return <LoadingSkeleton isEmbedded={isEmbedded} />;
  }

  // Error state or no context
  if (!intelContext || intelContext.error) {
    return (
      <div
        className={`${styles.AITickerIntel} ${isEmbedded ? styles.embedded : ""} ${className}`.trim()}
      >
        <div className={styles.innerContainer}>
          {!isEmbedded && (
            <div className={styles.logoHeader}>
              <div className={styles.logoHeaderIcon}>
                <AITickerIntelIcon size={24} />
              </div>
              <span className={styles.logoText}>AITickerIntel</span>
              <span className={styles.premiumBadge}>
                <SparklesIcon size={12} />
                PREMIUM
              </span>
            </div>
          )}
          <div className={styles.mainContent}>
            <div className={styles.errorState}>
              <div className={styles.errorIcon}>⚠️</div>
              <div className={styles.errorTitle}>Unable to load ticker data</div>
              {intelContext?.error && (
                <div className={styles.errorMessage}>{intelContext.error}</div>
              )}
            </div>
          </div>
          {!isEmbedded && (
            <div className={styles.footer}>
              <span className={styles.footerBadge}>
                <AITickerIntelIcon size={14} />
                AI-Powered Intelligence
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  const { company, price, trading, wave, signals, technical } = intelContext;

  // Compute day range position percentage
  const dayRangePosition =
    price && price.dayHigh !== price.dayLow
      ? ((price.currentPrice - price.dayLow) / (price.dayHigh - price.dayLow)) *
        100
      : 50;

  // Compute 52-week range position percentage
  const yearRangePosition =
    price && price.fiftyTwoWeekHigh !== price.fiftyTwoWeekLow
      ? ((price.currentPrice - price.fiftyTwoWeekLow) /
          (price.fiftyTwoWeekHigh - price.fiftyTwoWeekLow)) *
        100
      : 50;

  // Determine signal action to display
  const getSignalAction = () => {
    if (!signals) return null;
    const { buyMetrics, sellMetrics, holdMetrics } = signals;

    // Priority: explicit BUY/SELL actions over HOLD
    if (buyMetrics?.action?.action && buyMetrics.action.action !== "HOLD") {
      return { type: "buy", action: buyMetrics.action };
    }
    if (sellMetrics?.action?.action && sellMetrics.action.action !== "HOLD") {
      return { type: "sell", action: sellMetrics.action };
    }
    if (holdMetrics?.action) {
      return { type: "hold", action: holdMetrics.action };
    }
    return null;
  };

  const signalAction = getSignalAction();

  return (
    <div
      className={`${styles.AITickerIntel} ${isEmbedded ? styles.embedded : ""} ${className}`.trim()}
    >
      {/* Inner container for border-radius clipping */}
      <div className={styles.innerContainer}>
        {/* Logo Header - only in standalone mode */}
        {!isEmbedded && (
          <div className={styles.logoHeader}>
            <div className={styles.logoHeaderIcon}>
              <AITickerIntelIcon size={24} />
            </div>
            <span className={styles.logoText}>AITickerIntel</span>
            <span className={styles.premiumBadge}>
              <SparklesIcon size={12} />
              PREMIUM
            </span>
          </div>
        )}

        {/* Main Content Wrapper */}
        <div className={styles.mainContent}>
        {/* Current Price Section */}
        {price && (
          <div className={styles.priceSection}>
            <div className={styles.currentPrice}>
              <div className={styles.priceLabel}>Current Price</div>
              <div className={styles.priceValue}>
                ${price.currentPrice?.toFixed(2)}
                {price.direction && (
                  <span
                    className={`${styles.priceChange} ${styles[price.direction]}`}
                  >
                    {price.direction === "up" ? (
                      <TrendUpIcon size={14} />
                    ) : price.direction === "down" ? (
                      <TrendDownIcon size={14} />
                    ) : null}
                    {price.changePercent > 0 ? "+" : ""}
                    {price.changePercent}%
                  </span>
                )}
              </div>
            </div>
            <div className={styles.priceRange}>
              <div className={styles.rangeItem}>
                <span className={styles.rangeLabel}>Day High</span>
                <span className={styles.rangeValue}>
                  ${price.dayHigh?.toFixed(2)}
                </span>
              </div>
              <div className={styles.rangeItem}>
                <span className={styles.rangeLabel}>Day Low</span>
                <span className={styles.rangeValue}>
                  ${price.dayLow?.toFixed(2)}
                </span>
              </div>
            </div>
            <div className={styles.rangeBar}>
              <div className={styles.rangeBarTrack}>
                <div
                  className={styles.rangeBarFill}
                  style={{
                    left: "0%",
                    width: `${dayRangePosition}%`,
                  }}
                />
                <div
                  className={styles.rangeBarMarker}
                  style={{ left: `${dayRangePosition}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* 52 Week Range */}
        {price && (
          <div className={styles.detailSection}>
            <h3 className={styles.detailTitle}>52-Week Range</h3>
            <div className={styles.rangeGrid}>
              <div className={styles.rangeCard}>
                <div className={styles.rangeCardLabel}>High</div>
                <div className={styles.rangeCardValue}>
                  ${price.fiftyTwoWeekHigh?.toFixed(2)}
                </div>
              </div>
              <div className={styles.rangeCard}>
                <div className={styles.rangeCardLabel}>Low</div>
                <div className={styles.rangeCardValue}>
                  ${price.fiftyTwoWeekLow?.toFixed(2)}
                </div>
              </div>
            </div>
            <div className={styles.rangeBar} style={{ marginTop: "12px" }}>
              <div className={styles.rangeBarTrack}>
                <div
                  className={styles.rangeBarFill}
                  style={{
                    left: "0%",
                    width: `${yearRangePosition}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Elliott Wave Summary */}
        {wave?.activeScenario && (
          <div className={styles.detailSection}>
            <h3 className={styles.detailTitle}>
              <WaveIcon size={14} />
              Elliott Wave
            </h3>
            <div
              className={`${styles.waveCard} ${wave.mode === "MOTIVE" ? styles.bullish : styles.bearish}`}
            >
              <div className={styles.waveHeader}>
                <span className={styles.waveLabel}>{wave.label}</span>
                <span
                  className={`${styles.waveBadge} ${wave.mode === "MOTIVE" ? styles.bullish : styles.bearish}`}
                >
                  {wave.displayMode}
                </span>
              </div>
              <div className={styles.waveProbability}>
                <span className={styles.waveProbLabel}>Probability</span>
                <span className={styles.waveProbValue}>{wave.probability}%</span>
              </div>
              {wave.targets && (
                <div className={styles.waveTargets}>
                  <TargetIcon size={12} />
                  <span>
                    Target: ${wave.targets.startPrice?.toFixed(2)} - $
                    {wave.targets.endPrice?.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Signal Summary */}
        {signalAction && (
          <div className={styles.detailSection}>
            <h3 className={styles.detailTitle}>
              <SignalIcon size={14} />
              Signal Summary
            </h3>
            <div className={`${styles.signalCard} ${styles[signalAction.type]}`}>
              <div className={styles.signalAction}>
                {signalAction.action.action}
              </div>
              {signalAction.action.reason && (
                <div className={styles.signalReason}>
                  {signalAction.action.reason}
                </div>
              )}
              {signals.contradictions && signals.contradictions.length > 0 && (
                <div className={styles.signalWarning}>
                  ⚠️ {signals.contradictions.length} signal contradiction
                  {signals.contradictions.length > 1 ? "s" : ""}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Technical Indicators */}
        {technical && (
          <div className={styles.detailSection}>
            <h3 className={styles.detailTitle}>Technical Indicators</h3>
            <div className={styles.technicalGrid}>
              <div className={styles.technicalItem}>
                <span className={styles.technicalLabel}>RSI</span>
                <span
                  className={`${styles.technicalValue} ${
                    technical.rsi < 30
                      ? styles.oversold
                      : technical.rsi > 70
                        ? styles.overbought
                        : ""
                  }`}
                >
                  {technical.rsi?.toFixed(1)}
                </span>
              </div>
              <div className={styles.technicalItem}>
                <span className={styles.technicalLabel}>ADX</span>
                <span className={styles.technicalValue}>
                  {technical.adx?.toFixed(1)}
                </span>
              </div>
              <div className={styles.technicalItem}>
                <span className={styles.technicalLabel}>MACD</span>
                <span
                  className={`${styles.technicalValue} ${
                    technical.macdHist > 0 ? styles.positive : styles.negative
                  }`}
                >
                  {technical.macd?.toFixed(2)}
                </span>
              </div>
              <div className={styles.technicalItem}>
                <span className={styles.technicalLabel}>Williams %R</span>
                <span
                  className={`${styles.technicalValue} ${
                    technical.williamsR < -80
                      ? styles.oversold
                      : technical.williamsR > -20
                        ? styles.overbought
                        : ""
                  }`}
                >
                  {technical.williamsR?.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Company Details */}
        <div className={styles.detailSection}>
          <h3 className={styles.detailTitle}>Company Details</h3>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Industry</span>
              <span className={styles.detailValue}>{company.industry}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Exchange</span>
              <span className={styles.detailValue}>{company.exchange}</span>
            </div>
            {company.country && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Country</span>
                <span className={styles.detailValue}>{company.country}</span>
              </div>
            )}
            {price?.ath && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>ATH</span>
                <span className={styles.detailValue}>
                  ${price.ath.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Trading Information */}
        {trading && (
          <div className={styles.detailSection}>
            <h3 className={styles.detailTitle}>Trading</h3>
            <div className={styles.tradingGrid}>
              <div className={styles.tradingItem}>
                <span className={styles.tradingLabel}>Volume</span>
                <span className={styles.tradingValue}>
                  {trading.volumeFormatted}
                </span>
              </div>
              <div className={styles.tradingItem}>
                <span className={styles.tradingLabel}>Avg Volume</span>
                <span className={styles.tradingValue}>
                  {trading.avgVolumeFormatted}
                </span>
              </div>
              {trading.volumeRatio && (
                <div className={styles.tradingItem}>
                  <span className={styles.tradingLabel}>Vol Ratio</span>
                  <span
                    className={`${styles.tradingValue} ${
                      parseFloat(trading.volumeRatio) > 1.5
                        ? styles.highVolume
                        : ""
                    }`}
                  >
                    {trading.volumeRatio}x
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Website Link */}
        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.websiteLink}
          >
            <span>Visit Company Website</span>
            <span className={styles.linkIcon}>→</span>
          </a>
        )}
      </div>

        {/* Footer - only in standalone mode */}
        {!isEmbedded && (
          <div className={styles.footer}>
            <span className={styles.footerBadge}>
              <AITickerIntelIcon size={14} />
              AI-Powered Intelligence
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default AITickerIntel;
