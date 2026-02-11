import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import users from '../users.json';
import { useAuth } from '../context/AuthContext';
import './LogIn.css';

export function LogIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            login(user);
            navigate('/MyProfile');
        } else {
            setError('Invalid email or password');
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
            </form>
        </div>
    )

}