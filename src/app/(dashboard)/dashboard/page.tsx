"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  BarChart3,
  FileText,
  Clock,
  Calendar,
  AlertTriangle,
  Target,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Activity,
  Zap,
  LineChart,
  PieChart
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { UserProfile } from "@/components/user/user-profile";
import { kpis, clientes, atividades, vendedores, formatCurrency, formatNumber, formatPercentage, getTotalFaturamento, getTotalLeads, getLeadsConvertidos, getTaxaConversao, getTicketMedio } from "@/lib/data";

// Dados de vendas fechadas com métricas detalhadas
const vendasFechadasData = [
  {
    id: 1,
    cliente: "João Silva",
    projeto: "Cozinha Planejada - Centro",
    valor: 45000,
    status: "Entregue",
    dataFechamento: "15/05/2025",
    vendedor: "Carlos Silva",
    tempo_fechamento: 12,
    categoria: "Cozinha"
  },
  {
    id: 2,
    cliente: "Maria Santos",
    projeto: "Casa Completa - Zona Sul",
    valor: 78000,
    status: "Em produção",
    dataFechamento: "18/05/2025",
    vendedor: "Ana Costa",
    tempo_fechamento: 8,
    categoria: "Casa Completa"
  },
  {
    id: 3,
    cliente: "Pedro Costa",
    projeto: "Home Office Executivo",
    valor: 25000,
    status: "Instalando",
    dataFechamento: "20/05/2025",
    vendedor: "Roberto Garcia",
    tempo_fechamento: 15,
    categoria: "Escritório"
  },
  {
    id: 4,
    cliente: "Ana Carolina",
    projeto: "Closet Casal - Suíte Master",
    valor: 35000,
    status: "Concluído",
    dataFechamento: "22/05/2025",
    vendedor: "Marina Silva",
    tempo_fechamento: 10,
    categoria: "Quarto"
  },
  {
    id: 5,
    cliente: "Eduardo Costa",
    projeto: "Escritório Comercial",
    valor: 125000,
    status: "Entregue",
    dataFechamento: "24/05/2025",
    vendedor: "Carlos Silva",
    tempo_fechamento: 20,
    categoria: "Comercial"
  }
];

// Dados do funil de conversão
const funnelData = [
  { etapa: "Leads", quantidade: 129, porcentagem: 100, cor: "bg-blue-500" },
  { etapa: "Contatos", quantidade: 112, porcentagem: 87, cor: "bg-purple-500" },
  { etapa: "Propostas", quantidade: 67, porcentagem: 52, cor: "bg-pink-500" },
  { etapa: "Vendas", quantidade: 32, porcentagem: 24.8, cor: "bg-green-500" }
];

// Dados de cronograma de tarefas com status de progresso
const tarefas = [
  {
    id: 1,
    titulo: "Finalizar projeto da cozinha",
    status: "em_andamento",
    prazo: "31/05",
    responsavel: "João Silva",
    avatar: "AL",
    progresso: 60,
    prioridade: true
  },
  {
    id: 2,
    titulo: "Orçamento para closet",
    status: "pendente",
    prazo: "24/05",
    responsavel: "Maria Oliveira",
    avatar: "CS",
    progresso: 25,
    prioridade: true
  },
  {
    id: 3,
    titulo: "Agendar medição",
    status: "pendente",
    prazo: "23/05",
    responsavel: "Pedro Santos",
    avatar: "RM",
    progresso: 0,
    prioridade: false
  },
  {
    id: 4,
    titulo: "Orçamento para escritório",
    status: "em_andamento",
    prazo: "24/05",
    responsavel: "Maria Oliveira",
    avatar: "CS",
    progresso: 40,
    prioridade: false
  }
];

