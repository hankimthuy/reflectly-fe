import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { GARDEN_ZONES } from '../../constants/gardenZones';
import {
  GARDEN_MAP_DEV_COMPARE,
  GARDEN_MARKER_POSITIONS,
  GARDEN_MARKER_POSITIONS_SVG,
} from '../../constants/gardenMapScene';
import useReducedMotion from '../../hooks/useReducedMotion';
import GardenMapIllustration from './GardenMapIllustration';
import GardenMapPanel from './GardenMapPanel';
import GardenMapReference from './GardenMapReference';
import './GardenMap.scss';

const GardenMap = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleZoneClick = (zoneId: string) => {
    const zone = GARDEN_ZONES.find((z) => z.id === zoneId);
    if (!zone || zone.comingSoon) return;
    navigate(zone.route);
  };

  if (isMobile) {
    return (
      <section className="garden-map garden-map--mobile" aria-label={t('garden.mapTitle')}>
        <h2 className="garden-map__title">{t('garden.mapTitle')}</h2>
        <p className="garden-map__subtitle">{t('garden.mapSubtitle')}</p>
        <div className="garden-map__cards">
          {GARDEN_ZONES.map((zone, index) => (
            <button
              key={zone.id}
              type="button"
              className={`garden-map__card ${zone.comingSoon ? 'garden-map__card--soon' : ''}`}
              style={{ animationDelay: reducedMotion ? '0ms' : `${index * 80}ms` }}
              onClick={() => handleZoneClick(zone.id)}
              disabled={zone.comingSoon}
            >
              <div className="garden-map__card-icon">
                <zone.icon size={22} />
              </div>
              <div className="garden-map__card-content">
                <h3>{t(zone.labelKey)}</h3>
                <p>{t(zone.descKey)}</p>
                {zone.comingSoon && (
                  <span className="garden-map__badge">{t('garden.comingSoon')}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </section>
    );
  }

  if (GARDEN_MAP_DEV_COMPARE) {
    return (
      <section className="garden-map garden-map--dev" aria-label={t('garden.mapTitle')}>
        <h2 className="garden-map__title">{t('garden.mapTitle')}</h2>
        <p className="garden-map__subtitle">{t('garden.mapSubtitle')}</p>

        <p className="garden-map__dev-note">
          Dev: hai bản tách riêng — chỉnh hover PNG trong{' '}
          <code>GARDEN_MARKER_POSITIONS</code>, SVG trong <code>GARDEN_SCENE.zones</code>
        </p>

        <div className="garden-map__dev-split">
          <GardenMapPanel
            variant="png"
            label="PNG gốc (mind-house-map.png)"
            markerPositions={GARDEN_MARKER_POSITIONS}
            activeZone={activeZone}
            onZoneHover={setActiveZone}
            onZoneClick={handleZoneClick}
            showCoords
          >
            <GardenMapReference />
          </GardenMapPanel>

          <GardenMapPanel
            variant="svg"
            label="SVG code"
            markerPositions={GARDEN_MARKER_POSITIONS_SVG}
            activeZone={activeZone}
            onZoneHover={setActiveZone}
            onZoneClick={handleZoneClick}
            showCoords
          >
            <GardenMapIllustration />
          </GardenMapPanel>
        </div>
      </section>
    );
  }

  return (
    <section className="garden-map" aria-label={t('garden.mapTitle')}>
      <h2 className="garden-map__title">{t('garden.mapTitle')}</h2>
      <p className="garden-map__subtitle">{t('garden.mapSubtitle')}</p>

      <div className="garden-map__prod">
        <GardenMapPanel
          variant="prod"
          markerPositions={GARDEN_MARKER_POSITIONS_SVG}
          activeZone={activeZone}
          onZoneHover={setActiveZone}
          onZoneClick={handleZoneClick}
        >
          <GardenMapIllustration />
        </GardenMapPanel>
      </div>
    </section>
  );
};

export default GardenMap;
