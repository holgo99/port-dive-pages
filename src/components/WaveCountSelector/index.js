/**
 *
 * @component
 * UI component for selecting wave count scenarios
 * Pure presentation - state managed via hooks
 *
 * @example
 *
 */

import { memo } from "react";
import { useWaveCount } from "@site/src/hooks/useWaveCount";
import { PORTDIVE_THEME } from "@site/src/components/PortDiveTheme";
import styles from "./styles.module.css";

// ============================================================================
// WAVE COUNT SELECTOR LINKS
// ============================================================================
const WaveCountLink = memo(({ count, active, theme }) => {
  const isAlt = count.id === "alt1";

  return (
    <a
      href={`#wave-${count.id}`}
      aria-current={active ? "true" : undefined}
      style={{
        padding: "12px 16px",
        borderRadius: "8px",
        border: active
          ? `2px solid ${count.color}`
          : `1px solid ${theme.border}`,
        background: active
          ? isAlt
            ? `linear-gradient(135deg, ${count.color} 0%, ${PORTDIVE_THEME.secondaryLight} 100%)`
            : `${count.color}18`
          : "transparent",
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.2s ease",
        flex: "1 1 auto",
        minWidth: "120px",
        textDecoration: "none",
        display: "block",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span
          style={{
            color: active ? (isAlt ? "#fff" : count.color) : theme.text,
            fontWeight: 600,
            fontSize: "13px",
          }}
        >
          {count.label}
        </span>
        <span
          style={{
            color:
              active && isAlt ? "rgba(255,255,255,0.85)" : theme.textSecondary,
            fontSize: "11px",
            fontWeight: 500,
          }}
        >
          {count.probability}
        </span>
      </div>
    </a>
  );
});

// ============================================================================
// WAVE COUNT SELECTOR MAIN COMPONENT
// ============================================================================
export const WaveCountSelector = ({
  showProbability = true,
  onScenarioChange,
  theme = { PORTDIVE_THEME },
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
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginBottom: "20px",
        padding: "16px",
        background: theme.surface,
        borderRadius: "12px",
        border: `1px solid ${theme.border}`,
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          color: theme.textSecondary,
          textTransform: "uppercase",
          letterSpacing: "1px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          marginRight: "8px",
        }}
      >
        Wave Count
      </div>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", flex: 1 }}>
        {items.map((count) => (
          <WaveCountLink
            key={count.id}
            count={count}
            active={activeId === count.id}
            theme={theme}
          />
        ))}
      </div>
    </div>
  );
};
