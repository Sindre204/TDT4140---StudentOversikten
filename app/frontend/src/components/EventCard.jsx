import "./EventCard.css";

export function EventCard({ event }) {
  console.log(event)
  return (
    <div className="event-card">
      <div className="event-content">
        <h2 className="event-title">{event.title}</h2>
        
        <div className="event-info">
          <span className="info-badge">{event.capacity}</span>
        </div>

        <div className="event-details">
           {event.date} - {event.places}
        </div>

        <p className="event-description">
          {event.description}
        </p>
      </div>

      <div className="event-right">
        <img src={event.image} alt={event.title} className="event-image" />
        {/* <div className="status-pill">Arrangementet er åpent</div> */}
      </div>
    </div>
  );
}
