/**
 * ActionSignalMatrix Component - PREMIUM REDESIGN
 *
 * Trading signal decision matrices with BUY/ADD and SELL/TRIM signals.
 * Includes AI Contradiction Resolution logic for conflicting indicators.
 *
 * Uses Context + Composition pattern via TickerConfigProvider + OHLCVDataProvider
 *
 * @component
 * @example
 * <TickerConfigProvider config={nbisConfig}>
 *   <OHLCVDataProvider ticker="NBIS" timeframe="1D">
 *     <ActionSignalMatrix />
 *   </OHLCVDataProvider>
 * </TickerConfigProvider>
 */

import React, { memo } from "react";
import { useTickerConfig } from "@site/src/hooks/useTickerConfig";
import { useOHLCVData } from "@site/src/hooks/useOHLCVData";
import {
  useActionSignalMatrix,
  BUY_SIGNAL_WEIGHTS,
  SELL_SIGNAL_WEIGHTS,
} from "@site/src/hooks/useActionSignalMatrix";
import styles from "./styles.module.css";

// ============================================================================
// SVG ICONS
// ============================================================================

const SignalMatrixIcon = ({ size = 24 }) => (
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
    {/* Grid pattern representing decision matrix */}
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    {/* Check marks for confirmed signals */}
    <path d="M5 6l2 2 3-3" strokeWidth="1.5" />
    <path d="M16 6l2 2 3-3" strokeWidth="1.5" />
  </svg>
);

const CheckCircleIcon = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle
      cx="24"
      cy="24"
      r="20"
      stroke="currentColor"
      strokeWidth="2.5"
      fill="none"
    />
    <path
      d="M15 24l6 6 12-12"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const XCircleIcon = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle
      cx="24"
      cy="24"
      r="20"
      stroke="currentColor"
      strokeWidth="2.5"
      fill="none"
    />
    <path
      d="M16 16l16 16M32 16l-16 16"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
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
  >
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);

const ScaleIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 3v18" />
    <path d="M5 6l7-3 7 3" />
    <path d="M5 6v4c0 1.1.9 2 2 2h2" />
    <path d="M19 6v4c0 1.1-.9 2-2 2h-2" />
    <circle cx="5" cy="17" r="2" />
    <circle cx="19" cy="17" r="2" />
  </svg>
);

const PauseCircleIcon = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle
      cx="24"
      cy="24"
      r="20"
      stroke="currentColor"
      strokeWidth="2.5"
      fill="none"
    />
    <rect x="17" y="16" width="4" height="16" rx="1" fill="currentColor" />
    <rect x="27" y="16" width="4" height="16" rx="1" fill="currentColor" />
  </svg>
);

const BalanceIcon = ({ size = 18 }) => (
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
    <path d="M12 2v20" />
    <path d="M2 10h4l2-4 4 8 4-8 2 4h4" />
  </svg>
);


// ============================================================================
// SIGNAL CARD COMPONENT
// ============================================================================

const SignalCard = memo(({ signal, index }) => {
  const { label, description, met, value, details } = signal;

  return (
    <div
      className={`${styles.signalCard} ${met ? styles.confirmed : styles.notMet}`}
    >
      <div className={styles.signalCardHeader}>
        <span className={styles.signalNumber}>#{index + 1}</span>
        <span className={styles.signalLabel}>{label}</span>
      </div>

      <div className={styles.signalIconContainer}>
        <div
          className={`${styles.signalIcon} ${met ? styles.confirmed : styles.notMet}`}
        >
          {met ? <CheckCircleIcon size={40} /> : <XCircleIcon size={40} />}
        </div>
      </div>

      <div className={styles.signalCardBody}>
        <span className={styles.signalDescription}>{description}</span>
        <span
          className={`${styles.signalStatus} ${met ? styles.confirmed : styles.notMet}`}
        >
          {met ? "CONFIRMED" : "NOT MET"}
        </span>
      </div>

      <div className={styles.signalCardFooter}>
        <span className={styles.signalValueLabel}>Current:</span>
        <span
          className={`${styles.signalValue} ${met ? styles.confirmed : styles.notMet}`}
        >
          {typeof value === "number" ? value.toFixed(2) : (value ?? "—")}
        </span>
      </div>
    </div>
  );
});

// ============================================================================
// SIGNAL MATRIX SECTION COMPONENT
// ============================================================================

