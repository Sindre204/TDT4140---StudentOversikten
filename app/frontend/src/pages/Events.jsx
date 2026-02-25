import { useEffect, useState } from "react";
import { EventCard } from "../components/EventCard";
import { fetchEvents } from "../services/api";

export function Events() {
    const [events, setEvents] = useState([]);
    const [filter, setFilter] = useState("All");
    const [sortOrder, setSortOrder] = useState("newest");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchEvents().then(data => setEvents(data));
    }, []);

    const categories = [
        "All",
        ...new Set(events.map(event => event.category))
    ];

    const filteredEvents = events
        .filter(event => {
            const matchesCategory =
                filter === "All" || event.category === filter;

            const matchesSearch =
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesCategory && matchesSearch;
        })
        .sort((a, b) => {
            return sortOrder === "newest"
                ? new Date(b.date) - new Date(a.date)
                : new Date(a.date) - new Date(b.date);
        });

    return (
        <>
            <h1 className="events-header">Arrangementer</h1>

            <p className="events-subtitle">
                Utforsk kommende arrangementer
            </p>

            <div className="events-controls">
                <input
                    type="text"
                    placeholder="Søk etter arrangementer"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    {categories.map(category => (
                        <option key={category} value={category}>
                            {category === "All" ? "Alle kategorier" : category}
                        </option>
                    ))}
                </select>

                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <option value="newest">Nyeste først</option>
                    <option value="oldest">Eldste først</option>
                </select>
            </div>

            <div className="events-grid">
                {filteredEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        </>
    );
}
