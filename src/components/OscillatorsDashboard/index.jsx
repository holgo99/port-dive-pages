/**
 * OscillatorsDashboard Component
 * Premium technical indicators dashboard with gradient gauges, glowing effects, and signal matrix
 *
 * @component
 * @example
 * import { OscillatorsDashboard } from '@site/src/components/OscillatorsDashboard';
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
// CONSTANTS & CONFIGURATION
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
// SVG ICONS
// ============================================================================

const WarningIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const TrendUpIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const BalanceIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M12 3v18" />
    <path d="M5 6l7-3 7 3" />
    <path d="M5 6v4c0 1.1.9 2 2 2h2" />
    <path d="M19 6v4c0 1.1-.9 2-2 2h-2" />
    <circle cx="5" cy="17" r="2" />
    <circle cx="19" cy="17" r="2" />
  </svg>
);

const CheckCircleIcon = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2.5" fill="none" />
    <path d="M15 24l6 6 12-12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const XCircleIcon = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2.5" fill="none" />
    <path d="M16 16l16 16M32 16l-16 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
  </svg>
);

const ChartIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 3v18h18" />
    <path d="M18 9l-5 5-4-4-3 3" />
  </svg>
);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get status, color, and icon for an oscillator value
 */
const getOscillatorStatus = (key, value) => {
  if (value == null) return { status: "NEUTRAL", color: "blue", icon: "balance" };

  const config = INDICATOR_CONFIG[key];
  if (!config) return { status: "NEUTRAL", color: "blue", icon: "balance" };

  if (key === "ADX") {
    if (value >= config.strongTrend) return { status: "STRONG TREND", color: "teal", icon: "trend" };
    if (value >= config.weakTrend) return { status: "WEAK TREND", color: "blue", icon: "balance" };
    return { status: "NO TREND", color: "coral", icon: "warning" };
  }

  if (key === "Williams_R") {
    // Williams %R is inverted: -100 to 0
    if (value >= config.overbought) return { status: "OVERBOUGHT", color: "coral", icon: "warning" };
    if (value <= config.oversold) return { status: "OVERSOLD", color: "teal", icon: "trend" };
    return { status: "NEUTRAL", color: "blue", icon: "balance" };
  }

  // Standard oscillators (RSI, Stoch)
  if (value >= config.overbought) return { status: "OVERBOUGHT", color: "coral", icon: "warning" };
  if (value <= config.oversold) return { status: "OVERSOLD", color: "teal", icon: "trend" };
  return { status: "NEUTRAL", color: "blue", icon: "balance" };
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
// PREMIUM GRADIENT GAUGE COMPONENT
// ============================================================================

const GaugeIndicator = memo(({ indicatorKey, value, config }) => {
  const { status, color, icon } = getOscillatorStatus(indicatorKey, value);

  // Calculate normalized value for gauge position (0 to 1)
  const normalizedValue = useMemo(() => {
    if (value == null) return 0.5;
    const range = config.max - config.min;
    return Math.max(0, Math.min(1, (value - config.min) / range));
  }, [value, config]);

  // Arc geometry - larger, more prominent
  const radius = 70;
  const strokeWidth = 12;
  const centerX = 90;
  const centerY = 85;

  // Arc angles (180 degree semi-circle)
  const startAngle = Math.PI;
  const endAngle = 2 * Math.PI;
  const valueAngle = startAngle + normalizedValue * (endAngle - startAngle);

  // Calculate arc endpoints
  const polarToCartesian = (angle) => ({
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  });

  const startPoint = polarToCartesian(startAngle);
  const endPoint = polarToCartesian(endAngle);
  const valuePoint = polarToCartesian(valueAngle);

  // SVG arc path
  const describeArc = (startA, endA) => {
    const start = polarToCartesian(startA);
    const end = polarToCartesian(endA);
    const largeArcFlag = endA - startA > Math.PI ? 1 : 0;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  };

  // Gradient ID unique to this gauge
  const gradientId = `gauge-gradient-${indicatorKey}`;
  const glowId = `gauge-glow-${indicatorKey}`;

  // Status icon component
  const StatusIcon = () => {
    switch (icon) {
      case "warning":
        return <WarningIcon size={14} />;
      case "trend":
        return <TrendUpIcon size={14} />;
      default:
        return <BalanceIcon size={14} />;
    }
  };

  return (
    <div className={`${styles.gaugeCard} ${styles[color]}`}>
      <div className={styles.gaugeLabel}>{config.label}</div>

      <div className={styles.gaugeContainer}>
        <svg viewBox="0 0 180 110" className={styles.gaugeSvg}>
          <defs>
            {/* Gradient arc: Teal → Blue → Coral */}
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1FA39B" />
              <stop offset="50%" stopColor="#3D72FF" />
              <stop offset="100%" stopColor="#FF6B6B" />
            </linearGradient>

            {/* Glow filter */}
            <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background track */}
          <path
            d={describeArc(startAngle, endAngle)}
            fill="none"
            stroke="var(--gauge-track)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Gradient arc (full) */}
          <path
            d={describeArc(startAngle, endAngle)}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            opacity="0.3"
          />

          {/* Active value arc with glow */}
          {value != null && (
            <path
              d={describeArc(startAngle, valueAngle)}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              filter={`url(#${glowId})`}
              className={styles.gaugeArcActive}
            />
          )}

          {/* Value indicator dot */}
          {value != null && (
            <circle
              cx={valuePoint.x}
              cy={valuePoint.y}
              r={8}
              className={`${styles.gaugeIndicatorDot} ${styles[color]}`}
              filter={`url(#${glowId})`}
            />
          )}

          {/* Min/Max labels */}
          <text x={startPoint.x - 5} y={centerY + 20} className={styles.gaugeMinMax} textAnchor="middle">
            {config.min}
          </text>
          <text x={endPoint.x + 5} y={centerY + 20} className={styles.gaugeMinMax} textAnchor="middle">
            {config.max}
          </text>
        </svg>

        {/* Large bold value display */}
        <div className={styles.gaugeValueContainer}>
          <span className={`${styles.gaugeValue} ${styles[color]}`}>
            {config.format(value)}
          </span>
        </div>
      </div>

      {/* Status badge with icon and glow */}
      <div className={`${styles.gaugeStatusBadge} ${styles[color]}`}>
        <StatusIcon />
        <span>{status}</span>
      </div>

      {/* Reference levels */}
      <div className={styles.gaugeLevels}>
        {config.overbought && (
          <span className={styles.gaugeLevel}>
            Overbought: {config.overbought}
          </span>
        )}
        {config.oversold && (
          <span className={styles.gaugeLevel}>
            Oversold: {config.oversold}
          </span>
        )}
        {config.strongTrend && (
          <span className={styles.gaugeLevel}>
            Strong: &gt;{config.strongTrend}
          </span>
        )}
      </div>
    </div>
  );
});

