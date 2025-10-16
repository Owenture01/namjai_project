import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('waterQualityUser');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('waterQualityUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('waterQualityUser');
    }
  }, [user]);

  const login = async (email: string, _password: string) => {
    const mockUser: User = {
      id: '1',
      email,
      fullName: email.includes('admin') ? 'Admin User' : email.includes('field') ? 'Field Officer' : 'Observer User',
      role: email.includes('admin') ? 'admin' : email.includes('field') ? 'field_officer' : 'observer',
      status: 'active',
      createdAt: new Date(),
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  const hasRole = (roles: UserRole[]) => {
    return user ? roles.includes(user.role) : false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
