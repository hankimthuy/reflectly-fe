import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../constants/route';
import { Button } from '../Button/Button';
import './NotFound.scss';

/** See mockup 3c — no nav at all, just the wordmark and the notice. */
const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-page__wordmark">{t('brand.name')}</div>
      <div className="not-found-page__body">
        <div className="not-found-page__code">404</div>
        <h3 className="not-found-page__title">{t('notFound.title')}</h3>
        <p className="not-found-page__message">{t('notFound.subtitle')}</p>
        <Button variant="primary" onClick={() => navigate(APP_ROUTES.HOME)}>
          {t('notFound.back')}
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
