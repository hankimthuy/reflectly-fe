import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import MimoCharacter from '../../../components/MimoCharacter/MimoCharacter';
import { useAuth } from '../../../providers/AuthProvider';
import { APP_ROUTES } from '../../../constants/route';
import { Button } from '../../../components/Button/Button';
import './GardenHero.scss';

const GardenHero = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleCta = () => {
    navigate(currentUser ? APP_ROUTES.COACH_CHAT : APP_ROUTES.SIGNUP);
  };

  return (
    <section className="garden-hero">
      <div className="garden-hero__content">
        <p className="garden-hero__brand">
          {t('brand.name')} <span className="garden-hero__acronym">{t('brand.acronym')}</span>
        </p>
        <h1 className="garden-hero__slogan">{t('brand.slogan')}</h1>
        <p className="garden-hero__description">{t('brand.description')}</p>
        <Button variant="primary" size="lg" shape="pill" className="mt-6" onClick={handleCta}>
          {t(currentUser ? 'brand.ctaLoggedIn' : 'brand.ctaLoggedOut')}
        </Button>
      </div>
      <div className="garden-hero__mimo" aria-hidden="true">
        <MimoCharacter theme="bridge" />
      </div>
    </section>
  );
};

export default GardenHero;
