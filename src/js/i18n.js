// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import plTranslations from './locales/pl.json';

i18n.use(initReactI18next).init({
  resources: {
    en: enTranslations,
    pl: plTranslations
  },
  lng: 'pl', 
  fallbackLng: 'pl',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
