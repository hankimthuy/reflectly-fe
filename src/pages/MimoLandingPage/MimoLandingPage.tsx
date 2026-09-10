import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { APP_ROUTES } from '../../constants/route';
import './MimoLandingPage.scss';

/**
 * The public marketing home — see mockup 4a ("Landing, complete — six functions + the Leading
 * Self band"). PublicLayout already renders the top header (wordmark, Sign in/Start free); this
 * page is everything below it. Photography is placeholdered throughout, per the redesign brief's
 * assumptions section — there's no real asset yet.
 */
const MimoLandingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleCta = () => navigate(currentUser ? APP_ROUTES.HOME : APP_ROUTES.SIGNUP);

  const functions = [
    { key: 'talk', example: t('landing.functions.talk.example', '') },
    { key: 'catch', example: t('landing.functions.catch.example', '') },
    { key: 'mirror', example: '' },
    { key: 'people', example: t('landing.functions.people.example', '') },
    { key: 'timeline', example: '' },
    { key: 'values', example: '' },
  ] as const;

  return (
    <div className="landing">
      <section className="landing__hero">
        <div className="landing__hero-text">
          <h1 className="landing__headline">{t('landing.hero.headline')}</h1>
          <p className="landing__hero-body">{t('landing.hero.body')}</p>
          <div className="landing__hero-actions">
            <button type="button" className="btn btn-primary landing__hero-cta" onClick={handleCta}>
              {t(currentUser ? 'landing.hero.ctaLoggedIn' : 'landing.hero.cta')}
            </button>
            <span className="landing__hero-note">{t('landing.hero.note')}</span>
          </div>
        </div>
        <div className="landing__hero-media">
          <div className="landing__photo-placeholder">
            <span>{t('landing.hero.photoCaption')}</span>
          </div>
          <div className="landing__opener">
            <div className="landing__opener-avatar" />
            <div>
              <div className="landing__opener-label">{t('landing.hero.openerLabel')}</div>
              <p className="landing__opener-quote">{t('landing.hero.openerQuote')}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="landing__functions-label">{t('landing.functions.label')}</div>
      <section className="landing__functions">
        {functions.map(({ key, example }) => (
          <div key={key} className="landing__function">
            <div className="landing__function-kicker">{t(`landing.functions.${key}.kicker`)}</div>
            <h4 className="landing__function-title">{t(`landing.functions.${key}.title`)}</h4>
            <p className="landing__function-body">{t(`landing.functions.${key}.body`)}</p>
            {key === 'talk' && <div className="landing__function-bar" />}
            {key === 'catch' && example && <div className="landing__function-quote">{example}</div>}
            {key === 'mirror' && (
              <div className="landing__function-mirror">
                <span className="landing__function-mirror-cell landing__function-mirror-cell--open" />
                <span className="landing__function-mirror-cell" />
                <span className="landing__function-mirror-cell landing__function-mirror-cell--hidden" />
                <span className="landing__function-mirror-cell" />
              </div>
            )}
            {key === 'people' && (
              <>
                <div className="landing__function-nodes">
                  <span className="landing__function-node landing__function-node--dark" />
                  <span className="landing__function-node-line" />
                  <span className="landing__function-node landing__function-node--accent" />
                  <span className="landing__function-node-line" />
                  <span className="landing__function-node landing__function-node--outline" />
                </div>
                {example && <div className="landing__function-caption">{example}</div>}
              </>
            )}
          </div>
        ))}
      </section>

      <section className="landing__why">
        <div className="landing__why-intro">
          <div className="landing__why-label">{t('landing.why.label')}</div>
          <h2 className="landing__why-title">{t('landing.why.title')}</h2>
          <p className="landing__why-subtitle">{t('landing.why.subtitle')}</p>
        </div>
        <div className="landing__layers">
          {(['layer0', 'layer1', 'layer3', 'layer5'] as const).map((layer) => (
            <div key={layer} className="landing__layer">
              <div className="landing__layer-kicker">{t(`landing.why.${layer}.kicker`)}</div>
              <div className="landing__layer-title">{t(`landing.why.${layer}.title`)}</div>
              <p className="landing__layer-body">{t(`landing.why.${layer}.body`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing__closing">
        <h2 className="landing__closing-title">{t('landing.closing.title')}</h2>
        <button type="button" className="btn landing__closing-cta" onClick={handleCta}>
          {t('landing.closing.cta')}
        </button>
      </section>

      <footer className="landing__footer">
        <span>{t('landing.footer.rights')}</span>
        <span>{t('landing.footer.links')}</span>
      </footer>
    </div>
  );
};

export default MimoLandingPage;
