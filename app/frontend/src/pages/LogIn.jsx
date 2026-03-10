import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import './CreateUser.css';
import './LogIn.css';

export function LogIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const loginLabel = t("logIn");
    const submitLabel = loginLabel === "logIn" ? "Log In" : loginLabel;


    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await login({ email, password });
            navigate('/MyProfile');
        } catch (err) {
            setError(err.message || t("invalidLogin"));
        }
    };

    return (
        <div className="auth-page-wrapper login-page-wrapper">
            <div className="auth-container login-container">
                <h1 className="auth-title">{submitLabel}</h1>
                <p className="auth-subtitle">Logg inn for å fortsette i portalen</p>

                <form onSubmit={handleLogin} className="auth-form login-form">
                    <div className="form-group">
                        <label htmlFor="email">{t("email")}</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="navn@eksempel.no"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">{t("password")}</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Skriv inn passordet ditt"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="error-bubble error-message">{error}</p>}

                    <button type="submit" className="auth-submit-btn" aria-label={submitLabel}>
                        {submitLabel}
                    </button>

                    <div className="create-user-link">
                        <span>Ny her?</span>
                        <Link to="/CreateUser">
                            {t("noAccount")}
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )

}
