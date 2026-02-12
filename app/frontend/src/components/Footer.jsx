import "./Footer.css";

export default function Footer() {
  return (
    <footer>

      <div className="footer-title">StudentOversikten</div>
      <div className="footer-sub">Gruppe 47</div>

      <div className="footer-contact">
        📞 +47 123 45 678 <br />
        📧 kontakt@studentoversikten.no
      </div>

      <div className="footer-icons">
        {/* Her kan du legge ikonene dine */}
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} StudentOversikten
      </div>

    </footer>
  );
}