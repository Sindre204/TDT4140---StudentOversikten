import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-title">StudentOversikten</div>
          <p className="footer-sub">Gruppe 47</p>
        </div>

        <div className="footer-info">
          <a href="mailto:kontakt@studentoversikten.no" className="footer-link">
            kontakt@studentoversikten.no 
          </a>
          <span className="footer-divider">|</span>
          <span className="footer-text">+47 123 45 678</span>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} StudentOversikten
        </div>
      </div>
    </footer>
  );
}