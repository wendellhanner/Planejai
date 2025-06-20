"use client";

import { useSession } from "next-auth/react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { Loader2 } from "lucide-react";
import { NotificationProvider } from "@/components/providers/notification-provider";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Obtém a sessão para verificar autenticação
  const { status } = useSession();

  // Exibe um loader enquanto verifica a sessão
  if (status === "loading") {
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

  // Layout simplificado com sidebar fixa
  return (
    <NotificationProvider>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
        {/* Sidebar fixa */}
        <Sidebar />

        {/* Conteúdo principal com margem para a sidebar */}
        <div className="flex-1 flex flex-col ml-64">
          <Header />
          <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900">
            {children}
          </main>
        </div>
      </div>
    </NotificationProvider>
  );
}
