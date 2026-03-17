import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AdminWork.css";

export function AdminWork() {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return <Navigate to="/LogIn" replace />;
  }

  return (
    <section className="admin-work-page">
      <header className="admin-work-hero">
        <p className="admin-work-kicker">Administrator arbeid</p>
        <h1>Administrativ oversikt</h1>
        <p>Velg et område for å redigere brukere, arrangementer eller jobbannonser.</p>
      </header>

      <div className="admin-work-grid">
        <article className="admin-work-card">
          <h2>Oversikt over brukere</h2>
          <p>Se alle brukere og rediger dot-systemet.</p>
          <Link className="admin-work-button" to="/admin-work/users">Åpne brukeroversikt</Link>
        </article>

        <article className="admin-work-card">
          <h2>Oversikt over events</h2>
          <p>Se og rediger arrangementer.</p>
          <Link className="admin-work-button" to="/admin-work/events">Åpne event-oversikt</Link>
        </article>

        <article className="admin-work-card">
          <h2>Oversikt over listings</h2>
          <p>Se og rediger jobbannonser.</p>
          <Link className="admin-work-button" to="/admin-work/listings">Åpne listings-oversikt</Link>
        </article>
      </div>
    </section>
  );
}
