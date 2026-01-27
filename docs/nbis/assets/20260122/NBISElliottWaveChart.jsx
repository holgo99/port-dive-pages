import React, {
  useState,
  useMemo,
  useCallback,
  memo,
  useRef,
  useEffect,
} from "react";
import { PORTDIVE_THEME } from "@site/src/components/PortDiveTheme";

// ============================================================================
// OHLCV DATA WITH PRE-CALCULATED INDICATORS - DO NOT MODIFY VALUES
// ============================================================================
import OHLCV_DATA from "./nasdaq-nbis-1d-ohlcv_indicators.json";

// ============================================================================
// WAVE COUNT CONFIGURATIONS
// ============================================================================
import WAVE_COUNTS_JSON from "./nbis-wave-counts.json";

const resolveThemeReferences = (obj) => {
  if (typeof obj !== "object" || obj === null) return obj;

  if (Array.isArray(obj)) {
    return obj.map(resolveThemeReferences);
  }

  const resolved = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string" && value.startsWith("PORTDIVE_THEME.")) {
      const themeKey = value.replace("PORTDIVE_THEME.", "");
      resolved[key] = PORTDIVE_THEME[themeKey] || value;
    } else if (typeof value === "object") {
      resolved[key] = resolveThemeReferences(value);
    } else {
      resolved[key] = value;
    }
  }
  return resolved;
};

// Process on import
const WAVE_COUNTS = resolveThemeReferences(WAVE_COUNTS_JSON);

const dateString = formatTimestamp(OHLCV_DATA.at(-1).timestamp);

function formatTimestamp(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ============================================================================
// CHECKBOX TOGGLE COMPONENT (Styled like screenshot)
// ============================================================================
const CheckboxToggle = memo(
  ({ label, checked, onChange, color = PORTDIVE_THEME.primary, theme }) => (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
        padding: "8px 14px",
        border: "none",
        background: "transparent",
        transition: "all 0.15s ease",
        userSelect: "none",
      }}
    >
      <span
        style={{
          width: "18px",
          height: "18px",
          borderRadius: "4px",
          border: `2px solid ${checked ? color : theme.textMuted}`,
          background: checked ? color : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.15s ease",
          flexShrink: 0,
        }}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 6L5 8.5L9.5 3.5"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "13px",
          fontWeight: 500,
          color: checked ? color : theme.textSecondary,
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: color,
            opacity: checked ? 1 : 0.5,
          }}
        />
        {label}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
      />
    </label>
  ),
);

