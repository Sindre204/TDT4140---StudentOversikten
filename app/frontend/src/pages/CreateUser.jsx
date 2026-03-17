import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import "./CreateUser.css";

export function CreateUser() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role] = useState("student");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t("passwordsNoMatch"));
      return;
    }

    if (password.length < 6) {
      setError(t("passwordTooShort"));
      return;
    }

    try {
      await register({ email, fullName, password, role });
      navigate("/LogIn");
    } catch (err) {
      setError(err.message || t("failedToCreate"));
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <h1 className="auth-title">{t("createUser")}</h1>
        <p className="auth-subtitle">{t("createUserSubtitle")}</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="fullName">{t("fullName")}</label>
            <input
              type="text"
              id="fullName"
              placeholder={t("fullNamePlaceholder")}
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">{t("email")}</label>
            <input
              type="email"
              id="email"
              placeholder={t("emailPlaceholder")}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t("password")}</label>
            <input
              type="password"
              id="password"
              placeholder={t("passwordPlaceholder")}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">{t("confirmPassword")}</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder={t("confirmPasswordPlaceholder")}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>

          {error && <p className="error-bubble">{error}</p>}

          <button type="submit" className="auth-submit-btn">
            {t("createUser")}
          </button>
        </form>
      </div>
    </div>
  );
}
