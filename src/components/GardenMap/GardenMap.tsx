import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { GARDEN_ZONES } from '../../constants/gardenZones';
import { GARDEN_MARKER_POSITIONS_SVG, type GardenMarkerPosition } from '../../constants/gardenMapScene';
import useReducedMotion from '../../hooks/useReducedMotion';
import GardenScene3D from './GardenScene3D';
import GardenMapPanel from './GardenMapPanel';
import './GardenMap.scss';

const GardenMap = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [markerPositions, setMarkerPositions] =
    useState<Record<string, GardenMarkerPosition>>(GARDEN_MARKER_POSITIONS_SVG);
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

  return (
    <section className="garden-map" aria-label={t('garden.mapTitle')}>
      <h2 className="garden-map__title">{t('garden.mapTitle')}</h2>
      <p className="garden-map__subtitle">{t('garden.mapSubtitle')}</p>

      <div className="garden-map__prod">
        <GardenMapPanel
          variant="prod"
          markerPositions={markerPositions}
          activeZone={activeZone}
          onZoneHover={setActiveZone}
          onZoneClick={handleZoneClick}
        >
          <GardenScene3D activeZone={activeZone} onMarkerPositionsChange={setMarkerPositions} />
        </GardenMapPanel>
      </div>
    </section>
  );
};

export default GardenMap;
