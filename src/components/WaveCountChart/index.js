import React, { useMemo, useCallback, memo } from "react";
import { useChartContext } from "@site/src/components/ChartCanvas";
import { PORTDIVE_THEME } from "@site/src/components/PortDiveTheme";

// ============================================================================
// WAVE COUNT CHART - Renders wave analysis on ChartCanvas
// ============================================================================

/**
 * WaveCountChart renders Elliott Wave analysis overlays
 * Must be used as a child of ChartCanvas to access chart context
 *
 * @param {Object} props
 * @param {Object} props.activeCount - Active wave count scenario from useWaveCount
 * @param {string} props.activeWaveCountId - ID of active wave count (primary, alt1, alt2)
 * @param {Object} props.analysisState - Toggle state for various overlays
 */
const WaveCountChart = memo(
  ({ activeCount, activeWaveCountId, analysisState }) => {
    const {
      W,
      H,
      M,
      cW,
      cH,
      priceToY,
      idxToX,
      data,
      projectionBars,
      currentPrice,
      theme,
    } = useChartContext();

    const projectionBarsScale = 0.75;

    // Fibonacci retracement levels (based on wave 3 peak to wave 4 low)
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

    // Fibonacci extensions
    const fibExtensions = useMemo(() => {
      const wave1Length = 55.75 - 18.31,
        wave4Low = 75.25;
      return [
        { ratio: 1.0, price: wave4Low + wave1Length * 1.0, label: "1.0x" },
        {
          ratio: 1.272,
          price: wave4Low + wave1Length * 1.272,
          label: "1.272x",
        },
        {
          ratio: 1.618,
          price: wave4Low + wave1Length * 1.618,
          label: "1.618x",
          key: true,
        },
      ];
    }, []);

    // Wave label renderer
    const renderWaveLabel = useCallback(
      (x, y, label, above, color, isMinor = false) => {
        const size = isMinor ? 20 : 26;
        const fontSize = isMinor ? 12 : 14;
        const yOffset = above ? -(size + 8) : size + 8;

        return (
          <g key={`label-${label}-${x}-${y}`}>
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

    // Get projected target price
    const projectedPrice = activeCount?.projected?.at(-1)?.price || null;

    if (!activeCount) return null;

    return (
      <g className="wave-count-overlay">
        {/* Fibonacci Retracement */}
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
        {analysisState.showTargetBand && activeCount.projectedTargetBand && (
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
                10 * (projectedPrice >= currentPrice ? 1.0 : -1.0)
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

        {/* Motive Wave lines - Primary count */}
        {analysisState.showMotiveWaves && activeWaveCountId === "primary" && (
          <g>
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
          </g>
        )}

        {/* Motive Wave lines - Alt2 count */}
        {analysisState.showMotiveWaves && activeWaveCountId === "alt2" && (
          <g>
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
          </g>
        )}

        {/* Corrective Wave lines - Alt1 count */}
        {analysisState.showCorrectiveWaves && activeWaveCountId === "alt1" && (
          <g>
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
          </g>
        )}

        {/* Minor waves - Primary count */}
        {analysisState.showMinorWaves &&
          activeWaveCountId === "primary" &&
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

        {/* Minor waves - Alt2 count (W-X-Y) */}
        {analysisState.showMinorWaves &&
          activeWaveCountId === "alt2" &&
          activeCount.minorWaves?.waveWStart && (
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

        {/* Projected Wave 5 path - Primary */}
        {analysisState.showMotiveWaves &&
          activeWaveCountId === "primary" &&
          projectedPrice && (
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
              <g>
                <ellipse
                  cx={idxToX(
                    data.length + projectionBars * projectionBarsScale,
                  )}
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

        {/* Projected Wave C path - Alt1 */}
        {analysisState.showCorrectiveWaves &&
          activeWaveCountId === "alt1" &&
          projectedPrice && (
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
              <g>
                <ellipse
                  cx={idxToX(
                    data.length + projectionBars * projectionBarsScale,
                  )}
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

        {/* Projected Wave 4+5 path - Alt2 */}
        {analysisState.showCorrectiveWaves &&
          activeWaveCountId === "alt2" &&
          activeCount.projected?.length >= 3 && (
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
                  {activeCount.projected[1].label}
                </text>
                <ellipse
                  cx={idxToX(
                    data.length + projectionBars * projectionBarsScale,
                  )}
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
      </g>
    );
  },
);

WaveCountChart.displayName = "WaveCountChart";

export { WaveCountChart as WaveCountChart };
export default WaveCountChart;
