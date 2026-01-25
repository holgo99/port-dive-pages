/**
 * VerdictPanel Component - Scenario Decision Tree Design
 * Renders chart analysis verdict with visual decision tree layout
 *
 * @component
 * @example
 * import VerdictPanel from '@site/src/components/VerdictPanel';
 *
 * <VerdictPanel
 *   scenario="Bullish Continuation"
 *   probability={60}
 *   priceTargets={{ low: 64.70, high: 81.00 }}
 *   validation={[
 *     "Failure below **$93**",
 *     "Momentum Divergence at **141**"
 *   ]}
 *   invalidation={[
 *     "Break above **$141.10**",
 *     "Impulsive Momentum"
 *   ]}
 *   isCorrective={false}
 *   outcomeState="undecidable" // "validated" | "invalidated" | "undecidable"
 * />
 */

import React, { useMemo } from "react";
import styles from "./styles.module.css";

/**
 * SVG Icons for the panel
 */
const CheckIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path
      d="M3 8L6.5 11.5L13 4.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const XIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path
      d="M4 4L12 12M12 4L4 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HourglassIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M6 2H18M6 22H18M7 2V6.5C7 8.43 8.57 10 10.5 10H13.5C15.43 10 17 8.43 17 6.5V2M7 22V17.5C7 15.57 8.57 14 10.5 14H13.5C15.43 14 17 15.57 17 17.5V22M12 10V14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const WarningIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M7 5V7.5M7 9.5H7.005M6.13 2.5L1.13 11C0.98 11.26 0.9 11.55 0.9 11.85C0.9 12.15 0.98 12.44 1.13 12.7C1.28 12.96 1.5 13.18 1.76 13.33C2.02 13.48 2.31 13.56 2.61 13.56H11.39C11.69 13.56 11.98 13.48 12.24 13.33C12.5 13.18 12.72 12.96 12.87 12.7C13.02 12.44 13.1 12.15 13.1 11.85C13.1 11.55 13.02 11.26 12.87 11L7.87 2.5C7.72 2.24 7.5 2.02 7.24 1.87C6.98 1.72 6.69 1.64 6.39 1.64C6.09 1.64 5.8 1.72 5.54 1.87C5.28 2.02 5.06 2.24 4.91 2.5L6.13 2.5Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Parse markdown thesis content to extract structured data
 */
const parseVerdictMarkdown = (markdown) => {
  if (!markdown) return null;

  const lines = markdown.split("\n");
  let scenario = "";
  let validation = [];
  let invalidation = [];
  let currentSection = null;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) continue;

    if (trimmed.startsWith("# ")) {
      scenario = trimmed.replace(/^#\s*/, "").replace(/\*([^*]+)\*/g, "$1");
      continue;
    }

    if (/^##\s*\**\s*(thesis|validation|invalidation)/i.test(trimmed)) {
      const sectionMatch = trimmed.match(/^##\s*\**\s*(thesis|validation|invalidation)/i);
      if (sectionMatch) {
        currentSection = sectionMatch[1].toLowerCase();
      }
      continue;
    }

    if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      continue;
    }

    if (currentSection === "validation" && trimmed.startsWith("*")) {
      validation.push(trimmed.replace(/^\*\s*/, ""));
    } else if (currentSection === "invalidation" && trimmed.startsWith("*")) {
      invalidation.push(trimmed.replace(/^\*\s*/, ""));
    }
  }

  return { scenario, validation, invalidation };
};

/**
 * Render inline markdown (bold, prices, etc.)
 */
const InlineMarkdown = ({ text, highlightClass }) => {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\$[\d,.]+)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className={highlightClass}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code key={i} className={highlightClass}>
              {part.slice(1, -1)}
            </code>
          );
        }
        if (/^\$[\d,.]+$/.test(part)) {
          return (
            <span key={i} className={highlightClass}>
              {part}
            </span>
          );
        }
        return part;
      })}
    </>
  );
};

/**
 * Decision Tree SVG Component - Draws the branching lines
 */
