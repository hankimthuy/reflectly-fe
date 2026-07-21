import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LuArrowRightLeft, LuLayoutGrid, LuSprout, LuTrendingUp } from 'react-icons/lu';
import FrameworkPanels from '../../components/FrameworkPanels/FrameworkPanels';
import { APP_ROUTES } from '../../constants/route';
import { useAuth } from '../../providers/AuthProvider';
import './PhuongPhapPage.scss';

const LAYER_KEYS = ['foundation', 'innerverse', 'bridge', 'insight'] as const;
const LAYER_ICONS = {
  foundation: LuLayoutGrid,
  innerverse: LuSprout,
  bridge: LuArrowRightLeft,
  insight: LuTrendingUp,
} as const;

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

      <section className="phuong-phap-page__layers">
        <h2>{t('phuongPhapPage.layers.title')}</h2>
        <p className="phuong-phap-page__layers-subtitle">{t('phuongPhapPage.layers.subtitle')}</p>
        <div className="phuong-phap-page__layers-grid">
          {LAYER_KEYS.map((key) => {
            const Icon = LAYER_ICONS[key];
            return (
              <div key={key} className="phuong-phap-page__layer-card">
                <Icon size={20} />
                <span className="phuong-phap-page__layer-label">
                  {t(`phuongPhapPage.layers.items.${key}.label`)}
                </span>
                <p className="phuong-phap-page__layer-description">
                  {t(`phuongPhapPage.layers.items.${key}.description`)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <FrameworkPanels variant="full" showFeatureLink />

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
