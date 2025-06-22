"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { Loader2 } from "lucide-react";
import { NotificationProvider } from "@/components/providers/notification-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Usar o sistema de autenticação do Supabase
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  // Estado para controlar o tamanho da tela
  const [isMobile, setIsMobile] = useState(false);

  // Verificar autenticação
  useEffect(() => {
    if (!isLoading && !user) {
      console.log('Usuário não autenticado, redirecionando para login');
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Detectar tamanho da tela para responsividade
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Verificar inicialmente
    checkIfMobile();
    
    // Adicionar listener para redimensionamento
    window.addEventListener('resize', checkIfMobile);
    
    // Limpar listener
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Exibe um loader enquanto verifica a autenticação
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
          <p className="mt-4 text-slate-600 dark:text-slate-300 font-medium">Carregando...</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Verificando informações do usuário</p>
        </div>
      </div>
    );
  }
  
  // Se não estiver autenticado, não renderiza nada enquanto redireciona
  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
          <p className="mt-4 text-slate-600 dark:text-slate-300 font-medium">Redirecionando...</p>
        </div>
      </div>
    );
  }

  // Layout responsivo
  return (
    <NotificationProvider>
      <div className="flex h-screen bg-white dark:bg-slate-900">
        {/* Sidebar */}
        <Sidebar />

        {/* Conteúdo principal com margem responsiva */}
        <div className={`flex-1 flex flex-col ${!isMobile ? 'lg:ml-64' : 'ml-0'} transition-all duration-300`}>
          <div className={`${isMobile ? 'pl-16' : ''}`}>
            <Header />
          </div>
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-white dark:bg-slate-900">
            {children}
          </main>
        </div>
      </div>
    </NotificationProvider>
  );
}


