import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ihpyvfhvmdnghpyuosqf.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlocHl2Zmh2bWRuZ2hweXVvc3FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NTYyNDIsImV4cCI6MjA2NjAzMjI0Mn0.hBD0Aw1C42wQj3vP9vkpHvotVh_JoNhMwTuXxzti_Qk';

// Cria o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para as tabelas do Supabase
export type Database = {
  public: {
    Tables: {
      projetos: {
        Row: {
          id: string;
          created_at: string;
          nome: string;
          descricao: string | null;
          status: string;
          data_inicio: string | null;
          data_fim: string | null;
          cliente_id: string | null;
          valor: number | null;
          user_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          nome: string;
          descricao?: string | null;
          status?: string;
          data_inicio?: string | null;
          data_fim?: string | null;
          cliente_id?: string | null;
          valor?: number | null;
          user_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          nome?: string;
          descricao?: string | null;
          status?: string;
          data_inicio?: string | null;
          data_fim?: string | null;
          cliente_id?: string | null;
          valor?: number | null;
          user_id?: string;
        };
      };
      clientes: {
        Row: {
          id: string;
          created_at: string;
          nome: string;
          email: string | null;
          telefone: string | null;
          endereco: string | null;
          user_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          nome: string;
          email?: string | null;
          telefone?: string | null;
          endereco?: string | null;
          user_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          nome?: string;
          email?: string | null;
          telefone?: string | null;
          endereco?: string | null;
          user_id?: string;
        };
      };
      tarefas: {
        Row: {
          id: string;
          created_at: string;
          titulo: string;
          descricao: string | null;
          status: string;
          prioridade: string;
          data_inicio: string | null;
          data_fim: string | null;
          projeto_id: string | null;
          responsavel_id: string | null;
          user_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          titulo: string;
          descricao?: string | null;
          status?: string;
          prioridade?: string;
          data_inicio?: string | null;
          data_fim?: string | null;
          projeto_id?: string | null;
          responsavel_id?: string | null;
          user_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          titulo?: string;
          descricao?: string | null;
          status?: string;
          prioridade?: string;
          data_inicio?: string | null;
          data_fim?: string | null;
          projeto_id?: string | null;
          responsavel_id?: string | null;
          user_id?: string;
        };
      };
      usuarios: {
        Row: {
          id: string;
          created_at: string;
          nome: string;
          email: string;
          cargo: string | null;
          avatar_url: string | null;
          auth_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          nome: string;
          email: string;
          cargo?: string | null;
          avatar_url?: string | null;
          auth_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          nome?: string;
          email?: string;
          cargo?: string | null;
          avatar_url?: string | null;
          auth_id?: string;
        };
      };
    };
  };
};
