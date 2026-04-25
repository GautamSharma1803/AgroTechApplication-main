import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, getAuthToken } from '../utils/api';

interface User {
  id: string;
  email: string;
  user_metadata?: {
    fullName?: string;
    phone?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, phone: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
    const data = await auth.signIn(email, password);
    setUser(data.user);
  };

  const signUp = async (email: string, password: string, fullName: string, phone: string) => {
    const data = await auth.signUp(email, password, fullName, phone);
    // Auto sign in after signup
    await signIn(email, password);
  };

  const signOut = () => {
    auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
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
