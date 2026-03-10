import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./ListingCard.css";

export function ListingCard({ listing }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const employment = listing.employment_type || listing.employment || t("unknownEmployment");
  const imageUrl = getListingImageUrl(listing.image);

  return (
    <div className="listing-card" onClick={() => navigate(`/listings/${listing.id}`)}>
      <div className="listing-logo-container">
        {imageUrl ? (
          <img src={imageUrl} alt={listing.company} className="listing-logo" />
        ) : (
          <div className="listing-logo-fallback">{listing.company?.charAt(0) || "B"}</div>
        )}
      </div>

      <div className="listing-content">
        <span className="listing-company">{listing.company || t("unknownCompany")}</span>
        <h2 className="listing-title">{listing.title || t("noTitle")}</h2>

        <div className="listing-tags">
          <span className="info-badge">{employment}</span>
          <span className="info-badge location"> {listing.city || t("unknownLocation")}</span>
        </div>
      </div>
    </div>
  );
}

function getListingImageUrl(imagePath) {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  const baseUrl = "http://127.0.0.1:8000";
  return imagePath.startsWith("/") ? `${baseUrl}${imagePath}` : `${baseUrl}/${imagePath}`;
}