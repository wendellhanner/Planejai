import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { auth_id, email, nome, cargo, role } = await request.json();
    
    // Verificar se os dados necessários foram fornecidos
    if (!auth_id || !email || !nome || !role) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
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
    
    // Inserir ou atualizar o usuário na tabela usuarios
    const { data, error } = await supabase
      .from('usuarios')
      .upsert({
        auth_id,
        email,
        nome,
        cargo,
        role,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'auth_id',
        returning: 'representation'
      });
    
    if (error) {
      console.error('Erro ao sincronizar usuário:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ data: data[0] });
  } catch (error) {
    console.error('Erro no servidor:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
