import { useTranslation } from 'react-i18next';
import { LuArrowRight } from 'react-icons/lu';
import { ButtonLink } from '../Button/Button';
import { APP_ROUTES } from '../../constants/route';

const WIDTH = 220;
// Taller than it is wide: the viewBox needs enough room below the lowest node for its label to
// not get clipped by the SVG's default overflow:hidden — see RADIUS/NODE_RADIUS math below.
const HEIGHT = 245;
const CENTER_X = WIDTH / 2;
const CENTER_Y = 100;
const RADIUS = 68;
const NODE_RADIUS = 18;
const CENTER_NODE_RADIUS = 24;
const NODE_KEYS = ['node1', 'node2', 'node3', 'node4'] as const;

/**
 * Static, illustrative preview of the relationship map (PRM — Personal Relationship Management)
 * for the (public, unauthenticated) homepage — modeled on RelationshipMap.tsx's visual language
 * but with hardcoded example nodes instead of real Person[] data (which requires an
 * authenticated usePeopleQuery()).
 *
 * The Johari Window used to share this card behind a view-switcher dropdown; it's now its own
 * section (see JohariWindowCard.tsx) so neither concept is hidden behind a click on a page whose
 * job is to introduce both.
 *
 * Nodes are plain colored circles for now (no avatar imagery) — a person-avatar picker
 * (library-driven, user-selectable) is a planned future enhancement, not built here.
 */
const RelationshipMapPreviewCard = () => {
  const { t } = useTranslation();

  const nodes = NODE_KEYS.map((key, index) => {
    const angle = (2 * Math.PI * index) / NODE_KEYS.length - Math.PI / 2;
    return {
      key,
      label: t(`homePreview.map.${key}`),
      x: CENTER_X + RADIUS * Math.cos(angle),
      y: CENTER_Y + RADIUS * Math.sin(angle),
    };
  });

  return (
    <div className="mx-auto flex max-w-md flex-col rounded-2xl border border-coach-border bg-coach-surface p-4">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="mx-auto w-full max-w-[200px]" aria-hidden="true">
        {nodes.map((node) => (
          <line
            key={`line-${node.key}`}
            x1={CENTER_X}
            y1={CENTER_Y}
            x2={node.x}
            y2={node.y}
            stroke="var(--color-coach-border)"
            strokeWidth={2}
            strokeDasharray="4 4"
          />
        ))}

        <circle cx={CENTER_X} cy={CENTER_Y} r={CENTER_NODE_RADIUS} fill="var(--color-coach-primary)" />
        <text x={CENTER_X} y={CENTER_Y + 4} textAnchor="middle" fontSize={11} fill="white" fontWeight={600}>
          {t('homePreview.map.centerLabel')}
        </text>

        {nodes.map((node) => (
          <g key={node.key}>
            <circle
              cx={node.x}
              cy={node.y}
              r={NODE_RADIUS}
              fill="var(--color-coach-primary-light)"
              stroke="white"
              strokeWidth={2}
            />
            <text
              x={node.x}
              y={node.y + NODE_RADIUS + 13}
              textAnchor="middle"
              fontSize={10}
              fill="var(--color-coach-text)"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>

      <ButtonLink to={APP_ROUTES.DASHBOARD} variant="ghost" size="sm" className="mt-1 self-end !px-0">
        {t('homePreview.cta')}
        <LuArrowRight size={14} />
      </ButtonLink>
    </div>
  );
};

export default RelationshipMapPreviewCard;
