import React, {
  useState,
  useMemo,
  useCallback,
  memo,
  useRef,
  useEffect,
} from "react";
import VerdictPanel from "@site/src/components/VerdictPanel";

// ============================================================================
// OHLCV DATA - DO NOT MODIFY VALUES
// ============================================================================
import OHLCV_DATA from "./ohlcv-data.json";

const tickerIconUrl = "/portdive-pages/img/nbis/nbis-icon.svg";
const portdiveLogoUrl = "/portdive-pages/img/portdive-logo-primary.svg";
const dateString = formatTimestamp(OHLCV_DATA.at(-1).timestamp);
// ============================================================================
// PORTDIVE BRAND COLORS - LOCKED (DO NOT CHANGE)
// ============================================================================
const PORTDIVE_COLORS = {
  light: {
    bg: "#f8faf9",
    surface: "#ffffff",
    surfaceAlt: "#f0f4f2",
    text: "#0a1a1f",
    textSecondary: "#5a6570",
    textMuted: "#8a9199",
    border: "rgba(10, 26, 31, 0.12)",
    grid: "rgba(10, 26, 31, 0.06)",
    hover: "rgba(31, 163, 155, 0.08)",
    primaryGradient: "linear-gradient(135deg, #ffffff 0%, #f0f4f2 100%)",
    secondaryGradient:
      "linear-gradient(135deg, rgba(255, 107, 107, 0.25) 0%, #ffffff 100%)",
  },
  dark: {
    bg: "#0a1a1f",
    surface: "#0f2028",
    surfaceAlt: "#142830",
    text: "#f8faf9",
    textSecondary: "#a8b4bc",
    textMuted: "#6a7a84",
    border: "rgba(248, 250, 249, 0.12)",
    grid: "rgba(248, 250, 249, 0.04)",
    hover: "rgba(31, 163, 155, 0.15)",
    primaryGradient: "linear-gradient(135deg, #1a2a35 0%, #0f1a1f 100%)",
    secondaryGradient:
      "linear-gradient(135deg, rgba(255, 107, 107, 0.25) 0%, #1a2a35 100%)",
  },
  primary: "#1FA39B",
  primaryLight: "#25b8ae",
  secondary: "#FF6B6B",
  secondaryLight: "#FF8E8E",
  candleUp: "#1FA39B",
  candleDown: "#FF6B6B",
  volume: { up: "rgba(31, 163, 155, 0.45)", down: "rgba(255, 107, 107, 0.45)" },
  movingAverage: { fast: "#3D72FF", slow: "#F9E95E" },
  fibonacci: { primary: "#1FA39B", extension: "#00D9D9" },
  invalidation: "#FF6B6B",
  target: "#1FA39B",
  altCount: "#FF6B6B",
};