const SignalMatrixSection = memo(
  ({ title, signals, weights, action, totalWeight, confirmedCount, type }) => {
    const progressPercent = (confirmedCount / signals.length) * 100;
    const isBuy = type === "BUY";

    return (
      <div
        className={`${styles.matrixSection} ${isBuy ? styles.buySection : styles.sellSection}`}
      >
        <div className={styles.matrixHeader}>
          <div className={styles.matrixHeaderLeft}>
            <div
              className={`${styles.matrixIcon} ${isBuy ? styles.teal : styles.coral}`}
            >
              {isBuy ? <TrendUpIcon size={18} /> : <TrendDownIcon size={18} />}
            </div>
            <h3 className={styles.matrixTitle}>{title}</h3>
          </div>
          <span className={styles.matrixSubtitle}>Need 3/5 Confirmed</span>
        </div>

        <div className={styles.signalGrid}>
          {signals.map((signal, idx) => (
            <SignalCard key={signal.label} signal={signal} index={idx} />
          ))}
        </div>

        <div className={styles.weightSection}>
          <div className={styles.weightHeader}>
            <span className={styles.weightLabel}>Weight Distribution</span>
          </div>
          <div className={styles.weightBars}>
            <div className={styles.weightBar}>
              <span className={styles.weightBarLabel}>
                {isBuy ? "Volume + RSI" : "RSI + Williams + Volume"}
              </span>
              <div className={styles.weightBarTrack}>
                <div
                  className={`${styles.weightBarFill} ${styles.primary}`}
                  style={{ width: isBuy ? "60%" : "70%" }}
                />
              </div>
              <span className={styles.weightBarValue}>
                {isBuy ? "60%" : "70%"} PRIMARY
              </span>
            </div>
            <div className={styles.weightBar}>
              <span className={styles.weightBarLabel}>
                {isBuy ? "MACD + Williams" : "MACD + Stoch"}
              </span>
              <div className={styles.weightBarTrack}>
                <div
                  className={`${styles.weightBarFill} ${styles.secondary}`}
                  style={{ width: isBuy ? "40%" : "30%" }}
                />
              </div>
              <span className={styles.weightBarValue}>
                {isBuy ? "40%" : "30%"} CONFIRMATION
              </span>
            </div>
          </div>
        </div>

        <div className={styles.summaryContainer}>
          <div className={styles.summaryStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Signals</span>
              <span
                className={`${styles.statValue} ${confirmedCount >= 3 ? (isBuy ? styles.teal : styles.coral) : styles.blue}`}
              >
                {confirmedCount}/{signals.length}
              </span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Weight</span>
              <span
                className={`${styles.statValue} ${totalWeight >= 0.6 ? (isBuy ? styles.teal : styles.coral) : styles.blue}`}
              >
                {(totalWeight * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div
                className={`${styles.progressFill} ${confirmedCount >= 3 ? (isBuy ? styles.teal : styles.coral) : styles.blue}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className={styles.progressLabel}>
              {progressPercent.toFixed(0)}%
            </span>
          </div>

          <div className={styles.actionContainer}>
            <span className={styles.actionLabel}>ACTION:</span>
            <span className={`${styles.actionValue} ${styles[action.color]}`}>
              {action.action}
            </span>
          </div>
        </div>

        {action.reason && (
          <div className={styles.reasonContainer}>
            <span className={styles.reasonText}>{action.reason}</span>
          </div>
        )}
      </div>
    );
  },
);

// ============================================================================
// HOLD SIGNAL MATRIX SECTION COMPONENT
// ============================================================================

const HoldSignalMatrixSection = memo(
  ({ buyMetrics, sellMetrics, holdAction }) => {
    if (!holdAction) return null;

    const { action, reason, status, confidence } = holdAction;

    // Calculate the balance visualization
    const buyStrength = Math.round(buyMetrics.totalWeight * 100);
    const sellStrength = Math.round(sellMetrics.totalWeight * 100);
    const balanceOffset = buyStrength - sellStrength;

    return (
      <div className={`${styles.matrixSection} ${styles.holdSection}`}>
        <div className={styles.matrixHeader}>
          <div className={styles.matrixHeaderLeft}>
            <div className={`${styles.matrixIcon} ${styles.blue}`}>
              <BalanceIcon size={18} />
            </div>
            <h3 className={styles.matrixTitle}>HOLD Signal Matrix</h3>
          </div>
          <span className={styles.matrixSubtitle}>Balance Analysis</span>
        </div>

        {/* Hold Status Indicator */}
        <div className={styles.holdStatusContainer}>
          <div className={styles.holdIconWrapper}>
            <div className={`${styles.holdIcon} ${styles[status]}`}>
              <PauseCircleIcon size={56} />
            </div>
          </div>

          <div className={styles.holdDetails}>
            <div className={styles.holdActionBadge}>
              <span className={styles.holdActionText}>{action}</span>
            </div>
            <p className={styles.holdReason}>{reason}</p>
          </div>
        </div>

        {/* Signal Balance Visualization */}
        <div className={styles.balanceSection}>
          <div className={styles.balanceHeader}>
            <span className={styles.balanceLabel}>Signal Balance</span>
          </div>

          <div className={styles.balanceVisualization}>
            <div className={styles.balanceScale}>
              <div className={styles.balanceScaleLabels}>
                <span className={styles.balanceScaleLabelBuy}>BUY</span>
                <span className={styles.balanceScaleLabelCenter}>NEUTRAL</span>
                <span className={styles.balanceScaleLabelSell}>SELL</span>
              </div>
              <div className={styles.balanceTrack}>
                <div className={styles.balanceTrackBuy} />
                <div className={styles.balanceTrackCenter} />
                <div className={styles.balanceTrackSell} />
                <div
                  className={styles.balanceIndicator}
                  style={{
                    left: `${50 + balanceOffset / 2}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className={styles.balanceStats}>
            <div className={styles.balanceStatItem}>
              <span className={`${styles.balanceStatLabel} ${styles.teal}`}>
                Buy Signals
              </span>
              <span className={`${styles.balanceStatValue} ${styles.teal}`}>
                {buyMetrics.confirmedCount}/5 ({buyStrength}%)
              </span>
            </div>
            <div className={styles.balanceStatDivider} />
            <div className={styles.balanceStatItem}>
              <span className={`${styles.balanceStatLabel} ${styles.coral}`}>
                Sell Signals
              </span>
              <span className={`${styles.balanceStatValue} ${styles.coral}`}>
                {sellMetrics.confirmedCount}/5 ({sellStrength}%)
              </span>
            </div>
          </div>
        </div>

        {/* Confidence Meter */}
        <div className={styles.confidenceSection}>
          <div className={styles.confidenceHeader}>
            <span className={styles.confidenceLabel}>Hold Confidence</span>
            <span className={styles.confidenceValue}>{confidence}%</span>
          </div>
          <div className={styles.confidenceBar}>
            <div
              className={styles.confidenceFill}
              style={{ width: `${confidence}%` }}
            />
          </div>
          <div className={styles.confidenceHint}>
            {confidence >= 80
              ? "Strong hold signal - maintain current position"
              : confidence >= 60
                ? "Moderate hold - be ready for directional shift"
                : "Weak hold - signals developing, monitor closely"}
          </div>
        </div>
      </div>
    );
  },
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ActionSignalMatrix({
  // Props override context values
  ticker: tickerProp,
  tickerName: tickerNameProp,
  data: dataProp,
}) {
  // Get config from context (if available)
  const tickerConfig = useTickerConfig();
  const ohlcvContext = useOHLCVData();
  const signalsContext = useActionSignalMatrix();

  // Merge context with props (props take precedence)
  const ticker = tickerProp || tickerConfig.ticker;
  const tickerName = tickerNameProp || tickerConfig.tickerName;
  const data = dataProp || ohlcvContext.data || [];

  // Get signals from context (computed by ActionSignalMatrixProvider)
  const buySignals = signalsContext?.buySignals ?? [];
  const sellSignals = signalsContext?.sellSignals ?? [];
  const buyMetrics = signalsContext?.buyMetrics ?? {
    confirmedCount: 0,
    totalWeight: 0,
    action: { action: "HOLD", reason: "No data", color: "blue", percentage: 0 },
  };
  const sellMetrics = signalsContext?.sellMetrics ?? {
    confirmedCount: 0,
    totalWeight: 0,
    action: { action: "HOLD", reason: "No data", color: "blue", percentage: 0 },
  };
  const holdMetrics = signalsContext?.holdMetrics ?? { action: null };

  if (!data || data.length === 0) {
    return (
      <div className={styles.signalMatrixWrapper}>
        <div className={styles.noData}>
          No data available for signal analysis
        </div>
      </div>
    );
  }

  return (
    <div className={styles.signalMatrixWrapper}>
      {/* Logo Header */}
      <div className={styles.logoHeader}>
        <SignalMatrixIcon size={24} />
        <span className={styles.logoText}>ActionSignalMatrix</span>
      </div>

      {/* BUY/ADD Signal Matrix */}
      <SignalMatrixSection
        title="BUY/ADD Signal Matrix"
        signals={buySignals}
        weights={BUY_SIGNAL_WEIGHTS}
        action={buyMetrics.action}
        totalWeight={buyMetrics.totalWeight}
        confirmedCount={buyMetrics.confirmedCount}
        type="BUY"
      />

      {/* SELL/TRIM Signal Matrix */}
      <SignalMatrixSection
        title="SELL/TRIM Signal Matrix"
        signals={sellSignals}
        weights={SELL_SIGNAL_WEIGHTS}
        action={sellMetrics.action}
        totalWeight={sellMetrics.totalWeight}
        confirmedCount={sellMetrics.confirmedCount}
        type="SELL"
      />

      {/* HOLD Signal Matrix - shown when signals are balanced or neither active */}
      <HoldSignalMatrixSection
        buyMetrics={buyMetrics}
        sellMetrics={sellMetrics}
        holdAction={holdMetrics.action}
      />

      {/* Footer */}
      <footer className={styles.signalMatrixFooter}>
        <span className={styles.footerBadge}>
          <ScaleIcon size={14} />
          Decision Matrix Analysis
        </span>
      </footer>
    </div>
  );
}

export default ActionSignalMatrix;
