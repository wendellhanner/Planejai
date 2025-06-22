'use client';

import { ClienteList } from "@/components/clientes/cliente-list";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home, Users } from "lucide-react";

export default function ClientesPage() {
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
              <Users className="h-3.5 w-3.5 mr-1" />
              <span>Clientes</span>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
          Gerenciamento de Clientes
        </h1>
        
        <ClienteList />
      </div>
    </div>
  );
}
