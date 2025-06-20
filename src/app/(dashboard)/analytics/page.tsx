"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  FunnelChart,
  Funnel,
  LabelList
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Zap
} from "lucide-react";
import { kpis, clientes, atividades, vendedores, formatCurrency, formatNumber, formatPercentage, getTotalFaturamento, getTotalLeads, getLeadsConvertidos, getTaxaConversao, getTicketMedio } from "@/lib/data";

// Dados para os gráficos baseados nos dados centralizados
const salesData = [
  { mes: "Jan", vendas: 245000, leads: 32, conversao: 28.1 },
  { mes: "Fev", vendas: 312000, leads: 41, conversao: 31.7 },
  { mes: "Mar", vendas: 178000, leads: 28, conversao: 25.0 },
  { mes: "Abr", vendas: 289000, leads: 39, conversao: 33.3 },
  { mes: "Mai", vendas: getTotalFaturamento(), leads: getTotalLeads(), conversao: getTaxaConversao() }
];

const leadSources = [
  { name: "WhatsApp", value: 35, color: "#10B981" },
  { name: "Site", value: 25, color: "#3B82F6" },
  { name: "Indicação", value: 20, color: "#8B5CF6" },
  { name: "LinkedIn", value: 12, color: "#0EA5E9" },
  { name: "Facebook", value: 8, color: "#F59E0B" }
];

const performanceData = vendedores.map(v => ({
  vendedor: v.nome,
  vendas: v.vendaRealizada,
  meta: v.metaMensal,
  conversao: v.conversao,
  comissao: v.comissao
}));

const funnelData = [
  { name: "Leads Gerados", value: 156, fill: "#3B82F6" },
  { name: "Em Contato", value: 89, fill: "#8B5CF6" },
  { name: "Reunião Agendada", value: 67, fill: "#10B981" },
  { name: "Proposta Enviada", value: 34, fill: "#F59E0B" },
  { name: "Fechado", value: getLeadsConvertidos(), fill: "#EF4444" }
];

// Dados de conversão por produto
const productData = [
  { produto: "Cozinha Planejada", vendas: 8, valor: 360000 },
  { produto: "Closet/Quarto", vendas: 6, valor: 210000 },
  { produto: "Home Office", vendas: 4, valor: 120000 },
  { produto: "Sala de Estar", vendas: 3, valor: 135000 },
  { produto: "Banheiro", vendas: 2, valor: 80000 }
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6m");
  const [activeTab, setActiveTab] = useState("overview");

  // Calcular KPIs dinâmicos
  const totalFaturamento = getTotalFaturamento();
  const totalLeads = getTotalLeads();
  const leadsConvertidos = getLeadsConvertidos();
  const taxaConversao = getTaxaConversao();
  const ticketMedio = getTicketMedio();

  const kpiCards = [
    {
      title: "Receita Total",
      value: formatCurrency(totalFaturamento),
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Leads Convertidos",
      value: leadsConvertidos.toString(),
      change: "+8.2%",
      trend: "up",
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Taxa de Conversão",
      value: formatPercentage(taxaConversao),
      change: "+5.1%",
      trend: "up",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Ticket Médio",
      value: formatCurrency(ticketMedio),
      change: "-2.3%",
      trend: "down",
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-gray-400 mt-1">Análise detalhada de performance</p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-slate-900 border-slate-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 Mês</SelectItem>
              <SelectItem value="3m">3 Meses</SelectItem>
              <SelectItem value="6m">6 Meses</SelectItem>
              <SelectItem value="1y">1 Ano</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="border-slate-800 text-gray-300">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>

          <Button variant="outline" className="border-slate-800 text-gray-300">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <Card key={index} className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">{kpi.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{kpi.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {kpi.trend === "up" ? (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    )}
                    <span className={`text-xs font-medium ${
                      kpi.trend === "up" ? "text-green-500" : "text-red-500"
                    }`}>
                      {kpi.change}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">vs mês anterior</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                  <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs de Analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 bg-slate-900 border-slate-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="sales" className="data-[state=active]:bg-blue-600">
            Vendas
          </TabsTrigger>
          <TabsTrigger value="leads" className="data-[state=active]:bg-blue-600">
            Leads
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-blue-600">
            Performance
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Vendas */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Evolução de Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="mes" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: '1px solid #1e293b',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      formatter={(value) => [formatCurrency(Number(value)), 'Vendas']}
                    />
                    <Area
                      type="monotone"
                      dataKey="vendas"
                      stroke="#3B82F6"
                      fill="url(#colorVendas)"
                    />
                    <defs>
                      <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Origem dos Leads */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Origem dos Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={leadSources}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, value}) => `${name}: ${value}%`}
                    >
                      {leadSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: '1px solid #1e293b',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Funil de Conversão */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Funil de Conversão</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={funnelData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" stroke="#9CA3AF" />
                  <YAxis type="category" dataKey="name" stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #1e293b',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance por Produto */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Vendas por Produto</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={productData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="produto" stroke="#9CA3AF" angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: '1px solid #1e293b',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      formatter={(value, name) => [
                        name === 'valor' ? formatCurrency(Number(value)) : value,
                        name === 'valor' ? 'Valor Total' : 'Quantidade'
                      ]}
                    />
                    <Bar dataKey="vendas" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Taxa de Conversão Mensal */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Taxa de Conversão</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="mes" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: '1px solid #1e293b',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Conversão']}
                    />
                    <Line
                      type="monotone"
                      dataKey="conversao"
                      stroke="#F59E0B"
                      strokeWidth={3}
                      dot={{ fill: '#F59E0B', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Leads Tab */}
        <TabsContent value="leads" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Leads por Status */}
            {Object.entries({
              "Novos Leads": clientes.filter(c => c.status === "Novo").length,
              "Em Contato": clientes.filter(c => c.status === "Em Contato").length,
              "Reunião Agendada": clientes.filter(c => c.status === "Reunião Agendada").length,
              "Proposta Enviada": clientes.filter(c => c.status === "Proposta Enviada").length,
              "Fechado": clientes.filter(c => c.status === "Fechado").length,
            }).map(([status, count]) => (
              <Card key={status} className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white mb-2">{status}</h3>
                    <p className="text-3xl font-bold text-blue-400">{count}</p>
                    <Badge className="mt-2 bg-blue-100 text-blue-800">
                      {((count / totalLeads) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          {/* Performance dos Vendedores */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Performance dos Vendedores</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="vendedor" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #1e293b',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    formatter={(value, name) => [
                      name === 'vendas' || name === 'meta' ? formatCurrency(Number(value)) :
                      name === 'conversao' ? `${Number(value).toFixed(1)}%` :
                      formatCurrency(Number(value)),
                      name === 'vendas' ? 'Vendas Realizadas' :
                      name === 'meta' ? 'Meta' :
                      name === 'conversao' ? 'Taxa de Conversão' : 'Comissão'
                    ]}
                  />
                  <Bar dataKey="vendas" fill="#10B981" />
                  <Bar dataKey="meta" fill="#6B7280" opacity={0.7} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
