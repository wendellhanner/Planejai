import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase';

// Definir tipos para roles de usuário
export type UserRole = 'admin' | 'vendedor' | 'producao' | 'cliente';

// Tipo estendido para incluir informações de perfil do usuário
export interface UserProfile {
  id: string;
  auth_id: string;
  nome: string;
  email: string;
  cargo?: string;
  role: UserRole;
  created_at: string;
}

// Hook personalizado para gerenciar autenticação e operações do Supabase
export function useSupabase() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para carregar o perfil do usuário
  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_id', userId)
        .single();

      if (error) {
        console.error('Erro ao carregar perfil do usuário:', error);
        return null;
      }

      console.log('Perfil do usuário carregado:', data);
      setUserProfile(data as UserProfile);
      return data as UserProfile;
    } catch (error) {
      console.error('Exceção ao carregar perfil:', error);
      return null;
    }
  };

  // Carregar sessão e usuário ao inicializar
  useEffect(() => {
    // Obter sessão atual
    const getSession = async () => {
      setLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Erro ao obter sessão:', error);
        setLoading(false);
        return;
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      
      // Se tiver usuário autenticado, carregar o perfil
      if (session?.user) {
        await loadUserProfile(session.user.id);
      }
      
      setLoading(false);
    };

    getSession();

    // Configurar listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Se tiver usuário autenticado, carregar o perfil
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Limpar subscription ao desmontar
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Função para login com email e senha // Autenticação
  const signInWithEmail = async (email: string, password: string) => {
    try {
      console.log('Tentando login com:', { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Erro de autenticação Supabase:', error.message);
        return { data, error };
      }
      
      console.log('Login bem-sucedido:', data);
      return { data, error };
    } catch (error) {
      console.error('Exceção ao fazer login:', error);
      return { data: null, error };
    }
  };

  // Função para cadastro com email e senha
  const signUpWithEmail = async (email: string, password: string, userData: { nome: string, cargo?: string }) => {
    try {
      // Registrar usuário na autenticação
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      // Se o registro de autenticação foi bem-sucedido, criar o perfil do usuário
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('usuarios')
          .insert({
            nome: userData.nome,
            email: email,
            cargo: userData.cargo || null,
            auth_id: authData.user.id
          });

        if (profileError) {
          // Se houver erro ao criar o perfil, tentar excluir o usuário de autenticação
          await supabase.auth.admin.deleteUser(authData.user.id);
          throw profileError;
        }
      }

      return { data: authData, error: null };
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      return { data: null, error };
    }
  };

  // Função para logout
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      return { error: null };
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      return { error };
    }
  };

  // Função genérica para buscar dados
  const fetchData = async <T extends keyof Database['public']['Tables']>(
    table: T,
    options?: {
      columns?: string;
      filters?: Record<string, any>;
      orderBy?: { column: string; ascending?: boolean };
      limit?: number;
      single?: boolean;
    }
  ) => {
    try {
      let query = supabase
        .from(table)
        .select(options?.columns || '*');

      // Aplicar filtros
      if (options?.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      // Aplicar ordenação
      if (options?.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending ?? false
        });
      }

      // Aplicar limite
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      // Buscar um único registro ou vários
      const { data, error } = options?.single
        ? await query.single()
        : await query;

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error(`Erro ao buscar dados da tabela ${table}:`, error);
      return { data: null, error };
    }
  };

  // Função genérica para inserir dados
  const insertData = async <T extends keyof Database['public']['Tables']>(
    table: T,
    data: Database['public']['Tables'][T]['Insert']
  ) => {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select();

      if (error) {
        throw error;
      }

      return { data: result, error: null };
    } catch (error) {
      console.error(`Erro ao inserir dados na tabela ${table}:`, error);
      return { data: null, error };
    }
  };

  // Função genérica para atualizar dados
  const updateData = async <T extends keyof Database['public']['Tables']>(
    table: T,
    id: string,
    data: Database['public']['Tables'][T]['Update']
  ) => {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select();

      if (error) {
        throw error;
      }

      return { data: result, error: null };
    } catch (error) {
      console.error(`Erro ao atualizar dados na tabela ${table}:`, error);
      return { data: null, error };
    }
  };

  // Função genérica para excluir dados
  const deleteData = async <T extends keyof Database['public']['Tables']>(
    table: T,
    id: string
  ) => {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return { error: null };
    } catch (error) {
      console.error(`Erro ao excluir dados da tabela ${table}:`, error);
      return { error };
    }
  };

  return {
    user,
    session,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    fetchData,
    insertData,
    updateData,
    deleteData,
    supabase // Exporta a instância do supabase para casos de uso avançados
  };
}
