-- Verificar se o usuário admin@admin.com existe na tabela auth.users
SELECT id, email, confirmed_at
FROM auth.users
WHERE email = 'admin@admin.com';

-- Verificar se o usuário já existe na tabela usuarios
SELECT * 
FROM usuarios
WHERE email = 'admin@admin.com';

-- Inserir o usuário na tabela usuarios se ele existir na autenticação mas não na tabela usuarios
INSERT INTO usuarios (auth_id, nome, email, cargo, role, created_at)
SELECT 
  id as auth_id, 
  'Administrador' as nome, 
  email, 
  'Gerente' as cargo, 
  'admin' as role,
  CURRENT_TIMESTAMP as created_at
FROM auth.users
WHERE email = 'admin@admin.com'
AND NOT EXISTS (
  SELECT 1 FROM usuarios WHERE email = 'admin@admin.com'
);

-- Verificar se o usuário foi inserido corretamente
SELECT * 
FROM usuarios
WHERE email = 'admin@admin.com';
