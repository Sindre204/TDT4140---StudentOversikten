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
            <h1>Log In</h1>
            <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit">Log In</button>
                <div className="create-user-link">
                    <Link to="/CreateUser" style={{ color: 'blue', 
                                                    textDecoration: 'none', 
                                                    marginTop: '10px', 
                                                    display: 'inline-block',
                                                    borderRadius: '8px',
                                                    border: '1px solid #ccc',
                                                    padding: '8px 16px',}}
                                                    >
                        Create new user  
                    </Link>
                </div>
            </form>
        </div>
    )

}
