import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createEvent, fetchEventById, updateEvent } from "../services/api";
import "./CreateListingAdmin.css";

const EVENT_CATEGORIES = [
  "Sosialt",
  "Karriere",
  "Workshop",
  "Sport",
  "Faglig",
  "Fest",
  "Nettverksbygging",
  "Annet",
];

const INITIAL_FORM = {
  title: "",
  category: EVENT_CATEGORIES[0],
  date: "",
  description: "",
  places: "",
  capacity: "100",
  image: null,
};

export function CreateEventAdmin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "company") {
      return undefined;
    }

    let isActive = true;

    async function loadEvent() {
      if (!isEditMode) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const existingEvent = await fetchEventById(id);

        if (!isActive) {
          return;
        }

        if (existingEvent.created_by !== user.id) {
          navigate("/administration", { replace: true });
          return;
        }

        setFormData({
          title: existingEvent.title ?? "",
          category: existingEvent.category ?? EVENT_CATEGORIES[0],
          date: existingEvent.date ?? "",
          description: existingEvent.description ?? "",
          places: existingEvent.places ?? "",
          capacity: String(existingEvent.capacity ?? 100),
          image: null,
        });
      } catch (loadError) {
        if (isActive) {
          setError(loadError.message);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadEvent();

    return () => {
      isActive = false;
    };
  }, [id, isEditMode, navigate, user]);

  if (!user || user.role !== "company") {
    return <Navigate to="/LogIn" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    setFormData((current) => ({
      ...current,
      image: event.target.files?.[0] ?? null,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        created_by: user.id,
      };

      const savedEvent = isEditMode
        ? await updateEvent(id, payload)
        : await createEvent(payload);

      navigate(`/events/${savedEvent.id}`);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="administration-page">
      <div className="administration-hero">
        <p className="administration-kicker">Administrasjon</p>
        <h1>{isEditMode ? "Rediger arrangement" : "Opprett arrangement"}</h1>
        <p className="administration-subtitle">
          {isEditMode
            ? "Oppdater arrangementet med de samme feltene som i Django."
            : "Fyll ut de samme feltene som du ville gjort i Django."}
        </p>
      </div>

      {isLoading ? <p>Laster arrangement...</p> : null}

      {!isLoading ? (
      <form className="administration-form" onSubmit={handleSubmit}>
        <label>
          Tittel
          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Kategori
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {EVENT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label>
          Dato
          <input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Beskrivelse
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            required
          />
        </label>

        <label>
          Sted
          <input
            name="places"
            type="text"
            value={formData.places}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Kapasitet
          <input
            name="capacity"
            type="number"
            min="1"
            value={formData.capacity}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Bilde
          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>

        {error ? <p className="administration-error">{error}</p> : null}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? (isEditMode ? "Lagrer..." : "Oppretter...")
            : (isEditMode ? "Lagre endringer" : "Opprett arrangement")}
        </button>
      </form>
      ) : null}
    </section>
  );
}
