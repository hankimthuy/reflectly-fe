import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../constants/route';
import { Button } from '../Button/Button';
import './NotFound.scss';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <h1 className="not-found-page__code">404</h1>
      <h2 className="not-found-page__title">{t('notFound.title')}</h2>
      <p className="not-found-page__message">{t('notFound.subtitle')}</p>

      <div className="not-found-page__actions">
        <Button variant="primary" size="md" shape="pill" onClick={() => navigate(APP_ROUTES.WELCOME)}>
          {t('notFound.back')}
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