// ============================================================================
// TIME SERIES CHART COMPONENT
// ============================================================================

const TimeSeriesChart = memo(({ title, data, lines, thresholds, yDomain }) => {
  const width = 500;
  const height = 140;
  const margin = { top: 20, right: 50, bottom: 35, left: 45 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Calculate scales
  const xScale = useMemo(() => {
    if (data.length === 0) return () => 0;
    return (idx) => (idx / (data.length - 1)) * chartWidth;
  }, [data.length, chartWidth]);

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
    const step = Math.ceil(data.length / 7);
    for (let i = 0; i < data.length; i += step) {
      if (data[i]?.timestamp) {
        labels.push({
          x: xScale(i),
          label: formatDate(data[i].timestamp),
        });
      }
    }
    return labels;
  }, [data, xScale]);

  const glowFilterId = `chart-glow-${title.replace(/\s/g, "")}`;

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <ChartIcon size={16} />
        <span className={styles.chartTitle}>{title}</span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={styles.chartSvg}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id={glowFilterId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <line
              key={i}
              x1={0}
              x2={chartWidth}
              y1={chartHeight * ratio}
              y2={chartHeight * ratio}
              className={styles.gridLine}
            />
          ))}

          {/* Threshold lines with glow */}
          {thresholds?.map((threshold, idx) => (
            <g key={idx}>
              <line
                x1={0}
                x2={chartWidth}
                y1={yScale(threshold.value)}
                y2={yScale(threshold.value)}
                className={`${styles.thresholdLine} ${threshold.type === "overbought" ? styles.coral : threshold.type === "oversold" ? styles.teal : styles.muted}`}
                strokeDasharray="6,4"
              />
              <text
                x={chartWidth + 5}
                y={yScale(threshold.value) + 4}
                className={`${styles.thresholdLabel} ${threshold.type === "overbought" ? styles.coral : threshold.type === "oversold" ? styles.teal : styles.muted}`}
              >
                {threshold.value}
              </text>
            </g>
          ))}

          {/* Histogram bars for MACD */}
          {lines.some((l) => l.type === "histogram") &&
            data.map((d, i) => {
              const histLine = lines.find((l) => l.type === "histogram");
              if (!histLine) return null;
              const val = d[histLine.dataKey];
              if (val == null) return null;
              const barHeight = Math.abs(yScale(val) - yScale(0));
              const isPositive = val >= 0;
              const barWidth = Math.max(2, chartWidth / data.length - 1);
              return (
                <rect
                  key={i}
                  x={xScale(i) - barWidth / 2}
                  y={isPositive ? yScale(val) : yScale(0)}
                  width={barWidth}
                  height={barHeight || 1}
                  className={`${styles.histogramBar} ${isPositive ? styles.teal : styles.coral}`}
                  rx={1}
                />
              );
            })}

          {/* Data lines with glow effect */}
          {lines.filter(l => l.type !== "histogram").map((line, idx) => {
            const path = generatePath(line.dataKey);
            if (!path) return null;
            return (
              <path
                key={idx}
                d={path}
                fill="none"
                className={`${styles.dataLine} ${styles[line.color]}`}
                strokeWidth={line.strokeWidth || 2}
                filter={`url(#${glowFilterId})`}
              />
            );
          })}

          {/* X-axis labels */}
          {xLabels.map((label, idx) => (
            <text
              key={idx}
              x={label.x}
              y={chartHeight + 25}
              className={styles.axisLabel}
              textAnchor="middle"
            >
              {label.label}
            </text>
          ))}

          {/* Y-axis labels */}
          <text x={-8} y={8} className={styles.axisLabel} textAnchor="end">
            {yDomain[1]}
          </text>
          <text x={-8} y={chartHeight + 4} className={styles.axisLabel} textAnchor="end">
            {yDomain[0]}
          </text>
        </g>
      </svg>
    </div>
  );
});

