import React, {
  useState,
  useMemo,
  useCallback,
  memo,
  useRef,
  useEffect,
} from "react";
import { ChartCanvas } from "@site/src/components/ChartCanvas";
import { PORTDIVE_THEME } from "@site/src/components/PortDiveTheme";

import OHLCV_DATA from "./nasdaq-nbis-1d-ohlcv_indicators.json";

import { useColorMode } from "@docusaurus/theme-common";
import styles from "./styles.module.css";

// ============================================================================
// MAIN COMPONENT - REFACTORED
// ============================================================================
export function WaveCountChartChart({ colorMode = "dark" }) {
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
    </div>
  );
}

export default function WaveCountChartOverlayWrapper(props) {
  const { colorMode } = useColorMode();

  return <WaveCountChartOverlay {...props} colorMode={colorMode} />;
}
