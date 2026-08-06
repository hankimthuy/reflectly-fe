import { useTranslation } from 'react-i18next';
import ValuePillarsStrip from './ValuePillarsStrip';
import HomeSection from './HomeSection';
import ChatPreviewCard from './ChatPreviewCard';
import RelationshipMapPreviewCard from './RelationshipMapPreviewCard';
import JohariWindowCard from './JohariWindowCard';
import InsightTimelinePreviewCard from './InsightTimelinePreviewCard';

/**
 * The homepage's value-proposition body: a quick-scan pillar strip, then one full HomeSection
 * per concept the app delivers (AI Coach, Relationship Map / PRM, Johari Window, Insight
 * Timeline). Replaces the earlier 2-column "preview grid" — that layout packed three concepts
 * into compact cards and hid the Johari Window behind a view-switcher dropdown, which works
 * against a homepage whose job is to introduce (and be found via SEO for) exactly these
 * concepts. Each section is purely illustrative/static — see the individual card components for
 * why (public, unauthenticated route).
 */
const HomeValueSections = () => {
  const { t } = useTranslation();

  return (
    <>
      <ValuePillarsStrip />

      <HomeSection
        id="section-coach"
        title={t('homePreview.chat.sectionTitle')}
        description={t('homePreview.chat.sectionDescription')}
      >
        <ChatPreviewCard />
      </HomeSection>

      <HomeSection
        id="section-map"
        title={t('homePreview.map.sectionTitle')}
        description={t('homePreview.map.sectionDescription')}
        tinted
      >
        <RelationshipMapPreviewCard />
      </HomeSection>

      <HomeSection
        id="section-johari"
        title={t('homePreview.johari.sectionTitle')}
        description={t('homePreview.johari.sectionDescription')}
      >
        <JohariWindowCard />
      </HomeSection>

      <HomeSection
        id="section-insights"
        title={t('homePreview.insights.sectionTitle')}
        description={t('homePreview.insights.sectionDescription')}
        tinted
      >
        <InsightTimelinePreviewCard />
      </HomeSection>
    </>
  );
};

export default HomeValueSections;
