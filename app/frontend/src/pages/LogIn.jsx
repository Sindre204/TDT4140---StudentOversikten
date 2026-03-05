import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import './LogIn.css';

export function LogIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();


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
        <div className="login-container">
            <h1>{t("logIn")}</h1>
            <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                    <label htmlFor="email">{t("email")}</label>
                    <input
                        type="email" /* Endret fra text til email for bedre mobil-tastatur */
                        id="email"
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                
                {error && <p className="error-message">{error}</p>}
                
                <button type="submit">{t("logIn")}</button>

                <div className="create-user-link">
                    <Link to="/CreateUser">
                        {t("noAccount")}
                    </Link>
                </div>
            </form>
        </div>
    )

}
