/**
 * AIActionSignalMatrixContradictionResolver Component - AI Signal Conflict Resolution
 *
 * Premium component for resolving conflicting trading signals using
 * Elliott Wave hierarchy-based decision making.
 *
 * Automatically consumes contradictions from ActionSignalMatrixProvider context
 * when available, with props as fallback for backward compatibility.
 *
 * @component
 * @param {Array} [contradictions] - Array of contradiction objects (optional if using context)
 * @param {string} [variant="standalone"] - Display variant:
 *   - "standalone": Full panel with logo header, wrapper styling, and footer badge.
 *   - "embedded": Minimal content without outer chrome (no header, border, shadow, footer).
 * @param {string} [className] - Additional CSS class names
 *
 * @example
 * // With context (recommended) - contradictions auto-populated
 * <ActionSignalMatrixProvider>
 *   <AIActionSignalMatrixContradictionResolver />
 * </ActionSignalMatrixProvider>
 *
 * @example
 * // With explicit props (backward compatible)
 * <AIActionSignalMatrixContradictionResolver contradictions={contradictions} />
 *
 * @example
 * // Embedded variant (within another component)
 * <AIActionSignalMatrixContradictionResolver variant="embedded" />
 */

import React, { memo } from "react";
import { useActionSignalMatrix } from "@site/src/hooks/useActionSignalMatrix";
import styles from "./styles.module.css";

// ============================================================================
// SVG ICONS
// ============================================================================

const AIActionSignalMatrixContradictionResolverIcon = ({ size = 24 }) => (
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
    {/* Brain with neural connections */}
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.54" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.54" />
  </svg>
);

