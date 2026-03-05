import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./ListingCard.css";

export function ListingCard({ listing }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const employment =
    listing.employment_type || listing.employment || listing.emplyment || t("unknownLocation");
  const imageUrl = getListingImageUrl(listing.image);

  const handleClick = () => {
    navigate(`/listings/${listing.id}`);
  };

  return (
    <div
      className="listing-card"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={`${listing.company || "Company"} logo`} />
      ) : (
        <div className="listing-image-fallback">{t("noImage")}</div>
      )}

      <div className="content">
        <h3>{listing.company || t("unknownCompany")}</h3>
        <h2>{listing.title || t("noTitle")}</h2>

        <div className="details-row">
          <span className="employment">{employment}</span>
          <span className="location">
            {listing.city || t("unknownLocation")}
          </span>
        </div>

        <p className="description">{listing.description}</p>
      </div>
    </div>
  );
}

function getListingImageUrl(imagePath) {
  if (!imagePath) return null;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const baseUrl = "http://127.0.0.1:8000";
  return imagePath.startsWith("/")
    ? `${baseUrl}${imagePath}`
    : `${baseUrl}/${imagePath}`;
}
