import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./CompanyCard.css";

export function CompanyCard({ company }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const imageUrl = getCompanyImageUrl(company.image);

  const handleClick = () => {
    navigate(`/companies/${company.id}`);
  };

  return (
    <article className="company-card" onClick={handleClick}>
      <div className="company-content">
        <h2 className="company-name">{company.name || t("unknownCompanyShort")}</h2>
        <div className="company-meta">
          <span className="company-badge">{company.industry || t("unknownIndustry")}</span>
        </div>
      </div>

      <div className="company-right">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={t("companyLogoAlt", { name: company.name || t("company") })}
            className="company-image"
          />
        ) : (
          <div className="company-image-fallback">
            <span>{company.name ? company.name.charAt(0) : "?"}</span>
          </div>
        )}
      </div>
    </article>
  );
}

function getCompanyImageUrl(imagePath) {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  const baseUrl = "http://127.0.0.1:8000";
  return imagePath.startsWith("/") ? `${baseUrl}${imagePath}` : `${baseUrl}/${imagePath}`;
}