const BrainIcon = ({ size = 20 }) => (
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
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.54" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.54" />
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

const CheckCircleIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <circle
      cx="16"
      cy="16"
      r="13"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M10 16l4 4 8-8"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const AlertTriangleIcon = ({ size = 20 }) => (
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
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const ZapIcon = ({ size = 16 }) => (
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
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const ArrowRightIcon = ({ size = 16 }) => (
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
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

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

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Elliott Wave hierarchy weights for contradiction resolution
 */
const HIERARCHY_WEIGHTS = [
  {
    weight: 40,
    label: "Elliott Wave Structure",
    description: "Primary decision driver - wave position determines trend",
    color: "purple",
  },
  {
    weight: 35,
    label: "Momentum Indicators",
    description: "RSI, Williams %R, MACD momentum readings",
    color: "blue",
  },
  {
    weight: 15,
    label: "Trend Context",
    description: "ADX strength, DI+ / DI- directional",
    color: "teal",
  },
  {
    weight: 10,
    label: "Volatility & Volume",
    description: "ATR expansion, volume confirmation",
    color: "coral",
  },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Hierarchy Weight Bar - Visual representation of weight distribution
 */
const HierarchyWeightBar = memo(
  ({ weight, label, description, color, index }) => (
    <div className={styles.hierarchyWeightItem}>
      <div className={styles.hierarchyWeightHeader}>
        <div className={styles.hierarchyWeightRank}>
          <span className={styles.hierarchyRankNumber}>{index + 1}</span>
        </div>
        <div className={styles.hierarchyWeightInfo}>
          <span className={styles.hierarchyWeightLabel}>{label}</span>
          <span className={styles.hierarchyWeightDescription}>
            {description}
          </span>
        </div>
        <div className={`${styles.hierarchyWeightValue} ${styles[color]}`}>
          {weight}%
        </div>
      </div>
      <div className={styles.hierarchyWeightBarTrack}>
        <div
          className={`${styles.hierarchyWeightBarFill} ${styles[color]}`}
          style={{ width: `${weight}%` }}
        />
      </div>
    </div>
  ),
);

/**
 * Contradiction Card - Individual conflict resolution display
 */
const ContradictionCard = memo(({ contradiction, index }) => {
  const { description, resolution, action, color } = contradiction;

  // Extract signal conflicts (excluding metadata fields)
  const conflictSignals = Object.entries(contradiction).filter(
    ([key]) =>
      ![
        "type",
        "description",
        "resolution",
        "action",
        "color",
        "weights",
      ].includes(key),
  );

  return (
    <div className={styles.contradictionCard}>
      {/* Card Header */}
      <div className={styles.contradictionCardHeader}>
        <div className={styles.contradictionCardIcon}>
          <AlertTriangleIcon size={20} />
        </div>
        <div className={styles.contradictionCardTitle}>
          <span className={styles.contradictionCardLabel}>
            Conflict #{index + 1}
          </span>
          <h4 className={styles.contradictionCardHeading}>{description}</h4>
        </div>
      </div>

      {/* Conflicting Signals */}
      <div className={styles.conflictSignalsContainer}>
        <div className={styles.conflictSignalsHeader}>
          <ZapIcon size={14} />
          <span>Conflicting Signals</span>
        </div>
        <div className={styles.conflictSignalsGrid}>
          {conflictSignals.map(([key, value], idx) => (
            <div key={key} className={styles.conflictSignalItem}>
              <span className={styles.conflictSignalKey}>{key}</span>
              <span className={styles.conflictSignalArrow}>
                <ArrowRightIcon size={12} />
              </span>
              <span
                className={`${styles.conflictSignalValue} ${
                  value === "BUY" || value === "HOLD"
                    ? styles.teal
                    : value === "SELL"
                      ? styles.coral
                      : ""
                }`}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Resolution */}
      <div className={styles.resolutionContainer}>
        <div className={styles.resolutionHeader}>
          <SparklesIcon size={14} />
          <span>AI Resolution</span>
        </div>
        <p className={styles.resolutionText}>{resolution}</p>
      </div>

      {/* Action Badge */}
      <div className={`${styles.actionBadge} ${styles[color]}`}>
        <span className={styles.actionBadgeLabel}>Recommended Action</span>
        <span className={styles.actionBadgeValue}>{action}</span>
      </div>
    </div>
  );
});

/**
 * No Contradictions State - Shown when indicators are aligned
 */
const NoContradictionsState = memo(() => (
  <div className={styles.noContradictionsContainer}>
    <div className={styles.noContradictionsIcon}>
      <CheckCircleIcon size={48} />
    </div>
    <div className={styles.noContradictionsContent}>
      <h4 className={styles.noContradictionsTitle}>Signals Aligned</h4>
      <p className={styles.noContradictionsText}>
        No conflicting signals detected. All indicators are pointing in the same
        direction, providing a clearer trading signal.
      </p>
    </div>
    <div className={styles.noContradictionsBadge}>
      <CheckCircleIcon size={16} />
      <span>High Confidence Signal</span>
    </div>
  </div>
));

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function AIActionSignalMatrixContradictionResolver({
  contradictions: contradictionsProp = null,
  variant = "standalone",
  className = "",
}) {
  const isEmbedded = variant === "embedded";

  // Get contradictions from context (if available), with props as fallback
  const signalsContext = useActionSignalMatrix();
  const contradictions = contradictionsProp ?? signalsContext?.contradictions ?? null;
  const hasContradictions = contradictions && contradictions.length > 0;

  const wrapperClass = `${styles.contradictionResolverWrapper} ${
    isEmbedded ? styles.embedded : ""
  } ${className}`.trim();

  return (
    <div className={wrapperClass}>
      {/* Logo Header - only in standalone mode */}
      {!isEmbedded && (
        <div className={styles.logoHeader}>
          <AIActionSignalMatrixContradictionResolverIcon size={24} />
          <span className={styles.logoText}>
            AIActionSignalMatrixContradictionResolver
          </span>
          <span className={styles.premiumBadge}>
            <SparklesIcon size={12} />
            PREMIUM
          </span>
        </div>
      )}

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.sectionHeaderIcon}>
            <BrainIcon size={24} />
          </div>
          <div className={styles.sectionHeaderText}>
            <h3 className={styles.sectionTitle}>AI Contradiction Resolution</h3>
            <p className={styles.sectionSubtitle}>
              Elliott Wave hierarchy-based signal conflict resolution
            </p>
          </div>
        </div>

        {/* Hierarchy Weights Section */}
        <div className={styles.hierarchySection}>
          <div className={styles.hierarchySectionHeader}>
            <h4 className={styles.hierarchySectionTitle}>Decision Hierarchy</h4>
            <p className={styles.hierarchySectionDescription}>
              When signals disagree, the following weighted hierarchy determines
              the final action
            </p>
          </div>

          <div className={styles.hierarchyWeightsList}>
            {HIERARCHY_WEIGHTS.map((item, idx) => (
              <HierarchyWeightBar key={item.label} {...item} index={idx} />
            ))}
          </div>
        </div>

        {/* Contradictions Section */}
        <div className={styles.contradictionsSection}>
          <div className={styles.contradictionsSectionHeader}>
            <h4 className={styles.contradictionsSectionTitle}>
              {hasContradictions ? "Detected Conflicts" : "Conflict Status"}
            </h4>
            {hasContradictions && (
              <span className={styles.contradictionsCount}>
                {contradictions.length} conflict
                {contradictions.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {hasContradictions ? (
            <div className={styles.contradictionsGrid}>
              {contradictions.map((contradiction, idx) => (
                <ContradictionCard
                  key={contradiction.type || idx}
                  contradiction={contradiction}
                  index={idx}
                />
              ))}
            </div>
          ) : (
            <NoContradictionsState />
          )}
        </div>

        {/* Default Rule Callout */}
        <div className={styles.defaultRuleCallout}>
          <div className={styles.defaultRuleIcon}>
            <ScaleIcon size={20} />
          </div>
          <div className={styles.defaultRuleContent}>
            <span className={styles.defaultRuleLabel}>
              Default Resolution Rule
            </span>
            <p className={styles.defaultRuleText}>
              Elliott Wave structure (40% weight) takes precedence in conflicts.
              Wave position is more reliable than lagging indicators. When in
              doubt, follow the wave count.
            </p>
          </div>
        </div>
      </div>

      {/* Footer - only in standalone mode */}
      {!isEmbedded && (
        <div className={styles.footer}>
          <span className={styles.footerBadge}>
            <BrainIcon size={14} />
            AI-Powered Analysis
          </span>
        </div>
      )}
    </div>
  );
}

export default AIActionSignalMatrixContradictionResolver;
