import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Person } from '../../models/person';
import './RelationshipMap.scss';

interface RelationshipMapProps {
  people: Person[];
  emptyLabel: string;
  selectedId: string | null;
  onSelect: (personId: string) => void;
}

const SIZE = 380;
const CENTER = SIZE / 2;
const RADIUS = 140;
const NODE_W = 76;
const NODE_H = 32;

/** Needs attention (low health) → accent; drifting (mid) → accent-300; steady (high) → the
 * ground itself, bordered. Three flat fills, not a continuous gradient — matches the legend in
 * mockup 1c rather than a health "meter". */
const nodeFill = (signal: number): string => {
  if (signal < 0.35) return 'var(--color-accent)';
  if (signal < 0.7) return 'var(--color-accent-300)';
  return 'var(--color-bg)';
};

const RelationshipMap = ({ people, emptyLabel, selectedId, onSelect }: RelationshipMapProps) => {
  const { t } = useTranslation();

  const nodes = useMemo(
    () =>
      people.map((person, index) => {
        const angle = (2 * Math.PI * index) / people.length - Math.PI / 2;
        return { person, x: CENTER + RADIUS * Math.cos(angle), y: CENTER + RADIUS * Math.sin(angle) };
      }),
    [people],
  );

  if (people.length === 0) {
    return <div className="relationship-map__empty">{emptyLabel}</div>;
  }

  return (
    <div className="relationship-map">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="relationship-map__svg">
        {nodes.map(({ person, x, y }) => (
          <line key={`line-${person.id}`} x1={CENTER} y1={CENTER} x2={x} y2={y} stroke="var(--color-text)" strokeWidth={1.5} />
        ))}

        <rect x={CENTER - 34} y={CENTER - 18} width={68} height={36} fill="var(--color-text)" />
        <text x={CENTER} y={CENTER + 5} textAnchor="middle" fontFamily="Archivo, sans-serif" fontWeight={800} fontSize={15} fill="var(--color-bg)">
          {t('dashboard.you')}
        </text>

        {nodes.map(({ person, x, y }) => {
          const active = person.id === selectedId;
          const fill = nodeFill(person.healthSignal);
          const textColor = fill === 'var(--color-accent)' ? 'var(--color-bg)' : 'var(--color-text)';
          return (
            <g
              key={person.id}
              className="relationship-map__node"
              tabIndex={0}
              role="button"
              aria-label={person.name}
              aria-pressed={active}
              onClick={() => onSelect(person.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(person.id);
                }
              }}
            >
              <rect
                x={x - NODE_W / 2}
                y={y - NODE_H / 2}
                width={NODE_W}
                height={NODE_H}
                fill={fill}
                stroke="var(--color-text)"
                strokeWidth={active ? 3 : 2}
              />
              <text x={x} y={y + 5} textAnchor="middle" fontFamily="Archivo, sans-serif" fontWeight={800} fontSize={13} fill={textColor}>
                {person.name}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="relationship-map__legend">
        <span className="relationship-map__legend-item">
          <span className="relationship-map__legend-swatch" style={{ background: 'var(--color-accent)' }} />
          {t('reflect.people.needsAttention')}
        </span>
        <span className="relationship-map__legend-item">
          <span className="relationship-map__legend-swatch" style={{ background: 'var(--color-accent-300)' }} />
          {t('reflect.people.drifting')}
        </span>
        <span className="relationship-map__legend-item">
          <span className="relationship-map__legend-swatch" style={{ background: 'var(--color-bg)' }} />
          {t('reflect.people.steady')}
        </span>
      </div>
    </div>
  );
};

export default RelationshipMap;
