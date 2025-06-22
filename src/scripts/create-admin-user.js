// Este script deve ser executado no console do navegador na página do Supabase
// Abra o console (F12) e cole este código

// Substitua com suas credenciais
const email = 'admin@moveisplanejados.com';
const password = 'senha123'; // Use uma senha forte em produção!
const nome = 'Administrador';
const cargo = 'Gerente';

// Criar usuário na autenticação
const createUser = async () => {
  try {
    // Criar usuário na autenticação
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error('Erro ao criar usuário na autenticação:', authError);
      return;
    }

    console.log('Usuário criado com sucesso na autenticação:', authData);

    // Criar perfil do usuário
    if (authData.user) {
      const { data: profileData, error: profileError } = await supabase
        .from('usuarios')
        .insert({
          nome,
          email,
          cargo,
          auth_id: authData.user.id,
          role: 'admin' // Adicionando o role como admin
        });

      if (profileError) {
        console.error('Erro ao criar perfil do usuário:', profileError);
        return;
      }

      console.log('Perfil do usuário criado com sucesso:', profileData);
    }
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
  }
};

// Execute a função
createUser();
