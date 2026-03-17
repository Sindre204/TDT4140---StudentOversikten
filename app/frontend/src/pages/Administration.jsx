import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import {
  fetchAdsByCreator,
  fetchEventRegistrationsForCompany,
  fetchEventsByCreator,
  updateEventRegistrationDots,
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
  const [editingDots, setEditingDots] = useState({});
  const [draftDots, setDraftDots] = useState({});
  const [saveDotsLoading, setSaveDotsLoading] = useState({});
  const [saveDotsError, setSaveDotsError] = useState({});

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

  const buildEditKey = (eventId, participantId) => `${eventId}-${participantId}`;

  const handleStartEditDots = (eventId, participant) => {
    const key = buildEditKey(eventId, participant.id);
    setEditingDots((current) => ({ ...current, [key]: true }));
    setDraftDots((current) => ({ ...current, [key]: participant.dots ?? 0 }));
    setSaveDotsError((current) => ({ ...current, [key]: "" }));
  };

  const handleCancelEditDots = (eventId, participantId) => {
    const key = buildEditKey(eventId, participantId);
    setEditingDots((current) => ({ ...current, [key]: false }));
    setSaveDotsError((current) => ({ ...current, [key]: "" }));
  };

  const handleSaveDots = async (eventId, participantId) => {
    const key = buildEditKey(eventId, participantId);
    try {
      setSaveDotsLoading((current) => ({ ...current, [key]: true }));
      setSaveDotsError((current) => ({ ...current, [key]: "" }));
      const dotsToSave = Number(draftDots[key] ?? 0);
      const updatedParticipant = await updateEventRegistrationDots(eventId, participantId, user.id, dotsToSave);

      setEventRegistrations((current) => {
        const registrationData = current[eventId];
        if (!registrationData) return current;
        return {
          ...current,
          [eventId]: {
            ...registrationData,
            participants: registrationData.participants.map((participant) =>
              participant.id === participantId
                ? { ...participant, dots: updatedParticipant.dots }
                : participant
            ),
          },
        };
      });
      setEditingDots((current) => ({ ...current, [key]: false }));
    } catch (saveError) {
      setSaveDotsError((current) => ({ ...current, [key]: saveError.message || "Kunne ikke lagre dots." }));
    } finally {
      setSaveDotsLoading((current) => ({ ...current, [key]: false }));
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
                      {eventRegistrations[event.id]?.participants.map((p) => {
                        const key = buildEditKey(event.id, p.id);
                        const isEditing = Boolean(editingDots[key]);
                        const isSaving = Boolean(saveDotsLoading[key]);
                        const participantDots = p.dots ?? 0;
                        return (
                          <li key={p.id} className="admin-participant-row">
                            <div>
                              <span>{p.fullName} ({p.email})</span>
                              <span className="admin-dots-label">{t("dots")}: {participantDots}</span>
                            </div>
                            <div className="admin-dots-actions">
                              {isEditing ? (
                                <>
                                  <select
                                    aria-label={`Velg dots for ${p.fullName}`}
                                    value={draftDots[key] ?? participantDots}
                                    onChange={(eventObj) =>
                                      setDraftDots((current) => ({
                                        ...current,
                                        [key]: Number(eventObj.target.value),
                                      }))
                                    }
                                  >
                                    <option value={0}>0</option>
                                    <option value={1}>1</option>
                                    <option value={2}>2</option>
                                    <option value={3}>3</option>
                                  </select>
                                  <button
                                    type="button"
                                    className="admin-btn-outline"
                                    disabled={isSaving}
                                    onClick={() => handleSaveDots(event.id, p.id)}
                                  >
                                    {t("save")}
                                  </button>
                                  <button
                                    type="button"
                                    className="admin-btn-outline"
                                    disabled={isSaving}
                                    onClick={() => handleCancelEditDots(event.id, p.id)}
                                  >
                                    {t("cancel")}
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  className="admin-edit-icon-btn"
                                  onClick={() => handleStartEditDots(event.id, p)}
                                  aria-label={`Rediger dots for ${p.fullName}`}
                                  title={`${t("edit")} ${t("dots").toLowerCase()}`}
                                >
                                  ✎
                                </button>
                              )}
                            </div>
                            {saveDotsError[key] ? <p className="admin-error-text">{saveDotsError[key]}</p> : null}
                          </li>
                        );
                      })}
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
