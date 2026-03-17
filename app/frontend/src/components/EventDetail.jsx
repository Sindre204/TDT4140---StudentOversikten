import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  fetchEventById,
  fetchEventParticipants,
  fetchEventRegistrationStatus,
  registerForEvent,
  unregisterFromEvent,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./ItemDetail.css";

export function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const canRegister = user?.role !== "company";

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [message, setMessage] = useState("");
  const [participants, setParticipants] = useState([]);
  const [participantCount, setParticipantCount] = useState(0);

  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        setError("");
        setMessage("");

        const [data, participantData] = await Promise.all([
          fetchEventById(id),
          fetchEventParticipants(id),
        ]);
        setEvent(data);
        setParticipants(participantData.participants || []);
        setParticipantCount(participantData.registrations_count || 0);

        if (user?.id && canRegister) {
          const registration = await fetchEventRegistrationStatus(id, user.id);
          setIsRegistered(Boolean(registration.is_registered));
        } else {
          setIsRegistered(false);
        }
      } catch {
        setError(t("fetchError"));
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [canRegister, id, t, user?.id]);

  async function handleRegister() {
    setMessage("");

    if (!user?.id) {
      setMessage(t("mustBeLoggedInToRegister"));
      return;
    }

    try {
      if (isRegistered) {
        await unregisterFromEvent(id, user.id);
        setIsRegistered(false);
        setParticipants((current) => current.filter((participant) => participant.id !== user.id));
        setParticipantCount((current) => Math.max(0, current - 1));
        setMessage(t("leftEvent"));
      } else {
        await registerForEvent(id, user.id);
        setIsRegistered(true);
        setParticipants((current) => {
          if (current.some((participant) => participant.id === user.id)) {
            return current;
          }

          return [
            ...current,
            {
              id: user.id,
              fullName: user.fullName || user.email,
              email: user.email,
              dots: 0,
            },
          ];
        });
        setParticipantCount((current) => current + 1);
        setMessage(t("registeredEvent"));
      }
    } catch {
      setMessage(t("registrationUpdateFailed"));
    }
  }

  if (loading) {
    return <p className="detail-status">{t("loading")}</p>;
  }

  if (error || !event) {
    return <p className="detail-status">{error || t("eventNotFound")}</p>;
  }

  const imageUrl = getImageUrl(event.image);

  return (
    <section className="detail-page">
      <button type="button" className="back-button" onClick={() => navigate(-1)}>
        {t("back")}
      </button>

      {imageUrl && <img className="detail-image" src={imageUrl} alt={event.title} />}

      <div className="detail-hero">
        <h1>{event.title}</h1>
      </div>

      <section className="detail-meta" aria-label={t("eventInformation")}>
        <article className="detail-meta-card">
          <p className="detail-meta-label">{t("category")}</p>
          <p className="detail-meta-value">{event.category || "-"}</p>
        </article>
        <article className="detail-meta-card">
          <p className="detail-meta-label">{t("date")}</p>
          <p className="detail-meta-value">{event.date || "-"}</p>
        </article>
        <article className="detail-meta-card">
          <p className="detail-meta-label">{t("location")}</p>
          <p className="detail-meta-value">{event.places || "-"}</p>
        </article>
        <article className="detail-meta-card">
          <p className="detail-meta-label">{t("capacity")}</p>
          <p className="detail-meta-value">{event.capacity || "-"}</p>
        </article>
      </section>

      <section className="detail-content-section" aria-labelledby="description-heading">
        <h2 id="description-heading" className="detail-section-title">
          {t("description")}
        </h2>
        <p className="detail-description">{event.description || t("noDescriptionAvailable")}</p>
      </section>

      {canRegister ? (
        <div className="detail-actions">
          <button className={`register-button ${isRegistered ? "leave" : ""}`} onClick={handleRegister}>
            {isRegistered ? t("leaveEvent") : t("register")}
          </button>
        </div>
      ) : null}

      {message && <p className="register-message">{message}</p>}

      <section className="participants-section" aria-labelledby="participants-heading">
        <div className="participants-header">
          <div>
            <p className="participants-kicker">{t("participants")}</p>
            <h2 id="participants-heading">{t("whoIsComing")}</h2>
          </div>
          <div className="participants-count">{participantCount}</div>
        </div>

        {!participants.length ? (
          <p className="participants-empty">{t("noParticipantsYet")}</p>
        ) : (
          <ul className="participants-list">
            {participants.map((participant) => (
              <li key={participant.id} className="participants-item">
                <div className="participants-avatar" aria-hidden="true">
                  {getParticipantInitials(participant.fullName, participant.email)}
                </div>
                <div>
                  <p className="participants-name">{participant.fullName}</p>
                  <p className="participants-email">{participant.email}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
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
  return imagePath.startsWith("/") ? `${baseUrl}${imagePath}` : `${baseUrl}/${imagePath}`;
}

function getParticipantInitials(fullName, email) {
  const source = (fullName || email || "").trim();
  if (!source) return "?";

  const parts = source.split(/\s+/).filter(Boolean).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() || "").join("") || source[0].toUpperCase();
}
