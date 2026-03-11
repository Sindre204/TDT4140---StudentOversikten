import "./Footer.css";
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-title">StudentOversikten</div>
          <p className="footer-sub">{t("group")}</p> 
        </div>

        <div className="footer-info">
          <a href="mailto:kontakt@studentoversikten.no" className="footer-link">
            kontakt@studentoversikten.no 
          </a>
          <span className="footer-divider">|</span>
          <span className="footer-text">+47 123 45 678 </span>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} StudentOversikten
        </div>
      </div>
    </footer>
  );
}