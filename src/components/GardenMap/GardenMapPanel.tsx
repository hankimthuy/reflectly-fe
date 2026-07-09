import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { GARDEN_ZONES } from '../../constants/gardenZones';
import type { GardenMarkerPosition } from '../../constants/gardenMapScene';
import './GardenMapPanel.scss';

export type GardenMapPanelVariant = 'png' | 'svg' | 'prod';

interface GardenMapPanelProps {
  variant: GardenMapPanelVariant;
  label?: string;
  children: ReactNode;
  markerPositions: Record<string, GardenMarkerPosition>;
  activeZone: string | null;
  onZoneHover: (zoneId: string | null) => void;
  onZoneClick: (zoneId: string) => void;
  showCoords?: boolean;
}

const GardenMapPanel = ({
  variant,
  label,
  children,
  markerPositions,
  activeZone,
  onZoneHover,
  onZoneClick,
  showCoords = false,
}: GardenMapPanelProps) => {
  const { t } = useTranslation();
  const activeZoneData = GARDEN_ZONES.find((z) => z.id === activeZone);
  const isDev = variant === 'png' || variant === 'svg';

  return (
    <div className={`garden-map-panel garden-map-panel--${variant}`}>
      {label && <h3 className="garden-map-panel__label">{label}</h3>}

      <div className="garden-map-panel__canvas">
        <div className="garden-map-panel__art">{children}</div>

        <div className="garden-map-panel__markers">
          {GARDEN_ZONES.map((zone) => {
            const pos = markerPositions[zone.id];
            if (!pos) return null;
            const isActive = activeZone === zone.id;

            return (
              <button
                key={zone.id}
                type="button"
                className={`garden-map-panel__marker ${isActive ? 'garden-map-panel__marker--active' : ''} ${zone.comingSoon ? 'garden-map-panel__marker--soon' : ''} ${isDev ? `garden-map-panel__marker--dev-${variant}` : ''}`}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                onMouseEnter={() => onZoneHover(zone.id)}
                onMouseLeave={() => onZoneHover(null)}
                onFocus={() => onZoneHover(zone.id)}
                onBlur={() => onZoneHover(null)}
                onClick={() => onZoneClick(zone.id)}
                disabled={zone.comingSoon}
                aria-label={t(zone.labelKey)}
              >
                <span className="garden-map-panel__marker-ring">
                  <zone.icon size={20} strokeWidth={2} />
                </span>
                <span className="garden-map-panel__marker-tooltip">
                  {t(zone.labelKey)}
                  {showCoords && (
                    <small>
                      {pos.x.toFixed(1)}%, {pos.y.toFixed(1)}%
                    </small>
                  )}
                  {zone.comingSoon && ` · ${t('garden.comingSoon')}`}
                </span>
              </button>
            );
          })}
        </div>

        {!isDev && activeZoneData && (
          <div className="garden-map-panel__zone-label" role="status" aria-live="polite">
            <activeZoneData.icon size={16} />
            <div>
              <strong>{t(activeZoneData.labelKey)}</strong>
              <p>{t(activeZoneData.descKey)}</p>
              {activeZoneData.comingSoon && <em>{t('garden.comingSoon')}</em>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GardenMapPanel;
