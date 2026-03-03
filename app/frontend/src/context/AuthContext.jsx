import { createContext, useState, useContext } from 'react';
import { loginUser, registerUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = async ({ email, password }) => {
        const loggedInUser = await loginUser({ email, password });
        setUser(loggedInUser);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        return loggedInUser;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const register = async ({ email, fullName, password, role }) => {
        return registerUser({ email, fullName, password, role });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
};
