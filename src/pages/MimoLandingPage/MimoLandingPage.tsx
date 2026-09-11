import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { APP_ROUTES } from '../../constants/route';
import { MIRROR_PANES } from '../../hooks/useMirrorSnapshot';
import AuraMark from '../../components/AuraMark/AuraMark';
import './MimoLandingPage.scss';

/**
 * The public marketing home — see artboard 5b ("Landing, repainted and cut to four blocks").
 * PublicLayout renders the top header; this page is everything below it.
 *
 * Aura Soft v2 cut this page down: the hero's photo placeholder became a live-looking preview of
 * a conversation (the screenshot argues the product better than a paragraph did), six feature
 * blocks became four — Catch and Timeline tell one story, and Values belong in onboarding rather
 * than the pitch — and the four-layer "Leading Self" band came out entirely, since four layers
 * with four descriptions is an internal model rather than a promise a visitor needs.
 */
const MimoLandingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleCta = () => navigate(currentUser ? APP_ROUTES.HOME : APP_ROUTES.SIGNUP);

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

        {/* Illustrative, not real data — the shapes match what Talk actually renders (artboard 5d)
            so the pitch and the product read as the same app. */}
        <div className="landing__preview">
          <div className="landing__preview-turn">
            <AuraMark size="lg" />
            <p className="landing__preview-aura">{t('landing.hero.previewAura')}</p>
          </div>
          <p className="landing__preview-user">{t('landing.hero.previewUser')}</p>
          <div className="landing__preview-reading">
            <span className="landing__preview-reading-label">{t('talk.readingLabel')}</span>
            <span className="landing__preview-reading-bar" />
            <span className="landing__preview-reading-value">{t('landing.hero.previewMood')}</span>
          </div>
        </div>
      </section>

      <section className="landing__functions">
        <div className="landing__function">
          <h4 className="landing__function-title">{t('landing.functions.talk.title')}</h4>
          <p className="landing__function-body">{t('landing.functions.talk.body')}</p>
          <div className="landing__function-bar" />
        </div>

        <div className="landing__function">
          <h4 className="landing__function-title">{t('landing.functions.catch.title')}</h4>
          <p className="landing__function-body">{t('landing.functions.catch.body')}</p>
          <div className="landing__function-quote">{t('landing.functions.catch.example')}</div>
        </div>

        <div className="landing__function">
          <h4 className="landing__function-title">{t('landing.functions.mirror.title')}</h4>
          <p className="landing__function-body">{t('landing.functions.mirror.body')}</p>
          <div className="landing__function-mirror">
            {MIRROR_PANES.map((pane) => (
              <span key={pane} className={`landing__function-mirror-cell landing__function-mirror-cell--${pane}`}>
                {t(`mirror.${pane}.label`)}
              </span>
            ))}
          </div>
        </div>

        <div className="landing__function">
          <h4 className="landing__function-title">{t('landing.functions.people.title')}</h4>
          <p className="landing__function-body">{t('landing.functions.people.body')}</p>
          <div className="landing__function-nodes">
            <span className="landing__function-node landing__function-node--dark" />
            <span className="landing__function-node-line" />
            <span className="landing__function-node landing__function-node--attention" />
            <span className="landing__function-node-line" />
            <span className="landing__function-node landing__function-node--outline" />
          </div>
        </div>
      </section>

      <section className="landing__closing">
        <h2 className="landing__closing-title">{t('landing.closing.title')}</h2>
        <button type="button" className="landing__closing-cta" onClick={handleCta}>
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
