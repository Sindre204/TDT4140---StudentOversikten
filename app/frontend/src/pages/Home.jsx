import "./Home.css";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function Home() {
  const { t } = useTranslation();

  return (
    <div className="home">
      <header className="home-header">
        <h1>{t("homeTitle")}</h1>
        <p className="intro">{t("homeIntro")}</p>
      </header>

      <div className="info-card">
        <div className="info-content">
          <p>{t("homeInfo1")}</p>
          <p>{t("homeInfo2")}</p>
        </div>
        <div className="home-actions">
          <Link to="/Events" className="primary-btn">
            {t("events")}
          </Link>
          <Link to="/Listings" className="secondary-btn">
            {t("listings")}
          </Link>
        </div>
      </div>
    </div>
  );
}