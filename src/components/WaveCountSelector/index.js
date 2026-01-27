/**
 * WaveCountSelector Component - PREMIUM REDESIGN
 *
 * UI component for selecting wave count scenarios
 * Pure presentation - state managed via hooks
 *
 * @component
 * @example
 * import { WaveCountSelector } from '@site/src/components/WaveCountSelector';
 *
 * <WaveCountSelector
 *   showProbability={true}
 *   onScenarioChange={(id) => console.log(id)}
 * />
 */

import { memo } from "react";
import { useWaveCount } from "@site/src/hooks/useWaveCount";
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

  return (
    <div className={styles.selectorWrapper} role="tablist" aria-label="Wave Count Scenarios">
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