const DecisionTreeSVG = ({ isCorrective, outcomeState }) => {
  const validationColor = isCorrective ? "#FF6B6B" : "#1FA39B";
  const invalidationColor = isCorrective ? "#1FA39B" : "#FF6B6B";

  // Determine which path is "active" based on outcome
  const validationActive = outcomeState === "validated";
  const invalidationActive = outcomeState === "invalidated";
  const isUndecidable = outcomeState === "undecidable";

  return (
    <svg
      className={styles.treeSvg}
      viewBox="0 0 400 100"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Validation gradient */}
        <linearGradient id="validationGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={validationColor} stopOpacity={validationActive ? "1" : "0.7"} />
          <stop offset="100%" stopColor={validationColor} stopOpacity={validationActive ? "0.6" : "0.2"} />
        </linearGradient>

        {/* Invalidation gradient */}
        <linearGradient id="invalidationGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={invalidationColor} stopOpacity={invalidationActive ? "1" : "0.7"} />
          <stop offset="100%" stopColor={invalidationColor} stopOpacity={invalidationActive ? "0.6" : "0.2"} />
        </linearGradient>

        {/* Glow filter */}
        <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Top center node (connects from thesis) */}
      <circle cx="200" cy="8" r="4" fill="#fff" opacity="0.5" />

      {/* Left branch - Validation path */}
      <path
        d="M200,8 C200,25 160,35 120,45 S60,60 60,75"
        fill="none"
        stroke="url(#validationGrad)"
        strokeWidth={validationActive ? "4" : "3"}
        filter={validationActive ? "url(#glowFilter)" : "none"}
        opacity={invalidationActive ? "0.3" : "1"}
      />
      {/* Left branch node */}
      <circle
        cx="120"
        cy="45"
        r="4"
        fill={validationColor}
        opacity={invalidationActive ? "0.3" : "0.8"}
      />

      {/* Right branch - Invalidation path */}
      <path
        d="M200,8 C200,25 240,35 280,45 S340,60 340,75"
        fill="none"
        stroke="url(#invalidationGrad)"
        strokeWidth={invalidationActive ? "4" : "3"}
        filter={invalidationActive ? "url(#glowFilter)" : "none"}
        opacity={validationActive ? "0.3" : "1"}
      />
      {/* Right branch node */}
      <circle
        cx="280"
        cy="45"
        r="4"
        fill={invalidationColor}
        opacity={validationActive ? "0.3" : "0.8"}
      />
    </svg>
  );
};

/**
 * Bottom Connection SVG - Lines from cards to outcome
 */
const BottomConnectionSVG = ({ isCorrective, outcomeState }) => {
  const validationColor = isCorrective ? "#FF6B6B" : "#1FA39B";
  const invalidationColor = isCorrective ? "#1FA39B" : "#FF6B6B";

  const validationActive = outcomeState === "validated";
  const invalidationActive = outcomeState === "invalidated";

  return (
    <svg
      className={styles.bottomTreeSvg}
      viewBox="0 0 400 60"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="glowBottom" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Left path - from validation card to center */}
      <path
        d="M60,0 C60,20 120,40 200,55"
        fill="none"
        stroke={validationActive ? validationColor : "rgba(255,255,255,0.12)"}
        strokeWidth={validationActive ? "3" : "2"}
        filter={validationActive ? "url(#glowBottom)" : "none"}
      />

      {/* Right path - from invalidation card to center */}
      <path
        d="M340,0 C340,20 280,40 200,55"
        fill="none"
        stroke={invalidationActive ? invalidationColor : "rgba(255,255,255,0.12)"}
        strokeWidth={invalidationActive ? "3" : "2"}
        filter={invalidationActive ? "url(#glowBottom)" : "none"}
      />

      {/* Center convergence node */}
      <circle
        cx="200"
        cy="55"
        r="4"
        fill={
          validationActive ? validationColor :
          invalidationActive ? invalidationColor :
          "rgba(255,255,255,0.3)"
        }
      />
    </svg>
  );
};

/**
 * Outcome Card Component
 */
const OutcomeCard = ({ outcomeState, isCorrective }) => {
  const validationColor = isCorrective ? "#FF6B6B" : "#1FA39B";
  const invalidationColor = isCorrective ? "#1FA39B" : "#FF6B6B";

  const getOutcomeConfig = () => {
    switch (outcomeState) {
      case "validated":
        return {
          label: "Validated",
          icon: <CheckIcon size={20} />,
          color: validationColor,
          bgColor: `${validationColor}15`,
          borderColor: validationColor,
        };
      case "invalidated":
        return {
          label: "Invalidated",
          icon: <XIcon size={20} />,
          color: invalidationColor,
          bgColor: `${invalidationColor}15`,
          borderColor: invalidationColor,
        };
      default:
        return {
          label: "Undecidable",
          icon: <HourglassIcon size={20} />,
          color: "#6a7a84",
          bgColor: "rgba(106, 122, 132, 0.1)",
          borderColor: "#6a7a84",
        };
    }
  };

  const config = getOutcomeConfig();

  return (
    <div
      className={`${styles.outcomeCard} ${styles[outcomeState]}`}
      style={{
        '--outcome-color': config.color,
        '--outcome-bg': config.bgColor,
        '--outcome-border': config.borderColor,
      }}
    >
      <span className={styles.outcomeLabel}>Outcome State:</span>
      <span className={styles.outcomeValue}>{config.label}</span>
      <span className={styles.outcomeIcon}>{config.icon}</span>
    </div>
  );
};

/**
 * VerdictPanel Component - Scenario Decision Tree
 */
