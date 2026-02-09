import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './MyProfile.css';

export function MyProfile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) {
        return <div className="profile-container">Please log in to view your profile.</div>;
    }

    return (
        <div className="profile-container">
            <h1>My Profile</h1>
            <div className="profile-info">
                <p><strong>Full Name:</strong> {user.fullName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
            </div>
            <button onClick={handleLogout} className="logout-button">Log Out</button>
        </div>
    );
}
