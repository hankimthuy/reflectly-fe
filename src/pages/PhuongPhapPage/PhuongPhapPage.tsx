import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import FrameworkPanels from '../../components/FrameworkPanels/FrameworkPanels';
import { APP_ROUTES } from '../../constants/route';
import { useAuth } from '../../providers/AuthProvider';
import './PhuongPhapPage.scss';

const PhuongPhapPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleCta = () => {
    navigate(isAuthenticated ? APP_ROUTES.ENTRIES_NEW : APP_ROUTES.LOGIN);
  };

  return (
    <div className="phuong-phap-page">
      <section className="phuong-phap-page__hero">
        <span className="phuong-phap-page__badge">{t('phuongPhapPage.hero.badge')}</span>
        <h1 dangerouslySetInnerHTML={{ __html: t('phuongPhapPage.hero.title') }} />
        <p>{t('phuongPhapPage.hero.subtitle')}</p>
      </section>

      <FrameworkPanels variant="full" />

      <section className="phuong-phap-page__cta">
        <h2>{t('phuongPhapPage.cta.title')}</h2>
        <p>{t('phuongPhapPage.cta.subtitle')}</p>
        <button type="button" className="phuong-phap-page__cta-btn" onClick={handleCta}>
          {t('phuongPhapPage.cta.button')}
        </button>
      </section>
    </div>
  );
};

export default PhuongPhapPage;
