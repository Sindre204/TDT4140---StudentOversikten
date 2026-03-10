import { Link, useLocation } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import './Navbar.css';

export function Navbar() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');
  const location = useLocation();

  useEffect(() => {
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [isDark]);

  const switchLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    setOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-links">
          <Link to='/' className={isActive('/') ? 'nav-link active' : 'nav-link'}>{t("home")}</Link>
          <Link to='/Events' className={isActive('/Events') ? 'nav-link active' : 'nav-link'}>{t("events")}</Link>
          <Link to='/Listings' className={isActive('/Listings') ? 'nav-link active' : 'nav-link'}>{t("listings")}</Link>
          <Link to='/Companies' className={isActive('/Companies') ? 'nav-link active' : 'nav-link'}>Firmaer</Link>
        </div>

        <div className="navbar-actions">
          <button 
            className="theme-toggle" 
            onClick={() => setIsDark(!isDark)}
            title={isDark ? "Bytt til lyst tema" : "Bytt til mørkt tema"}
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {user ? (
            <>
              <Link to='/MyProfile' className="btn-primary-nav">{t("myProfile")}</Link>
              {(user.role === 'company' || user.role === 'admin') && (
                <div className="admin-section">
                  {user.role === 'company' ? (
                    <Link to='/administration' className="btn-admin-nav">Admin</Link>
                  ) : (
                    <a href="http://127.0.0.1:8000/admin/" className="btn-admin-nav">Django</a>
                  )}
                </div>
              )}
            </>
          ) : (
            <Link to='/LogIn' className="btn-primary-nav">{t("logIn")}</Link>
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
      </div>
    </nav>
  );
}