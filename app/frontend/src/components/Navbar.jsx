import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export function Navbar() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(localStorage.getItem("theme") === "dark");
  const location = useLocation();

  useEffect(() => {
    const theme = isDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
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
          <Link to="/" role="button" className={isActive("/") ? "nav-link active" : "nav-link"}>{t("home")}</Link>
          <Link to="/Events" role="button" className={isActive("/Events") ? "nav-link active" : "nav-link"}>{t("events")}</Link>
          <Link to="/Listings" role="button" className={isActive("/Listings") ? "nav-link active" : "nav-link"}>{t("listings")}</Link>
          <Link to="/Companies" role="button" className={isActive("/Companies") ? "nav-link active" : "nav-link"}>{t("companies")}</Link>
        </div>

        <div className="navbar-actions">
          <button
            className="theme-toggle"
            onClick={() => setIsDark(!isDark)}
            title={isDark ? t("lightTheme") : t("darkTheme")}
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          {user ? (
            <>
              <Link to="/MyProfile" role="button" className="btn-primary-nav">{t("myProfile")}</Link>
              {(user.role === "company" || user.role === "admin") && (
                <div className="admin-section">
                  {user.role === "company" ? (
                    <Link to="/administration" role="button" className="btn-admin-nav">{t("administration")}</Link>
                  ) : (
                    <a href="http://127.0.0.1:8000/admin/" role="button" className="btn-admin-nav">{t("adminLabel")}</a>
                  )}
                </div>
              )}
            </>
          ) : (
            <Link to="/LogIn" role="button" className="btn-primary-nav">{t("logIn")}</Link>
          )}

          <div className="language-switcher">
            <button className="language-btn" onClick={() => setOpen(!open)}>
              🌍
            </button>
            {open && (
              <div className="language-dropdown">
                <button
                  className={i18n.language === "no" ? "lang-opt active" : "lang-opt"}
                  onClick={() => switchLanguage("no")}
                >
                  🇳🇴 {t("norsk")}
                </button>
                <button
                  className={i18n.language === "pt" ? "lang-opt active" : "lang-opt"}
                  onClick={() => switchLanguage("pt")}
                >
                  🇵🇹 {t("portuguese")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
