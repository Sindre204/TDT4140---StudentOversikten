import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  fetchAdminUsersOverview,
  updateDotsFromAdminUsersOverview,
} from "../services/api";
import "./AdminWork.css";

function isStudent(user) {
  return user.role === "student";
}

export function AdminUsersOverview() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingDots, setEditingDots] = useState({});
  const [draftDots, setDraftDots] = useState({});
  const [saveDotsLoading, setSaveDotsLoading] = useState({});
  const [saveDotsError, setSaveDotsError] = useState({});

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    let isActive = true;

    async function loadUsers() {
      try {
        setIsLoading(true);
        setError("");
        const data = await fetchAdminUsersOverview(user.id);
        if (isActive) setUsers(data);
      } catch (loadError) {
        if (isActive) setError(loadError.message);
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    loadUsers();
    return () => {
      isActive = false;
    };
  }, [user]);

  if (!user || user.role !== "admin") {
    return <Navigate to="/LogIn" replace />;
  }

  const editKey = (userId, eventId) => `${userId}-${eventId}`;

  const handleStartEditDots = (targetUserId, eventId, dots) => {
    const key = editKey(targetUserId, eventId);
    setEditingDots((current) => ({ ...current, [key]: true }));
    setDraftDots((current) => ({ ...current, [key]: dots ?? 0 }));
    setSaveDotsError((current) => ({ ...current, [key]: "" }));
  };

  const handleCancelEditDots = (targetUserId, eventId) => {
    const key = editKey(targetUserId, eventId);
    setEditingDots((current) => ({ ...current, [key]: false }));
    setSaveDotsError((current) => ({ ...current, [key]: "" }));
  };

  const handleSaveDots = async (targetUserId, eventId) => {
    const key = editKey(targetUserId, eventId);
    try {
      setSaveDotsLoading((current) => ({ ...current, [key]: true }));
      setSaveDotsError((current) => ({ ...current, [key]: "" }));

      const dots = Number(draftDots[key] ?? 0);
      const response = await updateDotsFromAdminUsersOverview(user.id, targetUserId, eventId, dots);

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) => {
          if (currentUser.id !== targetUserId) return currentUser;
          const registrations = (currentUser.registrations || []).map((registration) =>
            registration.eventId === eventId
              ? { ...registration, dots: response.dots }
              : registration
          );
          const totalDots = registrations.reduce((sum, registration) => sum + (registration.dots || 0), 0);
          return {
            ...currentUser,
            registrations,
            totalDots,
          };
        })
      );

      setEditingDots((current) => ({ ...current, [key]: false }));
    } catch (saveError) {
      setSaveDotsError((current) => ({ ...current, [key]: saveError.message || "Kunne ikke lagre dots." }));
    } finally {
      setSaveDotsLoading((current) => ({ ...current, [key]: false }));
    }
  };

  return (
    <section className="admin-work-page">
      <header className="admin-work-hero admin-work-hero-left">
        <p className="admin-work-kicker">Administrator arbeid</p>
        <h1>Oversikt over brukere</h1>
        <p>Rediger studentenes dots per arrangement.</p>
        <Link className="admin-work-secondary-button" to="/admin-work">Tilbake</Link>
      </header>

      {isLoading ? <p>Laster brukere...</p> : null}
      {error ? <p className="admin-work-error">{error}</p> : null}

      {!isLoading && !error ? (
        <div className="admin-user-list">
          {users.map((listedUser) => (
            <article className="admin-user-card" key={listedUser.id}>
              <h2>{listedUser.fullName}</h2>
              <p>{listedUser.email}</p>
              <p>Rolle: {listedUser.role}</p>
              <p>Totale dots: {listedUser.totalDots ?? 0}</p>

              {isStudent(listedUser) ? (
                listedUser.registrations?.length ? (
                  <ul className="admin-user-registration-list">
                    {listedUser.registrations.map((registration) => {
                      const key = editKey(listedUser.id, registration.eventId);
                      const isEditing = Boolean(editingDots[key]);
                      const isSaving = Boolean(saveDotsLoading[key]);
                      return (
                        <li key={registration.eventId}>
                          <div>
                            <span>{registration.eventTitle}</span>
                            <span className="admin-user-registration-meta">
                              {registration.eventDate} · Dots: {registration.dots ?? 0}
                            </span>
                          </div>

                          <div className="admin-user-registration-actions">
                            {isEditing ? (
                              <>
                                <select
                                  aria-label={`Velg dots for ${listedUser.fullName} i ${registration.eventTitle}`}
                                  value={draftDots[key] ?? registration.dots ?? 0}
                                  onChange={(eventObj) =>
                                    setDraftDots((current) => ({
                                      ...current,
                                      [key]: Number(eventObj.target.value),
                                    }))
                                  }
                                >
                                  <option value={0}>0</option>
                                  <option value={1}>1</option>
                                  <option value={2}>2</option>
                                  <option value={3}>3</option>
                                </select>
                                <button
                                  type="button"
                                  className="admin-work-secondary-button"
                                  disabled={isSaving}
                                  onClick={() => handleSaveDots(listedUser.id, registration.eventId)}
                                >
                                  Lagre
                                </button>
                                <button
                                  type="button"
                                  className="admin-work-secondary-button"
                                  disabled={isSaving}
                                  onClick={() => handleCancelEditDots(listedUser.id, registration.eventId)}
                                >
                                  Avbryt
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                className="admin-work-icon-button"
                                onClick={() =>
                                  handleStartEditDots(
                                    listedUser.id,
                                    registration.eventId,
                                    registration.dots
                                  )
                                }
                                aria-label={`Rediger dots for ${listedUser.fullName}`}
                              >
                                ✎
                              </button>
                            )}
                          </div>

                          {saveDotsError[key] ? (
                            <p className="admin-work-error small">{saveDotsError[key]}</p>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p>Ingen registreringer.</p>
                )
              ) : (
                <p>Dots gjelder kun studenter.</p>
              )}
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