export default function VerdictPanel({
  scenario,
  probability,
  priceTargets,
  validation,
  invalidation,
  outcomeState = "undecidable",
  verdict,
  isCorrective = false,
  className = "",
}) {
  const parsedContent = useMemo(() => {
    if (verdict && !scenario) {
      return parseVerdictMarkdown(verdict);
    }
    return null;
  }, [verdict, scenario]);

  const displayScenario = scenario || parsedContent?.scenario || "Scenario Analysis";
  const displayValidation = validation || parsedContent?.validation || [];
  const displayInvalidation = invalidation || parsedContent?.invalidation || [];
  const displayProbability = probability || 60;
  const displayPriceTargets = priceTargets || { low: null, high: null };

  const validationColorClass = isCorrective ? styles.coral : styles.teal;
  const invalidationColorClass = isCorrective ? styles.teal : styles.coral;

  const wrapperClass = `${styles.verdictPanelWrapper} ${
    isCorrective ? styles.verdictPanelCorrective : ""
  } ${className}`.trim();

  return (
    <div className={wrapperClass}>
      {/* Logo Header */}
      <div className={styles.logoHeader}>
        <svg className={styles.logoIcon} width="24" height="24" viewBox="0 0 32 32" fill="none">
          <path
            d="M16 4L4 10L16 16L28 10L16 4Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 22L16 28L28 22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 16L16 22L28 16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className={styles.logoText}>VerdictPanel</span>
      </div>

      {/* Main Content */}
      <div className={styles.decisionTreeContainer}>
        {/* Section Title */}
        <h2 className={styles.sectionTitle}>Scenario Decision Tree</h2>

        {/* Thesis Hero Card */}
        <div className={styles.thesisCard}>
          <div className={styles.thesisHeader}>
            <span className={styles.thesisLabel}>Main Scenario:</span>
            <span className={styles.thesisScenario}>{displayScenario}</span>
          </div>

          <div className={styles.probabilityDisplay}>
            <span className={styles.probabilityValue}>{displayProbability}%</span>
            <span className={styles.probabilityLabel}>Confidence</span>
          </div>

          {(displayPriceTargets.low || displayPriceTargets.high) && (
            <div className={styles.priceTargets}>
              Price Targets: ${displayPriceTargets.low?.toFixed(2) || "—"} - ${displayPriceTargets.high?.toFixed(2) || "—"}
            </div>
          )}
        </div>

        {/* Top Decision Tree SVG */}
        <DecisionTreeSVG isCorrective={isCorrective} outcomeState={outcomeState} />

        {/* Branch Cards */}
        <div className={styles.branchCards}>
          {/* Validation Branch */}
          <div className={`${styles.branchCard} ${validationColorClass} ${outcomeState === "validated" ? styles.activeCard : ""} ${outcomeState === "invalidated" ? styles.fadedCard : ""}`}>
            <div className={styles.branchHeader}>
              <span className={`${styles.branchIcon} ${validationColorClass}`}>
                <CheckIcon />
              </span>
              <span className={styles.branchTitle}>Validation</span>
            </div>
            <ul className={styles.branchList}>
              {displayValidation.map((item, idx) => (
                <li key={idx} className={styles.branchItem}>
                  <span className={`${styles.bulletDot} ${validationColorClass}`} />
                  <InlineMarkdown
                    text={typeof item === 'string' ? item : item.text}
                    highlightClass={`${styles.highlight} ${validationColorClass}`}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Invalidation Branch */}
          <div className={`${styles.branchCard} ${invalidationColorClass} ${outcomeState === "invalidated" ? styles.activeCard : ""} ${outcomeState === "validated" ? styles.fadedCard : ""}`}>
            <div className={styles.branchHeader}>
              <span className={`${styles.branchIcon} ${invalidationColorClass}`}>
                <XIcon />
              </span>
              <span className={styles.branchTitle}>Invalidation</span>
            </div>
            <ul className={styles.branchList}>
              {displayInvalidation.map((item, idx) => (
                <li key={idx} className={styles.branchItem}>
                  <span className={`${styles.bulletDot} ${invalidationColorClass}`} />
                  <InlineMarkdown
                    text={typeof item === 'string' ? item : item.text}
                    highlightClass={`${styles.highlight} ${invalidationColorClass}`}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Connection SVG */}
        <BottomConnectionSVG isCorrective={isCorrective} outcomeState={outcomeState} />

        {/* Outcome State */}
        <div className={styles.outcomeContainer}>
          <OutcomeCard outcomeState={outcomeState} isCorrective={isCorrective} />
        </div>
      </div>

      {/* Footer Badge */}
      <div className={styles.verdictFooter}>
        <span className={`${styles.verdictBadge} ${styles[outcomeState]}`}>
          {outcomeState === "validated" && <CheckIcon size={14} />}
          {outcomeState === "invalidated" && <XIcon size={14} />}
          {outcomeState === "undecidable" && <WarningIcon />}
          <span>Analysis Verdict</span>
        </span>
      </div>
    </div>
  );
}
