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

/**
 * Four flat fills, not a continuous gradient — a legend, not a health "meter".
 *
 * The two states that want something from you are clay: Aura Soft reserves indigo/accent for
 * "primary action" and clay for "needs attention", so a relationship that needs you must never
 * reuse the CTA color. Above the health threshold the old single "healthy" bucket splits in two
 * on `daysSinceLastMention` — someone you've brought up in the last few days reads as "talked
 * about most" (periwinkle-light) rather than sitting in the same bucket as someone who is simply
 * fine and quiet ("steady", a mist fill with a hairline so it still reads as a node).
 */
const RECENTLY_MENTIONED_DAYS = 3;

type NodeBucket = 'needsAttention' | 'drifting' | 'talkedAboutMost' | 'steady';

interface NodeStyle {
  fill: string;
  stroke: string;
  /** Node labels sit directly on the fill, so this tracks the fill rather than being derived
   * from it — clay is dark enough to need a light label, the other three take ink. */
  text: string;
}

const BUCKET_STYLES: Record<NodeBucket, NodeStyle> = {
  needsAttention: { fill: 'var(--color-clay)', stroke: 'var(--color-clay)', text: 'var(--color-paper)' },
  drifting: { fill: 'var(--color-clay-light)', stroke: 'var(--color-clay-light)', text: 'var(--color-ink)' },
  talkedAboutMost: { fill: 'var(--color-periwinkle-light)', stroke: 'var(--color-periwinkle-light)', text: 'var(--color-ink)' },
  steady: { fill: 'var(--color-mist)', stroke: 'var(--color-divider)', text: 'var(--color-ink)' },
};

/** The legend, in the order the buckets are explained. */
const LEGEND_BUCKETS: NodeBucket[] = ['needsAttention', 'drifting', 'talkedAboutMost', 'steady'];

const nodeBucket = (person: Person): NodeBucket => {
  if (person.healthSignal < 0.35) return 'needsAttention';
  if (person.healthSignal < 0.7) return 'drifting';
  const days = person.daysSinceLastMention;
  if (days != null && days <= RECENTLY_MENTIONED_DAYS) return 'talkedAboutMost';
  return 'steady';
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
          <line key={`line-${person.id}`} x1={CENTER} y1={CENTER} x2={x} y2={y} stroke="var(--color-divider)" strokeWidth={1.5} />
        ))}

        <circle cx={CENTER} cy={CENTER} r={30} fill="var(--color-text)" />
        <text x={CENTER} y={CENTER + 5} textAnchor="middle" fontFamily="DM Sans, system-ui, sans-serif" fontWeight={700} fontSize={14} fill="var(--color-paper)">
          {t('dashboard.you')}
        </text>

        {nodes.map(({ person, x, y }) => {
          const active = person.id === selectedId;
          const { fill, stroke, text: textColor } = BUCKET_STYLES[nodeBucket(person)];
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
                rx={NODE_H / 2}
                ry={NODE_H / 2}
                fill={fill}
                stroke={active ? 'var(--color-ink)' : stroke}
                strokeWidth={active ? 2.5 : 1}
              />
              <text x={x} y={y + 5} textAnchor="middle" fontFamily="DM Sans, system-ui, sans-serif" fontWeight={600} fontSize={13} fill={textColor}>
                {person.name}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="relationship-map__legend">
        {LEGEND_BUCKETS.map((bucket) => (
          <span key={bucket} className="relationship-map__legend-item">
            <span className="relationship-map__legend-swatch" style={{ background: BUCKET_STYLES[bucket].fill }} />
            {t(`reflect.people.${bucket}`)}
          </span>
        ))}
      </div>
    </div>
  );
};

export default RelationshipMap;
