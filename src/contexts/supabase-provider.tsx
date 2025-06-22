'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useSupabase, UserProfile } from '@/hooks/use-supabase';
import { User, Session } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase';

// Tipo para o contexto
interface SupabaseContextType {
  user: any;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<any>;
  signUpWithEmail: (email: string, password: string, userData: any) => Promise<any>;
  signOut: () => Promise<void>;
  fetchData: <T>(table: string, options?: any) => Promise<{ data: T[] | null; error: any }>;
  insertData: <T>(table: string, data: any) => Promise<{ data: T | null; error: any }>;
  updateData: <T>(table: string, id: string, data: any) => Promise<{ data: T | null; error: any }>;
  deleteData: (table: string, id: string) => Promise<{ error: any }>;
  isLoading: boolean;
}

// Criar o contexto
const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

// Provider component
export function SupabaseProvider({ children }: { children: ReactNode }) {
  const supabase = useSupabase();
  
  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
}

// Hook para usar o contexto
export function useSupabaseContext() {
  const context = useContext(SupabaseContext);
  
  if (context === undefined) {
    throw new Error('useSupabaseContext deve ser usado dentro de um SupabaseProvider');
  }
  
  return context;
}
