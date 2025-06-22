'use client';

import { UserSyncTool } from '@/components/admin/user-sync-tool';
import { Breadcrumb } from '@/components/navigation/breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/components/providers/auth-provider';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function DiagnosticoPage() {
  const { userRole, isLoading } = useAuth();
  const router = useRouter();

  // Proteger página apenas para admins
  useEffect(() => {
    if (!isLoading && userRole !== 'admin') {
      router.push('/dashboard');
    }
  }, [userRole, isLoading, router]);

  // Mostrar loading enquanto verifica permissões
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Se não for admin, não renderizar o conteúdo (redirecionamento já está acontecendo)
  if (userRole !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Admin', href: '/admin' },
          { label: 'Diagnóstico', href: '/admin/diagnostico' },
        ]}
      />

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ferramentas de Diagnóstico</h1>
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="database">Banco de Dados</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="mt-4">
          <UserSyncTool />
        </TabsContent>
        
        <TabsContent value="database" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Diagnóstico de Banco de Dados</CardTitle>
              <CardDescription>
                Verifique e corrija problemas no banco de dados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Ferramentas de diagnóstico de banco de dados serão implementadas aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Logs do Sistema</CardTitle>
              <CardDescription>
                Visualize logs de autenticação e operações do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Visualização de logs será implementada aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
