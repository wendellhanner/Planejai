import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { sql } = await request.json();
    
    // Verificar se o SQL foi fornecido
    if (!sql) {
      return NextResponse.json(
        { error: 'SQL não fornecido' },
        { status: 400 }
      );
    }
    
    // Inicializar cliente Supabase
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // Verificar se o usuário está autenticado
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
    
    // Verificar se o usuário é admin (segurança adicional)
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('role')
      .eq('auth_id', session.user.id)
      .single();
    
    if (userError || userData?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Permissão negada. Apenas administradores podem executar SQL direto.' },
        { status: 403 }
      );
    }
    
    // Executar SQL
    const { data, error } = await supabase.rpc('execute_sql', { query_sql: sql });
    
    if (error) {
      console.error('Erro ao executar SQL:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Erro no servidor:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
