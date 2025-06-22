-- Função para executar SQL com segurança (apenas para diagnóstico)
-- Esta função só deve ser chamada por usuários autenticados com role 'admin'
CREATE OR REPLACE FUNCTION execute_sql(query_sql TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Executa com os privilégios do criador da função
AS $$
DECLARE
  result JSONB;
  user_role TEXT;
BEGIN
  -- Verificar se o usuário atual é admin
  SELECT role INTO user_role FROM usuarios 
  WHERE auth_id = auth.uid();
  
  IF user_role != 'admin' THEN
    RAISE EXCEPTION 'Permissão negada. Apenas administradores podem executar SQL direto.';
  END IF;

  -- Executar a consulta e capturar o resultado como JSON
  EXECUTE 'SELECT to_jsonb(array_agg(row_to_json(t))) FROM (' || query_sql || ') t' INTO result;
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('error', SQLERRM);
END;
$$;
