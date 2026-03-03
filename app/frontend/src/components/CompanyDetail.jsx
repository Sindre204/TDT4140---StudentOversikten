import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCompanyById } from "../services/api";
import "./ItemDetail.css";

export function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCompany() {
      try {
        setLoading(true);
        const data = await fetchCompanyById(id);
        setCompany(data);
      } catch (_err) {
        setError("Something went wrong while fetching the company.");
      } finally {
        setLoading(false);
      }
    }

    loadCompany();
  }, [id]);

  if (loading) {
    return <p className="detail-status">Loading company...</p>;
  }

  if (error || !company) {
    return <p className="detail-status">{error || "Company not found."}</p>;
  }

  const imageUrl = getImageUrl(company.image);

  return (
    <section className="detail-page">
      <button type="button" className="back-button" onClick={() => navigate(-1)}>
        Back
      </button>

      {imageUrl ? <img className="detail-image" src={imageUrl} alt={company.name} /> : null}

      <h1>{company.name}</h1>
      <p>
        <strong>Bransje:</strong> {company.industry || "Ukjent"}
      </p>
      <p className="detail-description">
        {company.description || "Ingen beskrivelse tilgjengelig."}
      </p>
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
