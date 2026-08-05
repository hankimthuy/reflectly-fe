import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthProvider';
import { APP_ROUTES } from '../../../constants/route';
import { Button } from '../../../components/Button/Button';

const GardenHero = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleCta = () => {
    navigate(currentUser ? APP_ROUTES.COACH_CHAT : APP_ROUTES.SIGNUP);
  };

  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-4 pt-6 pb-10 text-center sm:pt-8">
      {/* Brand name/acronym intentionally not repeated here — the header logo already shows
          "Aura Self AI"; duplicating it in the hero just pushed the headline down. */}
      <h1 className="mb-4 text-[clamp(1.75rem,4vw,2.75rem)] leading-tight font-bold text-coach-text [font-family:var(--font-family-heading)]">
        {t('brand.slogan')}
      </h1>

      <p className="max-w-xl text-base leading-relaxed text-coach-text-muted">
        {t('brand.description')}
      </p>

      <Button variant="primary" size="lg" shape="pill" className="mt-6" onClick={handleCta}>
        {t(currentUser ? 'brand.ctaLoggedIn' : 'brand.ctaLoggedOut')}
      </Button>
    </section>
  );
};

export default GardenHero;
