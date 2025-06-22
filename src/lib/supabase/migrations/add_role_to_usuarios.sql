-- Adiciona campo role à tabela usuarios
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS role VARCHAR(50) NOT NULL DEFAULT 'cliente';

-- Cria um tipo enum para os roles (opcional, você pode usar apenas strings)
-- CREATE TYPE user_role AS ENUM ('admin', 'vendedor', 'producao', 'cliente');
-- ALTER TABLE usuarios ALTER COLUMN role TYPE user_role USING role::user_role;

-- Adiciona comentário para documentação
COMMENT ON COLUMN usuarios.role IS 'Papel do usuário no sistema: admin, vendedor, producao, cliente, etc.';

-- Atualiza usuários existentes (opcional)
UPDATE usuarios SET role = 'admin' WHERE email = 'admin@admin.com';
UPDATE usuarios SET role = 'admin' WHERE email = 'admin@moveisplanejados.com';
