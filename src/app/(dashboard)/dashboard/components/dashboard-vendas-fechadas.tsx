"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  TrendingUp,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  BrainCircuit,
  LineChart,
  BarChart4,
  Lightbulb
} from "lucide-react";
import Link from "next/link";

interface VendaFechada {
  id: string;
  cliente: string;
  projeto: string;
  valor: number;
  dataFechamento: string;
  status: string;
}

export function DashboardVendasFechadas() {
  const [isLoading, setIsLoading] = useState(true);
  const [vendasRecentes, setVendasRecentes] = useState<VendaFechada[]>([]);
  const [metricas, setMetricas] = useState({
    total: 0,
    variacao: 0,
    ticketMedio: 0,
    variacaoTicket: 0,
    previsaoProximoMes: 0
  });
  const [insights, setInsights] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Simulação de carregamento de dados
      setTimeout(() => {
        // Dados simulados
        setVendasRecentes([
          {
            id: "VF-2025-001",
            cliente: "João Silva",
            projeto: "Cozinha + Sala",
            valor: 142850.00,
            dataFechamento: "15/05/2025",
            status: "Em produção"
          },
          {
            id: "VF-2025-002",
            cliente: "Maria Oliveira",
            projeto: "Closet Master",
            valor: 128750.00,
            dataFechamento: "10/05/2025",
            status: "Aguardando material"
          },
          {
            id: "VF-2025-003",
            cliente: "Pedro Santos",
            projeto: "Home Office",
            valor: 98500.00,
            dataFechamento: "05/05/2025",
            status: "Em produção"
          }
        ]);

        setMetricas({
          total: 3248500,
          variacao: 15.2,
          ticketMedio: 123403,
          variacaoTicket: 8.5,
          previsaoProximoMes: 3500000
        });

        setInsights([
          "Cozinhas representam 45% do faturamento deste mês",
          "Taxa de conversão cresceu 12% nos últimos 30 dias",
          "Meta de 3 milhões atingida com antecedência de 5 dias"
        ]);

        setIsLoading(false);
      }, 1000);
    };

    loadData();
  }, []);

  // Função para formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="flex items-center gap-2">
          <BarChart4 className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-base font-medium">Vendas Fechadas</CardTitle>
        </div>
        <Link href="/vendas-fechadas">
          <Button variant="ghost" size="sm" className="gap-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
            <span className="text-xs">Ver tudo</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {isLoading ? (
          <div className="space-y-3">
            <div className="flex justify-between animate-pulse">
              <div className="h-12 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-12 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
            <div className="h-[1px] bg-slate-200 dark:bg-slate-800 my-3" />
            <div className="space-y-2">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="flex justify-between animate-pulse">
                  <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {/* Métricas de vendas */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                  <DollarSign className="h-4 w-4 mr-1 text-emerald-500" />
                  Total de Vendas
                </div>
                <div className="text-xl font-semibold">{formatCurrency(metricas.total)}</div>
                <div className="flex items-center text-xs">
                  {metricas.variacao > 0 ? (
                    <>
                      <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-0.5" />
                      <span className="text-emerald-500">+{metricas.variacao}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-3 w-3 text-red-500 mr-0.5" />
                      <span className="text-red-500">{metricas.variacao}%</span>
                    </>
                  )}
                  <span className="text-slate-400 dark:text-slate-500 ml-1">vs. mês anterior</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1 text-blue-500" />
                  Ticket Médio
                </div>
                <div className="text-xl font-semibold">{formatCurrency(metricas.ticketMedio)}</div>
                <div className="flex items-center text-xs">
                  {metricas.variacaoTicket > 0 ? (
                    <>
                      <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-0.5" />
                      <span className="text-emerald-500">+{metricas.variacaoTicket}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-3 w-3 text-red-500 mr-0.5" />
                      <span className="text-red-500">{metricas.variacaoTicket}%</span>
                    </>
                  )}
                  <span className="text-slate-400 dark:text-slate-500 ml-1">vs. mês anterior</span>
                </div>
              </div>
            </div>

            {/* Linha de separação */}
            <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-3" />

            {/* Insights de IA */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <BrainCircuit className="h-4 w-4 text-indigo-500 mr-1.5" />
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Insights com IA</span>
              </div>
              <ul className="space-y-1.5">
                {insights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-1.5 text-sm">
                    <Lightbulb className="h-3.5 w-3.5 text-amber-500 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Vendas recentes */}
            <div>
              <div className="flex items-center mb-2">
                <LineChart className="h-4 w-4 text-emerald-500 mr-1.5" />
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Vendas recentes</span>
              </div>
              <div className="space-y-2">
                {vendasRecentes.map((venda) => (
                  <div key={venda.id} className="flex justify-between items-center p-1.5 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-md">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{venda.cliente}</div>
                      <div className="text-xs text-slate-500">{venda.projeto}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{formatCurrency(venda.valor)}</div>
                      <div className="text-xs text-slate-500">{venda.dataFechamento}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Previsão para o próximo mês */}
            <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Previsão para o próximo mês</span>
                </div>
                <div className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  {formatCurrency(metricas.previsaoProximoMes)}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
