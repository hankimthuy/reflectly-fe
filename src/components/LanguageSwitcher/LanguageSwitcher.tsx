import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.scss';

/** EN/VI segmented toggle — see mockup 1d's Settings list. Plain buttons rather than a dropdown:
 * there are only ever two languages. */
const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const setLanguage = (lang: 'en' | 'vi') => {
    if (i18n.language === lang) return;
    i18n.changeLanguage(lang);
  };

  return (
    <div className="language-switcher">
      {(['en', 'vi'] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          className={`language-switcher__option ${i18n.language === lang ? 'language-switcher__option--active' : ''}`}
          onClick={() => setLanguage(lang)}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
