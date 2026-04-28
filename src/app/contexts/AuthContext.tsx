import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, getAuthToken } from '../utils/api';

interface User {
  id: string;
  email: string;
  role?: 'user' | 'admin';
  user_metadata?: {
    fullName?: string;
    phone?: string;
    role?: 'user' | 'admin';
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, phone: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin credentials
const ADMIN_EMAIL = 'admin@agrotech.com';
const ADMIN_PASSWORD = 'admin123';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const isAdmin = user?.role === 'admin' || user?.user_metadata?.role === 'admin' || user?.email === ADMIN_EMAIL;

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const token = getAuthToken();
      if (token) {
        const data = await auth.getSession();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Session check failed:', error);
      auth.signOut();
    } finally {
      setLoading(false);
    }
  }

  const signIn = async (email: string, password: string) => {
    // Check if admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser: User = {
        id: 'admin-001',
        email: ADMIN_EMAIL,
        role: 'admin',
        user_metadata: {
          fullName: 'Administrator',
          role: 'admin'
        }
      };
      setUser(adminUser);
      localStorage.setItem('admin_token', 'admin-authenticated');
      return;
    }
    
    // Regular user login
    const data = await auth.signIn(email, password);
    setUser({
      ...data.user,
      role: data.user.user_metadata?.role || 'user'
    });
  };

  const signUp = async (email: string, password: string, fullName: string, phone: string) => {
    const data = await auth.signUp(email, password, fullName, phone);
    // Auto sign in after signup
    await signIn(email, password);
  };

  const signOut = () => {
    auth.signOut();
    localStorage.removeItem('admin_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}