import { createContext, useState, useContext, useEffect } from 'react';
import staticUsers from '../users.json';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
        setAllUsers([...staticUsers, ...storedUsers]);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const register = (newUser) => {
        const userWithRole = { ...newUser, role: 'student' };

        // Update local storage for persistence
        const storedUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
        const updatedStoredUsers = [...storedUsers, userWithRole];
        localStorage.setItem('registered_users', JSON.stringify(updatedStoredUsers));

        // Update state
        setAllUsers([...staticUsers, ...updatedStoredUsers]);

        return true;
    };

    return (
        <AuthContext.Provider value={{ user, allUsers, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
};