// ============================================================================
// WAVE COUNT CONFIGURATIONS
// ============================================================================
const WAVE_COUNTS = {
  primary: {
    id: "primary",
    label: "Bullish continuation",
    probability: "60%",
    mode: "MOTIVE",
    color: PORTDIVE_COLORS.primary,
    pivots: {
      wave1Start: { idx: 1, price: 18.31 },
      wave1Peak: { idx: 58, price: 55.75, label: "1" },
      wave2Low: { idx: 66, price: 43.89, label: "2" },
      wave3Peak: { idx: 130, price: 141.1, label: "3" },
      wave4Low: { idx: 177, price: 75.25, label: "4" },
    },
    minorWaves: {
      minorIPeak: { idx: 197, price: 110.5, label: "i" },
      minorIILow: { idx: 199, price: 93.1, label: "ii" },
    },
    projectedTarget: 150.13,
    projectedLabel: "5",
    projectedStart: { idx: 177, price: 75.25 },
    projectedTargetBand: { startPrice: 135.83, endPrice: 158.45 },
    description:
      "5-wave impulse (1)-(2)-(3)-(4) complete, now in (5) early stages",
    waves: [
      {
        label: "WAVE (1)",
        range: "$18.31 → $55.75",
        status: "COMPLETE",
        color: PORTDIVE_COLORS.primary,
      },
      {
        label: "WAVE (2)",
        range: "$55.75 → $43.89",
        status: "COMPLETE",
        color: PORTDIVE_COLORS.primary,
      },
      {
        label: "WAVE (3)",
        range: "$43.89 → $141.10",
        status: "COMPLETE",
        color: PORTDIVE_COLORS.primary,
      },
      {
        label: "WAVE (4)",
        range: "$141.10 → $75.25",
        status: "COMPLETE",
        color: PORTDIVE_COLORS.primary,
      },
      {
        label: "WAVE (5)",
        range: "$75.25 → >$135.83",
        status: "IN PROGRESS",
        color: "#F59E0B",
      },
    ],
    metrics: [
      {
        label: "Expected Value",
        value: "+12.9%",
        sublabel: "Wave (5) Continuation",
        indicator: true,
      },
      {
        label: "Sharpe Ratio",
        value: "0.54",
        sublabel: "EV / Hard-Stop Risk",
        color: "gradient",
      },
      {
        label: "Price Momentum",
        value: "+6.2%",
        sublabel: "From minor ii low ($93.10)",
      },
      {
        label: "Risk",
        value: "-9.6%",
        sublabel: "Probability-Weighted (Hard Stop)",
        isNegative: true,
      },
    ],
    verdict: `# Primary scenario: Bullish Continuation

## Thesis (60%)

**Most likely path:** minor iii lifts toward **$128 → $135/$141**, then minor iv pulls back (ideally holds above ~$110 or ~$103), then minor v attempts **$141+** and potentially **$150–158**.

## **Validation**

* Clean impulsive break and hold above **$141.10**

## **Invalidation**

* **Structural warning:** Loss of **$93.10** increases bearish odds
* **Minor degree invalidation:** Below **$75.25** breaks structure`,
  },
  alt1: {
    id: "alt1",
    label: "Corrective regime",
    probability: "30%",
    mode: "CORRECTIVE",
    color: PORTDIVE_COLORS.secondary,
    pivots: {
      wave1Start: { idx: 130, price: 141.1 },
      waveALow: { idx: 177, price: 75.25, label: "A" },
      waveBPeak: { idx: 197, price: 110.5, label: "B" },
    },
    minorWaves: {},
    projectedTarget: 64,
    projectedLabel: "C",
    projectedStart: { idx: 197, price: 110.5 },
    projectedTargetBand: { startPrice: 60, endPrice: 75.25 },
    description: "A–B–C / W–X–Y corrective regime",
    waves: [
      {
        label: "WAVE (A)",
        range: "$141.10 → $75.25",
        status: "COMPLETE",
        color: PORTDIVE_COLORS.secondary,
      },
      {
        label: "WAVE (B)",
        range: "$75.25 → $110.50",
        status: "COMPLETE",
        color: PORTDIVE_COLORS.secondary,
      },
      {
        label: "WAVE (C)",
        range: "$110.50 → <$75.25",
        status: "PROJECTED",
        color: "#F59E0B",
      },
      {
        label: "INVALIDATION",
        range: "$98.87 → $141.10",
        status: "CLEAN IMPULSIVE BREAK",
        color: PORTDIVE_COLORS.primary,
      },
    ],
    metrics: [
      {
        label: "Expected Value",
        value: "-9.1%",
        sublabel: "ABC / WXY Downside Risk",
        indicator: true,
      },
      {
        label: "Sharpe Ratio",
        value: "-0.38",
        sublabel: "EV / Worst-Case Risk",
        color: "gradient",
      },
      {
        label: "Price Momentum",
        value: "-10.5%",
        sublabel: "Below prior swing high ($110.50)",
        isNegative: true,
      },
      {
        label: "Risk",
        value: "-12.6%",
        sublabel: "Probability-Weighted (C Target)",
        isNegative: true,
      },
    ],
    verdict: `# Oct high was a completed 5-wave *blowoff*, and we’re in an A–B–C / W–X–Y corrective regime

## Thesis (30%)

The vertical Sep–Oct expansion behaves like a terminal/mania leg. Under this count:

* **$141.10** = terminal top (end of a higher-degree 5 or C)
* **$75.25** = Wave A (or W) low
* The current rise is **Wave B (or X)**, and **another Wave C (or Y)** down can still occur after B matures.
* A typical C target = **A length equality** or **1.272×A** from B high (We need the eventual B high to compute precisely, but likely downside zones would be **$81.0**, then **$64.7** as the deeper “78.6% shelf” of the prior Wave (3) retrace grid.)

## **Validation**

* Failure/rejection in **$135 – $141** zone with momentum divergence
* Subsequent breakdown below **$93 → $88 → $81** (key fib shelves), turning the structure into a clear 3-wave.

## **Invalidation**

* Clean impulsive break and hold above **$141.10** with rising momentum (would strongly favor the primary “(5)” continuation).`,
  },
  alt2: {
    id: "alt2",
    label: "Wave (4) complex not finished (triangle/combination)",
    probability: "10%",
    mode: "MOTIVE",
    color: PORTDIVE_COLORS.primary,
    pivots: {
      wave1Start: { idx: 1, price: 18.31 },
      wave1Peak: { idx: 58, price: 55.75, label: "1" },
      wave2Low: { idx: 66, price: 43.89, label: "2" },
      wave3ExtPeak: { idx: 130, price: 141.1, label: "3" },
    },
    minorWaves: {},
    projectedTarget: 92.5,
    projectedLabel: "4",
    projectedStart: { idx: 130, price: 141.1 },
    projectedTargetBand: { startPrice: 75.25, endPrice: 92.5 },
    description: "Wave (4) complex not finished (triangle/combination)",
    waves: [
      {
        label: "WAVE (W)",
        range: "$141.10 → $75.25",
        status: "COMPLETE",
        color: PORTDIVE_COLORS.secondary,
      },
      {
        label: "WAVE (X)",
        range: "$75.25 → $110.50",
        status: "COMPLETE",
        color: PORTDIVE_COLORS.secondary,
      },
      {
        label: "WAVE (Y)",
        range: "$110.50 → $92.50",
        status: "PROJECTED",
        color: "#F59E0B",
      },
      {
        label: "WAVE (5)",
        range: "$92.50 → $135.83",
        status: "PROJECTED",
        color: PORTDIVE_COLORS.primary,
      },
      {
        label: "INVALIDATION",
        range: "$125–133 and especially $141",
        status: "CLEAN 5-WAVE RISE ON 1D",
        color: PORTDIVE_COLORS.primary,
      },
    ],
    metrics: [],
    verdict: `# Wave (4) is not finished (triangle/complex combination), and current rally is a B/X leg inside it

## Thesis (10%)

This is a “time-correction” scenario:

* **$75.25** was not the final (4) low, just **C of W** (or A of a larger flat)
* Price chops upward (B/X), then fades again to retest **$80 – $75** before a true (5) begins.

## **Validation**

* Sideways-to-down behavior below **$110 – $113** with overlapping 1D swings (no clean 5-wave lift)
* MACD/RSI staying rangebound

## **Invalidation**

* A clean 5-wave rise on 1D through **$125 – $133** and especially **$141**`,
  },
};

function formatTimestamp(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ============================================================================
// PORTDIVE LOGO COMPONENT
// ============================================================================
const PortDiveLogo = memo(({ size = 48, showWordmark = false, theme }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <img src={portdiveLogoUrl} alt="PortDive Logo" width="48px" />
    {showWordmark && (
      <span
        style={{
          fontSize: size * 0.6,
          fontWeight: 700,
          color: theme.text,
          letterSpacing: "-0.02em",
        }}
      >
        PortDive
      </span>
    )}
  </div>
));

// ============================================================================
// TICKER ICON COMPONENT
// ============================================================================
const TickerIcon = memo(({ size = 48, showWordmark = false, theme }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      whiteSpace: "nowrap",
      flexShrink: 0,
    }}
  >
    <img
      src={tickerIconUrl}
      alt="NBIS Icon"
      width="48px"
      style={{ flexShrink: 0 }}
    />
    <span
      style={{
        fontSize: size * 0.6,
        fontWeight: 700,
        color: theme.text,
        letterSpacing: "-0.02em",
        flexShrink: 0,
      }}
    >
      NBIS
    </span>
    {showWordmark && (
      <>
        &nbsp;•&nbsp;
        <span
          style={{
            fontSize: size * 0.6,
            fontWeight: 700,
            color: theme.text,
            letterSpacing: "-0.02em",
            flexShrink: 0,
          }}
        >
          Nebius Group N.V.
        </span>
      </>
    )}
  </div>
));

