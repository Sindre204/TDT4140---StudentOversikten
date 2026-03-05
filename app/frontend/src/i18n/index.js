import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import no from "./no.json";
import pt from "./pt.json";

i18n.use(initReactI18next).init({
  lng: localStorage.getItem("lang") || "no",
  fallbackLng: "no",
  resources: {
    no: { translation: no },
    pt: { translation: pt },
  },
  interpolation: { escapeValue: false },
});

export default i18n;