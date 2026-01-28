/**
 * MovingAveragesDashboard Component - PREMIUM REDESIGN
 *
 * Displays moving average indicators (SMA, EMA, Volume MA) with trend analysis.
 * Supports Context + Composition pattern via TickerConfigProvider + OHLCVDataProvider
 *
 * @component
 * @example
 * // With full context (preferred - no props needed):
 * <NBISLayout>
 *   <MovingAveragesDashboard daysToShow={30} />
 * </NBISLayout>
 *
 * // Or with props (backwards compatible):
 * <MovingAveragesDashboard
 *   ticker="NBIS"
 *   tickerName="Nebius Group N.V."
 *   data={ohlcvData}
 *   daysToShow={30}
 * />
 */

import React, { useMemo, memo } from "react";
import { useTickerConfig } from "@site/src/hooks/useTickerConfig";
import { useOHLCVData } from "@site/src/hooks/useOHLCVData";
import styles from "./styles.module.css";

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const MA_CONFIG = {
  SMA_50: {
    key: "SMA_50",
    dataKey: "SMA_50",
    label: "SMA(50)",
    description: "50-Day Simple Moving Average",
    color: "teal",
    type: "SMA",
  },
  SMA_200: {
    key: "SMA_200",
    dataKey: "SMA_200",
    label: "SMA(200)",
    description: "200-Day Simple Moving Average",
    color: "blue",
    type: "SMA",
  },
  EMA_50: {
    key: "EMA_50",
    dataKey: "EMA_50",
    label: "EMA(50)",
    description: "50-Day Exponential Moving Average",
    color: "teal",
    type: "EMA",
  },
  EMA_200: {
    key: "EMA_200",
    dataKey: "EMA_200",
    label: "EMA(200)",
    description: "200-Day Exponential Moving Average",
    color: "blue",
    type: "EMA",
  },
  Volume_20_MA: {
    key: "Volume_20_MA",
    dataKey: "Volume_20_MA",
    label: "Vol MA(20)",
    description: "20-Day Volume Moving Average",
    color: "coral",
    type: "Volume",
  },
};

// ============================================================================
// SVG ICONS
// ============================================================================

const MovingAverageIcon = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Smooth wave line representing moving average */}
    <path d="M2 12c2-3 4-6 6-4s4 8 6 6 4-6 6-4" />
    {/* Trend indicator dots */}
    <circle cx="4" cy="10" r="1.5" fill="currentColor" />
    <circle cx="12" cy="14" r="1.5" fill="currentColor" />
    <circle cx="20" cy="10" r="1.5" fill="currentColor" />
  </svg>
);

const TrendUpIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const TrendDownIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);

const CrossoverIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M2 18L12 8l10 10" />
    <path d="M2 6l10 10L22 6" />
  </svg>
);

const ChartIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M3 3v18h18" />
    <path d="M18 9l-5 5-4-4-3 3" />
  </svg>
);

const VolumeIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="4" y="14" width="4" height="6" rx="1" />
    <rect x="10" y="10" width="4" height="10" rx="1" />
    <rect x="16" y="6" width="4" height="14" rx="1" />
  </svg>
);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format price value
 */
const formatPrice = (value) => {
  if (value == null) return "—";
  return `$${value.toFixed(2)}`;
};

/**
 * Format volume value
 */
const formatVolume = (value) => {
  if (value == null) return "—";
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
  return value.toFixed(0);
};

/**
 * Format date for display
 */
const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

/**
 * Get trend status for price vs MA
 */
const getTrendStatus = (price, ma) => {
  if (price == null || ma == null) {
    return { status: "NEUTRAL", color: "blue", icon: "neutral" };
  }

  const percentDiff = ((price - ma) / ma) * 100;

  if (percentDiff > 5) {
    return {
      status: "BULLISH",
      color: "teal",
      icon: "up",
      percentDiff,
      description: "Price well above MA",
    };
  }
  if (percentDiff > 0) {
    return {
      status: "ABOVE",
      color: "teal",
      icon: "up",
      percentDiff,
      description: "Price above MA",
    };
  }
  if (percentDiff > -5) {
    return {
      status: "BELOW",
      color: "coral",
      icon: "down",
      percentDiff,
      description: "Price below MA",
    };
  }
  return {
    status: "BEARISH",
    color: "coral",
    icon: "down",
    percentDiff,
    description: "Price well below MA",
  };
};

