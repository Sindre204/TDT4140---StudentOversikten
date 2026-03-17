import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { createEvent, fetchEventById, updateEvent } from "../services/api";
import "./CreateListingAdmin.css";

const EVENT_CATEGORIES = [
  { value: "Sosialt", label: "eventCategorySocial" },
  { value: "Karriere", label: "eventCategoryCareer" },
  { value: "Workshop", label: "eventCategoryWorkshop" },
  { value: "Sport", label: "eventCategorySport" },
  { value: "Faglig", label: "eventCategoryAcademic" },
  { value: "Fest", label: "eventCategoryParty" },
  { value: "Nettverksbygging", label: "eventCategoryNetworking" },
  { value: "Annet", label: "eventCategoryOther" },
];

const INITIAL_FORM = {
  title: "",
  category: EVENT_CATEGORIES[0].value,
  date: "",
  description: "",
  places: "",
  capacity: "100",
  image: null,
};

export function CreateEventAdmin() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ownerId, setOwnerId] = useState(null);

  useEffect(() => {
    if (!user || (user.role !== "company" && user.role !== "admin")) {
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

        if (user.role === "company" && existingEvent.created_by !== user.id) {
          navigate("/administration", { replace: true });
          return;
        }
        setOwnerId(existingEvent.created_by);

        setFormData({
          title: existingEvent.title ?? "",
          category: existingEvent.category ?? EVENT_CATEGORIES[0].value,
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

  if (!user || (user.role !== "company" && user.role !== "admin")) {
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
        created_by: isEditMode ? (ownerId ?? user.id) : user.id,
      };

      const savedEvent = isEditMode
        ? await updateEvent(id, payload)
        : await createEvent(payload);

      navigate(user.role === "admin" ? "/admin-work/events" : `/events/${savedEvent.id}`);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="administration-page">
      <div className="administration-hero">
        <p className="administration-kicker">{t("administration")}</p>
        <h1>{isEditMode ? t("editEvent") : t("createEventTitle")}</h1>
        <p className="administration-subtitle">
          {isEditMode ? t("editEventSubtitle") : t("createEventSubtitle")}
        </p>
      </div>

      {isLoading ? <p>{t("loadingEvent")}</p> : null}

      {!isLoading ? (
        <form className="administration-form" onSubmit={handleSubmit}>
          <label>
            {t("title")}
            <input
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            {t("eventCategory")}
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {EVENT_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {t(category.label)}
                </option>
              ))}
            </select>
          </label>

          <label>
            {t("eventDate")}
            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            {t("description")}
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
            />
          </label>

          <label>
            {t("eventPlace")}
            <input
              name="places"
              type="text"
              value={formData.places}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            {t("eventCapacity")}
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
            {t("image")}
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
              ? (isEditMode ? t("saving") : t("creating"))
              : (isEditMode ? t("saveChanges") : t("createEvent"))}
          </button>
        </form>
      ) : null}
    </section>
  );
}
