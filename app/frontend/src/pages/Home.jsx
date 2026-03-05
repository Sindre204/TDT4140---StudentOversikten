import "./Home.css";
import {useTranslation} from "react-i18next";

export function Home() {
  const {t} = useTranslation();

  return (
    <div className="home">
      <h1>{t("homeTitle")}</h1>

      <p className="intro">
        {t("homeIntro")}
      </p>

      <div className="info-box">
        <p>
          {t("homeInfo1")}
        </p>
        <p>
          {t("homeInfo2")}
        </p>
      </div>


    </div>
  );
}