import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from "../services/api";
import type { LoginResponse } from "../services/api";



interface AuthContextType {
  user: LoginResponse | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

 const login = async (email: string, password: string) => {
  try {
    const response = await apiService.login(email, password);

    // response = ApiResponse<LoginResponse>
    const actualUser = response.data; // <-- LoginResponse is inside .data

    if (!actualUser || !actualUser.token) {
      console.error("Backend response:", response);
      throw new Error("Login response missing token");
    }

    localStorage.setItem("token", actualUser.token);
    localStorage.setItem("user", JSON.stringify(actualUser));
    setUser(actualUser);

  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};


  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isStaff: user?.role === 'STAFF',
    isStudent: user?.role === 'STUDENT',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};