// ============================================================================
// CHECKBOX TOGGLE COMPONENT (Styled like screenshot)
// ============================================================================
const CheckboxToggle = memo(
  ({ label, checked, onChange, color = PORTDIVE_COLORS.primary, theme }) => (
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
// WAVE COUNT SELECTOR BUTTONS
// ============================================================================
const WaveCountButton = memo(({ count, active, onClick, theme }) => {
  const isAlt = count.id === "alt1";

  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        padding: "12px 16px",
        borderRadius: "8px",
        border: active
          ? `2px solid ${count.color}`
          : `1px solid ${theme.border}`,
        background: active
          ? isAlt
            ? `linear-gradient(135deg, ${count.color} 0%, ${PORTDIVE_COLORS.secondaryLight} 100%)`
            : `${count.color}18`
          : "transparent",
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.2s ease",
        flex: "1 1 auto",
        minWidth: "120px",
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
    </button>
  );
});

// ============================================================================
// CHART CANVAS COMPONENT - REDESIGNED
// ============================================================================
const ChartCanvas = memo(
  ({
    data,
    analysisState,
    activeWaveCount,
    theme,
    isDarkMode,
    containerWidth,
  }) => {
    // Responsive dimensions - increased height
    const W = Math.max(800, containerWidth || 1000);
    const H = 600; // Increased from 450
    const M = { t: 60, r: 90, b: 80, l: 70 };

    // Add projection space (25% extra for future projection to June 2026)
    const projectionBars = Math.floor(data.length * 0.25);
    const projectionBarsScale = 0.75;
    const totalBars = data.length + projectionBars;

    const cW = W - M.l - M.r;
    const cH = H - M.t - M.b - 60; // More space for volume
    const vH = 50; // Taller volume section

    const processedData = useMemo(
      () => data.map((d) => ({ ...d, date: new Date(d.timestamp * 1000) })),
      [data],
    );
    const pMin = useMemo(
      () => Math.min(...data.map((d) => d.low)) * 0.9,
      [data],
    );
    const pMax = useMemo(
      () => Math.max(...data.map((d) => d.high), 150) * 1.08,
      [data],
    ); // Extended for projections
    const vMax = useMemo(() => Math.max(...data.map((d) => d.volume)), [data]);

    const priceToY = useCallback(
      (p) => M.t + cH * (1 - (p - pMin) / (pMax - pMin)),
      [pMin, pMax, cH],
    );
    const idxToX = useCallback(
      (i) => M.l + (i + 0.5) * (cW / totalBars),
      [cW, totalBars],
    );
    const candleW = Math.max(2.5, Math.min(5, cW / totalBars - 1.5));

    const calcMA = useCallback(
      (period) => {
        const result = [];
        for (let i = period - 1; i < data.length; i++) {
          let sum = 0;
          for (let j = i - period + 1; j <= i; j++) sum += data[j].close;
          result.push({ idx: i, ma: sum / period });
        }
        return result;
      },
      [data],
    );

    const ma50 = useMemo(() => calcMA(50), [calcMA]);
    const ma200 = useMemo(() => calcMA(200), [calcMA]);

    // Get active wave count configuration
    const activeCount = WAVE_COUNTS[activeWaveCount] || WAVE_COUNTS.primary;

    const fibLevels = useMemo(() => {
      const peak = 141.1,
        low = 75.25,
        range = peak - low;
      return [
        { ratio: 0, price: peak, label: "0%", key: true },
        { ratio: 0.236, price: peak - range * 0.236, label: "23.6%" },
        { ratio: 0.382, price: peak - range * 0.382, label: "38.2%" },
        { ratio: 0.5, price: peak - range * 0.5, label: "50%" },
        {
          ratio: 0.618,
          price: peak - range * 0.618,
          label: "61.8%",
          key: true,
        },
        { ratio: 0.786, price: peak - range * 0.786, label: "78.6%" },
        { ratio: 1, price: low, label: "100%", key: true },
      ];
    }, []);

    const fibExtensions = useMemo(() => {
      const wave1Length = 55.75 - 18.31,
        wave4Low = 75.25;
      return [
        { ratio: 1.0, price: wave4Low + wave1Length * 1.0, label: "1.0×" },
        {
          ratio: 1.272,
          price: wave4Low + wave1Length * 1.272,
          label: "1.272×",
        },
        {
          ratio: 1.618,
          price: wave4Low + wave1Length * 1.618,
          label: "1.618×",
          key: true,
        },
      ];
    }, []);

    const priceGrid = [20, 40, 60, 80, 100, 120, 140, 160].filter(
      (p) => p >= pMin && p <= pMax,
    );

    const monthMarkers = useMemo(() => {
      const markers = [];
      let lastMonth = null;
      processedData.forEach((d, i) => {
        const month = d.date.getMonth();
        const year = d.date.getFullYear();
        if (month !== lastMonth) {
          markers.push({
            i,
            label: d.date.toLocaleDateString("en-US", { month: "short" }),
            year: year,
            showYear: month === 0 || i === 0,
          });
          lastMonth = month;
        }
      });

      // Add projection months (Feb-Jun 2026)
      const lastDate = processedData[processedData.length - 1]?.date;
      if (lastDate) {
        const projMonths = ["Feb", "Mar", "Apr", "May", "Jun"];
        projMonths.forEach((m, idx) => {
          markers.push({
            i: data.length + (idx + 1) * Math.floor(projectionBars / 5),
            label: m,
            year: 2026,
            isProjection: true,
          });
        });
      }
      return markers;
    }, [processedData, data.length, projectionBars]);

    const currentPrice = data[data.length - 1]?.close || 98.87;

    // Wave label pill renderer with collision avoidance
    const renderWaveLabel = useCallback(
      (x, y, label, above, color, isMinor = false) => {
        const size = isMinor ? 20 : 26;
        const fontSize = isMinor ? 12 : 14;
        const yOffset = above ? -(size + 8) : size + 8;

        return (
          <g key={`label-${label}`}>
            {/* Connection line */}
            <line
              x1={x}
              y1={y}
              x2={x}
              y2={y + (above ? -8 : 8)}
              stroke={color}
              strokeWidth={1.5}
              strokeDasharray={isMinor ? "3,2" : ""}
            />
            {/* Label pill */}
            {!isMinor && (
              <ellipse
                cx={x}
                cy={y + yOffset}
                rx={size * 0.55}
                ry={size * 0.55}
                stroke={color}
                filter="url(#labelShadow)"
              />
            )}
            <text
              x={x}
              y={y + yOffset + fontSize * 0.35}
              textAnchor="middle"
              fill="#fff"
              fontSize={fontSize}
              fontWeight="700"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              {label}
            </text>
          </g>
        );
      },
      [],
    );

    return (
      <svg
        width="100%"
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{
          background: theme.surface,
          borderRadius: "12px",
          border: `1px solid ${theme.border}`,
          display: "block",
        }}
      >
        <defs>
          {/* Shadow filter for labels */}
          <filter id="labelShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.3" />
          </filter>
          {/* Gradient for projection zone */}
          <linearGradient
            id="projectionGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor={theme.surface} stopOpacity="0" />
            <stop
              offset="100%"
              stopColor={PORTDIVE_COLORS.primary}
              stopOpacity="0.05"
            />
          </linearGradient>
          {/* Target zone gradient */}
          <linearGradient
            id="primaryTargetZoneGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor={PORTDIVE_COLORS.primary}
              stopOpacity="0.12"
            />
            <stop
              offset="100%"
              stopColor={PORTDIVE_COLORS.primaryLight}
              stopOpacity="0.02"
            />
          </linearGradient>
          {/* Target zone gradient */}
          <linearGradient
            id="secondaryTargetZoneGradient"
            x1="0%"
            y1="100%"
            x2="0%"
            y2="0%"
          >
            <stop
              offset="0%"
              stopColor={PORTDIVE_COLORS.secondaryLight}
              stopOpacity="0.12"
            />
            <stop
              offset="100%"
              stopColor={PORTDIVE_COLORS.secondary}
              stopOpacity="0.02"
            />
          </linearGradient>
        </defs>

        {/* Projection zone background */}
        <rect
          x={idxToX(data.length - 1)}
          y={M.t}
          width={cW - (idxToX(data.length - 1) - M.l)}
          height={cH + vH + 10}
          fill="url(#projectionGradient)"
        />

        {/* Price Grid - Cleaner with fewer lines */}
        {priceGrid.map((p) => (
          <g key={p}>
            <line
              x1={M.l}
              x2={W - M.r}
              y1={priceToY(p)}
              y2={priceToY(p)}
              stroke={theme.grid}
              strokeWidth="1"
            />
            <text
              x={M.l - 12}
              y={priceToY(p) + 4}
              textAnchor="end"
              fill={theme.textSecondary}
              fontSize="12"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="500"
            >
              ${p}
            </text>
          </g>
        ))}

        {/* Month markers - Improved readability */}
        {monthMarkers
          .filter((_, i) => i % 2 === 0 || monthMarkers.length < 15)
          .map(({ i, label, year, showYear, isProjection }) => (
            <g key={`${label}-${i}`}>
              <line
                x1={idxToX(i)}
                x2={idxToX(i)}
                y1={M.t}
                y2={H - M.b}
                stroke={isProjection ? PORTDIVE_COLORS.primary : theme.grid}
                strokeWidth="1"
                strokeDasharray={isProjection ? "4,4" : ""}
                opacity={isProjection ? 0.3 : 1}
              />
              <text
                x={idxToX(i)}
                y={H - M.b + 22}
                textAnchor="middle"
                fill={
                  isProjection ? PORTDIVE_COLORS.primary : theme.textSecondary
                }
                fontSize="12"
                fontWeight="500"
                fontFamily="system-ui, -apple-system, sans-serif"
                opacity={isProjection ? 0.7 : 1}
              >
                {label}
              </text>
              {showYear && (
                <text
                  x={idxToX(i)}
                  y={H - M.b + 38}
                  textAnchor="middle"
                  fill={theme.textMuted}
                  fontSize="11"
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  {year}
                </text>
              )}
            </g>
          ))}

        {/* Fibonacci Retracement - Improved visibility */}
        {analysisState.showFibRetracements &&
          fibLevels.map(({ ratio, price, label, key }) => {
            const y = priceToY(price);
            return (
              <g key={`fib-${ratio}`}>
                <line
                  x1={M.l}
                  x2={W - M.r - 60}
                  y1={y}
                  y2={y}
                  stroke={PORTDIVE_COLORS.fibonacci.primary}
                  strokeWidth={key ? 1.5 : 1}
                  strokeDasharray={key ? "" : "6,4"}
                  opacity={key ? 0.5 : 0.25}
                />
                <rect
                  x={W - M.r - 58}
                  y={y - 10}
                  width={50}
                  height={20}
                  rx={4}
                  fill={theme.surface}
                  stroke={PORTDIVE_COLORS.fibonacci.primary}
                  strokeWidth={1}
                  opacity={0.9}
                />
                <text
                  x={W - M.r - 33}
                  y={y + 4}
                  textAnchor="middle"
                  fill={PORTDIVE_COLORS.fibonacci.primary}
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  {label}
                </text>
              </g>
            );
          })}

        {/* Fibonacci Extensions */}
        {analysisState.showFibExtensions &&
          fibExtensions.map(({ ratio, price, label, key }) => {
            const y = priceToY(price);
            if (y < M.t - 20 || y > H - M.b) return null;
            return (
              <g key={`ext-${ratio}`}>
                <line
                  x1={idxToX(data.length * 0.8)}
                  x2={W - M.r}
                  y1={y}
                  y2={y}
                  stroke={PORTDIVE_COLORS.fibonacci.extension}
                  strokeWidth={key ? 2 : 1}
                  strokeDasharray="8,4"
                  opacity={key ? 0.6 : 0.35}
                />
                <rect
                  x={W - M.r + 4}
                  y={y - 12}
                  width={65}
                  height={24}
                  rx={4}
                  fill={
                    key ? PORTDIVE_COLORS.fibonacci.extension : theme.surface
                  }
                  stroke={PORTDIVE_COLORS.fibonacci.extension}
                  strokeWidth={1}
                  opacity={0.95}
                />
                <text
                  x={W - M.r + 36}
                  y={y + 4}
                  textAnchor="middle"
                  fill={key ? "#fff" : PORTDIVE_COLORS.fibonacci.extension}
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  {label} ${price.toFixed(0)}
                </text>
              </g>
            );
          })}

        {/* Target band */}
        {analysisState.showTargetBand && (
          <g>
            <rect
              x={idxToX(data.length - 20)}
              y={priceToY(activeCount.projectedTargetBand.endPrice)}
              width={cW - (idxToX(data.length - 20) - M.l) - 20}
              height={
                priceToY(activeCount.projectedTargetBand.startPrice) -
                priceToY(activeCount.projectedTargetBand.endPrice)
              }
              fill={
                activeCount.projectedTarget >= currentPrice
                  ? "url(#primaryTargetZoneGradient)"
                  : "url(#secondaryTargetZoneGradient)"
              }
              rx={4}
            />
            <text
              x={idxToX(data.length + projectionBars * 0.25)}
              y={
                priceToY(activeCount.projectedTarget) -
                (10 * activeCount.projectedTarget >= currentPrice ? 1.0 : -1.0)
              }
              textAnchor="middle"
              fill={activeCount.color}
              fontSize="11"
              fontWeight="600"
              opacity={0.8}
            >
              TARGET ZONE
            </text>
          </g>
        )}

        {/* Invalidation line */}
        {analysisState.showInvalidationLevel && (
          <g>
            <line
              x1={M.l}
              x2={W - M.r}
              y1={priceToY(75.25)}
              y2={priceToY(75.25)}
              stroke={PORTDIVE_COLORS.secondary}
              strokeWidth="2"
              strokeDasharray="10,5"
              opacity={0.7}
            />
            <rect
              x={M.l + 5}
              y={priceToY(75.25) - 20}
              width={130}
              height={18}
              rx={4}
              fill={PORTDIVE_COLORS.secondary}
              opacity={0.9}
            />
            <text
              x={M.l + 70}
              y={priceToY(75.25) - 8}
              textAnchor="middle"
              fill="#fff"
              fontSize="10"
              fontWeight="700"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              INVALIDATION $75.25
            </text>
          </g>
        )}

        {/* Moving Averages - Thicker lines */}
        {ma50.length > 1 && (
          <path
            d={`M ${ma50.map(({ idx, ma }) => `${idxToX(idx)},${priceToY(ma)}`).join(" L ")}`}
            fill="none"
            stroke={PORTDIVE_COLORS.movingAverage.fast}
            strokeWidth="2.5"
            opacity={0.7}
          />
        )}
        {ma200.length > 1 && (
          <path
            d={`M ${ma200.map(({ idx, ma }) => `${idxToX(idx)},${priceToY(ma)}`).join(" L ")}`}
            fill="none"
            stroke={PORTDIVE_COLORS.movingAverage.slow}
            strokeWidth="2.5"
            opacity={0.6}
          />
        )}

        {/* Candlesticks - Crisp rendering */}
        {processedData.map((d, i) => {
          const x = idxToX(i);
          const isGreen = d.close >= d.open;
          const bodyColor = isGreen
            ? PORTDIVE_COLORS.candleUp
            : PORTDIVE_COLORS.candleDown;
          const yO = priceToY(d.open),
            yC = priceToY(d.close);
          const yH = priceToY(d.high),
            yL = priceToY(d.low);
          const bodyHeight = Math.max(Math.abs(yC - yO), 1);

          return (
            <g key={i}>
              {/* Wick */}
              <line
                x1={x}
                y1={yH}
                x2={x}
                y2={yL}
                stroke={bodyColor}
                strokeWidth={1.5}
              />
              {/* Body */}
              <rect
                x={x - candleW / 2}
                y={Math.min(yO, yC)}
                width={candleW}
                height={bodyHeight}
                fill={bodyColor}
                rx={0.5}
              />
            </g>
          );
        })}

        {/* Motive Wave lines based on active count */}
        {analysisState.showMotiveWaves && (
          <g>
            {activeWaveCount === "primary" && (
              <>
                {/* Primary wave path */}
                <path
                  d={`M ${idxToX(activeCount.pivots.wave1Start.idx)},${priceToY(activeCount.pivots.wave1Start.price)}
                    L ${idxToX(activeCount.pivots.wave1Peak.idx)},${priceToY(activeCount.pivots.wave1Peak.price)}
                    L ${idxToX(activeCount.pivots.wave2Low.idx)},${priceToY(activeCount.pivots.wave2Low.price)}
                    L ${idxToX(activeCount.pivots.wave3Peak.idx)},${priceToY(activeCount.pivots.wave3Peak.price)}
                    L ${idxToX(activeCount.pivots.wave4Low.idx)},${priceToY(activeCount.pivots.wave4Low.price)}`}
                  fill="none"
                  stroke={activeCount.color}
                  strokeWidth="2.5"
                  opacity="0.8"
                  strokeLinejoin="round"
                />
                {/* Wave labels */}
                {renderWaveLabel(
                  idxToX(activeCount.pivots.wave1Peak.idx),
                  priceToY(activeCount.pivots.wave1Peak.price),
                  activeCount.pivots.wave1Peak.label,
                  true,
                  activeCount.color,
                )}
                {renderWaveLabel(
                  idxToX(activeCount.pivots.wave2Low.idx),
                  priceToY(activeCount.pivots.wave2Low.price),
                  activeCount.pivots.wave2Low.label,
                  false,
                  activeCount.color,
                )}
                {renderWaveLabel(
                  idxToX(activeCount.pivots.wave3Peak.idx),
                  priceToY(activeCount.pivots.wave3Peak.price),
                  activeCount.pivots.wave3Peak.label,
                  true,
                  activeCount.color,
                )}
                {renderWaveLabel(
                  idxToX(activeCount.pivots.wave4Low.idx),
                  priceToY(activeCount.pivots.wave4Low.price),
                  activeCount.pivots.wave4Low.label,
                  false,
                  activeCount.color,
                )}
              </>
            )}
            {activeWaveCount === "alt2" && (
              <>
                {/* Alt 2 wave path */}
                <path
                  d={`M ${idxToX(activeCount.pivots.wave1Start.idx)},${priceToY(activeCount.pivots.wave1Start.price)}
                    L ${idxToX(activeCount.pivots.wave1Peak.idx)},${priceToY(activeCount.pivots.wave1Peak.price)}
                    L ${idxToX(activeCount.pivots.wave2Low.idx)},${priceToY(activeCount.pivots.wave2Low.price)}
                    L ${idxToX(activeCount.pivots.wave3ExtPeak.idx)},${priceToY(activeCount.pivots.wave3ExtPeak.price)}`}
                  fill="none"
                  stroke={activeCount.color}
                  strokeWidth="2.5"
                  opacity="0.8"
                  strokeLinejoin="round"
                />
                {/* Wave labels */}
                {renderWaveLabel(
                  idxToX(activeCount.pivots.wave1Peak.idx),
                  priceToY(activeCount.pivots.wave1Peak.price),
                  activeCount.pivots.wave1Peak.label,
                  true,
                  activeCount.color,
                )}
                {renderWaveLabel(
                  idxToX(activeCount.pivots.wave2Low.idx),
                  priceToY(activeCount.pivots.wave2Low.price),
                  activeCount.pivots.wave2Low.label,
                  false,
                  activeCount.color,
                )}
                {renderWaveLabel(
                  idxToX(activeCount.pivots.wave3ExtPeak.idx),
                  priceToY(activeCount.pivots.wave3ExtPeak.price),
                  activeCount.pivots.wave3ExtPeak.label,
                  true,
                  activeCount.color,
                )}
              </>
            )}
          </g>
        )}

        {/* Corrective Wave lines based on active count */}
        {analysisState.showCorrectiveWaves && (
          <g>
            {activeWaveCount === "alt1" && (
              <>
                {/* Alt 1 wave path (correction) */}
                <path
                  d={`M ${idxToX(activeCount.pivots.wave1Start.idx)},${priceToY(activeCount.pivots.wave1Start.price)}
                    L ${idxToX(activeCount.pivots.waveALow.idx)},${priceToY(activeCount.pivots.waveALow.price)}
                    L ${idxToX(activeCount.pivots.waveBPeak.idx)},${priceToY(activeCount.pivots.waveBPeak.price)}`}
                  fill="none"
                  stroke={activeCount.color}
                  strokeWidth="2.5"
                  opacity="0.8"
                  strokeLinejoin="round"
                />
                {renderWaveLabel(
                  idxToX(activeCount.pivots.waveALow.idx),
                  priceToY(activeCount.pivots.waveALow.price),
                  activeCount.pivots.waveALow.label,
                  false,
                  activeCount.color,
                )}
                {renderWaveLabel(
                  idxToX(activeCount.pivots.waveBPeak.idx),
                  priceToY(activeCount.pivots.waveBPeak.price),
                  activeCount.pivots.waveBPeak.label,
                  true,
                  activeCount.color,
                )}
              </>
            )}
          </g>
        )}

        {/* Minor waves - Only for primary count */}
        {analysisState.showMinorWaves &&
          activeWaveCount === "primary" &&
          activeCount.minorWaves && (
            <g>
              <path
                d={`M ${idxToX(activeCount.pivots.wave4Low.idx)},${priceToY(activeCount.pivots.wave4Low.price)}
                L ${idxToX(activeCount.minorWaves.minorIPeak.idx)},${priceToY(activeCount.minorWaves.minorIPeak.price)}
                L ${idxToX(activeCount.minorWaves.minorIILow.idx)},${priceToY(activeCount.minorWaves.minorIILow.price)}
                L ${idxToX(data.length - 1)},${priceToY(currentPrice)}`}
                fill="none"
                stroke={activeCount.color}
                strokeWidth="1.5"
                strokeDasharray="6,4"
                opacity="0.7"
              />
              {renderWaveLabel(
                idxToX(activeCount.minorWaves.minorIPeak.idx),
                priceToY(activeCount.minorWaves.minorIPeak.price),
                activeCount.minorWaves.minorIPeak.label,
                true,
                activeCount.color,
                true,
              )}
              {renderWaveLabel(
                idxToX(activeCount.minorWaves.minorIILow.idx),
                priceToY(activeCount.minorWaves.minorIILow.price),
                activeCount.minorWaves.minorIILow.label,
                false,
                activeCount.color,
                true,
              )}
            </g>
          )}

        {/* Projected Wave 5 path */}
        {analysisState.showMotiveWaves && activeWaveCount === "primary" && (
          <g>
            <path
              d={`M ${idxToX(activeCount.projectedStart.idx)},${priceToY(activeCount.projectedStart.price)}
                L ${idxToX(data.length + projectionBars * projectionBarsScale)},${priceToY(activeCount.projectedTarget)}`}
              fill="none"
              stroke={activeCount.color}
              strokeWidth="2"
              strokeDasharray="8,6"
              opacity="0.5"
            />
            {/* Wave 5 projected label */}
            <g>
              <ellipse
                cx={idxToX(data.length + projectionBars * projectionBarsScale)}
                cy={priceToY(activeCount.projectedTarget) - 28}
                rx={16}
                ry={16}
                stroke={activeCount.color}
                strokeWidth={1.5}
                strokeDasharray="5,3"
                opacity={0.6}
                filter="url(#labelShadow)"
              />
              <text
                x={idxToX(data.length + projectionBars * projectionBarsScale)}
                y={priceToY(activeCount.projectedTarget) - 23}
                textAnchor="middle"
                fill="#fff"
                fontSize="14"
                fontWeight="700"
              >
                {activeCount.projectedLabel}
              </text>
              <text
                x={idxToX(data.length + projectionBars * projectionBarsScale)}
                y={priceToY(activeCount.projectedTarget)}
                textAnchor="middle"
                fill={activeCount.color}
                fontSize="10"
                fontWeight="600"
                opacity={0.8}
              >
                ${activeCount.projectedTarget}
              </text>
            </g>
          </g>
        )}

        {/* Projected Wave C path */}
        {analysisState.showCorrectiveWaves && activeWaveCount === "alt1" && (
          <g>
            <path
              d={`M ${idxToX(activeCount.projectedStart.idx)},${priceToY(activeCount.projectedStart.price)}
                L ${idxToX(data.length + projectionBars * projectionBarsScale)},${priceToY(activeCount.projectedTarget)}`}
              fill="none"
              stroke={activeCount.color}
              strokeWidth="2"
              strokeDasharray="8,6"
              opacity="0.5"
            />
            {/* Wave C projected label */}
            <g>
              <ellipse
                cx={idxToX(data.length + projectionBars * projectionBarsScale)}
                cy={priceToY(activeCount.projectedTarget) + 23}
                rx={16}
                ry={16}
                stroke={activeCount.color}
                strokeWidth={1.5}
                strokeDasharray="5,3"
                opacity={0.6}
                filter="url(#labelShadow)"
              />
              <text
                x={idxToX(data.length + projectionBars * projectionBarsScale)}
                y={priceToY(activeCount.projectedTarget) + 28}
                textAnchor="middle"
                fill="#fff"
                fontSize="14"
                fontWeight="700"
              >
                {activeCount.projectedLabel}
              </text>
              <text
                x={idxToX(data.length + projectionBars * projectionBarsScale)}
                y={priceToY(activeCount.projectedTarget)}
                textAnchor="middle"
                fill={activeCount.color}
                fontSize="10"
                fontWeight="600"
                opacity={0.8}
              >
                ${activeCount.projectedTarget}
              </text>
            </g>
          </g>
        )}

        {/* Projected Wave 4 path */}
        {analysisState.showMotiveWaves && activeWaveCount === "alt2" && (
          <g>
            <path
              d={`M ${idxToX(activeCount.projectedStart.idx)},${priceToY(activeCount.projectedStart.price)}
                L ${idxToX(data.length + projectionBars * projectionBarsScale)},${priceToY(activeCount.projectedTarget)}`}
              fill="none"
              stroke={activeCount.color}
              strokeWidth="2"
              strokeDasharray="8,6"
              opacity="0.5"
            />
            {/* Wave C projected label */}
            <g>
              <ellipse
                cx={idxToX(data.length + projectionBars * projectionBarsScale)}
                cy={priceToY(activeCount.projectedTarget) + 23}
                rx={16}
                ry={16}
                stroke={activeCount.color}
                strokeWidth={1.5}
                strokeDasharray="5,3"
                opacity={0.6}
                filter="url(#labelShadow)"
              />
              <text
                x={idxToX(data.length + projectionBars * projectionBarsScale)}
                y={priceToY(activeCount.projectedTarget) + 28}
                textAnchor="middle"
                fill="#fff"
                fontSize="14"
                fontWeight="700"
              >
                {activeCount.projectedLabel}
              </text>
              <text
                x={idxToX(data.length + projectionBars * projectionBarsScale)}
                y={priceToY(activeCount.projectedTarget)}
                textAnchor="middle"
                fill={activeCount.color}
                fontSize="10"
                fontWeight="600"
                opacity={0.8}
              >
                ${activeCount.projectedTarget}
              </text>
            </g>
          </g>
        )}

        {/* Volume section */}
        <rect
          x={M.l}
          y={H - M.b - vH - 5}
          width={cW}
          height={vH + 5}
          rx={4}
          fill="none"
        />
        {processedData.map((d, i) => {
          const x = idxToX(i);
          const h = (d.volume / vMax) * vH * 0.85;
          const isGreen = d.close >= d.open;
          return (
            <rect
              key={`vol-${i}`}
              x={x - candleW / 2}
              y={H - M.b - h - 2}
              width={candleW}
              height={h}
              fill={
                isGreen
                  ? PORTDIVE_COLORS.volume.up
                  : PORTDIVE_COLORS.volume.down
              }
              rx={0.5}
            />
          );
        })}

        {/* Current price marker */}
        <g>
          <line
            x1={idxToX(data.length - 1) + candleW}
            x2={W - M.r + 70}
            y1={priceToY(currentPrice)}
            y2={priceToY(currentPrice)}
            stroke={
              currentPrice >= data[data.length - 2]?.close
                ? PORTDIVE_COLORS.candleUp
                : PORTDIVE_COLORS.candleDown
            }
            strokeWidth={1.5}
            strokeDasharray="4,3"
          />
          <rect
            x={W - M.r + 4}
            y={priceToY(currentPrice) - 14}
            width={70}
            height={28}
            rx={6}
            fill={
              currentPrice >= data[data.length - 2]?.close
                ? PORTDIVE_COLORS.candleUp
                : PORTDIVE_COLORS.candleDown
            }
          />
          <text
            x={W - M.r + 39}
            y={priceToY(currentPrice) + 5}
            textAnchor="middle"
            fill="#fff"
            fontSize="13"
            fontWeight="700"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            ${currentPrice.toFixed(2)}
          </text>
        </g>

        {/* MA Legend - Cleaner */}
        <g transform={`translate(${M.l + 15}, ${M.t + 20})`}>
          <rect
            x={-8}
            y={-12}
            width={160}
            height={28}
            rx={6}
            fill={theme.surface}
            opacity={0.9}
          />
          {ma50.length > 1 && (
            <>
              <line
                x1="0"
                y1="0"
                x2="20"
                y2="0"
                stroke={PORTDIVE_COLORS.movingAverage.fast}
                strokeWidth="2.5"
              />
              <text
                x="26"
                y="4"
                fill={theme.textSecondary}
                fontSize="11"
                fontWeight="500"
              >
                50-MA
              </text>
            </>
          )}
          {ma200.length > 1 && (
            <>
              <line
                x1="75"
                y1="0"
                x2="95"
                y2="0"
                stroke={PORTDIVE_COLORS.movingAverage.slow}
                strokeWidth="2.5"
              />
              <text
                x="101"
                y="4"
                fill={theme.textSecondary}
                fontSize="11"
                fontWeight="500"
              >
                200-MA
              </text>
            </>
          )}
        </g>

        {/* Projection zone label */}
        <g
          transform={`translate(${idxToX(data.length + 10)}, ${H - M.b - vH - 20})`}
        >
          <rect
            x={-40}
            y={-10}
            width={80}
            height={18}
            rx={4}
            fill={PORTDIVE_COLORS.primary}
            opacity={0.15}
          />
          <text
            x="0"
            y="3"
            textAnchor="middle"
            fill={PORTDIVE_COLORS.primary}
            fontSize="10"
            fontWeight="600"
          >
            PROJECTION
          </text>
        </g>
      </svg>
    );
  },
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
              ? PORTDIVE_COLORS.primaryLight
              : PORTDIVE_COLORS.secondary,
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
              ? PORTDIVE_COLORS.primary
              : PORTDIVE_COLORS.secondary,
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
              background: `linear-gradient(90deg, ${isTargetPositive ? PORTDIVE_COLORS.primary : PORTDIVE_COLORS.secondaryLight} 0%, ${isTargetPositive ? PORTDIVE_COLORS.primaryLight : PORTDIVE_COLORS.secondary} 100%)`,
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
                    ? PORTDIVE_COLORS.secondary
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
                    ? PORTDIVE_COLORS.primary
                    : `repeating-linear-gradient(90deg, ${PORTDIVE_COLORS.primary} 0px, ${PORTDIVE_COLORS.primary} 4px, transparent 4px, transparent 8px)`,
                  opacity: isSolid ? 0.6 : 0.4,
                }}
              />
              <span
                style={{
                  fontSize: "12px",
                  fontFamily: "monospace",
                  color: isCurrentLevel
                    ? PORTDIVE_COLORS.secondary
                    : theme.text,
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
                  ? PORTDIVE_COLORS.secondary
                  : PORTDIVE_COLORS.primary,
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
                    background: PORTDIVE_COLORS.primary,
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
            background: PORTDIVE_COLORS.primary,
          }}
        />
        #1 WMS PROGRESSION
      </div>
    </div>
  );
});

