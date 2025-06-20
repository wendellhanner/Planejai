"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  PieChart,
  BarChart,
  BarChart4,
  ChevronRight,
  PercentIcon,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
  Clock,
  Calendar,
  Users,
  Target,
} from "lucide-react";

interface VendaAnalytics {
  periodoAtual: {
    total: number;
    quantidade: number;
    ticketMedio: number;
    taxaConversao: number;
    tempoMedio: number;
  };
  comparativoAnterior: {
    total: number;
    quantidade: number;
    ticketMedio: number;
    taxaConversao: number;
    tempoMedio: number;
  };
  distribuicaoPorTipo: {
    tipo: string;
    valor: number;
    percentual: number;
  }[];
  formaPagamento: {
    forma: string;
    quantidade: number;
    percentual: number;
  }[];
  meta: {
    valorMensal: number;
    percentualAtingido: number;
    diasRestantes: number;
    tendencia: number;
  };
  desempenhoSemanal: {
    semana: string;
    valor: number;
    quantidade: number;
    comparativoSemanaAnterior: number;
  }[];
  desempenhoMensal: {
    mes: string;
    valor: number;
    meta: number;
    atingido: number;
  }[];
}

export function KPIsVendas() {
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<VendaAnalytics | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setTimeout(() => {
        setAnalytics({
          periodoAtual: {
            total: 748900,
            quantidade: 32,
            ticketMedio: 23403,
            taxaConversao: 24.5,
            tempoMedio: 14,
          },
          comparativoAnterior: {
            total: 685200,
            quantidade: 28,
            ticketMedio: 24471,
            taxaConversao: 22.8,
            tempoMedio: 16,
          },
          distribuicaoPorTipo: [
            { tipo: "Cozinhas", valor: 337005, percentual: 45 },
            { tipo: "Dormitórios", valor: 149780, percentual: 20 },
            { tipo: "Home Office", valor: 112335, percentual: 15 },
            { tipo: "Salas", valor: 74890, percentual: 10 },
            { tipo: "Closets", valor: 74890, percentual: 10 },
          ],
          formaPagamento: [
            { forma: "Entrada + Parcelas", quantidade: 22, percentual: 68.75 },
            { forma: "À vista", quantidade: 6, percentual: 18.75 },
            { forma: "Financiamento", quantidade: 4, percentual: 12.5 },
          ],
          meta: {
            valorMensal: 3000000,
            percentualAtingido: 24.96,
            diasRestantes: 18,
            tendencia: 8.2,
          },
          desempenhoSemanal: [
            { semana: "Semana 1", valor: 180500, quantidade: 8, comparativoSemanaAnterior: 12.4 },
            { semana: "Semana 2", valor: 254300, quantidade: 11, comparativoSemanaAnterior: 8.7 },
            { semana: "Semana 3", valor: 187600, quantidade: 8, comparativoSemanaAnterior: -5.2 },
            { semana: "Semana atual", valor: 126500, quantidade: 5, comparativoSemanaAnterior: 15.8 },
          ],
          desempenhoMensal: [
            { mes: "Janeiro", valor: 2150000, meta: 2500000, atingido: 86 },
            { mes: "Fevereiro", valor: 2320000, meta: 2500000, atingido: 92.8 },
            { mes: "Março", valor: 2650000, meta: 2700000, atingido: 98.1 },
            { mes: "Abril", valor: 2850000, meta: 2700000, atingido: 105.5 },
            { mes: "Maio (atual)", valor: 748900, meta: 3000000, atingido: 24.96 },
          ],
        });
        setIsLoading(false);
      }, 1000);
    };

    loadData();
  }, []);

  // Função para formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Calcula a variação percentual entre períodos
  const calcularVariacao = (atual: number, anterior: number) => {
    if (anterior === 0) return 100;
    return ((atual - anterior) / anterior) * 100;
  };

  if (isLoading || !analytics) {
    return (
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">KPIs de Vendas</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 animate-pulse">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
            <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="flex items-center gap-2">
          <BarChart4 className="h-5 w-5 text-purple-500" />
          <CardTitle className="text-base font-medium">KPIs de Vendas</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <span className="text-xs">Exportar relatório</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Total de Vendas */}
          <div className="space-y-1">
            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
              <DollarSign className="h-3.5 w-3.5 mr-1" />
              <span>Valor Total</span>
            </div>
            <div className="text-lg font-semibold">
              {formatCurrency(analytics.periodoAtual.total)}
            </div>
            <div className="flex items-center text-xs">
              {calcularVariacao(
                analytics.periodoAtual.total,
                analytics.comparativoAnterior.total
              ) > 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-0.5" />
                  <span className="text-emerald-500">
                    +
                    {calcularVariacao(
                      analytics.periodoAtual.total,
                      analytics.comparativoAnterior.total
                    ).toFixed(1)}
                    %
                  </span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-0.5" />
                  <span className="text-red-500">
                    {calcularVariacao(
                      analytics.periodoAtual.total,
                      analytics.comparativoAnterior.total
                    ).toFixed(1)}
                    %
                  </span>
                </>
              )}
              <span className="text-slate-400 dark:text-slate-500 ml-1">
                vs último mês
              </span>
            </div>
          </div>

          {/* Quantidade de Vendas */}
          <div className="space-y-1">
            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
              <ShoppingBag className="h-3.5 w-3.5 mr-1" />
              <span>Projetos Vendidos</span>
            </div>
            <div className="text-lg font-semibold">
              {analytics.periodoAtual.quantidade}
            </div>
            <div className="flex items-center text-xs">
              {calcularVariacao(
                analytics.periodoAtual.quantidade,
                analytics.comparativoAnterior.quantidade
              ) > 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-0.5" />
                  <span className="text-emerald-500">
                    +
                    {calcularVariacao(
                      analytics.periodoAtual.quantidade,
                      analytics.comparativoAnterior.quantidade
                    ).toFixed(1)}
                    %
                  </span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-0.5" />
                  <span className="text-red-500">
                    {calcularVariacao(
                      analytics.periodoAtual.quantidade,
                      analytics.comparativoAnterior.quantidade
                    ).toFixed(1)}
                    %
                  </span>
                </>
              )}
              <span className="text-slate-400 dark:text-slate-500 ml-1">
                vs último mês
              </span>
            </div>
          </div>

          {/* Ticket Médio */}
          <div className="space-y-1">
            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
              <TrendingUp className="h-3.5 w-3.5 mr-1" />
              <span>Ticket Médio</span>
            </div>
            <div className="text-lg font-semibold">
              {formatCurrency(analytics.periodoAtual.ticketMedio)}
            </div>
            <div className="flex items-center text-xs">
              {calcularVariacao(
                analytics.periodoAtual.ticketMedio,
                analytics.comparativoAnterior.ticketMedio
              ) > 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-0.5" />
                  <span className="text-emerald-500">
                    +
                    {calcularVariacao(
                      analytics.periodoAtual.ticketMedio,
                      analytics.comparativoAnterior.ticketMedio
                    ).toFixed(1)}
                    %
                  </span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-0.5" />
                  <span className="text-red-500">
                    {calcularVariacao(
                      analytics.periodoAtual.ticketMedio,
                      analytics.comparativoAnterior.ticketMedio
                    ).toFixed(1)}
                    %
                  </span>
                </>
              )}
              <span className="text-slate-400 dark:text-slate-500 ml-1">
                vs último mês
              </span>
            </div>
          </div>

          {/* Taxa de Conversão */}
          <div className="space-y-1">
            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
              <PercentIcon className="h-3.5 w-3.5 mr-1" />
              <span>Taxa de Conversão</span>
            </div>
            <div className="text-lg font-semibold">
              {analytics.periodoAtual.taxaConversao}%
            </div>
            <div className="flex items-center text-xs">
              {calcularVariacao(
                analytics.periodoAtual.taxaConversao,
                analytics.comparativoAnterior.taxaConversao
              ) > 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-0.5" />
                  <span className="text-emerald-500">
                    +
                    {calcularVariacao(
                      analytics.periodoAtual.taxaConversao,
                      analytics.comparativoAnterior.taxaConversao
                    ).toFixed(1)}
                    %
                  </span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-0.5" />
                  <span className="text-red-500">
                    {calcularVariacao(
                      analytics.periodoAtual.taxaConversao,
                      analytics.comparativoAnterior.taxaConversao
                    ).toFixed(1)}
                    %
                  </span>
                </>
              )}
              <span className="text-slate-400 dark:text-slate-500 ml-1">
                vs último mês
              </span>
            </div>
          </div>

          {/* Tempo Médio de Fechamento */}
          <div className="space-y-1">
            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>Tempo de Fechamento</span>
            </div>
            <div className="text-lg font-semibold">
              {analytics.periodoAtual.tempoMedio} dias
            </div>
            <div className="flex items-center text-xs">
              {calcularVariacao(
                analytics.comparativoAnterior.tempoMedio,
                analytics.periodoAtual.tempoMedio
              ) > 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-0.5" />
                  <span className="text-emerald-500">
                    -
                    {calcularVariacao(
                      analytics.comparativoAnterior.tempoMedio,
                      analytics.periodoAtual.tempoMedio
                    ).toFixed(1)}
                    %
                  </span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-0.5" />
                  <span className="text-red-500">
                    +
                    {Math.abs(
                      calcularVariacao(
                        analytics.comparativoAnterior.tempoMedio,
                        analytics.periodoAtual.tempoMedio
                      )
                    ).toFixed(1)}
                    %
                  </span>
                </>
              )}
              <span className="text-slate-400 dark:text-slate-500 ml-1">
                mais rápido
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Distribuição por Tipo de Projeto */}
          <div>
            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center mb-3">
              <PieChart className="h-4 w-4 text-blue-500 mr-2" />
              Distribuição por Tipo de Projeto
            </h3>
            <div className="space-y-2">
              {analytics.distribuicaoPorTipo.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-full flex items-center">
                    <div className="w-20 text-sm text-slate-700 dark:text-slate-300">
                      {item.tipo}
                    </div>
                    <div className="flex-1 mx-2">
                      <div className="h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 w-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${item.percentual}%`,
                            backgroundColor:
                              index === 0
                                ? "#3b82f6"
                                : index === 1
                                ? "#8b5cf6"
                                : index === 2
                                ? "#10b981"
                                : index === 3
                                ? "#f59e0b"
                                : "#ef4444",
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-24 flex justify-between">
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {formatCurrency(item.valor)}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {item.percentual}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formas de Pagamento */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center mb-3">
                <BarChart className="h-4 w-4 text-amber-500 mr-2" />
                Formas de Pagamento
              </h3>
              <div className="space-y-2">
                {analytics.formaPagamento.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {item.forma}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800">
                        {item.quantidade} projetos
                      </Badge>
                      <span className="text-sm font-medium">
                        {item.percentual}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Meta Mensal e Tendências */}
        <div className="mt-8 mb-2">
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center mb-3">
            <Target className="h-4 w-4 text-purple-600 mr-2" />
            Meta Mensal e Desempenho
          </h3>

          <Card className="border border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-900/20">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      Meta Mensal
                    </span>
                    <span className="text-sm font-bold text-purple-700 dark:text-purple-400">
                      {formatCurrency(analytics.meta.valorMensal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      Valor Atual
                    </span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {formatCurrency(analytics.periodoAtual.total)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      Dias Restantes
                    </span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {analytics.meta.diasRestantes} dias
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      Tendência
                    </span>
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      +{analytics.meta.tendencia}%
                    </span>
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                        {analytics.meta.percentualAtingido.toFixed(1)}% da meta atingida
                      </span>
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        Meta: {formatCurrency(analytics.meta.valorMensal)}
                      </span>
                    </div>
                    <div className="h-4 w-full bg-purple-200 dark:bg-purple-900/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600 dark:bg-purple-500"
                        style={{ width: `${analytics.meta.percentualAtingido}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mt-1">
                      <span>Início do mês</span>
                      <span>Meta: {formatCurrency(analytics.meta.valorMensal)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Análise de Desempenho Semanal e Mensal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Desempenho Semanal */}
          <div>
            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center mb-3">
              <Calendar className="h-4 w-4 text-blue-500 mr-2" />
              Desempenho Semanal (Maio)
            </h3>
            <div className="space-y-3">
              {analytics.desempenhoSemanal.map((semana, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                  <div>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {semana.semana}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>{semana.quantidade} vendas</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {formatCurrency(semana.valor)}
                    </div>
                    <div
                      className={`text-xs flex items-center justify-end gap-1 ${
                        semana.comparativoSemanaAnterior > 0
                          ? "text-emerald-500"
                          : "text-red-500"
                      }`}
                    >
                      {semana.comparativoSemanaAnterior > 0 ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      <span>
                        {Math.abs(semana.comparativoSemanaAnterior)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desempenho Mensal */}
          <div>
            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center mb-3">
              <BarChart className="h-4 w-4 text-emerald-500 mr-2" />
              Desempenho Mensal (2025)
            </h3>
            <div className="space-y-3">
              {analytics.desempenhoMensal.map((mes, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {mes.mes}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Meta: {formatCurrency(mes.meta)}
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          mes.atingido >= 100
                            ? "text-emerald-500"
                            : "text-blue-500"
                        }`}
                      >
                        {mes.atingido}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        mes.atingido >= 100
                          ? "bg-emerald-500"
                          : mes.atingido >= 90
                          ? "bg-blue-500"
                          : mes.atingido >= 75
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${Math.min(mes.atingido, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
