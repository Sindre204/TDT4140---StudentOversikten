import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LogIn.css';

export function LogIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await login({ email, password });
            navigate('/MyProfile');
        } catch (err) {
            setError(err.message || 'Invalid email or password');
        }
    };

    return (
        <div className="login-container">
            <h1>Logg Inn</h1>
            <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email" /* Endret fra text til email for bedre mobil-tastatur */
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Passord</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                
                {error && <p className="error-message">{error}</p>}
                
                <button type="submit">Logg Inn</button>

                <div className="create-user-link">
                    <Link to="/CreateUser">
                        Har du ikke konto? Lag ny bruker
                    </Link>
                </div>
            </form>
        </div>
    )

}
