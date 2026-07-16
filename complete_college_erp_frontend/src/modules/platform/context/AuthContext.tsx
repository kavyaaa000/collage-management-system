import  { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loadUserFromToken = async () => {
    const savedToken = localStorage.getItem('cc_token');
    if (savedToken) {
      setToken(savedToken);
      try {
        const response = await authApi.me();
        setUser({
          userId: response.userId,
          name: response.name,
          role: response.role,
          department: response.department,
        });
      } catch (error) {
        console.error('Failed to load user:', error);
        localStorage.removeItem('cc_token');
        setToken(null);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadUserFromToken();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response: AuthResponse = await authApi.login(credentials);
      localStorage.setItem('cc_token', response.token);
      setToken(response.token);
      setUser({
        userId: response.userId,
        name: response.name,
        role: response.role,
        department: response.department,
      });
      navigate('/platform/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      await authApi.register(data);
      navigate('/platform/login');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('cc_token');
    setToken(null);
    setUser(null);
    navigate('/platform/login');
  };

  const refreshMe = async () => {
    try {
      const response = await authApi.me();
      setUser({
        userId: response.userId,
        name: response.name,
        role: response.role,
        department: response.department,
      });
    } catch (error) {
      console.error('Failed to refresh user:', error);
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        refreshMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};