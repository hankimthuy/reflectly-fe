import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { REFLECT_TABS, reflectTabPath, type ReflectTab } from '../../constants/route';
import PeopleTab from './tabs/PeopleTab';
import MirrorTab from './tabs/MirrorTab';
import TimelineTab from './tabs/TimelineTab';
import JournalTab from './tabs/JournalTab';
import './ReflectPage.scss';
import './ReflectTabs.scss';

const TAB_LABEL_KEY: Record<ReflectTab, string> = {
    people: 'reflect.tabs.people',
    mirror: 'reflect.tabs.mirror',
    timeline: 'reflect.tabs.timeline',
    journal: 'reflect.tabs.journal',
};

/**
 * The Reflect hub — everything Aura and the person using it have put down, in one room with
 * four tabs (see the redesign brief, section 04/05). People and Mirror are theirs to edit; the
 * Timeline is what Aura noticed. Replaces the old separate Dashboard and Entries-list pages —
 * see constants/route.ts for the redirects from those routes.
 */
const ReflectPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { tab } = useParams<{ tab: string }>();
    const activeTab: ReflectTab = REFLECT_TABS.includes(tab as ReflectTab) ? (tab as ReflectTab) : 'people';

    return (
        <div className="reflect">
            <div className="reflect__header">
                <h2 className="reflect__title">{t('reflect.title')}</h2>
                <p className="reflect__subtitle">{t('reflect.subtitle')}</p>
                <div className="reflect__tabs">
                    {REFLECT_TABS.map((tabKey) => (
                        <button
                            key={tabKey}
                            type="button"
                            className={`reflect__tab ${activeTab === tabKey ? 'reflect__tab--active' : ''}`}
                            onClick={() => navigate(reflectTabPath(tabKey))}
                        >
                            {t(TAB_LABEL_KEY[tabKey])}
                        </button>
                    ))}
                </div>
            </div>

            <div className="reflect__body">
                {activeTab === 'people' && <PeopleTab />}
                {activeTab === 'mirror' && <MirrorTab />}
                {activeTab === 'timeline' && <TimelineTab />}
                {activeTab === 'journal' && <JournalTab />}
            </div>
        </div>
    );
};

export default ReflectPage;