// ============================================================================
// PREMIUM SIGNAL CARD COMPONENT
// ============================================================================

const SignalCard = memo(({ label, status, value, isConfirmed }) => {
  return (
    <div className={`${styles.signalCard} ${isConfirmed ? styles.confirmed : styles.notMet}`}>
      <div className={styles.signalCardHeader}>
        <span className={styles.signalLabel}>{label}</span>
        <span className={`${styles.signalStatusText} ${isConfirmed ? styles.confirmed : styles.notMet}`}>
          {isConfirmed ? "CONFIRMED" : "NOT MET"}
        </span>
      </div>

      <div className={styles.signalIconContainer}>
        <div className={`${styles.signalIcon} ${isConfirmed ? styles.confirmed : styles.notMet}`}>
          {isConfirmed ? <CheckCircleIcon size={48} /> : <XCircleIcon size={48} />}
        </div>
      </div>

      <div className={styles.signalCardFooter}>
        <span className={styles.signalValueLabel}>{isConfirmed ? status : status}</span>
        <span className={`${styles.signalValue} ${isConfirmed ? styles.confirmed : styles.notMet}`}>
          {value}
        </span>
      </div>
    </div>
  );
});

// ============================================================================
// SIGNAL MATRIX COMPONENT
// ============================================================================

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
    const isMacdShrinking = macdHist != null && macdHist < 0;
    const isVolumeDecline = volume != null && volumeMA != null && volume < volumeMA;

    return [
      {
        label: "MACD Shrinking",
        status: isMacdShrinking ? "Shrinking" : "Expanding",
        isConfirmed: isMacdShrinking,
        value: macdHist != null ? `${(macdHist).toFixed(2)}` : "—",
      },
      {
        label: isSellMode ? "RSI >70" : "RSI <30",
        status: isSellMode ? (rsiValue > 70 ? "Overbought" : "Normal") : (rsiValue < 30 ? "Oversold" : "Normal"),
        isConfirmed: isSellMode ? rsiValue > 70 : rsiValue < 30,
        value: rsiValue?.toFixed(2) ?? "—",
      },
      {
        label: "Volume Declining",
        status: isVolumeDecline ? "Declining" : "Rising",
        isConfirmed: isVolumeDecline,
        value: volume != null ? `${(volume / 1000000).toFixed(1)}M` : "—",
      },
      {
        label: isSellMode ? "Williams <-20" : "Williams <-80",
        status: isSellMode
          ? (williamsValue > -20 ? "Overbought" : "Normal")
          : (williamsValue < -80 ? "Oversold" : "Normal"),
        isConfirmed: isSellMode ? williamsValue > -20 : williamsValue < -80,
        value: williamsValue?.toFixed(2) ?? "—",
      },
      {
        label: isSellMode ? "Stoch >80" : "Stoch <20",
        status: isSellMode
          ? ((stochK > 80 || stochD > 80) ? "Overbought" : "Normal")
          : ((stochK < 20 || stochD < 20) ? "Oversold" : "Normal"),
        isConfirmed: isSellMode
          ? (stochK > 80 || stochD > 80)
          : (stochK < 20 || stochD < 20),
        value: stochK != null && stochD != null
          ? `${stochK.toFixed(0)}/${stochD.toFixed(0)}`
          : "—",
      },
    ];
  }, [latestData, signalType]);

  const confirmedCount = signals.filter((s) => s.isConfirmed).length;
  const totalSignals = signals.length;
  const progressPercent = (confirmedCount / totalSignals) * 100;

  // Determine action based on confirmed signals
  const getAction = () => {
    if (confirmedCount >= 4) return { text: "STRONG SELL", color: "coral" };
    if (confirmedCount >= 3) return { text: "TRIM 25-30%", color: "coral" };
    if (confirmedCount >= 2) return { text: "WATCH CLOSELY", color: "blue" };
    return { text: "HOLD", color: "teal" };
  };

  const action = getAction();

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

      <div className={styles.signalSummaryContainer}>
        <div className={styles.signalCountSection}>
          <span className={styles.signalCountLabel}>SIGNAL COUNT:</span>
          <span className={`${styles.signalCountValue} ${confirmedCount >= 3 ? styles.coral : styles.blue}`}>
            {confirmedCount}/{totalSignals} CONFIRMED
          </span>
        </div>

        <div className={styles.signalProgressBar}>
          <div
            className={`${styles.signalProgressFill} ${confirmedCount >= 3 ? styles.coral : styles.teal}`}
            style={{ width: `${progressPercent}%` }}
          />
          <span className={styles.signalProgressLabel}>{progressPercent.toFixed(0)}%</span>
        </div>

        <div className={styles.signalActionSection}>
          <span className={styles.signalActionLabel}>ACTION:</span>
          <span className={`${styles.signalActionValue} ${styles[action.color]}`}>
            {action.text}
          </span>
        </div>
      </div>
    </div>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function OscillatorsDashboard({
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
        <div className={styles.headerContent}>
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
          lines={[{ dataKey: "RSI", color: "blue", strokeWidth: 2.5 }]}
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
            { dataKey: "MACD", color: "blue", strokeWidth: 2.5 },
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
            { dataKey: "Stoch_K", color: "blue", strokeWidth: 2.5 },
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
          <ChartIcon size={14} />
          Technical Analysis Dashboard
        </span>
      </footer>
    </div>
  );
}