// ============================================================================
// MAIN COMPONENT - REFACTORED
// ============================================================================
export default function NBISElliottWaveChart({ colorMode = "dark" }) {
  // Use Docusaurus colorMode prop or default to dark
  const isDarkMode = colorMode === "dark";
  const theme = isDarkMode ? PORTDIVE_COLORS.dark : PORTDIVE_COLORS.light;

  const [activeWaveCount, setActiveWaveCount] = useState("primary");
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

  // Handle wave count change - this now actually updates the chart
  const handleWaveCountChange = useCallback((countId) => {
    setActiveWaveCount(countId);
  }, []);

  const currentPrice = OHLCV_DATA[OHLCV_DATA.length - 1].close;
  const prevClose = OHLCV_DATA[OHLCV_DATA.length - 2].close;
  const priceChange = ((currentPrice - prevClose) / prevClose) * 100;
  const activeCount = WAVE_COUNTS[activeWaveCount] || WAVE_COUNTS.primary;

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
          <TickerIcon showWordmark={showWordmark} theme={theme} />
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
              Elliott Wave Analysis
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
            </h1>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: "13px",
                color: theme.textSecondary,
              }}
            >
              Apr 2025 → Jun 2026 (Projection) | Target: $
              {activeCount.projectedTarget.toFixed(2)} | ATH: $141.10
            </p>
          </div>
        </div>
      </header>

      {/* Wave Count Selector */}
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
          {Object.values(WAVE_COUNTS).map((count) => (
            <WaveCountButton
              key={count.id}
              count={count}
              active={activeWaveCount === count.id}
              onClick={() => handleWaveCountChange(count.id)}
              theme={theme}
            />
          ))}
        </div>
      </div>

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
          color={PORTDIVE_COLORS.primary}
          theme={theme}
        />
        <CheckboxToggle
          label="Corrective (25%)"
          checked={analysisState.showCorrectiveWaves}
          onChange={() => toggleAnalysis("showCorrectiveWaves")}
          color={PORTDIVE_COLORS.secondary}
          theme={theme}
        />
        <CheckboxToggle
          label="Minor Waves"
          checked={analysisState.showMinorWaves}
          onChange={() => toggleAnalysis("showMinorWaves")}
          color={PORTDIVE_COLORS.primary}
          theme={theme}
        />
        <CheckboxToggle
          label="Fib Retracement"
          checked={analysisState.showFibRetracements}
          onChange={() => toggleAnalysis("showFibRetracements")}
          color={PORTDIVE_COLORS.primary}
          theme={theme}
        />
        <CheckboxToggle
          label="Fib Extension"
          checked={analysisState.showFibExtensions}
          onChange={() => toggleAnalysis("showFibExtensions")}
          color={PORTDIVE_COLORS.fibonacci.extension}
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
                background: PORTDIVE_COLORS.primary,
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
                background: PORTDIVE_COLORS.secondary,
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
                background: PORTDIVE_COLORS.fibonacci.extension,
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
            <span style={{ color: PORTDIVE_COLORS.primary, fontWeight: 600 }}>
              Target:
            </span>{" "}
            ${activeCount.projectedTarget.toFixed(2)}
          </span>
          <span>
            <span style={{ color: PORTDIVE_COLORS.secondary, fontWeight: 600 }}>
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
          target={activeCount.projectedTarget}
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
          marginBottom: "20px",
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
