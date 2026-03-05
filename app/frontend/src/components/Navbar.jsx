import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import './Navbar.css';


export function Navbar() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const switchLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    setOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to='/'><button> {t("home")} </button></Link>
        <Link to='/Events'><button> {t("events")} </button></Link>
        <Link to='/Listings'><button> {t("listings")} </button></Link>
        <Link to='/Companies'><button> Firmaer </button></Link>
      </div>



      <div className="navbar-login">
        {user ? (
          <>
            {user.role === 'company' && <span className="role-badge">Bedrift</span>}
            <Link to='/MyProfile'><button> {t("myProfile")} </button></Link>
          </>
        ) : (
          <Link to='/LogIn'><button> {t("logIn")} </button></Link>
        )}

        {user && user.role === 'company' && (
          <Link to='/administration'>
            <button id="admin"> Administrasjon </button>
          </Link>
        )}


        {user && user.role === 'admin' && (
          <a href="http://127.0.0.1:8000/admin/">
            <button id="admin"> Admin </button>
          </a>
        )}

        <div className="language-switcher">
          <button className="language-btn" onClick={() => setOpen(!open)}>
            🌍
          </button>

          {open && (
            <ul className="language-dropdown">
              <li>
                <button
                  className={i18n.language === "no" ? "active" : ""}
                  onClick={() => switchLanguage("no")}>
                  🇳🇴 Norsk
                </button>
              </li>
              <li>
                <button
                  className={i18n.language === "pt" ? "active" : ""}
                  onClick={() => switchLanguage("pt")}>
                  🇵🇹 Português
                </button>
              </li>
            </ul>
          )}
        </div>

      </div>
    </nav>
  )

} 