// Métricas de performance de vendas
const performanceMetrics = {
  vendas_mensal: {
    atual: getTotalFaturamento(),
    anterior: 2850000,
    meta: 3500000
  },
  ticket_medio: {
    atual: getTicketMedio(),
    anterior: 52000,
    crescimento: 8.2
  },
  tempo_medio_fechamento: {
    atual: 13,
    anterior: 16,
    melhoria: -18.8
  },
  vendas_por_categoria: [
    { categoria: "Cozinha", valor: 1250000, porcentagem: 38.5 },
    { categoria: "Casa Completa", valor: 980000, porcentagem: 30.2 },
    { categoria: "Escritório", valor: 650000, porcentagem: 20.0 },
    { categoria: "Quarto", valor: 368500, porcentagem: 11.3 }
  ],
  custo_por_lead: {
    atual: 58.30,
    anterior: 62.15,
    melhoria: 6.2
  },
  cac: {
    atual: 235.15,
    anterior: 248.90,
    melhoria: 5.5
  }
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("Mês");
  const [activeTab, setActiveTab] = useState("vendas");

  const totalFaturamento = getTotalFaturamento();
  const totalLeads = getTotalLeads();
  const leadsConvertidos = getLeadsConvertidos();
  const taxaConversao = getTaxaConversao();
  const projetosAtivos = 24;

  const formatDate = () => {
    return new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "em_andamento":
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />;
      case "pendente":
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />;
      case "atrasada":
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 bg-white dark:bg-slate-950 min-h-screen text-slate-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
          Olá, {user?.user_metadata?.nome || "Usuário"}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 capitalize text-sm lg:text-base">{formatDate()}</p>
      </div>
      
      {/* Perfil do Usuário */}
      <div className="mb-6">
        <UserProfile />
      </div>

      {/* KPIs Grid - Responsivo com ícones ajustados e margens corrigidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Vendas do Mês - Azul escuro com ícone corrigido */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0 pr-3">
                <p className="text-xs lg:text-sm font-medium text-slate-600 dark:text-slate-400">Vendas do Mês</p>
                <p className="text-lg lg:text-2xl font-bold text-slate-900 dark:text-white truncate">{formatCurrency(totalFaturamento)}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-600 dark:text-green-400">12% desde o mês passado</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Novos Leads */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0 pr-3">
                <p className="text-xs lg:text-sm font-medium text-slate-600 dark:text-slate-400">Novos Leads</p>
                <p className="text-lg lg:text-2xl font-bold text-slate-900 dark:text-white">{totalLeads}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-600 dark:text-green-400">12% desde o mês passado</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Taxa de Conversão */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0 pr-3">
                <p className="text-xs lg:text-sm font-medium text-slate-600 dark:text-slate-400">Taxa de Conversão</p>
                <p className="text-lg lg:text-2xl font-bold text-slate-900 dark:text-white">{taxaConversao}%</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-600 dark:text-green-400">5% desde o mês passado</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projetos Ativos */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0 pr-3">
                <p className="text-xs lg:text-sm font-medium text-slate-600 dark:text-slate-400">Projetos Ativos</p>
                <p className="text-lg lg:text-2xl font-bold text-slate-900 dark:text-white">{projetosAtivos}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-600 dark:text-green-400">8% desde o mês passado</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid - Responsivo */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Análise de Performance */}
        <Card className="xl:col-span-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Análise de Performance</CardTitle>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full lg:w-auto">
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                  <Button
                    variant={selectedPeriod === "Semana" ? "default" : "ghost"}
                    size="sm"
                    className="text-xs h-7 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    onClick={() => setSelectedPeriod("Semana")}
                  >
                    Semana
                  </Button>
                  <Button
                    variant={selectedPeriod === "Mês" ? "default" : "ghost"}
                    size="sm"
                    className="text-xs h-7 bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => setSelectedPeriod("Mês")}
                  >
                    Mês
                  </Button>
                  <Button
                    variant={selectedPeriod === "Trimestre" ? "default" : "ghost"}
                    size="sm"
                    className="text-xs h-7 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    onClick={() => setSelectedPeriod("Trimestre")}
                  >
                    Trimestre
                  </Button>
                  <Button
                    variant={selectedPeriod === "Ano" ? "default" : "ghost"}
                    size="sm"
                    className="text-xs h-7 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    onClick={() => setSelectedPeriod("Ano")}
                  >
                    Ano
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                  Mai 2025
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-slate-100 dark:bg-slate-800 w-full lg:w-auto">
                <TabsTrigger
                  value="vendas"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-700 dark:text-slate-300"
                >
                  📊 Vendas
                </TabsTrigger>
                <TabsTrigger
                  value="conversao"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-700 dark:text-slate-300"
                >
                  📈 Conversão
                </TabsTrigger>
              </TabsList>

              <TabsContent value="vendas" className="space-y-4 mt-6">
                {/* Métricas de Vendas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Vendas Realizadas</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{vendasFechadasData.length}</p>
                    <div className="flex items-center gap-1">
                      <ArrowUp className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-green-600 dark:text-green-400">15% vs. mês anterior</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Ticket Médio</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(performanceMetrics.ticket_medio.atual)}</p>
                    <div className="flex items-center gap-1">
                      <ArrowUp className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-green-600 dark:text-green-400">{performanceMetrics.ticket_medio.crescimento}%</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Tempo Médio</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{performanceMetrics.tempo_medio_fechamento.atual} dias</p>
                    <div className="flex items-center gap-1">
                      <ArrowDown className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-green-600 dark:text-green-400">{Math.abs(performanceMetrics.tempo_medio_fechamento.melhoria)}% melhora</span>
                    </div>
                  </div>
                </div>

                {/* Vendas por Categoria */}
                <div>
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">Vendas por Categoria</h4>
                  <div className="space-y-3">
                    {performanceMetrics.vendas_por_categoria.map((categoria, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">{categoria.categoria} ({categoria.porcentagem}%)</span>
                          <span className="text-slate-900 dark:text-white font-medium">{formatCurrency(categoria.valor)}</span>
                        </div>
                        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 transition-all duration-500"
                            style={{ width: `${categoria.porcentagem}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="conversao" className="space-y-4 mt-6">
                {/* Métricas principais */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Taxa de Conversão</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">24.8%</p>
                    <div className="flex items-center gap-1">
                      <ArrowDown className="w-3 h-3 text-red-400" />
                      <span className="text-xs text-red-400">3% vs. mês anterior</span>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Leads Gerados</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">129</p>
                    <div className="flex items-center gap-1 justify-start md:justify-end">
                      <ArrowUp className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-green-600 dark:text-green-400">8.4%</span>
                    </div>
                  </div>
                </div>

                {/* Funil de Conversão */}
                <div className="space-y-3">
                  {funnelData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">{item.etapa} ({item.porcentagem}%)</span>
                        <span className="text-white font-medium">{item.quantidade}</span>
                      </div>
                      <div className="h-6 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.cor} transition-all duration-500 flex items-center justify-end pr-2`}
                          style={{ width: `${item.porcentagem}%` }}
                        >
                          <span className="text-white text-xs font-medium">{item.quantidade}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Métricas adicionais - CAC e Custo por Lead */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                  <div className="text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Custo por Lead</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">R$ {performanceMetrics.custo_por_lead.atual.toFixed(2)}</p>
                    <div className="flex items-center justify-center gap-1">
                      <ArrowDown className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-green-600 dark:text-green-400">{performanceMetrics.custo_por_lead.melhoria}%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Tempo Médio</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">18 dias</p>
                    <div className="flex items-center justify-center gap-1">
                      <ArrowUp className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-green-600 dark:text-green-400">3.5%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400">CAC</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">R$ {performanceMetrics.cac.atual.toFixed(2)}</p>
                    <div className="flex items-center justify-center gap-1">
                      <ArrowDown className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-green-600 dark:text-green-400">{performanceMetrics.cac.melhoria}%</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Cronograma de Tarefas */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Cronograma de Tarefas</CardTitle>
            <Link href="/tarefas">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                Ver tudo
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Prioridades */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-sm font-medium text-red-400">Prioridades</span>
              </div>
              {tarefas.filter(t => t.prioridade).map((tarefa) => (
                <div key={tarefa.id} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 mb-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-red-600 text-white text-xs">
                      {tarefa.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{tarefa.titulo}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-red-400">Progresso</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{tarefa.progresso}%</span>
                    </div>
                    <Progress value={tarefa.progresso} className="mt-2 h-1" />
                  </div>
                </div>
              ))}
            </div>

            {/* Em andamento */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">Em andamento</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-blue-600 text-white text-xs">
                    AL
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Finalizar projeto da cozinha</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-blue-400">Progresso</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">60%</span>
                  </div>
                  <Progress value={60} className="mt-2 h-1" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row - Vendas Fechadas */}
      <div className="grid grid-cols-1">
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Vendas Fechadas</CardTitle>
            </div>
            <Link href="/vendas-fechadas">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                Ver tudo
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {vendasFechadasData.slice(0, 6).map((venda) => (
                <div key={venda.id} className="flex flex-col p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all gap-3">
                  <div className="flex items-start justify-between w-full">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback className="bg-green-600 text-white">
                          {venda.cliente.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 max-w-[60%]">
                        <h4 className="font-medium text-slate-900 dark:text-white truncate">{venda.cliente}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{venda.projeto}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600 dark:text-green-400 whitespace-nowrap">{formatCurrency(venda.valor)}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-[100px]">{venda.vendedor}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <Badge className={`text-xs whitespace-nowrap ${
                      venda.status === 'Entregue' ? 'bg-green-600 text-white hover:bg-green-700' :
                      venda.status === 'Em produção' ? 'bg-blue-600 text-white hover:bg-blue-700' :
                      venda.status === 'Concluído' ? 'bg-green-600 text-white hover:bg-green-700' :
                      'bg-purple-600 text-white hover:bg-purple-700'
                    }`}>
                      {venda.status}
                    </Badge>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-500">{venda.dataFechamento}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
