import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './MyProfile.css';

export function MyProfile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const roleLabel = user?.role === 'company'
        ? 'Bedrift'
        : user?.role === 'admin'
            ? 'Admin'
            : 'Student';

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) {
        return <div className="profile-container">Please log in to view your profile.</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>My Profile</h1>
                {user.role === 'company' && <span className="profile-role-badge">Bedrift</span>}
            </div>
            <div className="profile-info">
                <p><strong>Full Name:</strong> {user.fullName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {roleLabel}</p>
            </div>
            <button onClick={handleLogout} className="logout-button">Log Out</button>
        </div>
    );
}
