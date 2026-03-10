import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchListingById } from "../services/api";
import "./ItemDetail.css";

export function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadListing() {
      try {
        setLoading(true);
        const data = await fetchListingById(id);
        setListing(data);
      } catch (_err) {
        setError(t("fetchListingError"));
      } finally {
        setLoading(false);
      }
    }

    loadListing();
  }, [id]);

  if (loading) {
    return <p className="detail-status">{t("loading")}</p>;
  }

  if (error || !listing) {
    return <p className="detail-status">{error || t("listingNotFound")}</p>;
  }

  const imageUrl = getImageUrl(listing.image);

  return (
    <section className="detail-page">
      <button type="button" className="back-button" onClick={() => navigate(-1)}>
        {t("back")}
      </button>
      {imageUrl ? <img className="detail-image" src={imageUrl} alt={listing.title} /> : null}
      <div className="detail-hero">
        <h1>{listing.title}</h1>
        <h2>{listing.company}</h2>
      </div>
      <section className="detail-meta" aria-label="Listing information">
        <article className="detail-meta-card">
          <p className="detail-meta-label">{t("employment")}</p>
          <p className="detail-meta-value">{listing.employment_type || "-"}</p>
        </article>
        <article className="detail-meta-card">
          <p className="detail-meta-label">{t("location")}</p>
          <p className="detail-meta-value">{listing.city || t("unknownLocation")}</p>
        </article>
      </section>
      <section className="detail-content-section" aria-labelledby="listing-description-heading">
        <h2 id="listing-description-heading" className="detail-section-title">Beskrivelse</h2>
        <p className="detail-description">{listing.description || "Ingen beskrivelse tilgjengelig."}</p>
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
