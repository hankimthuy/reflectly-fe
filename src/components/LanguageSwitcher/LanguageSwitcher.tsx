import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { Language } from '@mui/icons-material';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const currentLang = i18n.language;
    console.log('Current language:', currentLang);
    const newLang = currentLang === 'en' ? 'vi' : 'en';
    console.log('Switching to:', newLang);
    i18n.changeLanguage(newLang, (err) => {
      if (err) {
        console.error('Error changing language:', err);
      } else {
        console.log('Language changed successfully to:', i18n.language);
      }
    });
  };

  return (
    <Button
      variant="outlined"
      startIcon={<Language sx={{ 
        color: 'var(--c-primary)',
        transition: 'color 0.2s ease-in-out'
      }} />}
      onClick={toggleLanguage}
      sx={{
        minWidth: 'auto',
        px: 2,
        color: 'var(--c-text-on-background)',
        borderColor: 'var(--c-primary)',
        backgroundColor: 'var(--c-surface)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: 'var(--c-primary)',
          color: 'var(--c-white)',
          borderColor: 'var(--c-primary-hover)',
          '& .MuiSvgIcon-root': {
            color: 'var(--c-white) !important'
          }
        },
      }}
    >
      {i18n.language === 'en' ? 'EN' : 'VI'}
    </Button>
  );
};

export default LanguageSwitcher;
