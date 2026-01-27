/**
 * WaveCountSelector Component - PREMIUM REDESIGN
 *
 * UI component for selecting wave count scenarios
 * Uses Context + Composition pattern via TickerConfigProvider
 *
 * @component
 * @example
 * // With context (preferred):
 * <TickerConfigProvider config={nbisConfig}>
 *   <WaveCountSelector
 *     showProbability={true}
 *     onScenarioChange={(id) => console.log(id)}
 *   />
 * </TickerConfigProvider>
 */

import { memo } from "react";
import { useWaveCount } from "@site/src/hooks/useWaveCount";
import { useTickerConfig } from "@site/src/hooks/useTickerConfig";
import styles from "./styles.module.css";

// ============================================================================
// WAVE COUNT SCENARIO LINK
// ============================================================================
const WaveCountLink = memo(({ scenario, active, onClick }) => {
  // Determine color mode based on scenario mode
  const colorMode = scenario.mode === "MOTIVE" ? "motive" : "corrective";

  // Build class names
  const linkClasses = [
    styles.scenarioLink,
    active && styles.active,
    active && styles[colorMode],
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <a
      href={`#wave-${scenario.id}`}
      className={linkClasses}
      aria-current={active ? "true" : undefined}
      onClick={(e) => {
        // Prevent default scroll behavior but allow URL update via hook
        e.preventDefault();
        onClick?.(scenario.id);
      }}
      role="tab"
      aria-selected={active}
    >
      <div className={styles.scenarioContent}>
        <span className={styles.scenarioLabel}>{scenario.label}</span>
        <span className={styles.scenarioProbability}>{scenario.probability}</span>
      </div>
    </a>
  );
});

WaveCountLink.displayName = "WaveCountLink";

// ============================================================================
// WAVE COUNT SELECTOR MAIN COMPONENT
// ============================================================================
export const WaveCountSelector = ({
  showProbability = true,
  onScenarioChange,
}) => {
  const { activeId, items, switchScenario, isLoading, error } = useWaveCount();
  const { ticker } = useTickerConfig();

  const handleSelect = (scenarioId) => {
    switchScenario(scenarioId);
    onScenarioChange?.(scenarioId);
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading scenarios...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  // Build accessible label with ticker if available
  const ariaLabel = ticker
    ? `${ticker} Wave Count Scenarios`
    : "Wave Count Scenarios";

  return (
    <div className={styles.selectorWrapper} role="tablist" aria-label={ariaLabel}>
      <div className={styles.selectorLabel}>Wave Count</div>
      <div className={styles.itemsContainer}>
        {items.map((scenario) => (
          <WaveCountLink
            key={scenario.id}
            scenario={scenario}
            active={activeId === scenario.id}
            onClick={handleSelect}
            showProbability={showProbability}
          />
        ))}
      </div>
    </div>
  );
};

export default WaveCountSelector;
