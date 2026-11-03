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
    // Só o idioma, sem a região: o navegador pede "pt-BR" e os arquivos são
    // "pt" e "en". Sem isto, toda carga tenta /locales/pt-BR e toma 404 antes
    // de cair no fallback.
    load: "languageOnly",
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
