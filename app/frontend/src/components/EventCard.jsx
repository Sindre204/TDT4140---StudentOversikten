import { useNavigate } from "react-router-dom";
import "./EventCard.css";

export function EventCard({ event }) {
  const navigate = useNavigate();
  const imageUrl = getEventImageUrl(event.image);

  const handleClick = () => {
    navigate(`/events/${event.id}`);
  };

  return (
    <div
      className="event-card"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div className="event-content">
        <h2 className="event-title">{event.title}</h2>

        <div className="event-info">
          <span className="info-badge">{event.capacity}</span>
        </div>

        <div className="event-details">
          {event.date} - {event.places}
        </div>

        <p className="event-description">{event.description}</p>
      </div>

      <div className="event-right">
        <img src={imageUrl} alt={event.title} className="event-image" />
      </div>
    </div>
  );
}

function getEventImageUrl(imagePath) {
  if (!imagePath) return null;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const baseUrl = "http://127.0.0.1:8000";
  return imagePath.startsWith("/")
    ? `${baseUrl}${imagePath}`
    : `${baseUrl}/${imagePath}`;
}
