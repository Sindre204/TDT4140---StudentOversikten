import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchAdsByCreator, fetchEventsByCreator } from "../services/api";
import "./Administration.css";

export function Administration() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "company") {
      return undefined;
    }

    let isActive = true;

    async function loadCreatedContent() {
      try {
        setIsLoading(true);
        setError("");

        const [eventData, listingData] = await Promise.all([
          fetchEventsByCreator(user.id),
          fetchAdsByCreator(user.id),
        ]);

        if (!isActive) {
          return;
        }

        setEvents(eventData);
        setListings(listingData);
      } catch (loadError) {
        if (!isActive) {
          return;
        }

        setError(loadError.message);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadCreatedContent();

    return () => {
      isActive = false;
    };
  }, [user]);

  if (!user || user.role !== "company") {
    return <Navigate to="/LogIn" replace />;
  }

  return (
    <section className="administration-page">
      <div className="administration-hero">
        <p className="administration-kicker">Administrasjon</p>
        <h1>Opprett innhold</h1>
        <p className="administration-subtitle">
          Velg hva du vil publisere. Alt du oppretter her lagres direkte i systemet.
        </p>
      </div>

      <div className="administration-grid">
        <article className="administration-card">
          <h2>Nytt arrangement</h2>
          <p>
            Opprett et arrangement med de samme feltene som i Django-administrasjonen.
          </p>
          <Link to="/administration/events/new" className="administration-link">
            Gå til arrangementskjema
          </Link>
        </article>

        <article className="administration-card">
          <h2>Ny jobbannonse</h2>
          <p>
            Opprett en jobbannonse og publiser den direkte i backend.
          </p>
          <Link to="/administration/ads/new" className="administration-link">
            Gå til jobbannonse
          </Link>
        </article>
      </div>

      <section className="administration-section">
        <div className="administration-section-header">
          <h2>Dine arrangementer</h2>
          <Link to="/administration/events/new" className="administration-link">
            Opprett nytt
          </Link>
        </div>

        {isLoading ? <p>Laster arrangementer...</p> : null}
        {!isLoading && !events.length ? (
          <p>Du har ikke opprettet noen arrangementer ennå.</p>
        ) : null}

        {!isLoading && events.length ? (
          <div className="administration-list">
            {events.map((event) => (
              <article key={event.id} className="administration-item">
                <div>
                  <h3>{event.title}</h3>
                  <p>{event.date} · {event.places}</p>
                </div>
                <Link
                  to={`/administration/events/${event.id}/edit`}
                  className="administration-link"
                >
                  Rediger
                </Link>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <section className="administration-section">
        <div className="administration-section-header">
          <h2>Dine jobbannonser</h2>
          <Link to="/administration/ads/new" className="administration-link">
            Opprett ny
          </Link>
        </div>

        {error ? <p className="administration-error">{error}</p> : null}
        {isLoading ? <p>Laster jobbannonser...</p> : null}
        {!isLoading && !listings.length ? (
          <p>Du har ikke opprettet noen jobbannonser ennå.</p>
        ) : null}

        {!isLoading && listings.length ? (
          <div className="administration-list">
            {listings.map((listing) => (
              <article key={listing.id} className="administration-item">
                <div>
                  <h3>{listing.title}</h3>
                  <p>{listing.company} · {listing.city}</p>
                </div>
                <Link
                  to={`/administration/ads/${listing.id}/edit`}
                  className="administration-link"
                >
                  Rediger
                </Link>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </section>
  );
}
