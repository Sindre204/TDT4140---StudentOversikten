import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import './CreateUser.css';

export function CreateUser() {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('student');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError(t("passwordsNoMatch"));
            return;
        }

        if (password.length < 6) {
            setError(t("passwordTooShort"));
            return;
        }

        try {
            await register({ email, fullName, password, role });
            navigate('/LogIn');
        } catch (err) {
            setError(err.message || t("failedToCreate"));
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className="auth-container">
                <h1 className="auth-title">{t("createUser")}</h1>
                <p className="auth-subtitle">Opprett en konto for å komme i gang</p>
                
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="fullName">{t("fullName")}</label>
                        <input
                            type="text"
                            id="fullName"
                            placeholder="Ditt fulle navn"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>
                    
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
                        <label htmlFor="role">Jeg er en...</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="student">Student</option>
                            <option value="company">Bedrift</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">{t("password")}</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Minimum 6 tegn"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">{t("confirmPassword")}</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Gjenta passordet ditt"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="error-bubble">{error}</p>}
                    
                    <button type="submit" className="auth-submit-btn">
                        {t("createUser")}
                    </button>
                </form>
            </div>
        </div>
    );
}