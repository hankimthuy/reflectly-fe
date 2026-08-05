import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { LuArrowRight, LuLayoutDashboard, LuMessageCircle, LuUsers } from 'react-icons/lu';
import useReducedMotion from '../../hooks/useReducedMotion';
import { APP_ROUTES } from '../../constants/route';
import { ButtonLink } from '../Button/Button';
import './FrameworkPanels.scss';

interface FrameworkPanelsProps {
  variant?: 'compact' | 'full';
}

interface FrameworkPrinciple {
  title: string;
  description: string;
}

const PANEL_KEYS = ['goOut', 'comeBack', 'filter'] as const;
const PANEL_ICONS = {
  goOut: LuMessageCircle,
  comeBack: LuUsers,
  filter: LuLayoutDashboard,
} as const;
const PANEL_ROUTES: Record<(typeof PANEL_KEYS)[number], string> = {
  goOut: APP_ROUTES.COACH_CHAT,
  comeBack: APP_ROUTES.DASHBOARD,
  filter: APP_ROUTES.DASHBOARD,
};

const FrameworkPanels = ({ variant = 'compact' }: FrameworkPanelsProps) => {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();

  const PanelWrapper = reducedMotion ? 'div' : motion.div;
  const panelProps = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-50px' },
        transition: { duration: 0.4 },
      };

  return (
    <section className={`framework-panels framework-panels--${variant}`}>
      <div className="framework-panels__grid">
        {PANEL_KEYS.map((key, index) => {
          const Icon = PANEL_ICONS[key];
          return (
            <PanelWrapper
              key={key}
              className="framework-panels__panel"
              {...(reducedMotion ? {} : { ...panelProps, transition: { duration: 0.4, delay: index * 0.1 } })}
            >
              <div className="framework-panels__panel-header">
                <Icon size={20} />
                <h3>{t(`garden.framework.${key}.title`)}</h3>
              </div>
              <p className="framework-panels__intro">{t(`garden.framework.${key}.intro`)}</p>
              <ul className="framework-panels__steps">
                {(t(`garden.framework.${key}.steps`, { returnObjects: true }) as string[]).map((step) => (
                  <li key={step}>
                    <LuArrowRight size={14} />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
              <ButtonLink to={PANEL_ROUTES[key]} variant="ghost" size="sm" className="!px-0 mt-3">
                {t(`garden.framework.${key}.linkLabel`)}
                <LuArrowRight size={14} />
              </ButtonLink>
            </PanelWrapper>
          );
        })}
      </div>

      {variant === 'full' && (
        <div className="framework-panels__principles">
          <h3>{t('garden.framework.principlesTitle')}</h3>
          <ul>
            {(t('garden.framework.principles', { returnObjects: true }) as FrameworkPrinciple[]).map((item) => (
              <li key={item.title}>
                <span className="framework-panels__principle-title">{item.title}</span>
                <span className="framework-panels__principle-description">{item.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default FrameworkPanels;
