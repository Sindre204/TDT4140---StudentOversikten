import { Link, useLocation } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import './Navbar.css';

export function Navbar() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const switchLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    setOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to='/' className={isActive('/') ? 'nav-link active' : 'nav-link'}>{t("home")}</Link>
        <Link to='/Events' className={isActive('/Events') ? 'nav-link active' : 'nav-link'}>{t("events")}</Link>
        <Link to='/Listings' className={isActive('/Listings') ? 'nav-link active' : 'nav-link'}>{t("listings")}</Link>
        <Link to='/Companies' className={isActive('/Companies') ? 'nav-link active' : 'nav-link'}>Firmaer</Link>
      </div>

      <div className="navbar-actions">
        {user ? (
          <>
            {user.role === 'company' && <span className="role-badge">Bedrift</span>}
            <Link to='/MyProfile' className="btn-primary">{t("myProfile")}</Link>
            
            {(user.role === 'company' || user.role === 'admin') && (
              <div className="admin-section">
                {user.role === 'company' ? (
                  <Link to='/administration' className="btn-admin">Administrasjon</Link>
                ) : (
                  <a href="http://127.0.0.1:8000/admin/" className="btn-admin">Admin</a>
                )}
              </div>
            )}
          </>
        ) : (
          <Link to='/LogIn' className="btn-primary">{t("logIn")}</Link>
        )}

        <div className="language-switcher">
          <button className="language-btn" onClick={() => setOpen(!open)}>
            🌍
          </button>

          {open && (
            <div className="language-dropdown">
              <button
                className={i18n.language === "no" ? "lang-opt active" : "lang-opt"}
                onClick={() => switchLanguage("no")}>
                🇳🇴 Norsk
              </button>
              <button
                className={i18n.language === "pt" ? "lang-opt active" : "lang-opt"}
                onClick={() => switchLanguage("pt")}>
                🇵🇹 Português
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}