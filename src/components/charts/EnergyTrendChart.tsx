import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import type { EnergyTrendPoint } from '../../utils/energyStatsUtil';
import './EnergyTrendChart.scss';

export interface EnergyTrendChartProps {
  data: EnergyTrendPoint[];
  emptyLabel: string;
}

const WIDTH = 600;
const HEIGHT = 240;
const PADDING_X = 32;
const PADDING_Y = 24;
const MIN_LEVEL = 0;
const MAX_LEVEL = 10;
const GRID_LEVELS = [0, 2.5, 5, 7.5, 10];

/**
 * Dependency-free inline SVG line/area chart of daily average energy
 * level over time. Responsive via viewBox, themed via CSS variables.
 */
const EnergyTrendChart = ({ data, emptyLabel }: EnergyTrendChartProps) => {
  const { i18n } = useTranslation();

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(i18n.language, { month: 'short', day: 'numeric' }),
    [i18n.language]
  );

  const points = useMemo(() => {
    if (!data.length) return [];

    const innerWidth = WIDTH - PADDING_X * 2;
    const innerHeight = HEIGHT - PADDING_Y * 2;
    const stepX = data.length > 1 ? innerWidth / (data.length - 1) : 0;

    return data.map((point, index) => {
      const x = data.length > 1 ? PADDING_X + stepX * index : WIDTH / 2;
      const ratio = (point.avgLevel - MIN_LEVEL) / (MAX_LEVEL - MIN_LEVEL);
      const clampedRatio = Math.min(Math.max(ratio, 0), 1);
      const y = PADDING_Y + innerHeight * (1 - clampedRatio);
      return { ...point, x, y };
    });
  }, [data]);

  if (!points.length) {
    return <div className="energy-trend-chart energy-trend-chart--empty">{emptyLabel}</div>;
  }

  const linePath = points.map((p, index) => `${index === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${HEIGHT - PADDING_Y} L ${points[0].x} ${HEIGHT - PADDING_Y} Z`;

  const tickEvery = Math.max(1, Math.ceil(points.length / 6));

  return (
    <div className="energy-trend-chart">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="energy-trend-chart__svg"
        preserveAspectRatio="xMidYMid meet"
        role="img"
      >
        <defs>
          <linearGradient id="energyTrendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--garden-grass)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--garden-grass)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {GRID_LEVELS.map((level) => {
          const y = PADDING_Y + (HEIGHT - PADDING_Y * 2) * (1 - level / MAX_LEVEL);
          return (
            <line
              key={level}
              x1={PADDING_X}
              y1={y}
              x2={WIDTH - PADDING_X}
              y2={y}
              className="energy-trend-chart__gridline"
            />
          );
        })}

        <motion.path
          d={areaPath}
          fill="url(#energyTrendFill)"
          stroke="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />

        <motion.path
          d={linePath}
          fill="none"
          className="energy-trend-chart__line"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        {points.map((p) => (
          <circle key={p.date} cx={p.x} cy={p.y} r={3} className="energy-trend-chart__dot">
            <title>{`${p.date}: ${p.avgLevel}`}</title>
          </circle>
        ))}

        {points.map((p, index) =>
          index % tickEvery === 0 || index === points.length - 1 ? (
            <text
              key={`label-${p.date}`}
              x={p.x}
              y={HEIGHT - 4}
              className="energy-trend-chart__tick"
              textAnchor="middle"
            >
              {dateFormatter.format(new Date(`${p.date}T00:00:00`))}
            </text>
          ) : null
        )}
      </svg>
    </div>
  );
};

export default EnergyTrendChart;
