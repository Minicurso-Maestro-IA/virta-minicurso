import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "pt",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      // BASE_URL em vez de "/": publicado numa subpasta do GitHub Pages, o
      // caminho absoluto buscaria as traduções na raiz do domínio e o app
      // abriria sem texto nenhum.
      loadPath: `${import.meta.env.BASE_URL}locales/{{lng}}/translation.json`,
    },
  });

export default i18n;