// ============================================================================
// CURRENT PRICE CARD COMPONENT
// ============================================================================
const CurrentPriceCard = ({ price, change, target, theme, isDarkMode }) => {
  const isTargetPositive = useMemo(() => {
    return target >= price;
  }, [target, price]);
  const progressToTarget = useMemo(() => {
    return Math.min(Math.max(((target - price) / price) * 100, -100), 100);
  }, [target, price]);
  const isPositive = change >= 0;

  return (
    <div
      style={{
        background: isTargetPositive
          ? theme.primaryGradient
          : theme.secondaryGradient,
        borderRadius: "12px",
        padding: "24px",
        border: `1px solid ${theme.border}`,
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          color: theme.textSecondary,
          textTransform: "uppercase",
          letterSpacing: "1px",
          marginBottom: "8px",
          fontWeight: 600,
        }}
      >
        Last close
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <div
          style={{
            fontSize: "48px",
            fontWeight: 700,
            color: isTargetPositive
              ? PORTDIVE_THEME.primaryLight
              : PORTDIVE_THEME.secondary,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          ${price.toFixed(2)}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "6px 12px",
            borderRadius: "6px",
            background: isPositive
              ? "rgba(31, 163, 155, 0.15)"
              : "rgba(255, 107, 107, 0.15)",
            color: isPositive
              ? PORTDIVE_THEME.primary
              : PORTDIVE_THEME.secondary,
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {isPositive ? "↑" : "↓"} {Math.abs(change).toFixed(2)}%
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        <div
          style={{
            height: "8px",
            background: theme.border,
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <div
            key={`progress-${progressToTarget}`}
            style={{
              width: `${Math.abs(progressToTarget)}%`,
              marginLeft: isTargetPositive ? "0" : "auto",
              height: "100%",
              background: `linear-gradient(90deg, ${isTargetPositive ? PORTDIVE_THEME.primary : PORTDIVE_THEME.secondaryLight} 0%, ${isTargetPositive ? PORTDIVE_THEME.primaryLight : PORTDIVE_THEME.secondary} 100%)`,
              borderRadius: "4px",
              transition: "width 0.5s ease",
              willChange: "width",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "10px",
            fontSize: "12px",
          }}
        >
          <span>{progressToTarget.toFixed(0)}% to Target</span>
          <span>Target: ${target.toFixed(2)}</span>
        </div>
      </div>
      <div
        style={{
          marginTop: "12px",
          fontSize: "11px",
          color: theme.textSecondary,
        }}
      >
        Daily Close • Last updated at: {dateString}
      </div>
    </div>
  );
};

// ============================================================================
// FIBONACCI LEVELS PANEL
// ============================================================================
const FibonacciLevelsPanel = memo(({ currentPrice, theme }) => {
  const peak = 141.1;
  const low = 75.25;
  const range = peak - low;

  const levels = [
    { ratio: 0, price: peak, label: "0%" },
    { ratio: 0.236, price: peak - range * 0.236, label: "23.6%" },
    { ratio: 0.382, price: peak - range * 0.382, label: "38.2%" },
    { ratio: 0.5, price: peak - range * 0.5, label: "50%" },
    { ratio: 0.618, price: peak - range * 0.618, label: "61.8%" },
    { ratio: 0.786, price: peak - range * 0.786, label: "78.6%" },
    { ratio: 1, price: low, label: "100%" },
  ];

  const getCurrentLevel = () => {
    for (let i = 0; i < levels.length - 1; i++) {
      if (currentPrice <= levels[i].price && currentPrice > levels[i + 1].price)
        return i;
    }
    return levels.length - 1;
  };

  const currentLevelIdx = getCurrentLevel();

  return (
    <div
      style={{
        background: theme.surface,
        borderRadius: "12px",
        padding: "16px",
        border: `1px solid ${theme.border}`,
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          color: theme.textSecondary,
          textTransform: "uppercase",
          letterSpacing: "1px",
          marginBottom: "12px",
          fontWeight: 600,
        }}
      >
        Fibonacci Levels
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {levels.map((level, idx) => {
          const isCurrentLevel = idx === currentLevelIdx;
          const isSolid =
            level.ratio === 0 || level.ratio === 1 || level.ratio === 0.618;

          return (
            <div
              key={level.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px",
                borderRadius: "4px",
                background: isCurrentLevel
                  ? "rgba(255, 107, 107, 0.1)"
                  : "transparent",
              }}
            >
              <span
                style={{
                  width: "45px",
                  fontSize: "11px",
                  color: isCurrentLevel
                    ? PORTDIVE_THEME.secondary
                    : theme.textSecondary,
                  fontWeight: isCurrentLevel ? 600 : 400,
                }}
              >
                {level.label}
              </span>
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: isSolid
                    ? PORTDIVE_THEME.primary
                    : `repeating-linear-gradient(90deg, ${PORTDIVE_THEME.primary} 0px, ${PORTDIVE_THEME.primary} 4px, transparent 4px, transparent 8px)`,
                  opacity: isSolid ? 0.6 : 0.4,
                }}
              />
              <span
                style={{
                  fontSize: "12px",
                  fontFamily: "monospace",
                  color: isCurrentLevel ? PORTDIVE_THEME.secondary : theme.text,
                  fontWeight: isCurrentLevel ? 600 : 400,
                }}
              >
                ${level.price.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

// ============================================================================
// ANALYSIS METRICS ROW
// ============================================================================
const AnalysisMetricsRow = memo(({ metrics, theme }) => {
  return (
    <div
      style={{
        background: theme.surface,
        borderRadius: "12px",
        padding: "16px",
        border: `1px solid ${theme.border}`,
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          color: theme.textSecondary,
          textTransform: "uppercase",
          letterSpacing: "1px",
          marginBottom: "12px",
          fontWeight: 600,
        }}
      >
        Analysis Metrics
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "12px",
        }}
      >
        {metrics.map((m, idx) => (
          <div
            key={idx}
            style={{
              padding: "12px",
              borderRadius: "8px",
              background: m.isNegative
                ? theme.secondaryGradient
                : "rgba(31, 163, 155, 0.05)",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                color: theme.textSecondary,
                textTransform: "uppercase",
                marginBottom: "4px",
              }}
            >
              {m.label}
            </div>
            <div
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: m.isNegative
                  ? PORTDIVE_THEME.secondary
                  : PORTDIVE_THEME.primary,
              }}
            >
              {m.value}
            </div>
            <div
              style={{
                fontSize: "9px",
                color: theme.textSecondary,
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              {m.indicator && (
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: PORTDIVE_THEME.primary,
                  }}
                />
              )}
              {m.sublabel}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

// ============================================================================
// WAVE TIMELINE PANEL
// ============================================================================
const WaveTimelinePanel = memo(({ waves, theme }) => {
  return (
    <div
      style={{
        background: theme.surface,
        borderRadius: "12px",
        padding: "16px",
        border: `1px solid ${theme.border}`,
        width: "100%",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          color: theme.textSecondary,
          textTransform: "uppercase",
          letterSpacing: "1px",
          marginBottom: "12px",
          fontWeight: 600,
        }}
      >
        Wave Timeline
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 3fr))",
          gap: "10px",
        }}
      >
        {waves.map((wave, idx) => (
          <div
            key={idx}
            style={{
              padding: "12px",
              borderRadius: "8px",
              background: `${wave.color}15`,
              borderLeft: `3px solid ${wave.color}`,
            }}
          >
            <div
              style={{ fontSize: "12px", fontWeight: 600, color: wave.color }}
            >
              {wave.label}
            </div>
            <div
              style={{
                fontSize: "10px",
                color: theme.textSecondary,
                marginTop: "4px",
              }}
            >
              {wave.range}
            </div>
            <div
              style={{
                marginTop: "8px",
                fontSize: "9px",
                padding: "3px 8px",
                borderRadius: "4px",
                background: wave.color,
                color: "#fff",
                display: "inline-block",
              }}
            >
              {wave.status}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: "10px",
          fontSize: "10px",
          color: theme.textSecondary,
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: PORTDIVE_THEME.primary,
          }}
        />
        #1 WMS PROGRESSION
      </div>
    </div>
  );
});

// ============================================================================
// HELPER: Parse wave count from URL hash
// ============================================================================
const getWaveCountFromHash = () => {
  if (typeof window === "undefined") return "primary";
  const hash = window.location.hash;
  if (hash.startsWith("#wave-")) {
    const countId = hash.replace("#wave-", "");
    if (WAVE_COUNTS[countId]) {
      return countId;
    }
  }
  return "primary";
};

// ============================================================================
// MAIN COMPONENT - REFACTORED
// ============================================================================
export default function NBISElliottWaveChart({ colorMode = "dark" }) {
  // Use Docusaurus colorMode prop or default to dark
  const isDarkMode = colorMode === "dark";
  const theme = isDarkMode ? PORTDIVE_THEME.dark : PORTDIVE_THEME.light;

  const [activeWaveCount, setActiveWaveCount] = useState(() =>
    getWaveCountFromHash(),
  );
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(1000);
  const [showWordmark, setShowWordmark] = useState(true);

  const [analysisState, setAnalysisState] = useState({
    showMotiveWaves: true,
    showCorrectiveWaves: true,
    showMinorWaves: true,
    showFibRetracements: false,
    showFibExtensions: true,
    showInvalidationLevel: true,
    showTargetBand: true,
  });

  // Listen for hash changes (browser back/forward, direct link)
  useEffect(() => {
    const handleHashChange = () => {
      const countId = getWaveCountFromHash();
      setActiveWaveCount(countId);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Responsive container width
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
        setShowWordmark(containerRef.current.offsetWidth >= 768);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const toggleAnalysis = useCallback((key) => {
    setAnalysisState((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const currentPrice = OHLCV_DATA[OHLCV_DATA.length - 1].close;
  const prevClose = OHLCV_DATA[OHLCV_DATA.length - 2].close;
  const priceChange = ((currentPrice - prevClose) / prevClose) * 100;
  const activeCount = WAVE_COUNTS[activeWaveCount] || WAVE_COUNTS.primary;
  const projectedPrice = activeCount.projected.at(-1).price;

  return (
    <div
      ref={containerRef}
      style={{
        background: theme.bg,
        marginBottom: "24px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        color: theme.text,
        borderRadius: "16px",
        maxWidth: "100%",
      }}
    >
      {/* Overlay Toggle Controls - Redesigned as checkboxes */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "20px",
          padding: "16px",
          background: theme.surface,
          borderRadius: "12px",
          border: `1px solid ${theme.border}`,
          alignItems: "center",
        }}
      >
        <CheckboxToggle
          label="Motive Waves (65%)"
          checked={analysisState.showMotiveWaves}
          onChange={() => toggleAnalysis("showMotiveWaves")}
          color={PORTDIVE_THEME.primary}
          theme={theme}
        />
        <CheckboxToggle
          label="Corrective (25%)"
          checked={analysisState.showCorrectiveWaves}
          onChange={() => toggleAnalysis("showCorrectiveWaves")}
          color={PORTDIVE_THEME.secondary}
          theme={theme}
        />
        <CheckboxToggle
          label="Minor Waves"
          checked={analysisState.showMinorWaves}
          onChange={() => toggleAnalysis("showMinorWaves")}
          color={PORTDIVE_THEME.primary}
          theme={theme}
        />
        <CheckboxToggle
          label="Fib Retracement"
          checked={analysisState.showFibRetracements}
          onChange={() => toggleAnalysis("showFibRetracements")}
          color={PORTDIVE_THEME.primary}
          theme={theme}
        />
        <CheckboxToggle
          label="Fib Extension"
          checked={analysisState.showFibExtensions}
          onChange={() => toggleAnalysis("showFibExtensions")}
          color={PORTDIVE_THEME.fibonacci.extension}
          theme={theme}
        />
      </div>

      {/* Main Chart */}
      <div
        style={{
          marginBottom: "8px",
          width: "100%",
        }}
      >
        <ChartCanvas
          data={OHLCV_DATA}
          analysisState={analysisState}
          activeWaveCount={activeWaveCount}
          theme={theme}
          isDarkMode={isDarkMode}
          containerWidth={containerWidth - 48} // Account for padding
        />
      </div>

      {/* Chart Footer Legend */}
      <footer
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "24px",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          background: theme.surface,
          borderRadius: "12px",
          border: `1px solid ${theme.border}`,
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "20px",
                height: "4px",
                background: PORTDIVE_THEME.primary,
                borderRadius: "2px",
              }}
            />
            <span
              style={{
                fontSize: "12px",
                color: theme.textSecondary,
                fontWeight: 500,
              }}
            >
              Primary (60%)
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "20px",
                height: "4px",
                background: PORTDIVE_THEME.secondary,
                borderRadius: "2px",
              }}
            />
            <span
              style={{
                fontSize: "12px",
                color: theme.textSecondary,
                fontWeight: 500,
              }}
            >
              Alt #1 (30%)
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "20px",
                height: "4px",
                background: PORTDIVE_THEME.fibonacci.extension,
                borderRadius: "2px",
              }}
            />
            <span
              style={{
                fontSize: "12px",
                color: theme.textSecondary,
                fontWeight: 500,
              }}
            >
              Extensions
            </span>
          </div>
        </div>

        <div
          style={{
            fontSize: "12px",
            color: theme.textSecondary,
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <span>
            <span style={{ color: PORTDIVE_THEME.primary, fontWeight: 600 }}>
              Target:
            </span>{" "}
            ${projectedPrice.toFixed(2)}
          </span>
          <span>
            <span style={{ color: PORTDIVE_THEME.secondary, fontWeight: 600 }}>
              Invalidation:
            </span>{" "}
            $75.25
          </span>
        </div>
      </footer>

      {/* Info Panel */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "8px",
          width: "100%",
          marginBottom: "20px",
        }}
      >
        <CurrentPriceCard
          price={currentPrice}
          change={priceChange}
          target={projectedPrice}
          theme={theme}
          isDarkMode={isDarkMode}
        />
        <FibonacciLevelsPanel currentPrice={currentPrice} theme={theme} />
        {activeCount.metrics.length > 0 && (
          <AnalysisMetricsRow metrics={activeCount.metrics} theme={theme} />
        )}
      </div>

      {/* Info Panel 2 */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          width: "100%",
          marginBottom: "20px",
        }}
      >
        {activeCount.waves.length > 0 && (
          <WaveTimelinePanel waves={activeCount.waves} theme={theme} />
        )}
      </div>

      {/* Verdict Panel */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          width: "100%",
        }}
      >
        {activeCount.verdict.length > 0 && (
          <VerdictPanel
            verdict={activeCount.verdict}
            isCorrective={activeCount.mode === "CORRECTIVE"}
          />
        )}
      </div>
    </div>
  );
}
