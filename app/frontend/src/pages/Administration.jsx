import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import {
  fetchAdsByCreator,
  fetchEventRegistrationsForCompany,
  fetchEventsByCreator,
} from "../services/api";
import "./Administration.css";

export function Administration() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
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
        const [eventData] = await Promise.all([
          fetchEventsByCreator(user.id),
          fetchAdsByCreator(user.id),
        ]);
        if (isActive) {
          setEvents(eventData);
        }
      } catch (loadError) {
        if (isActive) setError(loadError.message);
      } finally {
        if (isActive) setIsLoading(false);
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
        <h1 className="admin-main-title">{t("administration")}</h1>
        <p className="admin-subtitle">{t("administrationSubtitle")}</p>
      </header>

      <div className="admin-action-grid">
        <div className="admin-action-card">
          <h2>{t("newEvent")}</h2>
          <p>{t("newEventDescription")}</p>
          <Link to="/administration/events/new" className="admin-btn-primary">
            {t("createEvent")}
          </Link>
        </div>

        <div className="admin-action-card">
          <h2>{t("newListing")}</h2>
          <p>{t("newListingDescription")}</p>
          <Link to="/administration/ads/new" className="admin-btn-primary">
            {t("createListing")}
          </Link>
        </div>
      </div>

      <section className="admin-content-section">
        <div className="admin-section-header">
          <h2>{t("yourEvents")}</h2>
        </div>
        <div className="admin-list">
          {isLoading ? <p>{t("loadingRegistrations")}</p> : null}
          {events.map((event) => (
            <article key={event.id} className="admin-item-card">
              <div className="admin-item-info">
                <h3>{event.title}</h3>
                <p>{event.date} · {event.places}</p>
              </div>
              <div className="admin-item-btns">
                <button onClick={() => handleToggleRegistrations(event.id)} className="admin-btn-outline">
                  {expandedEvents[event.id] ? t("hideRegistrations") : t("showRegistrations")}
                </button>
                <Link to={`/administration/events/${event.id}/edit`} className="admin-btn-edit">
                  {t("edit")}
                </Link>
              </div>

              {expandedEvents[event.id] && (
                <div className="admin-registration-details">
                  {eventRegistrationLoading[event.id] ? (
                    <p>{t("loadingRegistrations")}</p>
                  ) : eventRegistrationError[event.id] ? (
                    <p>{eventRegistrationError[event.id]}</p>
                  ) : (
                    <ul>
                      {eventRegistrations[event.id]?.participants.map((participant) => (
                        <li key={participant.id}>
                          {participant.fullName} ({participant.email})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </article>
          ))}
          {error ? <p>{error}</p> : null}
        </div>
      </section>
    </div>
  );
}
