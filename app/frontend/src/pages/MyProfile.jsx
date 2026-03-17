import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import "./MyProfile.css";

export function MyProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const roleLabel = user?.role === "company"
    ? t("roleCompany")
    : user?.role === "admin"
      ? t("roleAdmin")
      : t("roleStudent");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return <div className="profile-container">{t("pleaseLogIn")}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>{t("myProfileTitle")}</h1>
        {user.role === "company" && <span className="profile-role-badge">{t("roleCompany")}</span>}
      </div>
      <div className="profile-info">
        <p><strong>{t("fullName")}</strong> {user.fullName}</p>
        <p><strong>{t("email")}</strong> {user.email}</p>
        <p><strong>{t("role")}</strong> {roleLabel}</p>
      </div>
      <button onClick={handleLogout} className="logout-button">{t("logOut")}</button>
    </div>
  );
}
