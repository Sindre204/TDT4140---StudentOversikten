import "./EventCard.css";

export function EventCard({ event }) {
  return (
    <div className="event-card">
      <div className="event-content">
        <h2 className="event-title">{event.title}</h2>
        
        <div className="event-info">
          <span className="info-badge">{event.places}</span>
        </div>

        <div className="event-details">
           <span className="icon"></span> {event.date}
        </div>
      </div>

      <div className="event-right">
        <img src={event.img} alt={event.title} className="event-image" />
        {/* <div className="status-pill">Arrangementet er åpent</div> */}
      </div>
    </div>
  );
}
