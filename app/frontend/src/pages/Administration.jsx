import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  fetchAdsByCreator,
  fetchEventRegistrationsForCompany,
  fetchEventsByCreator,
} from "../services/api";
import "./Administration.css";

export function Administration() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedEvents, setExpandedEvents] = useState({});
  const [eventRegistrations, setEventRegistrations] = useState({});
  const [eventRegistrationLoading, setEventRegistrationLoading] = useState({});
  const [eventRegistrationError, setEventRegistrationError] = useState({});

  useEffect(() => {
    if (!user || user.role !== "company") {
      return undefined;
    }

    let isActive = true;

    async function loadCreatedContent() {
      try {
        setIsLoading(true);
        setError("");

        const [eventData, listingData] = await Promise.all([
          fetchEventsByCreator(user.id),
          fetchAdsByCreator(user.id),
        ]);

        if (!isActive) {
          return;
        }

        setEvents(eventData);
        setListings(listingData);
      } catch (loadError) {
        if (!isActive) {
          return;
        }
        setError(loadError.message);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
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

    if (eventRegistrations[eventId]) {
      return;
    }

    try {
      setEventRegistrationLoading((current) => ({ ...current, [eventId]: true }));
      setEventRegistrationError((current) => ({ ...current, [eventId]: "" }));
      const data = await fetchEventRegistrationsForCompany(eventId, user.id);
      setEventRegistrations((current) => ({ ...current, [eventId]: data }));
    } catch (loadError) {
      setEventRegistrationError((current) => ({ ...current, [eventId]: loadError.message }));
    } finally {
      setEventRegistrationLoading((current) => ({ ...current, [eventId]: false }));
    }
  };

  return (
    <section className="administration-page">
      <div className="administration-hero">
        <p className="administration-kicker">Administrasjon</p>
        <h1>Opprett innhold</h1>
        <p className="administration-subtitle">
          Velg hva du vil publisere. Alt du oppretter her lagres direkte i systemet.
        </p>
      </div>

      <div className="administration-grid">
        <article className="administration-card">
          <h2>Nytt arrangement</h2>
          <p>Opprett et arrangement med de samme feltene som i Django-administrasjonen.</p>
          <Link to="/administration/events/new" className="administration-link">
            Ga til arrangementskjema
          </Link>
        </article>

        <article className="administration-card">
          <h2>Ny jobbannonse</h2>
          <p>Opprett en jobbannonse og publiser den direkte i backend.</p>
          <Link to="/administration/ads/new" className="administration-link">
            Ga til jobbannonse
          </Link>
        </article>
      </div>

      <section className="administration-section">
        <div className="administration-section-header">
          <h2>Dine arrangementer</h2>
          <Link to="/administration/events/new" className="administration-link">
            Opprett nytt
          </Link>
        </div>

        {isLoading ? <p>Laster arrangementer...</p> : null}
        {!isLoading && !events.length ? <p>Du har ikke opprettet noen arrangementer enda.</p> : null}

        {!isLoading && events.length ? (
          <div className="administration-list">
            {events.map((event) => (
              <article key={event.id} className="administration-item">
                <div className="administration-item-top">
                  <div className="administration-item-main">
                    <h3>{event.title}</h3>
                    <p>
                      {event.date} · {event.places}
                    </p>
                  </div>

                  <div className="administration-item-actions">
                    <button
                      type="button"
                      className="administration-link administration-link-button"
                      onClick={() => handleToggleRegistrations(event.id)}
                    >
                      {expandedEvents[event.id] ? "Skjul påmeldte" : "Vis påmeldte"}
                    </button>
                    <Link to={`/administration/events/${event.id}/edit`} className="administration-link">
                      Rediger
                    </Link>
                  </div>
                </div>

                {expandedEvents[event.id] ? (
                  <div className="administration-registrations">
                    {eventRegistrationLoading[event.id] ? <p>Laster påmeldte...</p> : null}
                    {eventRegistrationError[event.id] ? (
                      <p className="administration-error">{eventRegistrationError[event.id]}</p>
                    ) : null}

                    {eventRegistrations[event.id] ? (
                      <div>
                        <p>Antall påmeldte: {eventRegistrations[event.id].registrations_count}</p>
                        {!eventRegistrations[event.id].participants.length ? (
                          <p>Ingen er påmeldt enda.</p>
                        ) : (
                          <ul>
                            {eventRegistrations[event.id].participants.map((participant) => (
                              <li key={participant.id}>
                                {participant.fullName} ({participant.email})
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <section className="administration-section">
        <div className="administration-section-header">
          <h2>Dine jobbannonser</h2>
          <Link to="/administration/ads/new" className="administration-link">
            Opprett ny
          </Link>
        </div>

        {error ? <p className="administration-error">{error}</p> : null}
        {isLoading ? <p>Laster jobbannonser...</p> : null}
        {!isLoading && !listings.length ? <p>Du har ikke opprettet noen jobbannonser enda.</p> : null}

        {!isLoading && listings.length ? (
          <div className="administration-list">
            {listings.map((listing) => (
              <article key={listing.id} className="administration-item">
                <div className="administration-item-top">
                  <div className="administration-item-main">
                    <h3>{listing.title}</h3>
                    <p>
                      {listing.company} · {listing.city}
                    </p>
                  </div>
                  <div className="administration-item-actions">
                    <Link to={`/administration/ads/${listing.id}/edit`} className="administration-link">
                      Rediger
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </section>
  );
}
