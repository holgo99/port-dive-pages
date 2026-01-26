import React, { useState, useMemo } from "react";
import { TickerIcon } from "@site/src/components/TickerIcon";
import { PORTDIVE_THEME } from "@site/src/components/PortDiveTheme";
import styles from "./styles.module.css";

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function TickerHeader({
  tickerIconUrl,
  ticker = "NBIS",
  tickerName = "Nebius Group N.V.",
  theme = { PORTDIVE_THEME },
  title,
}) {
  const [showWordmark, setShowWordmark] = useState(true);

  return (
    <div className={styles.tickerHeaderWrapper}>
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <TickerIcon
            tickerIconUrl={tickerIconUrl}
            ticker={ticker}
            tickerName={tickerName}
            showWordmark={showWordmark}
            theme={theme}
          />
          <div
            style={{
              borderLeft: `2px solid ${theme.border}`,
              paddingLeft: "16px",
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: 700,
                color: theme.text,
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {title}
            </h1>
            <span
              style={{
                fontSize: "11px",
                padding: "4px 10px",
                background: theme.surfaceAlt,
                borderRadius: "6px",
                color: theme.textSecondary,
                fontWeight: 600,
                border: `1px solid ${theme.border}`,
              }}
            >
              1D
            </span>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: "13px",
                color: theme.textSecondary,
              }}
            >
              Apr 2025 → Jun 2026 (Projection) | Target: $
            </p>
          </div>
        </div>
      </header>
    </div>
  );
}
