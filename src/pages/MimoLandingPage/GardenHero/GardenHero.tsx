import { useTranslation } from 'react-i18next';
import MimoCharacter from '../../../components/MimoCharacter/MimoCharacter';
import './GardenHero.scss';

const GardenHero = () => {
  const { t } = useTranslation();

  return (
    <section className="garden-hero">
      <div className="garden-hero__content">
        <p className="garden-hero__brand">{t('brand.name')}</p>
        <p className="garden-hero__acronym">{t('brand.acronym')}</p>
        <h1 className="garden-hero__slogan">{t('brand.slogan')}</h1>
        <p className="garden-hero__description">{t('brand.description')}</p>
        <p className="garden-hero__tagline">{t('brand.tagline')}</p>
        <blockquote className="garden-hero__quote">
          <p>{t('garden.quote')}</p>
        </blockquote>
      </div>
      <div className="garden-hero__mimo" aria-hidden="true">
        <MimoCharacter theme="bridge" />
      </div>
    </section>
  );
};

export default GardenHero;
