import { useNavigate } from "react-router-dom";
import "./ListingCard.css";

export function ListingCard({ listing }) {
  const navigate = useNavigate();
  const employment =
    listing.employment_type || listing.employment || listing.emplyment || "Ukjent";
  const imageUrl = getListingImageUrl(listing.image);

  const handleClick = () => {
    // change to detail page here for later
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
        <div className="listing-image-fallback">Ingen bilde</div>
      )}

      <div className="content">
        <h3>{listing.company || "Ukjent selskap"}</h3>
        <h2>{listing.title || "Ingen tittel"}</h2>

        <div className="details-row">
          <span className="employment">{employment}</span>
          <span className="location">{listing.location || "Ukjent sted"}</span>
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
