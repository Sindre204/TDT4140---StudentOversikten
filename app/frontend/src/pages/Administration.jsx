import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  fetchAdsByCreator,
  fetchEventRegistrationsForCompany,
  fetchEventsByCreator,
} from "../services/api";
import "./Administration.css";

export function Administration() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedEvents, setExpandedEvents] = useState({});
  const [eventRegistrations, setEventRegistrations] = useState({});
  const [eventRegistrationLoading, setEventRegistrationLoading] = useState({});
  const [eventRegistrationError, setEventRegistrationError] = useState({});

  useEffect(() => {
    if (!user || user.role !== "company") return;
    let isActive = true;

    async function loadCreatedContent() {
      try {
        setIsLoading(true);
        const [eventData, listingData] = await Promise.all([
          fetchEventsByCreator(user.id),
          fetchAdsByCreator(user.id),
        ]);
        if (isActive) {
          setEvents(eventData);
          setListings(listingData);
        }
      } catch (loadError) {
        if (isActive) setError(loadError.message);
      } finally {
        if (isActive) setIsLoading(false);
      }
    }
    loadCreatedContent();
    return () => { isActive = false; };
  }, [user]);

  if (!user || user.role !== "company") {
    return <Navigate to="/LogIn" replace />;
  }

  const handleToggleRegistrations = async (eventId) => {
    const isExpanded = Boolean(expandedEvents[eventId]);
    if (isExpanded) {
      setExpandedEvents((current) => ({ ...current, [eventId]: false }));
      return;
    }
    setExpandedEvents((current) => ({ ...current, [eventId]: true }));
    if (eventRegistrations[eventId]) return;

    try {
      setEventRegistrationLoading((current) => ({ ...current, [eventId]: true }));
      const data = await fetchEventRegistrationsForCompany(eventId, user.id);
      setEventRegistrations((current) => ({ ...current, [eventId]: data }));
    } catch (loadError) {
      setEventRegistrationError((current) => ({ ...current, [eventId]: loadError.message }));
    } finally {
      setEventRegistrationLoading((current) => ({ ...current, [eventId]: false }));
    }
  };

  return (
    <div className="admin-page-container">
      <header className="admin-hero">
        <h1 className="admin-main-title">Administrasjon</h1>
        <p className="admin-subtitle">
          Velg hva du vil publisere. Alt du oppretter her lagres direkte i systemet.
        </p>
      </header>

      <div className="admin-action-grid">
        <div className="admin-action-card">
          <h2>Nytt arrangement</h2>
          <p>Lag et nytt event for studenter.</p>
          <Link to="/administration/events/new" className="admin-btn-primary">Opprett arrangement</Link>
        </div>

        <div className="admin-action-card">
          <h2>Ny jobbannonse</h2>
          <p>Publiser en ledig stilling.</p>
          <Link to="/administration/ads/new" className="admin-btn-primary">Opprett jobbannonse</Link>
        </div>
      </div>

      <section className="admin-content-section">
        <div className="admin-section-header">
          <h2>Dine arrangementer</h2>
        </div>
        <div className="admin-list">
          {events.map((event) => (
            <article key={event.id} className="admin-item-card">
              <div className="admin-item-info">
                <h3>{event.title}</h3>
                <p>{event.date} · {event.places}</p>
              </div>
              <div className="admin-item-btns">
                <button onClick={() => handleToggleRegistrations(event.id)} className="admin-btn-outline">
                  {expandedEvents[event.id] ? "Skjul påmeldte" : "Vis påmeldte"}
                </button>
                <Link to={`/administration/events/${event.id}/edit`} className="admin-btn-edit">Rediger</Link>
              </div>
              
              {expandedEvents[event.id] && (
                <div className="admin-registration-details">
                  {eventRegistrationLoading[event.id] ? <p>Laster...</p> : (
                    <ul>
                      {eventRegistrations[event.id]?.participants.map(p => (
                        <li key={p.id}>{p.fullName} ({p.email})</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}