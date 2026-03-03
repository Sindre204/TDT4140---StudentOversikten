import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createListing, fetchListingById, updateListing } from "../services/api";
import "./Administration.css";

const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Internship",
  "Summer job",
];

const INITIAL_FORM = {
  title: "",
  description: "",
  company: "",
  employment_type: EMPLOYMENT_TYPES[0],
  city: "",
  image: null,
};

export function CreateListingAdmin() {
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

    async function loadListing() {
      if (!isEditMode) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const existingListing = await fetchListingById(id);

        if (!isActive) {
          return;
        }

        if (existingListing.created_by !== user.id) {
          navigate("/administration", { replace: true });
          return;
        }

        setFormData({
          title: existingListing.title ?? "",
          description: existingListing.description ?? "",
          company: existingListing.company ?? "",
          employment_type: existingListing.employment_type ?? EMPLOYMENT_TYPES[0],
          city: existingListing.city ?? "",
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

    loadListing();

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

      const savedListing = isEditMode
        ? await updateListing(id, payload)
        : await createListing(payload);

      navigate(`/listings/${savedListing.id}`);
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
        <h1>{isEditMode ? "Rediger jobbannonse" : "Opprett jobbannonse"}</h1>
        <p className="administration-subtitle">
          {isEditMode
            ? "Oppdater jobbannonsen og lagre endringene direkte i backend."
            : "Legg inn en jobbannonse som publiseres direkte i backend."}
        </p>
      </div>

      {isLoading ? <p>Laster jobbannonse...</p> : null}

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
          Firma
          <input
            name="company"
            type="text"
            value={formData.company}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Ansettelsesform
          <select
            name="employment_type"
            value={formData.employment_type}
            onChange={handleChange}
            required
          >
            {EMPLOYMENT_TYPES.map((employmentType) => (
              <option key={employmentType} value={employmentType}>
                {employmentType}
              </option>
            ))}
          </select>
        </label>

        <label>
          By
          <input
            name="city"
            type="text"
            value={formData.city}
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
            : (isEditMode ? "Lagre endringer" : "Opprett jobbannonse")}
        </button>
      </form>
      ) : null}
    </section>
  );
}
