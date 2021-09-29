import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

export const getTranslation = async (locale: string) => {
  let ret;
  try {
    ret = await import(`../translations/${locale}.json`);
  } catch (e) {
    ret = await import('../translations/en.json');
  }
  return ret;
};

export const initializeI18next = async (locale: string) => {
  const translation = await getTranslation(locale);
  i18next.use(initReactI18next).init({
    lng: locale,
    resources: { [locale]: { translation } },
    interpolation: {
      escapeValue: false,
      prefix: '{',
      suffix: '}',
    },
    nonExplicitWhitelist: true,
    keySeparator: false,
  });

  return i18next;
};
