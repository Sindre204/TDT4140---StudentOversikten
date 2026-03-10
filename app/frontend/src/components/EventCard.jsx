import { useNavigate } from "react-router-dom";
import "./EventCard.css";

export function EventCard({ event }) {
  const navigate = useNavigate();
  const imageUrl = getEventImageUrl(event.image);

  return (
    <div className="event-card" onClick={() => navigate(`/events/${event.id}`)}>
      <div className="event-content">
        <div className="event-header-row">
          <span className="info-badge category">{event.category}</span>
          <span className="event-date">{event.date}</span>
        </div>

        {event.host_company ? (
          <p className="event-host">Hostes av {event.host_company}</p>
        ) : null}
        
        <h2 className="event-title">{event.title}</h2>
        
        <div className="event-meta">
          <span className="meta-item"> {event.places}</span>
          <span className="meta-item"> {event.capacity} plasser</span>
        </div>
      </div>

      {imageUrl && (
        <div className="event-right">
          <img src={imageUrl} alt={event.title} className="event-image" />
        </div>
      )}
    </div>
  );
}

function getEventImageUrl(imagePath) {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  const baseUrl = "http://127.0.0.1:8000";
  return imagePath.startsWith("/") ? `${baseUrl}${imagePath}` : `${baseUrl}/${imagePath}`;
}
