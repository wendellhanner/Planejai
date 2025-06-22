"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useSupabaseContext } from "@/contexts/supabase-provider";
import { useRouter, usePathname } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { UserProfile, UserRole } from "@/hooks/use-supabase";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  userRole: UserRole | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  register: (email: string, password: string, userData: { nome: string; cargo?: string }) => Promise<{ success: boolean; error?: any }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, userProfile, loading, signInWithEmail, signUpWithEmail, signOut } = useSupabaseContext();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const userRole = userProfile?.role || null;
  
  // Verificar autenticação e redirecionar se necessário
  useEffect(() => {
    if (!loading) {
      setIsLoading(false);
      
      // Redirecionar usuários não autenticados para login
      const isAuthRoute = pathname?.includes('/(auth)');
      
      if (!user && !isAuthRoute && pathname !== '/') {
        console.log('Redirecionando para login: usuário não autenticado');
        router.push('/login');
      }
      
      // Redirecionar usuários autenticados para dashboard
      if (user && isAuthRoute) {
        console.log('Redirecionando para dashboard: usuário autenticado', user);
        router.push('/dashboard');
      }
    }
  }, [user, loading, pathname, router]);
  
  // Funções de autenticação
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await signInWithEmail(email, password);
      
      if (error) {
        return { success: false, error };
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };
  
  const register = async (email: string, password: string, userData: { nome: string; cargo?: string }) => {
    try {
      const { data, error } = await signUpWithEmail(email, password, userData);
      
      if (error) {
        return { success: false, error };
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };
  
  const logout = async () => {
    await signOut();
    router.push('/login');
  };
  
  const value = {
    user,
    userProfile,
    userRole,
    isLoading,
    login,
    register,
    logout
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}
