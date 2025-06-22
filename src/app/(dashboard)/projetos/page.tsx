'use client';

import { ProjetoList } from "@/components/projetos/projeto-list";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home, FolderOpen } from "lucide-react";

export default function ProjetosPage() {
  return (
    <div className="p-4 lg:p-6 space-y-6 bg-white dark:bg-slate-950 min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">
              <Home className="h-3.5 w-3.5 mr-1" />
              <span>Início</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              <FolderOpen className="h-3.5 w-3.5 mr-1" />
              <span>Projetos</span>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
          Gerenciamento de Projetos
        </h1>
        
        <ProjetoList />
      </div>
    </div>
  );
}