/**
 * Get volume trend status
 */
const getVolumeTrendStatus = (currentVolume, volumeMA) => {
  if (currentVolume == null || volumeMA == null) {
    return { status: "NEUTRAL", color: "blue", icon: "neutral" };
  }

  const ratio = currentVolume / volumeMA;

  if (ratio > 1.5) {
    return {
      status: "HIGH VOLUME",
      color: "teal",
      icon: "up",
      ratio,
      description: "Significant volume spike",
    };
  }
  if (ratio > 1.0) {
    return {
      status: "ABOVE AVG",
      color: "teal",
      icon: "up",
      ratio,
      description: "Above average volume",
    };
  }
  if (ratio > 0.7) {
    return {
      status: "BELOW AVG",
      color: "coral",
      icon: "down",
      ratio,
      description: "Below average volume",
    };
  }
  return {
    status: "LOW VOLUME",
    color: "coral",
    icon: "down",
    ratio,
    description: "Very low volume",
  };
};

/**
 * Check for Golden Cross (50 MA crosses above 200 MA)
 */
const checkGoldenCross = (data, ma50Key, ma200Key) => {
  if (!data || data.length < 2) return null;

  const latest = data[data.length - 1];
  const previous = data[data.length - 2];

  const latestMA50 = latest?.[ma50Key];
  const latestMA200 = latest?.[ma200Key];
  const prevMA50 = previous?.[ma50Key];
  const prevMA200 = previous?.[ma200Key];

  if (
    latestMA50 == null ||
    latestMA200 == null ||
    prevMA50 == null ||
    prevMA200 == null
  ) {
    return null;
  }

  // Golden Cross: 50 MA crosses above 200 MA
  if (prevMA50 <= prevMA200 && latestMA50 > latestMA200) {
    return {
      type: "GOLDEN_CROSS",
      label: "Golden Cross",
      description: "50 MA crossed above 200 MA - Bullish signal",
      color: "teal",
    };
  }

  // Death Cross: 50 MA crosses below 200 MA
  if (prevMA50 >= prevMA200 && latestMA50 < latestMA200) {
    return {
      type: "DEATH_CROSS",
      label: "Death Cross",
      description: "50 MA crossed below 200 MA - Bearish signal",
      color: "coral",
    };
  }

  // Check current position
  if (latestMA50 > latestMA200) {
    return {
      type: "BULLISH_ALIGNMENT",
      label: "Bullish Alignment",
      description: "50 MA above 200 MA - Uptrend intact",
      color: "teal",
    };
  }

  return {
    type: "BEARISH_ALIGNMENT",
    label: "Bearish Alignment",
    description: "50 MA below 200 MA - Downtrend intact",
    color: "coral",
  };
};

// ============================================================================
// MA CARD COMPONENT
// ============================================================================

const MACard = memo(({ config, value, price, isVolume = false }) => {
  const trend = isVolume
    ? getVolumeTrendStatus(price, value) // For volume, price is current volume
    : getTrendStatus(price, value);

  const displayValue = isVolume ? formatVolume(value) : formatPrice(value);
  const percentText = isVolume
    ? trend.ratio
      ? `${(trend.ratio * 100).toFixed(0)}% of avg`
      : "—"
    : trend.percentDiff != null
      ? `${trend.percentDiff > 0 ? "+" : ""}${trend.percentDiff.toFixed(2)}%`
      : "—";

  return (
    <div className={`${styles.maCard} ${styles[config.color]}`}>
      <div className={styles.maCardHeader}>
        <span className={styles.maLabel}>{config.label}</span>
        <span className={styles.maType}>{config.type}</span>
      </div>

      <div className={styles.maValueContainer}>
        <span className={`${styles.maValue} ${styles[config.color]}`}>
          {displayValue}
        </span>
      </div>

      <div className={styles.maDescription}>{config.description}</div>

      <div className={`${styles.maTrendBadge} ${styles[trend.color]}`}>
        {trend.icon === "up" ? (
          <TrendUpIcon size={14} />
        ) : (
          <TrendDownIcon size={14} />
        )}
        <span>{trend.status}</span>
      </div>

      <div className={styles.maCardFooter}>
        <span className={styles.maPercentLabel}>vs Price:</span>
        <span className={`${styles.maPercent} ${styles[trend.color]}`}>
          {percentText}
        </span>
      </div>
    </div>
  );
});

