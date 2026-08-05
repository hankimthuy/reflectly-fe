import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import vi from './locales/vi.json';

const resources = {
  en: {
    translation: en
  },
  vi: {
    translation: vi
  }
};

const LANGUAGE_STORAGE_KEY = 'app_language';
const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
const initialLanguage = storedLanguage === 'en' || storedLanguage === 'vi' ? storedLanguage : 'vi';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLanguage,
    fallbackLng: 'vi',
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false // React already escapes by default
    },
    react: {
      useSuspense: false // Disable suspense mode
    }
  });

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
});

export default i18n;
