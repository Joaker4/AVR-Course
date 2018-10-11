import i18n from 'i18next';
import { withI18n, reactI18nextModule } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import App from './App';
import Translations from './i18n.json'

i18n.use(LanguageDetector).use(reactI18nextModule).init({
    // we init with resources
    resources: {
        en: {
            translations: Translations.en
        },
        es: {
            translations: Translations.es
        },
        jp: {
            translations: Translations.jp
        },

    },
    fallbackLng: "en",
    debug: true,
    returnObjects: true,

    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations",

    keySeparator: false, // we use content as keys

    interpolation: {
        escapeValue: false, // not needed for react!!
        formatSeparator: ","
    },

    react: {
        wait: true
    }
});

export default withI18n()(App);