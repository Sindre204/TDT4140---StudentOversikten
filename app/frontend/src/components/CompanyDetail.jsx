import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchCompanyById } from "../services/api";
import "./ItemDetail.css";

export function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCompany() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchCompanyById(id);
        setCompany(data);
      } catch {
        setError(t("fetchCompanyError"));
      } finally {
        setLoading(false);
      }
    }

    loadCompany();
  }, [id, t]);

  if (loading) {
    return <p className="detail-status">{t("loadingCompany")}</p>;
  }

  if (error || !company) {
    return <p className="detail-status">{error || t("companyNotFound")}</p>;
  }

  const imageUrl = getImageUrl(company.image);

  return (
    <section className="detail-page">
      <button type="button" className="back-button" onClick={() => navigate(-1)}>
        {t("back")}
      </button>

      {imageUrl ? <img className="detail-image" src={imageUrl} alt={company.name} /> : null}

      <div className="detail-hero">
        <h1>{company.name}</h1>
      </div>

      <section className="detail-meta" aria-label={t("companyInformation")}>
        <article className="detail-meta-card">
          <p className="detail-meta-label">{t("industry")}</p>
          <p className="detail-meta-value">{company.industry || t("unknownIndustry")}</p>
        </article>
      </section>

      <section className="detail-content-section" aria-labelledby="company-description-heading">
        <h2 id="company-description-heading" className="detail-section-title">
          {t("description")}
        </h2>
        <p className="detail-description">{company.description || t("noDescriptionAvailable")}</p>
      </section>
    </section>
  );
}

function getImageUrl(imagePath) {
  if (!imagePath) return null;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const baseUrl = "http://127.0.0.1:8000";
  return imagePath.startsWith("/")
    ? `${baseUrl}${imagePath}`
    : `${baseUrl}/${imagePath}`;
}
