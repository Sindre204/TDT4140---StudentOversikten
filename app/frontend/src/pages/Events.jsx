import { useEffect, useState } from "react";
import { EventCard } from "../components/EventCard";
import { fetchEvents } from "../services/api";


export function Events() {
    const [events, setEvents] = useState([]);
    
    useEffect(() => {
        fetchEvents().then(data => setEvents(data));
    }, []);

    return (
        <>
            <h1>Events</h1>

            <div className="events-grid">
                {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        </>
    );

}
