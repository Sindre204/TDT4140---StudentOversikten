import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchAds } from "../services/api";
import "./AdminWork.css";

export function AdminListingsOverview() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    let isActive = true;

    async function loadListings() {
      try {
        setIsLoading(true);
        setError("");
        const data = await fetchAds();
        if (isActive) setListings(data);
      } catch (loadError) {
        if (isActive) setError(loadError.message);
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    loadListings();
    return () => {
      isActive = false;
    };
  }, [user]);

  if (!user || user.role !== "admin") {
    return <Navigate to="/LogIn" replace />;
  }

  return (
    <section className="admin-work-page">
      <header className="admin-work-hero admin-work-hero-left">
        <p className="admin-work-kicker">Administrator arbeid</p>
        <h1>Oversikt over listings</h1>
        <p>Rediger jobbannonser i systemet.</p>
        <Link className="admin-work-secondary-button" to="/admin-work">Tilbake</Link>
      </header>

      {isLoading ? <p>Laster listings...</p> : null}
      {error ? <p className="admin-work-error">{error}</p> : null}

      {!isLoading && !error ? (
        <div className="admin-simple-list">
          {listings.map((listing) => (
            <article key={listing.id} className="admin-simple-list-card">
              <div>
                <h2>{listing.title}</h2>
                <p>{listing.company} · {listing.city}</p>
              </div>
              <Link className="admin-work-button" to={`/administration/ads/${listing.id}/edit`}>
                Rediger
              </Link>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
