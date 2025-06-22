'use client';

import { useState } from 'react';
import { useSupabaseContext } from '@/contexts/supabase-provider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

export function UserSyncTool() {
  const { user } = useSupabaseContext();
  const [isLoading, setIsLoading] = useState(false);
  const [authUser, setAuthUser] = useState<any>(null);
  const [dbUser, setDbUser] = useState<any>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'checking' | 'synced' | 'not_found' | 'error'>('idle');

  // Verificar se o usuário existe na autenticação e na tabela usuarios
  const checkUserSync = async () => {
    if (!user) {
      toast.error('Você precisa estar logado para usar esta ferramenta');
      return;
    }

    setIsLoading(true);
    setSyncStatus('checking');

    try {
      // Verificar usuário na autenticação (já temos isso no objeto user)
      setAuthUser(user);

      // Verificar usuário na tabela usuarios
      const { data: dbUserData, error: dbUserError } = await fetch('/api/admin/check-user-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'admin@admin.com' }),
      }).then(res => res.json());

      if (dbUserError) {
        console.error('Erro ao verificar usuário na tabela:', dbUserError);
        setSyncStatus('error');
        toast.error('Erro ao verificar usuário na tabela de usuários');
        return;
      }

      setDbUser(dbUserData);

      if (dbUserData) {
        setSyncStatus('synced');
        toast.success('Usuário está sincronizado corretamente');
      } else {
        setSyncStatus('not_found');
        toast.warning('Usuário não encontrado na tabela de usuários');
      }
    } catch (error) {
      console.error('Erro ao verificar sincronização:', error);
      setSyncStatus('error');
      toast.error('Erro ao verificar sincronização do usuário');
    } finally {
      setIsLoading(false);
    }
  };

  // Sincronizar usuário (criar na tabela usuarios se não existir)
  const syncUser = async () => {
    if (!user) {
      toast.error('Você precisa estar logado para usar esta ferramenta');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await fetch('/api/admin/sync-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth_id: user.id,
          email: 'admin@admin.com',
          nome: 'Administrador',
          cargo: 'Gerente',
          role: 'admin'
        }),
      }).then(res => res.json());

      if (error) {
        console.error('Erro ao sincronizar usuário:', error);
        toast.error('Erro ao sincronizar usuário');
        return;
      }

      setDbUser(data);
      setSyncStatus('synced');
      toast.success('Usuário sincronizado com sucesso');
    } catch (error) {
      console.error('Erro ao sincronizar usuário:', error);
      toast.error('Erro ao sincronizar usuário');
    } finally {
      setIsLoading(false);
    }
  };

  // Executar SQL diretamente (apenas para fins de diagnóstico)
  const runSyncSQL = async () => {
    if (!user) {
      toast.error('Você precisa estar logado para usar esta ferramenta');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await fetch('/api/admin/run-sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql: `
            INSERT INTO usuarios (auth_id, nome, email, cargo, role, created_at)
            VALUES (
              '${user.id}',
              'Administrador',
              'admin@admin.com',
              'Gerente',
              'admin',
              CURRENT_TIMESTAMP
            )
            ON CONFLICT (email) DO NOTHING
            RETURNING *;
          `
        }),
      }).then(res => res.json());

      if (error) {
        console.error('Erro ao executar SQL:', error);
        toast.error('Erro ao executar SQL');
        return;
      }

      setDbUser(data?.[0]);
      setSyncStatus('synced');
      toast.success('SQL executado com sucesso');
    } catch (error) {
      console.error('Erro ao executar SQL:', error);
      toast.error('Erro ao executar SQL');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Ferramenta de Sincronização de Usuário</CardTitle>
        <CardDescription>
          Verifique e corrija problemas de sincronização entre o sistema de autenticação e a tabela de usuários
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {syncStatus === 'idle' && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Verificação de Usuário</AlertTitle>
            <AlertDescription>
              Clique no botão abaixo para verificar se o usuário admin@admin.com está corretamente sincronizado.
            </AlertDescription>
          </Alert>
        )}

        {syncStatus === 'checking' && (
          <div className="flex items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Verificando sincronização...</span>
          </div>
        )}

        {syncStatus === 'synced' && (
          <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle>Usuário Sincronizado</AlertTitle>
            <AlertDescription>
              O usuário admin@admin.com está corretamente sincronizado entre o sistema de autenticação e a tabela de usuários.
            </AlertDescription>
          </Alert>
        )}

        {syncStatus === 'not_found' && (
          <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle>Usuário Não Sincronizado</AlertTitle>
            <AlertDescription>
              O usuário admin@admin.com existe no sistema de autenticação, mas não foi encontrado na tabela de usuários.
              Clique em "Sincronizar Usuário" para corrigir este problema.
            </AlertDescription>
          </Alert>
        )}

        {syncStatus === 'error' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              Ocorreu um erro ao verificar a sincronização do usuário. Verifique o console para mais detalhes.
            </AlertDescription>
          </Alert>
        )}

        {authUser && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Dados do Sistema de Autenticação:</h3>
            <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md text-xs overflow-auto">
              {JSON.stringify(authUser, null, 2)}
            </pre>
          </div>
        )}

        {dbUser && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Dados da Tabela de Usuários:</h3>
            <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md text-xs overflow-auto">
              {JSON.stringify(dbUser, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button 
          onClick={checkUserSync} 
          disabled={isLoading}
          variant="outline"
          className="w-full sm:w-auto"
        >
          {isLoading && syncStatus === 'checking' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verificando...
            </>
          ) : (
            'Verificar Sincronização'
          )}
        </Button>
        
        {syncStatus === 'not_found' && (
          <Button 
            onClick={syncUser} 
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sincronizando...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Sincronizar Usuário
              </>
            )}
          </Button>
        )}
        
        <Button 
          onClick={runSyncSQL} 
          disabled={isLoading}
          variant="secondary"
          className="w-full sm:w-auto"
        >
          Executar SQL Direto
        </Button>
      </CardFooter>
    </Card>
  );
}
