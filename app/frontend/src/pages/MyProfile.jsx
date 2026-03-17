<<<<<<< Updated upstream
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import "./MyProfile.css";

export function MyProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
=======
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchUserProfile } from '../services/api';
import './MyProfile.css';

export function MyProfile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [profile, setProfile] = useState(null);
>>>>>>> Stashed changes

  const roleLabel = user?.role === "company"
    ? t("roleCompany")
    : user?.role === "admin"
      ? t("roleAdmin")
      : t("roleStudent");

<<<<<<< Updated upstream
  const handleLogout = () => {
    logout();
    navigate("/");
  };
=======
    useEffect(() => {
        if (!user?.id) return;
        let isActive = true;

        async function loadProfile() {
            try {
                const profileData = await fetchUserProfile(user.id);
                if (isActive) setProfile(profileData);
            } catch (_error) {
                if (isActive) setProfile(null);
            }
        }

        loadProfile();
        return () => { isActive = false; };
    }, [user?.id]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };
>>>>>>> Stashed changes

  if (!user) {
    return <div className="profile-container">{t("pleaseLogIn")}</div>;
  }

<<<<<<< Updated upstream
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
=======
    const totalDots = profile?.totalDots ?? user.totalDots ?? 0;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>{t("myProfileTitle")}</h1>
                {user.role === 'company' && <span className="profile-role-badge">Bedrift</span>}
            </div>
            <div className="profile-info">
                <p><strong>{t("fullName")}</strong> {user.fullName}</p>
                <p><strong>{t("email")}</strong> {user.email}</p>
                <p><strong>{t("role")}</strong> {roleLabel}</p>
                {user.role === 'student' && (
                    <p><strong>{t("dots")}</strong> {totalDots}</p>
                )}
            </div>
            <button onClick={handleLogout} className="logout-button">{t("logOut")}</button>
        </div>
    );
>>>>>>> Stashed changes
}
