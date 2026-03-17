import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchEvents } from "../services/api";
import "./AdminWork.css";

export function AdminEventsOverview() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    let isActive = true;

    async function loadEvents() {
      try {
        setIsLoading(true);
        setError("");
        const data = await fetchEvents();
        if (isActive) setEvents(data);
      } catch (loadError) {
        if (isActive) setError(loadError.message);
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    loadEvents();
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
        <h1>Oversikt over events</h1>
        <p>Rediger arrangementer i systemet.</p>
        <Link className="admin-work-secondary-button" to="/admin-work">Tilbake</Link>
      </header>

      {isLoading ? <p>Laster events...</p> : null}
      {error ? <p className="admin-work-error">{error}</p> : null}

      {!isLoading && !error ? (
        <div className="admin-simple-list">
          {events.map((event) => (
            <article key={event.id} className="admin-simple-list-card">
              <div>
                <h2>{event.title}</h2>
                <p>{event.date} · {event.places}</p>
              </div>
              <Link className="admin-work-button" to={`/administration/events/${event.id}/edit`}>
                Rediger
              </Link>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
