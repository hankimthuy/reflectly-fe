import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LuArrowLeft, LuLock, LuPenLine, LuBookOpen } from 'react-icons/lu';
import { getGardenZoneById } from '../../constants/gardenZones';
import { APP_ROUTES } from '../../constants/route';
import { useAuth } from '../../providers/AuthProvider';
import './GardenZonePage.scss';

interface GardenZonePageProps {
  zoneId: string;
}

const GardenZonePage = ({ zoneId }: GardenZonePageProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const zone = getGardenZoneById(zoneId);

  if (!zone) return null;

  const Icon = zone.icon;
  const isReflection = zoneId === 'tu-chiem-nghiem';

  const handleWriteJournal = () => {
    navigate(isAuthenticated ? APP_ROUTES.ENTRIES_NEW : APP_ROUTES.LOGIN);
  };

  const handleViewJournal = () => {
    navigate(isAuthenticated ? APP_ROUTES.ENTRIES_LIST : APP_ROUTES.LOGIN);
  };

  return (
    <div className="garden-zone-page">
      <button type="button" className="garden-zone-page__back" onClick={() => navigate(APP_ROUTES.WELCOME)}>
        <LuArrowLeft size={18} />
        <span>{t('zonePage.backToGarden')}</span>
      </button>

      <section className="garden-zone-page__hero">
        <div className="garden-zone-page__icon">
          <Icon size={32} />
        </div>
        <h1>{t(zone.labelKey)}</h1>
        <p>{t(zone.descKey)}</p>
      </section>

      <section className="garden-zone-page__content">
        {zone.comingSoon ? (
          <div className="garden-zone-page__soon">
            <LuLock size={24} />
            <h2>{t('zonePage.comingSoon')}</h2>
            <p>{t('zonePage.comingSoonDesc')}</p>
          </div>
        ) : isReflection ? (
          <div className="garden-zone-page__actions">
            <button type="button" className="garden-zone-page__cta garden-zone-page__cta--primary" onClick={handleWriteJournal}>
              <LuPenLine size={18} />
              <span>{t('zonePage.writeJournal')}</span>
            </button>
            <button type="button" className="garden-zone-page__cta garden-zone-page__cta--secondary" onClick={handleViewJournal}>
              <LuBookOpen size={18} />
              <span>{t('zonePage.viewJournal')}</span>
            </button>
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default GardenZonePage;
