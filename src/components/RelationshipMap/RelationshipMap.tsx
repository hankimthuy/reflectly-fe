import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Person } from '../../models/person';
import { useUpdatePersonMutation } from '../../queries/peopleQueryHook';
import { usePersonInsightsQuery } from '../../queries/insightsQueryHook';
import PersonForm from '../PersonForm/PersonForm';

interface RelationshipMapProps {
  people: Person[];
  emptyLabel: string;
}

const SIZE = 360;
const CENTER = SIZE / 2;
const RADIUS = 130;
const NODE_RADIUS = 26;

/** Red (0.0) → amber (0.5) → green (1.0), interpolated in RGB space — good enough for a small UI dot. */
function healthColor(signal: number): string {
  const clamped = Math.min(1, Math.max(0, signal));
  const stops = [
    { at: 0, rgb: [239, 68, 68] },
    { at: 0.5, rgb: [245, 158, 11] },
    { at: 1, rgb: [34, 197, 94] },
  ];
  let lower = stops[0];
  let upper = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (clamped >= stops[i].at && clamped <= stops[i + 1].at) {
      lower = stops[i];
      upper = stops[i + 1];
      break;
    }
  }
  const span = upper.at - lower.at || 1;
  const t = (clamped - lower.at) / span;
  const rgb = lower.rgb.map((c, i) => Math.round(c + (upper.rgb[i] - c) * t));
  return `rgb(${rgb.join(',')})`;
}

const RelationshipMap = ({ people, emptyLabel }: RelationshipMapProps) => {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const updatePerson = useUpdatePersonMutation();

  const nodes = useMemo(() => {
    return people.map((person, index) => {
      const angle = (2 * Math.PI * index) / people.length - Math.PI / 2;
      return {
        person,
        x: CENTER + RADIUS * Math.cos(angle),
        y: CENTER + RADIUS * Math.sin(angle),
      };
    });
  }, [people]);

  const selected = people.find((p) => p.id === selectedId) ?? null;
  const { data: personInsights } = usePersonInsightsQuery(selected?.id ?? null);

  if (people.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-coach-border bg-coach-surface p-8 text-center text-sm text-coach-text-muted">
        {emptyLabel}
      </div>
    );
  }

  const selectPerson = (personId: string) => {
    setIsEditing(false);
    setSelectedId(personId === selectedId ? null : personId);
  };

  return (
    <div className="rounded-2xl border border-coach-border bg-coach-surface p-4">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full">
        {nodes.map(({ person, x, y }) => (
          <line
            key={`line-${person.id}`}
            x1={CENTER}
            y1={CENTER}
            x2={x}
            y2={y}
            stroke="var(--color-coach-border)"
            strokeWidth={2}
          />
        ))}

        <circle cx={CENTER} cy={CENTER} r={30} fill="var(--color-coach-primary)" />
        <text x={CENTER} y={CENTER + 5} textAnchor="middle" fontSize={13} fill="white" fontWeight={600}>
          {t('dashboard.you')}
        </text>

        {nodes.map(({ person, x, y }) => (
          <g
            key={person.id}
            className="cursor-pointer"
            tabIndex={0}
            role="button"
            aria-label={person.name}
            aria-pressed={person.id === selectedId}
            onClick={() => selectPerson(person.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectPerson(person.id);
              }
            }}
          >
            <circle
              cx={x}
              cy={y}
              r={NODE_RADIUS}
              fill={healthColor(person.healthSignal)}
              stroke={person.id === selectedId ? 'var(--color-coach-text)' : 'white'}
              strokeWidth={person.id === selectedId ? 3 : 2}
            />
            <text x={x} y={y + 4} textAnchor="middle" fontSize={11} fill="white" fontWeight={600}>
              {person.name.slice(0, 2).toUpperCase()}
            </text>
            <text x={x} y={y + NODE_RADIUS + 16} textAnchor="middle" fontSize={12} fill="var(--color-coach-text)">
              {person.name}
            </text>
          </g>
        ))}
      </svg>

      {selected && isEditing && (
        <div className="mt-3">
          <PersonForm
            initialValue={{ name: selected.name, relationshipType: selected.relationshipType, notes: selected.notes ?? undefined }}
            submitLabel={t('dashboard.person.save')}
            onCancel={() => setIsEditing(false)}
            onSubmit={async (person) => {
              await updatePerson.mutateAsync({ id: selected.id, person });
              setIsEditing(false);
            }}
          />
        </div>
      )}

      {selected && !isEditing && (
        <div className="mt-3 rounded-xl bg-coach-bg p-3 text-sm text-coach-text">
          <div className="flex items-center justify-between">
            <p className="font-medium">{selected.name}</p>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-xs font-medium text-coach-primary hover:underline"
            >
              {t('dashboard.person.edit')}
            </button>
          </div>
          {selected.notes && <p className="mt-1 text-coach-text-muted">{selected.notes}</p>}
          {selected.nudgeText ? (
            <p className="mt-1 text-coach-text-muted">{selected.nudgeText}</p>
          ) : (
            <p className="mt-1 text-coach-text-muted">
              {t('dashboard.noNudge')}
            </p>
          )}

          {personInsights && personInsights.content.length > 0 && (
            <div className="mt-3 border-t border-coach-border pt-2">
              <p className="text-xs font-semibold tracking-wide text-coach-text-muted uppercase">
                {t('dashboard.person.relatedInsights')}
              </p>
              <ul className="mt-1 flex flex-col gap-1">
                {personInsights.content.map((insight) => (
                  <li key={insight.id} className="text-xs text-coach-text-muted">
                    {insight.insightText}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RelationshipMap;
