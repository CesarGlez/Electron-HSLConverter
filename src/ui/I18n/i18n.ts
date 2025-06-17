import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import language_es from './translate/es';

const resources = {
  es: {
    translation: language_es,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
