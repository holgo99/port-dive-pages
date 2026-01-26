/**
 * OscillatorsDashboard Component
 * Technical indicators dashboard with gauges, charts, and signal matrix
 *
 * @component
 * @example
 * import OscillatorsDashboard from '@site/src/components/OscillatorsDashboard';
 *
 * <OscillatorsDashboard
 *   ticker="NBIS"
 *   tickerName="Nebius Group N.V."
 *   data={ohlcvData}
 *   daysToShow={30}
 * />
 */

import React, { useMemo, memo } from "react";
import styles from "./styles.module.css";

// ============================================================================
// CONSTANTS
// ============================================================================

const INDICATOR_CONFIG = {
  RSI: {
    label: "RSI(14)",
    min: 0,
    max: 100,
    overbought: 70,
    oversold: 30,
    format: (v) => v?.toFixed(1) ?? "—",
  },
  Williams_R: {
    label: "Williams %R(14)",
    min: -100,
    max: 0,
    overbought: -20,
    oversold: -80,
    format: (v) => v?.toFixed(1) ?? "—",
  },
  Stoch_K: {
    label: "Stochastic K",
    min: 0,
    max: 100,
    overbought: 80,
    oversold: 20,
    format: (v) => v?.toFixed(1) ?? "—",
  },
  Stoch_D: {
    label: "Stochastic D",
    min: 0,
    max: 100,
    overbought: 80,
    oversold: 20,
    format: (v) => v?.toFixed(1) ?? "—",
  },
  ADX: {
    label: "ADX(14)",
    min: 0,
    max: 60,
    strongTrend: 25,
    weakTrend: 20,
    format: (v) => v?.toFixed(1) ?? "—",
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get status and color for an oscillator value
 */
const getOscillatorStatus = (key, value) => {
  if (value == null) return { status: "NEUTRAL", color: "neutral" };

  const config = INDICATOR_CONFIG[key];
  if (!config) return { status: "NEUTRAL", color: "neutral" };

  if (key === "ADX") {
    if (value >= config.strongTrend) return { status: "STRONG TREND", color: "primary" };
    if (value >= config.weakTrend) return { status: "WEAK TREND", color: "warning" };
    return { status: "NO TREND", color: "neutral" };
  }

  if (key === "Williams_R") {
    // Williams %R is inverted: -100 to 0
    if (value >= config.overbought) return { status: "OVERBOUGHT", color: "secondary" };
    if (value <= config.oversold) return { status: "OVERSOLD", color: "primary" };
    return { status: "NEUTRAL", color: "neutral" };
  }

  // Standard oscillators (RSI, Stoch)
  if (value >= config.overbought) return { status: "OVERBOUGHT", color: "secondary" };
  if (value <= config.oversold) return { status: "OVERSOLD", color: "primary" };
  return { status: "NEUTRAL", color: "neutral" };
};

/**
 * Format date for display
 */
const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

/**
 * Format full date for header
 */
const formatFullDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// ============================================================================
// SVG GAUGE COMPONENT
// ============================================================================

const GaugeIndicator = memo(({ indicatorKey, value, config }) => {
  const { status, color } = getOscillatorStatus(indicatorKey, value);

  // Calculate angle for the gauge (180 degree arc)
  const normalizedValue = useMemo(() => {
    if (value == null) return 0.5;
    const range = config.max - config.min;
    return (value - config.min) / range;
  }, [value, config]);

  // Arc calculations
  const radius = 45;
  const strokeWidth = 8;
  const centerX = 60;
  const centerY = 55;

  // Start and end angles for the arc (in radians)
  const startAngle = Math.PI;
  const endAngle = 2 * Math.PI;
  const valueAngle = startAngle + normalizedValue * (endAngle - startAngle);

  // Calculate arc path
  const getArcPath = (start, end) => {
    const startX = centerX + radius * Math.cos(start);
    const startY = centerY + radius * Math.sin(start);
    const endX = centerX + radius * Math.cos(end);
    const endY = centerY + radius * Math.sin(end);
    const largeArc = end - start > Math.PI ? 1 : 0;
    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}`;
  };

  const colorClass = styles[color] || styles.neutral;

  return (
    <div className={styles.gaugeCard}>
      <div className={styles.gaugeLabel}>{config.label}</div>
      <div className={styles.gaugeContainer}>
        <svg viewBox="0 0 120 70" className={styles.gaugeSvg}>
          {/* Background arc */}
          <path
            d={getArcPath(startAngle, endAngle)}
            fill="none"
            stroke="var(--gauge-track)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Value arc */}
          {value != null && (
            <path
              d={getArcPath(startAngle, valueAngle)}
              fill="none"
              className={`${styles.gaugeArc} ${colorClass}`}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          )}
          {/* Min/Max labels */}
          <text x="10" y="68" className={styles.gaugeMinMax}>
            {config.min}
          </text>
          <text x="110" y="68" className={styles.gaugeMinMax} textAnchor="end">
            {config.max}
          </text>
        </svg>
        <div className={styles.gaugeValueContainer}>
          <span className={`${styles.gaugeValue} ${colorClass}`}>
            {config.format(value)}
          </span>
        </div>
      </div>
      <div className={`${styles.gaugeStatus} ${colorClass}`}>{status}</div>
    </div>
  );
});

// ============================================================================
// TIME SERIES CHART COMPONENT
// ============================================================================

const TimeSeriesChart = memo(({ title, data, lines, thresholds, yDomain }) => {
  const width = 400;
  const height = 120;
  const margin = { top: 20, right: 40, bottom: 30, left: 40 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Calculate scales
  const xScale = useMemo(() => {
    const validData = data.filter((d) => d.datetime);
    if (validData.length === 0) return () => 0;
    return (idx) => (idx / (data.length - 1)) * chartWidth;
  }, [data, chartWidth]);

  const yScale = useMemo(() => {
    const [yMin, yMax] = yDomain;
    return (val) => chartHeight - ((val - yMin) / (yMax - yMin)) * chartHeight;
  }, [yDomain, chartHeight]);

  // Generate line paths
  const generatePath = (dataKey) => {
    const points = data
      .map((d, i) => {
        const val = d[dataKey];
        if (val == null) return null;
        return `${xScale(i)},${yScale(val)}`;
      })
      .filter(Boolean);

    if (points.length < 2) return "";
    return `M ${points.join(" L ")}`;
  };

  // Generate X-axis labels
  const xLabels = useMemo(() => {
    const labels = [];
    const step = Math.ceil(data.length / 6);
    for (let i = 0; i < data.length; i += step) {
      if (data[i]?.datetime) {
        labels.push({
          x: xScale(i),
          label: formatDate(data[i].timestamp),
        });
      }
    }
    return labels;
  }, [data, xScale]);

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartTitle}>{title}</div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={styles.chartSvg}
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Threshold lines */}
          {thresholds?.map((threshold, idx) => (
            <g key={idx}>
              <line
                x1={0}
                x2={chartWidth}
                y1={yScale(threshold.value)}
                y2={yScale(threshold.value)}
                className={`${styles.thresholdLine} ${threshold.type === "overbought" ? styles.secondary : styles.primary}`}
                strokeDasharray="4,4"
              />
            </g>
          ))}

          {/* Grid lines */}
          {[0, 1, 2, 3].map((i) => (
            <line
              key={i}
              x1={0}
              x2={chartWidth}
              y1={(chartHeight / 3) * i}
              y2={(chartHeight / 3) * i}
              className={styles.gridLine}
            />
          ))}

          {/* Data lines */}
          {lines.map((line, idx) => {
            const path = generatePath(line.dataKey);
            if (!path) return null;
            return (
              <path
                key={idx}
                d={path}
                fill="none"
                className={`${styles.dataLine} ${styles[line.color]}`}
                strokeWidth={line.strokeWidth || 2}
              />
            );
          })}

          {/* Histogram bars for MACD */}
          {lines.some((l) => l.type === "histogram") &&
            data.map((d, i) => {
              const histLine = lines.find((l) => l.type === "histogram");
              if (!histLine) return null;
              const val = d[histLine.dataKey];
              if (val == null) return null;
              const barHeight = Math.abs(yScale(val) - yScale(0));
              const isPositive = val >= 0;
              return (
                <rect
                  key={i}
                  x={xScale(i) - 1.5}
                  y={isPositive ? yScale(val) : yScale(0)}
                  width={3}
                  height={barHeight}
                  className={`${styles.histogramBar} ${isPositive ? styles.primary : styles.secondary}`}
                />
              );
            })}

          {/* X-axis labels */}
          {xLabels.map((label, idx) => (
            <text
              key={idx}
              x={label.x}
              y={chartHeight + 20}
              className={styles.axisLabel}
              textAnchor="middle"
            >
              {label.label}
            </text>
          ))}

          {/* Y-axis labels */}
          <text x={-5} y={5} className={styles.axisLabel} textAnchor="end">
            {yDomain[1]}
          </text>
          <text x={-5} y={chartHeight} className={styles.axisLabel} textAnchor="end">
            {yDomain[0]}
          </text>
        </g>
      </svg>
    </div>
  );
});

// ============================================================================
// SIGNAL MATRIX COMPONENT
// ============================================================================

const SignalCard = memo(({ label, status, value, isConfirmed }) => {
  return (
    <div className={`${styles.signalCard} ${isConfirmed ? styles.confirmed : styles.notMet}`}>
      <div className={styles.signalLabel}>{label}</div>
      <div className={`${styles.signalStatus} ${isConfirmed ? styles.confirmed : styles.notMet}`}>
        {isConfirmed ? "✓ CONFIRMED" : "✗ NOT MET"}
      </div>
      <div className={styles.signalValue}>{value}</div>
    </div>
  );
});

const SignalMatrix = memo(({ latestData, signalType = "SELL/TRIM" }) => {
  // Calculate signals based on latest data
  const signals = useMemo(() => {
    if (!latestData) return [];

    const rsiValue = latestData.RSI;
    const williamsValue = latestData.Williams_R;
    const macdHist = latestData["MACD.hist"];
    const stochK = latestData.Stoch_K;
    const stochD = latestData.Stoch_D;
    const volume = latestData.volume;
    const volumeMA = latestData.Volume_20_MA;

    const isSellMode = signalType === "SELL/TRIM";

    return [
      {
        label: isSellMode ? "RSI >70" : "RSI <30",
        isConfirmed: isSellMode ? rsiValue > 70 : rsiValue < 30,
        value: rsiValue?.toFixed(2) ?? "—",
      },
      {
        label: isSellMode ? "Williams %R >-20" : "Williams %R <-80",
        isConfirmed: isSellMode ? williamsValue > -20 : williamsValue < -80,
        value: williamsValue?.toFixed(2) ?? "—",
      },
      {
        label: "MACD Shrinking",
        isConfirmed: macdHist != null && macdHist < 0,
        value: macdHist != null ? (macdHist > 0 ? "Expanding" : "Shrinking") : "—",
      },
      {
        label: "Volume Declining",
        isConfirmed: volume != null && volumeMA != null && volume < volumeMA,
        value: volume != null ? `${(volume / 1000000).toFixed(1)}M` : "—",
      },
      {
        label: isSellMode ? "Stoch >80" : "Stoch <20",
        isConfirmed: isSellMode
          ? (stochK > 80 || stochD > 80)
          : (stochK < 20 || stochD < 20),
        value: stochK != null && stochD != null
          ? `${stochK.toFixed(2)}/${stochD.toFixed(2)}`
          : "—",
      },
    ];
  }, [latestData, signalType]);

  const confirmedCount = signals.filter((s) => s.isConfirmed).length;

  // Determine action based on confirmed signals
  const getAction = () => {
    if (confirmedCount >= 4) return "STRONG SELL";
    if (confirmedCount >= 3) return "TRIM 25-30%";
    if (confirmedCount >= 2) return "WATCH CLOSELY";
    return "HOLD";
  };

  return (
    <div className={styles.signalMatrixContainer}>
      <div className={styles.signalMatrixHeader}>
        <h3 className={styles.signalMatrixTitle}>{signalType} Signal Matrix</h3>
      </div>
      <div className={styles.signalGrid}>
        {signals.map((signal, idx) => (
          <SignalCard key={idx} {...signal} />
        ))}
      </div>
      <div className={styles.signalSummary}>
        <div className={styles.signalCount}>
          SIGNAL COUNT: <span className={confirmedCount >= 3 ? styles.secondary : styles.neutral}>
            {confirmedCount}/{signals.length} CONFIRMED
          </span>
        </div>
        <div className={styles.signalAction}>
          ACTION: <span className={confirmedCount >= 3 ? styles.secondary : styles.primary}>
            {getAction()}
          </span>
        </div>
      </div>
    </div>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function OscillatorsDashboard({
  ticker = "NBIS",
  tickerName = "Nebius Group N.V.",
  data = [],
  daysToShow = 30,
}) {
  // Get latest data point and filter recent data
  const { latestData, recentData, dateString } = useMemo(() => {
    if (!data || data.length === 0) {
      return { latestData: null, recentData: [], dateString: "—" };
    }

    const latest = data[data.length - 1];
    const recent = data.slice(-daysToShow);
    const dateStr = formatFullDate(latest.timestamp);

    return { latestData: latest, recentData: recent, dateString: dateStr };
  }, [data, daysToShow]);

  // Gauge indicators data
  const gaugeIndicators = useMemo(() => {
    if (!latestData) return [];
    return [
      { key: "RSI", value: latestData.RSI, config: INDICATOR_CONFIG.RSI },
      { key: "Williams_R", value: latestData.Williams_R, config: INDICATOR_CONFIG.Williams_R },
      { key: "Stoch_K", value: latestData.Stoch_K, config: INDICATOR_CONFIG.Stoch_K },
      { key: "Stoch_D", value: latestData.Stoch_D, config: INDICATOR_CONFIG.Stoch_D },
      { key: "ADX", value: latestData.ADX, config: INDICATOR_CONFIG.ADX },
    ];
  }, [latestData]);

  if (!data || data.length === 0) {
    return (
      <div className={styles.dashboardWrapper}>
        <div className={styles.noData}>No data available</div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardWrapper}>
      {/* Header */}
      <header className={styles.dashboardHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.dashboardTitle}>{ticker} Technical Dashboard</h1>
          <p className={styles.dashboardSubtitle}>
            Multi-Indicator Analysis | As of {dateString}
          </p>
        </div>
      </header>

      {/* Gauge Indicators Row */}
      <section className={styles.gaugesSection}>
        <div className={styles.gaugesGrid}>
          {gaugeIndicators.map((indicator) => (
            <GaugeIndicator
              key={indicator.key}
              indicatorKey={indicator.key}
              value={indicator.value}
              config={indicator.config}
            />
          ))}
        </div>
      </section>

      {/* Time Series Charts */}
      <section className={styles.chartsSection}>
        {/* RSI Chart */}
        <TimeSeriesChart
          title="RSI(14) - Momentum"
          data={recentData}
          lines={[{ dataKey: "RSI", color: "blue", strokeWidth: 2 }]}
          thresholds={[
            { value: 70, type: "overbought" },
            { value: 30, type: "oversold" },
          ]}
          yDomain={[0, 100]}
        />

        {/* MACD Chart */}
        <TimeSeriesChart
          title="MACD(12/26/9) - Trend"
          data={recentData}
          lines={[
            { dataKey: "MACD", color: "blue", strokeWidth: 2 },
            { dataKey: "MACD.signal", color: "warning", strokeWidth: 2 },
            { dataKey: "MACD.hist", color: "histogram", type: "histogram" },
          ]}
          thresholds={[{ value: 0, type: "zero" }]}
          yDomain={[-5, 5]}
        />

        {/* Stochastic Chart */}
        <TimeSeriesChart
          title="Stochastic(14/3/3) - Mean Reversion"
          data={recentData}
          lines={[
            { dataKey: "Stoch_K", color: "blue", strokeWidth: 2 },
            { dataKey: "Stoch_D", color: "magenta", strokeWidth: 2 },
          ]}
          thresholds={[
            { value: 80, type: "overbought" },
            { value: 20, type: "oversold" },
          ]}
          yDomain={[0, 100]}
        />
      </section>

      {/* Signal Matrix */}
      <section className={styles.signalSection}>
        <SignalMatrix latestData={latestData} signalType="SELL/TRIM" />
      </section>

      {/* Footer */}
      <footer className={styles.dashboardFooter}>
        <span className={styles.footerBadge}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3v18h18" />
            <path d="M18 9l-5 5-4-4-3 3" />
          </svg>
          Technical Analysis Dashboard
        </span>
      </footer>
    </div>
  );
}
