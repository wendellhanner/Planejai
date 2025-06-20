"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  FolderOpen,
  Search,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Plus
} from "lucide-react";
import { useState } from "react";

export default function MeusProjetosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const projetos = [
    {
      id: "1",
      nome: "Cozinha Moderna - Apartamento Santos",
      cliente: "João Silva",
      status: "em_producao",
      valor: "R$ 45.000,00",
      prazoEntrega: "20/06/2025",
      progresso: 65,
      responsavel: "Carlos Montador",
      categoria: "Cozinha",
      descricao: "Projeto completo de cozinha com ilha central"
    },
    {
      id: "2",
      nome: "Closet Casal - Casa Morumbi",
      cliente: "Maria Santos",
      status: "medicao",
      valor: "R$ 28.500,00",
      prazoEntrega: "30/06/2025",
      progresso: 15,
      responsavel: "Ana Designer",
      categoria: "Closet",
      descricao: "Closet planejado com iluminação LED"
    },
    {
      id: "3",
      nome: "Home Office - Vila Madalena",
      cliente: "Pedro Costa",
      status: "finalizado",
      valor: "R$ 18.900,00",
      prazoEntrega: "15/04/2025",
      progresso: 100,
      responsavel: "Roberto Designer",
      categoria: "Home Office",
      descricao: "Escritório completo com estante"
    }
  ];

  const estatisticas = [
    { label: "Projetos Ativos", valor: "4", icone: FolderOpen, cor: "text-blue-600" },
    { label: "Valor Total", valor: "R$ 150.400", icone: DollarSign, cor: "text-green-600" },
    { label: "Concluídos", valor: "1", icone: CheckCircle, cor: "text-purple-600" },
    { label: "Em Atraso", valor: "0", icone: AlertCircle, cor: "text-red-600" }
  ];

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      medicao: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
      em_producao: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300",
      finalizado: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
    };
    return colors[status] || colors.medicao;
  };

  const getStatusText = (status: string) => {
    const texts: { [key: string]: string } = {
      medicao: "Medição",
      em_producao: "Em Produção",
      finalizado: "Finalizado"
    };
    return texts[status] || status;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Meus Projetos</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Acompanhe todos os seus projetos em andamento
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {estatisticas.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-800 ${stat.cor}`}>
                  <stat.icone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stat.valor}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
        <Input
          placeholder="Buscar projetos..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projetos.map((projeto) => (
          <Card key={projeto.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg leading-tight">
                    {projeto.nome}
                  </CardTitle>
                  <CardDescription>
                    Cliente: {projeto.cliente}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(projeto.status)}>
                  <Clock className="h-3 w-3 mr-1" />
                  {getStatusText(projeto.status)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {projeto.categoria}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {projeto.descricao}
              </p>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Progresso</span>
                  <span className="font-medium">{projeto.progresso}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${projeto.progresso}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-600 dark:text-slate-400">Valor</p>
                  <p className="font-semibold text-green-600 dark:text-green-400">
                    {projeto.valor}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400">Entrega</p>
                  <p className="font-medium">{projeto.prazoEntrega}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs bg-blue-100 text-blue-800">
                    {projeto.responsavel.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {projeto.responsavel}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
