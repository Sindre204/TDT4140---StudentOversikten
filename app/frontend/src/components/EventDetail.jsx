import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchEventById } from "../services/api";
import "./ItemDetail.css";

export function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        const data = await fetchEventById(id);
        setEvent(data);
      } catch (_err) {
        setError("Something went wrong while fetching the event.");
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [id]);

  if (loading) {
    return <p className="detail-status">Loading event...</p>;
  }

  if (error || !event) {
    return <p className="detail-status">{error || "Event not found."}</p>;
  }

  const imageUrl = getImageUrl(event.image);

  return (
    <section className="detail-page">
      <button type="button" className="back-button" onClick={() => navigate(-1)}>
        Back
      </button>

      {imageUrl ? (
        <img className="detail-image" src={imageUrl} alt={event.title} />
      ) : null}

      <h1>{event.title}</h1>

      <p>
        <strong>Category:</strong> {event.category}
      </p>

      <p>
        <strong>Date:</strong> {event.date}
      </p>

      <p>
        <strong>Location:</strong> {event.places}
      </p>

      <p>
        <strong>Capacity:</strong> {event.capacity}
      </p>

      <p className="detail-description">{event.description}</p>
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
