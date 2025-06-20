"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowUpRight,
  ArrowDownRight,
  BarChart4,
  Calendar,
  ChevronRight,
  User,
  Clock,
  Target,
  TrendingUp,
  LineChart,
  AreaChart,
  Award,
  Crown,
  ThumbsUp,
  AlertTriangle,
  Users,
  Lightbulb
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Chart component (simulated since we don't have an actual chart library)
function SimulatedChart({ type, title, subtitle, heightClass, colorClass }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-medium">{title}</h3>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
        {type === "bar" && <BarChart4 className={`h-4 w-4 ${colorClass}`} />}
        {type === "line" && <LineChart className={`h-4 w-4 ${colorClass}`} />}
        {type === "area" && <AreaChart className={`h-4 w-4 ${colorClass}`} />}
      </div>

      <div className={`${heightClass} rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden`}>
        {type === "bar" && (
          <div className="flex items-end justify-between h-full p-2 pt-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((_, i) => (
              <div
                key={i}
                className={`${colorClass} w-4 rounded-t-sm mx-0.5`}
                style={{
                  height: `${Math.random() * 80 + 10}%`,
                  opacity: i % 3 === 0 ? 1 : i % 3 === 1 ? 0.8 : 0.6
                }}
              ></div>
            ))}
          </div>
        )}

        {type === "line" && (
          <div className="h-full p-2 flex items-center">
            <svg viewBox="0 0 100 30" className="w-full h-full">
              <path
                d="M0,25 Q10,20 20,18 T40,15 T60,10 T80,5 L100,5"
                fill="none"
                stroke={colorClass === "text-blue-500" ? "#3b82f6" :
                        colorClass === "text-emerald-500" ? "#10b981" :
                        colorClass === "text-purple-500" ? "#8b5cf6" : "#6b7280"}
                strokeWidth="1.5"
              />
            </svg>
          </div>
        )}

        {type === "area" && (
          <div className="h-full p-2 flex items-center">
            <svg viewBox="0 0 100 30" className="w-full h-full">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%"
                    style={{
                      stopColor: colorClass === "text-blue-500" ? "#3b82f6" :
                               colorClass === "text-emerald-500" ? "#10b981" :
                               colorClass === "text-purple-500" ? "#8b5cf6" : "#6b7280",
                      stopOpacity: 0.6
                    }}
                  />
                  <stop offset="100%"
                    style={{
                      stopColor: colorClass === "text-blue-500" ? "#3b82f6" :
                               colorClass === "text-emerald-500" ? "#10b981" :
                               colorClass === "text-purple-500" ? "#8b5cf6" : "#6b7280",
                      stopOpacity: 0.1
                    }}
                  />
                </linearGradient>
              </defs>
              <path
                d="M0,25 Q10,20 20,18 T40,15 T60,10 T80,5 L100,5 V30 H0 Z"
                fill="url(#grad1)"
                stroke="none"
              />
              <path
                d="M0,25 Q10,20 20,18 T40,15 T60,10 T80,5 L100,5"
                fill="none"
                stroke={colorClass === "text-blue-500" ? "#3b82f6" :
                        colorClass === "text-emerald-500" ? "#10b981" :
                        colorClass === "text-purple-500" ? "#8b5cf6" : "#6b7280"}
                strokeWidth="1.5"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

export function AnalisePerformance() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("semanal");
  const [periodo, setPeriodo] = useState("maio"); // Supondo que estamos em maio/2025

  // Dados de performance semanal
  const dadosSemanais = [
    {
      semana: "Semana 1 (01-07/mai)",
      valorTotal: 752000,
      ticketMedio: 123500,
      totalVendas: 32,
      crescimento: 6.2,
      vendasPorCategoria: {
        cozinhas: 45,
        dormitorios: 20,
        homeOffice: 15,
        salas: 10,
        closets: 10
      },
      topVendedor: "Carlos Mendes",
      progressoMeta: 25.1 // % da meta mensal
    },
    {
      semana: "Semana 2 (08-14/mai)",
      valorTotal: 841000,
      ticketMedio: 124800,
      totalVendas: 34,
      crescimento: 11.8,
      vendasPorCategoria: {
        cozinhas: 40,
        dormitorios: 25,
        homeOffice: 15,
        salas: 12,
        closets: 8
      },
      topVendedor: "Ana Costa",
      progressoMeta: 28.0 // % da meta mensal
    },
    {
      semana: "Semana 3 (15-21/mai)",
      valorTotal: 903500,
      ticketMedio: 125100,
      totalVendas: 36,
      crescimento: 7.4,
      vendasPorCategoria: {
        cozinhas: 42,
        dormitorios: 22,
        homeOffice: 18,
        salas: 8,
        closets: 10
      },
      topVendedor: "Carlos Mendes",
      progressoMeta: 30.1 // % da meta mensal
    },
    {
      semana: "Semana 4 (22-28/mai)",
      valorTotal: 748900,
      ticketMedio: 123400,
      totalVendas: 32,
      crescimento: -17.1,
      vendasPorCategoria: {
        cozinhas: 44,
        dormitorios: 20,
        homeOffice: 16,
        salas: 10,
        closets: 10
      },
      topVendedor: "Roberto Alves",
      progressoMeta: 25.0 // % da meta mensal - até agora, em andamento
    }
  ];

  // Dados de performance mensal (últimos 6 meses)
  const dadosMensais = [
    {
      mes: "Dezembro/24",
      valorTotal: 3240000,
      ticketMedio: 124000,
      totalVendas: 135,
      crescimento: 5.2,
      meta: 3000000,
      progressoMeta: 108.0,
      destaques: ["Promoção de Natal", "Lançamento da linha premium"]
    },
    {
      mes: "Janeiro/25",
      valorTotal: 2850000,
      ticketMedio: 121500,
      totalVendas: 100,
      crescimento: -12.0,
      meta: 3000000,
      progressoMeta: 95.0,
      destaques: ["Início da temporada de férias", "Descontos pós-festas"]
    },
    {
      mes: "Fevereiro/25",
      valorTotal: 2920000,
      ticketMedio: 122100,
      totalVendas: 105,
      crescimento: 2.5,
      meta: 3000000,
      progressoMeta: 97.3,
      destaques: ["Feira de móveis", "Campanha para home office"]
    },
    {
      mes: "Março/25",
      valorTotal: 3050000,
      ticketMedio: 122900,
      totalVendas: 116,
      crescimento: 4.5,
      meta: 3000000,
      progressoMeta: 101.7,
      destaques: ["Volta às aulas", "Semana do consumidor"]
    },
    {
      mes: "Abril/25",
      valorTotal: 3150000,
      ticketMedio: 123000,
      totalVendas: 124,
      crescimento: 3.3,
      meta: 3000000,
      progressoMeta: 105.0,
      destaques: ["Campanha multicanal", "Novos materiais de cozinha"]
    },
    {
      mes: "Maio/25",
      valorTotal: 3245400, // Soma das semanas até agora
      ticketMedio: 124200,
      totalVendas: 134,
      crescimento: 3.0,
      meta: 3000000,
      progressoMeta: 108.2, // Projeção
      destaques: ["Dia das mães", "Lançamento linha ecológica"]
    }
  ];

  // Dados trimestrais (últimos 4 trimestres)
  const dadosTrimestrais = [
    {
      trimestre: "Q2/2024",
      valorTotal: 8150000,
      ticketMedio: 118500,
      totalVendas: 342,
      crescimento: 8.5,
      meta: 8000000,
      progressoMeta: 101.9,
      destaques: ["Lançamento de novos produtos", "Expansão para novas regiões"]
    },
    {
      trimestre: "Q3/2024",
      valorTotal: 8650000,
      ticketMedio: 120800,
      totalVendas: 356,
      crescimento: 6.1,
      meta: 8500000,
      progressoMeta: 101.8,
      destaques: ["Parcerias com arquitetos", "Campanha de inverno"]
    },
    {
      trimestre: "Q4/2024",
      valorTotal: 9250000,
      ticketMedio: 122400,
      totalVendas: 375,
      crescimento: 6.9,
      meta: 9000000,
      progressoMeta: 102.8,
      destaques: ["Black Friday", "Vendas de fim de ano"]
    },
    {
      trimestre: "Q1/2025",
      valorTotal: 8820000,
      ticketMedio: 123500,
      totalVendas: 321,
      crescimento: -4.6,
      meta: 9000000,
      progressoMeta: 98.0,
      destaques: ["Novo showroom", "Reforma de lojas físicas"]
    }
  ];

  // Dados anuais (últimos 3 anos + projeção atual)
  const dadosAnuais = [
    {
      ano: "2022",
      valorTotal: 28500000,
      ticketMedio: 98500,
      totalVendas: 1210,
      crescimento: 0,
      meta: 27000000,
      progressoMeta: 105.6,
      destaques: ["Recuperação pós-pandemia", "Novos fornecedores"]
    },
    {
      ano: "2023",
      valorTotal: 31200000,
      ticketMedio: 108000,
      totalVendas: 1325,
      crescimento: 9.5,
      meta: 30000000,
      progressoMeta: 104.0,
      destaques: ["Implementação de CRM", "Estratégia omnichannel"]
    },
    {
      ano: "2024",
      valorTotal: 34800000,
      ticketMedio: 118000,
      totalVendas: 1450,
      crescimento: 11.5,
      meta: 33000000,
      progressoMeta: 105.5,
      destaques: ["Abertura de 2 novas lojas", "Parceria com bancos"]
    },
    {
      ano: "2025 (Projeção)",
      valorTotal: 38500000,
      ticketMedio: 125000,
      totalVendas: 1550,
      crescimento: 10.6,
      meta: 36000000,
      progressoMeta: 106.9,
      destaques: ["Expansão internacional", "Novas linhas premium"]
    }
  ];

  // Ranking de vendedores (últimos 30 dias)
  const rankingVendedores = [
    { nome: "Carlos Mendes", vendas: 42, valor: 982500, comissao: 24562, crescimento: 8.2 },
    { nome: "Ana Costa", vendas: 38, valor: 887000, comissao: 22175, crescimento: 12.4 },
    { nome: "Roberto Alves", vendas: 31, valor: 745600, comissao: 18640, crescimento: -3.6 },
    { nome: "Juliana Rodrigues", vendas: 28, valor: 710500, comissao: 17762, crescimento: 5.8 },
    { nome: "Marcelo Santos", vendas: 24, valor: 580000, comissao: 14500, crescimento: 2.1 }
  ];

  // Projeções para o mês atual
  const projecoes = {
    vendas: {
      projecaoBaixaVendas: 2800000,
      projecaoMediaVendas: 3100000,
      projecaoAltaVendas: 3400000,
      metaVendas: 3000000,
      crescimentoEsperado: 8.2
    },
    emAndamento: {
      numeroProjetos: 28,
      valorTotal: 1540000,
      tempoBaixaMedio: 12 // dias para fechar
    },
    tendencias: [
      "Crescimento de 22% nas vendas de home office",
      "Aumento de 15% no ticket médio para cozinhas premium",
      "Redução de 8% no tempo médio de fechamento de vendas",
      "Crescimento de 18% nas vendas pelo canal digital"
    ]
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  // Formatação de moeda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart4 className="h-5 w-5 text-blue-500" />
            <span>Análise de Performance de Vendas</span>
          </CardTitle>
          <CardDescription>Carregando dados de performance...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-8 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((_, i) => (
                <div key={i} className="h-36 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart4 className="h-5 w-5 text-blue-500" />
              <span>Análise de Performance de Vendas</span>
            </CardTitle>
            <CardDescription>Acompanhamento detalhado do desempenho comercial</CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm font-medium flex items-center gap-1.5">
              <Target className="h-4 w-4 text-purple-500" />
              <span>Meta mensal:</span>
              <span className="text-purple-600 dark:text-purple-400">{formatCurrency(3000000)}</span>
            </div>

            <Separator orientation="vertical" className="h-6 mx-2" />

            <div className="text-sm">
              <span className="text-slate-500 dark:text-slate-400">Período:</span>
              <Badge variant="outline" className="ml-2 bg-blue-50 dark:bg-blue-900/20">
                Maio/2025
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Resumo da meta atual */}
        <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-purple-700 dark:text-purple-300">Vendas Acumuladas (Maio)</div>
              <div className="font-semibold text-lg text-purple-800 dark:text-purple-200">
                {formatCurrency(3245400)}
              </div>
              <div className="flex items-center gap-1 text-xs">
                <ArrowUpRight className="h-3 w-3 text-green-500" />
                <span className="text-green-600 dark:text-green-400">108.2% da meta</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-purple-700 dark:text-purple-300">Projetos Vendidos</div>
              <div className="font-semibold text-lg text-purple-800 dark:text-purple-200">
                134 projetos
              </div>
              <div className="flex items-center gap-1 text-xs">
                <ArrowUpRight className="h-3 w-3 text-green-500" />
                <span className="text-green-600 dark:text-green-400">+8% vs. abril</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-purple-700 dark:text-purple-300">Ticket Médio</div>
              <div className="font-semibold text-lg text-purple-800 dark:text-purple-200">
                {formatCurrency(124200)}
              </div>
              <div className="flex items-center gap-1 text-xs">
                <ArrowUpRight className="h-3 w-3 text-green-500" />
                <span className="text-green-600 dark:text-green-400">+5.2% vs. abril</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-purple-700 dark:text-purple-300">Projeção Final (Maio)</div>
              <div className="font-semibold text-lg text-purple-800 dark:text-purple-200">
                {formatCurrency(3400000)}
              </div>
              <div className="flex items-center gap-1 text-xs">
                <ArrowUpRight className="h-3 w-3 text-green-500" />
                <span className="text-green-600 dark:text-green-400">113.3% da meta</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs para análise em diferentes períodos */}
        <Tabs defaultValue="semanal" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="semanal" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Semanal</span>
            </TabsTrigger>
            <TabsTrigger value="mensal" className="flex items-center gap-2">
              <BarChart4 className="h-4 w-4" />
              <span>Mensal</span>
            </TabsTrigger>
            <TabsTrigger value="trimestral" className="flex items-center gap-2">
              <AreaChart className="h-4 w-4" />
              <span>Trimestral</span>
            </TabsTrigger>
            <TabsTrigger value="anual" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              <span>Anual</span>
            </TabsTrigger>
          </TabsList>

          {/* Conteúdo da aba semanal */}
          <TabsContent value="semanal" className="mt-6">
            <div className="space-y-6">
              {/* Indicadores de performance semanal */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {dadosSemanais.map((semana, index) => (
                  <Card key={index} className={index === 3 ? "border-blue-300 dark:border-blue-700 shadow-sm" : ""}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">{semana.semana}</CardTitle>
                      <div className="flex justify-between items-center mt-1">
                        <div className="text-lg font-semibold">{formatCurrency(semana.valorTotal)}</div>
                        <Badge variant={semana.crescimento > 0 ? "success" : "destructive"} className="text-xs">
                          {semana.crescimento > 0 ? "+" : ""}{semana.crescimento}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="grid grid-cols-2 text-xs gap-y-1">
                        <div className="text-slate-500 dark:text-slate-400">Vendas:</div>
                        <div className="text-right font-medium">{semana.totalVendas}</div>
                        <div className="text-slate-500 dark:text-slate-400">Ticket médio:</div>
                        <div className="text-right font-medium">{formatCurrency(semana.ticketMedio)}</div>
                        <div className="text-slate-500 dark:text-slate-400">Top vendedor:</div>
                        <div className="text-right font-medium">{semana.topVendedor}</div>
                        <div className="text-slate-500 dark:text-slate-400">Meta:</div>
                        <div className="text-right font-medium text-purple-700 dark:text-purple-400">{semana.progressoMeta}%</div>
                      </div>

                      <div className="mt-3 pt-2 border-t">
                        <div className="text-xs text-slate-500 mb-1">Progresso da meta mensal</div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500 dark:bg-purple-400 rounded-full"
                            style={{ width: `${semana.progressoMeta}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>



              {/* Insights da Semana */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    Insights da Semana Atual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <ThumbsUp className="h-4 w-4 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">Melhores Performances</h4>
                        <ul className="mt-1 text-sm space-y-1">
                          <li className="flex items-center gap-1.5">
                            <Crown className="h-3.5 w-3.5 text-amber-500" />
                            <span>Roberto Alves superou sua meta em 22% esta semana</span>
                          </li>
                          <li className="flex items-center gap-1.5">
                            <Award className="h-3.5 w-3.5 text-blue-500" />
                            <span>Cozinhas continuam liderando com 44% das vendas</span>
                          </li>
                          <li className="flex items-center gap-1.5">
                            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                            <span>Vendas de closets aumentaram 18% em relação à semana anterior</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">Pontos de Atenção</h4>
                        <ul className="mt-1 text-sm space-y-1">
                          <li>Vendas de salas estão 15% abaixo da meta semanal</li>
                          <li>Queda de 17.1% em comparação com a semana anterior</li>
                          <li>4 propostas de alto valor (&gt;R$50.000) pendentes de aprovação</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Conteúdo da aba mensal */}
          <TabsContent value="mensal" className="mt-6">
            <div className="space-y-6">
              {/* Gráficos de Análise Mensal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SimulatedChart
                  type="bar"
                  title="Vendas Mensais"
                  subtitle="Comparativo dos últimos 6 meses"
                  heightClass="h-64"
                  colorClass="text-purple-500"
                />

                <SimulatedChart
                  type="area"
                  title="Progresso vs. Metas"
                  subtitle="Desempenho mensal em relação às metas"
                  heightClass="h-64"
                  colorClass="text-blue-500"
                />
              </div>

              {/* Tabela de Desempenho Mensal */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    Desempenho Mensal (6 meses)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[320px]">
                    <div className="w-full">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b text-xs text-slate-500">
                            <th className="font-medium text-left py-2">Mês</th>
                            <th className="font-medium text-right py-2">Vendas</th>
                            <th className="font-medium text-right py-2">Projetos</th>
                            <th className="font-medium text-right py-2">Ticket</th>
                            <th className="font-medium text-right py-2">Crescimento</th>
                            <th className="font-medium text-right py-2">Meta</th>
                            <th className="font-medium text-right py-2">Alcançado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dadosMensais.map((mes, index) => (
                            <tr
                              key={index}
                              className={`border-b text-sm ${index === dadosMensais.length - 1 ? 'font-medium bg-blue-50 dark:bg-blue-900/10' : ''}`}
                            >
                              <td className="py-2.5">{mes.mes}</td>
                              <td className="text-right">{formatCurrency(mes.valorTotal)}</td>
                              <td className="text-right">{mes.totalVendas}</td>
                              <td className="text-right">{formatCurrency(mes.ticketMedio)}</td>
                              <td className={`text-right ${mes.crescimento > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                {mes.crescimento > 0 ? '+' : ''}{mes.crescimento}%
                              </td>
                              <td className="text-right">{formatCurrency(mes.meta)}</td>
                              <td className="text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <span
                                    className={`${mes.progressoMeta >= 100 ? 'text-emerald-600 dark:text-emerald-400' : mes.progressoMeta >= 90 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}
                                  >
                                    {mes.progressoMeta}%
                                  </span>
                                  <div className="w-10 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${mes.progressoMeta >= 100 ? 'bg-emerald-500' : mes.progressoMeta >= 90 ? 'bg-amber-500' : 'bg-red-500'}`}
                                      style={{ width: `${Math.min(mes.progressoMeta, 100)}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Top Vendedores e Projeções */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Vendedores */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      Top Vendedores (30 dias)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {rankingVendedores.map((vendedor, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-900">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${
                                index === 0 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200' :
                                index === 1 ? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200' :
                                index === 2 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200' :
                                'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                              }`}>
                                {vendedor.nome.split(' ').map(word => word[0]).join('')}
                              </div>
                              {index < 3 && (
                                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
                                  {index === 0 && <Crown className="h-3 w-3 text-amber-500" />}
                                  {index === 1 && <Award className="h-3 w-3 text-slate-400" />}
                                  {index === 2 && <Award className="h-3 w-3 text-orange-500" />}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium">{vendedor.nome}</div>
                              <div className="text-xs text-slate-500">{vendedor.vendas} vendas • {formatCurrency(vendedor.valor)}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{formatCurrency(vendedor.comissao)}</div>
                            <div className={`text-xs flex items-center justify-end ${vendedor.crescimento > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                              {vendedor.crescimento > 0 ? (
                                <ArrowUpRight className="h-3 w-3 mr-0.5" />
                              ) : (
                                <ArrowDownRight className="h-3 w-3 mr-0.5" />
                              )}
                              <span>{vendedor.crescimento > 0 ? '+' : ''}{vendedor.crescimento}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Projeções */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <LineChart className="h-4 w-4 text-emerald-500" />
                      Projeções para Maio/2025
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Meta de vendas</span>
                          <span className="font-medium">{formatCurrency(projecoes.vendas.metaVendas)}</span>
                        </div>

                        <div className="space-y-2 pt-1 pb-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-500">Projeção conservadora</span>
                            <span className="text-xs font-medium">{formatCurrency(projecoes.vendas.projecaoBaixaVendas)}</span>
                          </div>
                          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-200 dark:bg-emerald-900"
                              style={{ width: `${(projecoes.vendas.projecaoBaixaVendas / projecoes.vendas.metaVendas) * 100}%` }}
                            ></div>
                          </div>

                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-slate-500">Projeção esperada</span>
                            <span className="text-xs font-medium">{formatCurrency(projecoes.vendas.projecaoMediaVendas)}</span>
                          </div>
                          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-400 dark:bg-emerald-700"
                              style={{ width: `${(projecoes.vendas.projecaoMediaVendas / projecoes.vendas.metaVendas) * 100}%` }}
                            ></div>
                          </div>

                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-slate-500">Projeção otimista</span>
                            <span className="text-xs font-medium">{formatCurrency(projecoes.vendas.projecaoAltaVendas)}</span>
                          </div>
                          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 dark:bg-emerald-600"
                              style={{ width: `${(projecoes.vendas.projecaoAltaVendas / projecoes.vendas.metaVendas) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                        <h4 className="text-sm font-medium">Principais Tendências</h4>
                        <ul className="text-xs space-y-1.5 mt-2">
                          {projecoes.tendencias.map((tendencia, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <TrendingUp className="h-3.5 w-3.5 text-emerald-500 mt-0.5" />
                              <span>{tendencia}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <h4 className="text-sm font-medium text-purple-800 dark:text-purple-200 flex items-center gap-1.5">
                          <Target className="h-3.5 w-3.5" />
                          <span>Em andamento</span>
                        </h4>
                        <div className="mt-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-purple-700 dark:text-purple-300">Projetos em negociação:</span>
                            <span className="font-medium text-purple-800 dark:text-purple-200">{projecoes.emAndamento.numeroProjetos}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-purple-700 dark:text-purple-300">Valor potencial:</span>
                            <span className="font-medium text-purple-800 dark:text-purple-200">{formatCurrency(projecoes.emAndamento.valorTotal)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Conteúdo da aba trimestral */}
          <TabsContent value="trimestral" className="mt-6">
            <div className="space-y-6">
              {/* Gráficos de Análise Trimestral */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SimulatedChart
                  type="bar"
                  title="Vendas Trimestrais"
                  subtitle="Comparativo dos últimos 4 trimestres"
                  heightClass="h-64"
                  colorClass="text-blue-500"
                />

                <SimulatedChart
                  type="area"
                  title="Progresso vs. Metas Trimestrais"
                  subtitle="Desempenho por trimestre"
                  heightClass="h-64"
                  colorClass="text-purple-500"
                />
              </div>

              {/* Tabela de Desempenho Trimestral */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    Desempenho Trimestral (4 trimestres)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[320px]">
                    <div className="w-full">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b text-xs text-slate-500">
                            <th className="font-medium text-left py-2">Trimestre</th>
                            <th className="font-medium text-right py-2">Vendas</th>
                            <th className="font-medium text-right py-2">Projetos</th>
                            <th className="font-medium text-right py-2">Ticket</th>
                            <th className="font-medium text-right py-2">Crescimento</th>
                            <th className="font-medium text-right py-2">Meta</th>
                            <th className="font-medium text-right py-2">Alcançado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dadosTrimestrais.map((trimestre, index) => (
                            <tr
                              key={index}
                              className={`border-b text-sm ${index === dadosTrimestrais.length - 1 ? 'font-medium bg-blue-50 dark:bg-blue-900/10' : ''}`}
                            >
                              <td className="py-2.5">{trimestre.trimestre}</td>
                              <td className="text-right">{formatCurrency(trimestre.valorTotal)}</td>
                              <td className="text-right">{trimestre.totalVendas}</td>
                              <td className="text-right">{formatCurrency(trimestre.ticketMedio)}</td>
                              <td className={`text-right ${trimestre.crescimento > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                {trimestre.crescimento > 0 ? '+' : ''}{trimestre.crescimento}%
                              </td>
                              <td className="text-right">{formatCurrency(trimestre.meta)}</td>
                              <td className="text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <span
                                    className={`${trimestre.progressoMeta >= 100 ? 'text-emerald-600 dark:text-emerald-400' : trimestre.progressoMeta >= 90 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}
                                  >
                                    {trimestre.progressoMeta}%
                                  </span>
                                  <div className="w-10 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${trimestre.progressoMeta >= 100 ? 'bg-emerald-500' : trimestre.progressoMeta >= 90 ? 'bg-amber-500' : 'bg-red-500'}`}
                                      style={{ width: `${Math.min(trimestre.progressoMeta, 100)}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Insights Trimestrais */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    Insights Trimestrais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                      <TrendingUp className="h-4 w-4 text-amber-500 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">Tendências Trimestrais</h4>
                        <ul className="mt-1 text-sm space-y-1">
                          <li>Crescimento consistente nos últimos 3 trimestres</li>
                          <li>Ticket médio aumentou em 4.2% em comparação com o mesmo trimestre do ano anterior</li>
                          <li>Sazonalidade menor comparada a anos anteriores</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <Award className="h-4 w-4 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">Destaques</h4>
                        <ul className="mt-1 text-sm space-y-1">
                          <li>Q4/2024 foi o trimestre mais forte em toda a história da empresa</li>
                          <li>Home Office superou Dormitórios como segunda categoria mais vendida</li>
                          <li>Novas parcerias contribuíram com 15% do faturamento no Q1/2025</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Conteúdo da aba anual */}
          <TabsContent value="anual" className="mt-6">
            <div className="space-y-6">
              {/* Gráficos de Análise Anual */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SimulatedChart
                  type="bar"
                  title="Vendas Anuais"
                  subtitle="Comparativo dos últimos 3 anos + projeção atual"
                  heightClass="h-64"
                  colorClass="text-emerald-500"
                />

                <SimulatedChart
                  type="line"
                  title="Evolução Anual do Ticket Médio"
                  subtitle="Crescimento histórico"
                  heightClass="h-64"
                  colorClass="text-purple-500"
                />
              </div>

              {/* Tabela de Desempenho Anual */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BarChart4 className="h-4 w-4 text-blue-500" />
                    Desempenho Anual (3 anos + projeção)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-xs text-slate-500">
                          <th className="font-medium text-left py-2">Ano</th>
                          <th className="font-medium text-right py-2">Vendas</th>
                          <th className="font-medium text-right py-2">Projetos</th>
                          <th className="font-medium text-right py-2">Ticket</th>
                          <th className="font-medium text-right py-2">Crescimento</th>
                          <th className="font-medium text-right py-2">Meta</th>
                          <th className="font-medium text-right py-2">Alcançado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dadosAnuais.map((ano, index) => (
                          <tr
                            key={index}
                            className={`border-b text-sm ${index === dadosAnuais.length - 1 ? 'font-medium bg-emerald-50 dark:bg-emerald-900/10' : ''}`}
                          >
                            <td className="py-2.5">{ano.ano}</td>
                            <td className="text-right">{formatCurrency(ano.valorTotal)}</td>
                            <td className="text-right">{ano.totalVendas}</td>
                            <td className="text-right">{formatCurrency(ano.ticketMedio)}</td>
                            <td className={`text-right ${ano.crescimento > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                              {ano.crescimento > 0 ? '+' : ''}{ano.crescimento}%
                            </td>
                            <td className="text-right">{formatCurrency(ano.meta)}</td>
                            <td className="text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <span
                                  className={`${ano.progressoMeta >= 100 ? 'text-emerald-600 dark:text-emerald-400' : ano.progressoMeta >= 90 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}
                                >
                                  {ano.progressoMeta}%
                                </span>
                                <div className="w-10 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${ano.progressoMeta >= 100 ? 'bg-emerald-500' : ano.progressoMeta >= 90 ? 'bg-amber-500' : 'bg-red-500'}`}
                                    style={{ width: `${Math.min(ano.progressoMeta, 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Destaques Anuais */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Crown className="h-4 w-4 text-amber-500" />
                    Destaques Anuais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dadosAnuais.map((ano, index) => (
                      <div key={index} className="p-3 border-b last:border-b-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${
                            index === dadosAnuais.length - 1
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
                          }`}>
                            {ano.ano.substring(0, 4)}
                          </div>
                          <h3 className="font-medium">{ano.ano}</h3>
                          <Badge variant="outline" className={index === dadosAnuais.length - 1 ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30" : ""}>
                            {formatCurrency(ano.valorTotal)}
                          </Badge>
                        </div>

                        <ul className="mt-1 space-y-1">
                          {ano.destaques.map((destaque, i) => (
                            <li key={i} className="text-sm flex items-start gap-1.5">
                              <TrendingUp className="h-3.5 w-3.5 text-blue-500 mt-0.5" />
                              <span>{destaque}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