// ============================================================================
// CROSSOVER SIGNAL COMPONENT
// ============================================================================

const CrossoverSignal = memo(({ smaSignal, emaSignal }) => {
  return (
    <div className={styles.crossoverSection}>
      <div className={styles.crossoverHeader}>
        <CrossoverIcon size={18} />
        <h3 className={styles.crossoverTitle}>MA Crossover Signals</h3>
      </div>

      <div className={styles.crossoverGrid}>
        {smaSignal && (
          <div className={`${styles.crossoverCard} ${styles[smaSignal.color]}`}>
            <div className={styles.crossoverCardHeader}>
              <span className={styles.crossoverType}>SMA 50/200</span>
              <span
                className={`${styles.crossoverLabel} ${styles[smaSignal.color]}`}
              >
                {smaSignal.label}
              </span>
            </div>
            <p className={styles.crossoverDescription}>
              {smaSignal.description}
            </p>
          </div>
        )}

        {emaSignal && (
          <div className={`${styles.crossoverCard} ${styles[emaSignal.color]}`}>
            <div className={styles.crossoverCardHeader}>
              <span className={styles.crossoverType}>EMA 50/200</span>
              <span
                className={`${styles.crossoverLabel} ${styles[emaSignal.color]}`}
              >
                {emaSignal.label}
              </span>
            </div>
            <p className={styles.crossoverDescription}>
              {emaSignal.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

// ============================================================================
// TIME SERIES CHART COMPONENT
// ============================================================================

const TimeSeriesChart = memo(({ title, data, lines, yDomain, icon }) => {
  const width = 500;
  const height = 160;
  const margin = { top: 20, right: 60, bottom: 35, left: 55 };
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
        {icon}
        <span className={styles.chartTitle}>{title}</span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={styles.chartSvg}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter
            id={glowFilterId}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
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

          {/* Data lines with glow effect */}
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
                strokeDasharray={line.dashed ? "6,4" : undefined}
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
            {yDomain[1].toFixed(0)}
          </text>
          <text
            x={-8}
            y={chartHeight + 4}
            className={styles.axisLabel}
            textAnchor="end"
          >
            {yDomain[0].toFixed(0)}
          </text>
        </g>
      </svg>

      {/* Legend */}
      <div className={styles.chartLegend}>
        {lines.map((line, idx) => (
          <div key={idx} className={styles.legendItem}>
            <span
              className={`${styles.legendColor} ${styles[line.color]}`}
              style={{
                borderStyle: line.dashed ? "dashed" : "solid",
              }}
            />
            <span className={styles.legendLabel}>{line.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function MovingAveragesDashboard({
  // Props override context values
  ticker: tickerProp,
  tickerName: tickerNameProp,
  data: dataProp,
  daysToShow = 60,
}) {
  // Get config from context (if available)
  const tickerConfig = useTickerConfig();
  const ohlcvContext = useOHLCVData();

  // Merge context with props (props take precedence)
  const ticker = tickerProp || tickerConfig.ticker;
  const tickerName = tickerNameProp || tickerConfig.tickerName;
  const data = dataProp || ohlcvContext.data || [];

  // Get latest data point and filter recent data
  const { latestData, recentData, priceRange } = useMemo(() => {
    if (!data || data.length === 0) {
      return { latestData: null, recentData: [], priceRange: [0, 100] };
    }

    const latest = data[data.length - 1];
    const recent = data.slice(-daysToShow);

    // Calculate price range for charts
    const allPrices = recent.flatMap((d) => [
      d.close,
      d.SMA_50,
      d.SMA_200,
      d.EMA_50,
      d.EMA_200,
    ]).filter((v) => v != null);

    const minPrice = Math.min(...allPrices) * 0.95;
    const maxPrice = Math.max(...allPrices) * 1.05;

    return {
      latestData: latest,
      recentData: recent,
      priceRange: [minPrice, maxPrice],
    };
  }, [data, daysToShow]);

  // Calculate volume range
  const volumeRange = useMemo(() => {
    if (!recentData || recentData.length === 0) return [0, 1000000];

    const volumes = recentData
      .flatMap((d) => [d.volume, d.Volume_20_MA])
      .filter((v) => v != null);

    const maxVol = Math.max(...volumes) * 1.1;
    return [0, maxVol];
  }, [recentData]);

  // Check for crossover signals
  const smaSignal = useMemo(() => {
    return checkGoldenCross(recentData, "SMA_50", "SMA_200");
  }, [recentData]);

  const emaSignal = useMemo(() => {
    return checkGoldenCross(recentData, "EMA_50", "EMA_200");
  }, [recentData]);

  if (!data || data.length === 0) {
    return (
      <div className={styles.dashboardWrapper}>
        <div className={styles.noData}>No data available</div>
      </div>
    );
  }

  const currentPrice = latestData?.close;
  const currentVolume = latestData?.volume;

  return (
    <div className={styles.dashboardWrapper}>
      {/* Logo Header */}
      <div className={styles.logoHeader}>
        <MovingAverageIcon size={24} />
        <span className={styles.logoText}>MovingAveragesDashboard</span>
      </div>

      {/* SMA Section */}
      <section className={styles.maSection}>
        <div className={styles.sectionHeader}>
          <ChartIcon size={18} />
          <h2 className={styles.sectionTitle}>Simple Moving Averages (SMA)</h2>
        </div>

        <div className={styles.maGrid}>
          <MACard
            config={MA_CONFIG.SMA_50}
            value={latestData?.SMA_50}
            price={currentPrice}
          />
          <MACard
            config={MA_CONFIG.SMA_200}
            value={latestData?.SMA_200}
            price={currentPrice}
          />
        </div>

        <TimeSeriesChart
          title="Price vs SMA (50/200)"
          data={recentData}
          lines={[
            { dataKey: "close", color: "blue", strokeWidth: 2, label: "Price" },
            {
              dataKey: "SMA_50",
              color: "teal",
              strokeWidth: 2,
              label: "SMA(50)",
            },
            {
              dataKey: "SMA_200",
              color: "coral",
              strokeWidth: 2,
              dashed: true,
              label: "SMA(200)",
            },
          ]}
          yDomain={priceRange}
          icon={<ChartIcon size={16} />}
        />
      </section>

      {/* EMA Section */}
      <section className={styles.maSection}>
        <div className={styles.sectionHeader}>
          <ChartIcon size={18} />
          <h2 className={styles.sectionTitle}>
            Exponential Moving Averages (EMA)
          </h2>
        </div>

        <div className={styles.maGrid}>
          <MACard
            config={MA_CONFIG.EMA_50}
            value={latestData?.EMA_50}
            price={currentPrice}
          />
          <MACard
            config={MA_CONFIG.EMA_200}
            value={latestData?.EMA_200}
            price={currentPrice}
          />
        </div>

        <TimeSeriesChart
          title="Price vs EMA (50/200)"
          data={recentData}
          lines={[
            { dataKey: "close", color: "blue", strokeWidth: 2, label: "Price" },
            {
              dataKey: "EMA_50",
              color: "teal",
              strokeWidth: 2,
              label: "EMA(50)",
            },
            {
              dataKey: "EMA_200",
              color: "coral",
              strokeWidth: 2,
              dashed: true,
              label: "EMA(200)",
            },
          ]}
          yDomain={priceRange}
          icon={<ChartIcon size={16} />}
        />
      </section>

      {/* Volume MA Section */}
      <section className={styles.maSection}>
        <div className={styles.sectionHeader}>
          <VolumeIcon size={18} />
          <h2 className={styles.sectionTitle}>Volume Moving Average</h2>
        </div>

        <div className={styles.maGrid}>
          <MACard
            config={MA_CONFIG.Volume_20_MA}
            value={latestData?.Volume_20_MA}
            price={currentVolume}
            isVolume={true}
          />
        </div>

        <TimeSeriesChart
          title="Volume vs Volume MA(20)"
          data={recentData}
          lines={[
            {
              dataKey: "volume",
              color: "blue",
              strokeWidth: 2,
              label: "Volume",
            },
            {
              dataKey: "Volume_20_MA",
              color: "coral",
              strokeWidth: 2,
              dashed: true,
              label: "Vol MA(20)",
            },
          ]}
          yDomain={volumeRange}
          icon={<VolumeIcon size={16} />}
        />
      </section>

      {/* Crossover Signals */}
      <CrossoverSignal smaSignal={smaSignal} emaSignal={emaSignal} />

      {/* Footer */}
      <footer className={styles.dashboardFooter}>
        <span className={styles.footerBadge}>
          <MovingAverageIcon size={14} />
          Moving Averages Analysis
        </span>
      </footer>
    </div>
  );
}

export default MovingAveragesDashboard;
