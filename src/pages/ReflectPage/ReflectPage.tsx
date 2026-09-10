import { useTranslation } from 'react-i18next';

/**
 * Placeholder — built out in full as its own redesign step (People / Mirror / Timeline /
 * Journal tabs, merging the old Dashboard + Entries list). Kept here only so AppRoutes compiles
 * while that work is in progress.
 */
const ReflectPage = () => {
    const { t } = useTranslation();
    return (
        <div style={{ padding: 32 }}>
            <h2>{t('nav.reflect')}</h2>
        </div>
    );
};

export default ReflectPage;
