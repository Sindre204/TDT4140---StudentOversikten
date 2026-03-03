import { useNavigate } from "react-router-dom";
import "./CompanyCard.css";

export function CompanyCard({ company }) {
  const navigate = useNavigate();
  const imageUrl = getCompanyImageUrl(company.image);
  const handleClick = () => {
    navigate(`/companies/${company.id}`);
  };

  return (
    <article className="company-card" onClick={handleClick} style={{ cursor: "pointer" }}>
      <div className="company-content">
        <h2 className="company-name">{company.name || "Ukjent firma"}</h2>

        <div className="company-meta">
          <span className="company-badge">{company.industry || "Ukjent bransje"}</span>
        </div>
      </div>

      <div className="company-right">
        {imageUrl ? (
          <img src={imageUrl} alt={`${company.name || "Firma"} logo`} className="company-image" />
        ) : (
          <div className="company-image-fallback">Ingen bilde</div>
        )}
      </div>
    </article>
  );
}

function getCompanyImageUrl(imagePath) {
  if (!imagePath) return null;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const baseUrl = "http://127.0.0.1:8000";
  return imagePath.startsWith("/")
    ? `${baseUrl}${imagePath}`
    : `${baseUrl}/${imagePath}`;
}
