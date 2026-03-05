import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  fetchEventById,
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

  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        setError("");
        setMessage("");

        const data = await fetchEventById(id);
        setEvent(data);

        if (user?.id && canRegister) {
          const registration = await fetchEventRegistrationStatus(id, user.id);
          setIsRegistered(Boolean(registration.is_registered));
        } else {
          setIsRegistered(false);
        }
      } catch (_err) {
        setError("Something went wrong while fetching the event.");
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [id, user?.id, canRegister]);

  async function handleRegister() {
    setMessage("");

    if (!user?.id) {
      setMessage("Du ma vare logget inn for a melde deg pa.");
      return;
    }

    try {
      if (isRegistered) {
        await unregisterFromEvent(id, user.id);
        setIsRegistered(false);
        setMessage("Du har forlatt arrangementet.");
      } else {
        await registerForEvent(id, user.id);
        setIsRegistered(true);
        setMessage("Du er nå påmeldt.");
      }
    } catch (_err) {
      setMessage("Kunne ikke oppdatere påmelding akkurat na.");
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

      <button
        type="button"
        className="back-button"
        onClick={() => navigate(-1)}
      >
        {t("back")}
      </button>

      {imageUrl && <img className="detail-image" src={imageUrl} alt={event.title} />}

      <h1>{event.title}</h1>

      <p>
        <strong>{t("category")}</strong> {event.category}
      </p>

      <p>
        <strong>{t("date")}</strong> {event.date}
      </p>

      <p>
        <strong>{t("location")}</strong> {event.places}
      </p>

      <p>
        <strong>{t("capacity")}</strong> {event.capacity}
      </p>

      <p className="detail-description">{event.description}</p>

      {canRegister ? (
        <button className={`register-button ${isRegistered ? "leave" : ""}`} onClick={handleRegister}>
          {isRegistered ? t("leaveEvent") : t("register")}
        </button>
      ) : null}

      {message && <p className="register-message">{message}</p>}
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
