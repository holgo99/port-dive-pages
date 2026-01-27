import React, {
  useState,
  useMemo,
  useCallback,
  memo,
  useRef,
  useEffect,
} from "react";
import styles from "./styles.module.css";

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

    // Use pre-calculated moving averages from the data
    const ma50 = useMemo(
      () =>
        data
          .map((d, idx) =>
            d["50_MA"] != null ? { idx, ma: d["50_MA"] } : null,
          )
          .filter(Boolean),
      [data],
    );
    const ma200 = useMemo(
      () =>
        data
          .map((d, idx) =>
            d["200_MA"] != null ? { idx, ma: d["200_MA"] } : null,
          )
          .filter(Boolean),
      [data],
    );

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

    // Calculate aspect ratio for responsive scaling
    const aspectRatio = W / H;

    // Get projected target
    const projectedPrice = activeCount.projected.at(-1).price || null;

    return (
      <svg
        width="100%"
        viewBox={`0 0 ${W} ${H}`}
        style={{
          background: theme.surface,
          borderRadius: "12px",
          border: `1px solid ${theme.border}`,
          display: "block",
          aspectRatio: `${aspectRatio}`,
          height: "auto",
          maxHeight: `${H}px`,
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
              stopColor={PORTDIVE_THEME.primary}
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
              stopColor={PORTDIVE_THEME.primary}
              stopOpacity="0.12"
            />
            <stop
              offset="100%"
              stopColor={PORTDIVE_THEME.primaryLight}
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
              stopColor={PORTDIVE_THEME.secondaryLight}
              stopOpacity="0.12"
            />
            <stop
              offset="100%"
              stopColor={PORTDIVE_THEME.secondary}
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
                stroke={isProjection ? PORTDIVE_THEME.primary : theme.grid}
                strokeWidth="1"
                strokeDasharray={isProjection ? "4,4" : ""}
                opacity={isProjection ? 0.3 : 1}
              />
              <text
                x={idxToX(i)}
                y={H - M.b + 22}
                textAnchor="middle"
                fill={
                  isProjection ? PORTDIVE_THEME.primary : theme.textSecondary
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
                  stroke={PORTDIVE_THEME.fibonacci.primary}
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
                  stroke={PORTDIVE_THEME.fibonacci.primary}
                  strokeWidth={1}
                  opacity={0.9}
                />
                <text
                  x={W - M.r - 33}
                  y={y + 4}
                  textAnchor="middle"
                  fill={PORTDIVE_THEME.fibonacci.primary}
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
                  stroke={PORTDIVE_THEME.fibonacci.extension}
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
                    key ? PORTDIVE_THEME.fibonacci.extension : theme.surface
                  }
                  stroke={PORTDIVE_THEME.fibonacci.extension}
                  strokeWidth={1}
                  opacity={0.95}
                />
                <text
                  x={W - M.r + 36}
                  y={y + 4}
                  textAnchor="middle"
                  fill={key ? "#fff" : PORTDIVE_THEME.fibonacci.extension}
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
              fill={activeCount.projectedTargetBand.fill}
              rx={4}
            />
            <text
              x={idxToX(data.length + projectionBars * 0.25)}
              y={
                priceToY(projectedPrice) -
                (10 * projectedPrice >= currentPrice ? 1.0 : -1.0)
              }
              textAnchor="middle"
              fill={activeCount.projectedTargetBand.color}
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
              stroke={PORTDIVE_THEME.secondary}
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
              fill={PORTDIVE_THEME.secondary}
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
            stroke={PORTDIVE_THEME.movingAverage.fast}
            strokeWidth="2.5"
            opacity={0.7}
          />
        )}
        {ma200.length > 1 && (
          <path
            d={`M ${ma200.map(({ idx, ma }) => `${idxToX(idx)},${priceToY(ma)}`).join(" L ")}`}
            fill="none"
            stroke={PORTDIVE_THEME.movingAverage.slow}
            strokeWidth="2.5"
            opacity={0.6}
          />
        )}

        {/* Candlesticks - Crisp rendering */}
        {processedData.map((d, i) => {
          const x = idxToX(i);
          const isGreen = d.close >= d.open;
          const bodyColor = isGreen
            ? PORTDIVE_THEME.candleUp
            : PORTDIVE_THEME.candleDown;
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
                    L ${idxToX(activeCount.pivots.wave3Peak.idx)},${priceToY(activeCount.pivots.wave3Peak.price)}`}
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

        {/* Minor waves - Only for primary count */}
        {analysisState.showMinorWaves &&
          activeWaveCount === "alt2" &&
          activeCount.minorWaves && (
            <g>
              <path
                d={`M ${idxToX(activeCount.minorWaves.waveWStart.idx)},${priceToY(activeCount.minorWaves.waveWStart.price)}
                L ${idxToX(activeCount.minorWaves.waveWLow.idx)},${priceToY(activeCount.minorWaves.waveWLow.price)}
                L ${idxToX(activeCount.minorWaves.waveXPeak.idx)},${priceToY(activeCount.minorWaves.waveXPeak.price)}
                L ${idxToX(activeCount.minorWaves.waveYLow.idx)},${priceToY(activeCount.minorWaves.waveYLow.price)}`}
                fill="none"
                stroke={PORTDIVE_THEME.secondary}
                strokeWidth="1.5"
                strokeDasharray="6,4"
                opacity="0.7"
              />
              {renderWaveLabel(
                idxToX(activeCount.minorWaves.waveWLow.idx),
                priceToY(activeCount.minorWaves.waveWLow.price),
                activeCount.minorWaves.waveWLow.label,
                false,
                PORTDIVE_THEME.secondary,
                true,
              )}
              {renderWaveLabel(
                idxToX(activeCount.minorWaves.waveXPeak.idx),
                priceToY(activeCount.minorWaves.waveXPeak.price),
                activeCount.minorWaves.waveXPeak.label,
                true,
                PORTDIVE_THEME.secondary,
                true,
              )}
              {renderWaveLabel(
                idxToX(activeCount.minorWaves.waveYLow.idx),
                priceToY(activeCount.minorWaves.waveYLow.price),
                activeCount.minorWaves.waveYLow.label,
                false,
                PORTDIVE_THEME.secondary,
                true,
              )}
            </g>
          )}

        {/* Projected Wave 5 path */}
        {analysisState.showMotiveWaves && activeWaveCount === "primary" && (
          <g>
            <path
              d={`M ${idxToX(activeCount.projected[0].idx)},${priceToY(activeCount.projected[0].price)}
                L ${idxToX(data.length + projectionBars * projectionBarsScale)},${priceToY(projectedPrice)}`}
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
                cy={priceToY(projectedPrice) - 28}
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
                y={priceToY(projectedPrice) - 23}
                textAnchor="middle"
                fill="#fff"
                fontSize="14"
                fontWeight="700"
              >
                {activeCount.projected.at(-1).label}
              </text>
              <text
                x={idxToX(data.length + projectionBars * projectionBarsScale)}
                y={priceToY(projectedPrice)}
                textAnchor="middle"
                fill={activeCount.color}
                fontSize="10"
                fontWeight="600"
                opacity={0.8}
              >
                ${projectedPrice}
              </text>
            </g>
          </g>
        )}

        {/* Projected Wave C path */}
        {analysisState.showCorrectiveWaves && activeWaveCount === "alt1" && (
          <g>
            <path
              d={`M ${idxToX(activeCount.projected[0].idx)},${priceToY(activeCount.projected[0].price)}
                L ${idxToX(data.length + projectionBars * projectionBarsScale)},${priceToY(projectedPrice)}`}
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
                cy={priceToY(projectedPrice) + 23}
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
                y={priceToY(projectedPrice) + 28}
                textAnchor="middle"
                fill="#fff"
                fontSize="14"
                fontWeight="700"
              >
                {activeCount.projected.at(-1).label}
              </text>
              <text
                x={idxToX(data.length + projectionBars * projectionBarsScale)}
                y={priceToY(projectedPrice)}
                textAnchor="middle"
                fill={activeCount.color}
                fontSize="10"
                fontWeight="600"
                opacity={0.8}
              >
                ${projectedPrice}
              </text>
            </g>
          </g>
        )}

        {/* Projected Wave 4 path */}
        {analysisState.showCorrectiveWaves && activeWaveCount === "alt2" && (
          <g>
            <path
              d={`M ${idxToX(activeCount.projected[0].idx)},${priceToY(activeCount.projected[0].price)}
                L ${idxToX(data.length + projectionBars * projectionBarsScale * 0.5)},${priceToY(activeCount.projected[1].price)}
                L ${idxToX(data.length + projectionBars * projectionBarsScale)},${priceToY(projectedPrice)}`}
              fill="none"
              stroke={PORTDIVE_THEME.primary}
              strokeWidth="2"
              strokeDasharray="8,6"
              opacity="0.5"
            />
            {/* Wave 4 + 5 projected label */}
            <g>
              <ellipse
                cx={idxToX(
                  data.length + projectionBars * projectionBarsScale * 0.5,
                )}
                cy={priceToY(activeCount.projected[1].price) + 23}
                rx={16}
                ry={16}
                stroke={PORTDIVE_THEME.primary}
                strokeWidth={1.5}
                strokeDasharray="5,3"
                opacity={0.6}
                filter="url(#labelShadow)"
              />
              <text
                x={idxToX(
                  data.length + projectionBars * projectionBarsScale * 0.5,
                )}
                y={priceToY(activeCount.projected[1].price) + 28}
                textAnchor="middle"
                fill="#fff"
                fontSize="14"
                fontWeight="700"
              >
                {activeCount.projected.at(1).label}
              </text>
              <ellipse
                cx={idxToX(data.length + projectionBars * projectionBarsScale)}
                cy={priceToY(projectedPrice) - 28}
                rx={16}
                ry={16}
                stroke={PORTDIVE_THEME.primary}
                strokeWidth={1.5}
                strokeDasharray="5,3"
                opacity={0.6}
                filter="url(#labelShadow)"
              />
              <text
                x={idxToX(data.length + projectionBars * projectionBarsScale)}
                y={priceToY(projectedPrice) - 23}
                textAnchor="middle"
                fill="#fff"
                fontSize="14"
                fontWeight="700"
              >
                {activeCount.projected.at(-1).label}
              </text>
              <text
                x={idxToX(data.length + projectionBars * projectionBarsScale)}
                y={priceToY(projectedPrice)}
                textAnchor="middle"
                fill={PORTDIVE_THEME.primary}
                fontSize="10"
                fontWeight="600"
                opacity={0.8}
              >
                ${projectedPrice}
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
                isGreen ? PORTDIVE_THEME.volume.up : PORTDIVE_THEME.volume.down
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
                ? PORTDIVE_THEME.candleUp
                : PORTDIVE_THEME.candleDown
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
                ? PORTDIVE_THEME.candleUp
                : PORTDIVE_THEME.candleDown
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
                stroke={PORTDIVE_THEME.movingAverage.fast}
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
                stroke={PORTDIVE_THEME.movingAverage.slow}
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
            fill={PORTDIVE_THEME.primary}
            opacity={0.15}
          />
          <text
            x="0"
            y="3"
            textAnchor="middle"
            fill={PORTDIVE_THEME.primary}
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
