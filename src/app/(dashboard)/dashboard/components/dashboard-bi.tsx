"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, ArrowUpRight, ArrowDownRight, PieChart, Calendar, ChevronRight, BarChart } from "lucide-react";
import { useState, useEffect } from "react";

export function DashboardBI() {
  const [activeChart, setActiveChart] = useState<"vendas" | "conversao">("vendas");
  const [timeRange, setTimeRange] = useState<"semana" | "mes" | "trimestre" | "ano">("mes");
  const [isLoading, setIsLoading] = useState(true);

  // Simulação de carregamento
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="shadow-sm border-slate-200 dark:border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-base font-medium">Análise de Performance</CardTitle>
        <div className="flex items-center gap-2">
          <Tabs defaultValue={timeRange} onValueChange={(value) => setTimeRange(value as any)} className="hidden sm:block">
            <TabsList className="h-7 px-1 py-1">
              <TabsTrigger value="semana" className="text-xs px-2 py-0.5">Semana</TabsTrigger>
              <TabsTrigger value="mes" className="text-xs px-2 py-0.5">Mês</TabsTrigger>
              <TabsTrigger value="trimestre" className="text-xs px-2 py-0.5">Trimestre</TabsTrigger>
              <TabsTrigger value="ano" className="text-xs px-2 py-0.5">Ano</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="ghost" size="sm" className="h-7 gap-1 text-slate-500 dark:text-slate-400">
            <Calendar className="h-3.5 w-3.5" />
            <span className="text-xs">Mai 2025</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-6 pt-2 pb-4">
          <div className="flex gap-2">
            <Button
              variant={activeChart === "vendas" ? "default" : "outline"}
              size="sm"
              className="gap-1"
              onClick={() => setActiveChart("vendas")}
            >
              <BarChart className="h-4 w-4" />
              <span>Vendas</span>
            </Button>
            <Button
              variant={activeChart === "conversao" ? "default" : "outline"}
              size="sm"
              className="gap-1"
              onClick={() => setActiveChart("conversao")}
            >
              <TrendingUp className="h-4 w-4" />
              <span>Conversão</span>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="h-[250px] flex items-center justify-center">
            <div className="h-8 w-8 border-2 border-t-blue-500 border-slate-200 dark:border-slate-700 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {activeChart === "vendas" && (
              <div className="px-6 pb-6">
                <div className="flex justify-between mb-2">
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Total de Vendas</div>
                    <div className="text-2xl font-bold">R$ 248.500</div>
                    <div className="flex items-center text-xs font-medium mt-1">
                      <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                      <span className="text-emerald-500">12%</span>
                      <span className="text-slate-400 ml-1 dark:text-slate-500">vs. mês anterior</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 dark:text-slate-400">Meta Mensal</div>
                    <div className="text-2xl font-bold">R$ 300.000</div>
                    <div className="flex items-center text-xs font-medium mt-1 justify-end">
                      <span className="text-slate-500">82.8% atingida</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Ticket Médio</div>
                    <div className="text-lg font-bold">R$ 7.765</div>
                    <div className="flex items-center text-xs font-medium mt-0.5">
                      <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-0.5" />
                      <span className="text-emerald-500">4.2%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Produtos Vendidos</div>
                    <div className="text-lg font-bold">32</div>
                    <div className="flex items-center text-xs font-medium mt-0.5">
                      <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-0.5" />
                      <span className="text-emerald-500">8.3%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Novos Clientes</div>
                    <div className="text-lg font-bold">18</div>
                    <div className="flex items-center text-xs font-medium mt-0.5">
                      <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-0.5" />
                      <span className="text-emerald-500">12.5%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeChart === "conversao" && (
              <div className="px-6 pb-6">
                <div className="flex justify-between mb-2">
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Taxa de Conversão</div>
                    <div className="text-2xl font-bold">24.8%</div>
                    <div className="flex items-center text-xs font-medium mt-1">
                      <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                      <span className="text-red-500">3%</span>
                      <span className="text-slate-400 ml-1 dark:text-slate-500">vs. mês anterior</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 dark:text-slate-400">Leads Gerados</div>
                    <div className="text-2xl font-bold">129</div>
                    <div className="flex items-center text-xs font-medium mt-1 justify-end">
                      <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                      <span className="text-emerald-500">8.4%</span>
                    </div>
                  </div>
                </div>

                {/* Gráfico simulado de funil */}
                <div className="mt-6 flex flex-col items-center">
                  <div className="w-full flex items-center gap-2">
                    <div className="w-32 text-right text-xs font-medium text-slate-500 dark:text-slate-400">Leads (100%)</div>
                    <div className="flex-1 h-8 bg-blue-500 dark:bg-blue-600 rounded-sm relative">
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">129</div>
                    </div>
                  </div>
                  <div className="h-2 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
                  <div className="w-full flex items-center gap-2">
                    <div className="w-32 text-right text-xs font-medium text-slate-500 dark:text-slate-400">Contatos (87%)</div>
                    <div className="flex-1 h-8 bg-indigo-500 dark:bg-indigo-600 rounded-sm relative" style={{ width: '87%' }}>
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">112</div>
                    </div>
                    <div className="w-[13%]"></div>
                  </div>
                  <div className="h-2 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
                  <div className="w-full flex items-center gap-2">
                    <div className="w-32 text-right text-xs font-medium text-slate-500 dark:text-slate-400">Propostas (52%)</div>
                    <div className="flex-1 h-8 bg-purple-500 dark:bg-purple-600 rounded-sm relative" style={{ width: '52%' }}>
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">67</div>
                    </div>
                    <div className="w-[48%]"></div>
                  </div>
                  <div className="h-2 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
                  <div className="w-full flex items-center gap-2">
                    <div className="w-32 text-right text-xs font-medium text-slate-500 dark:text-slate-400">Vendas (24.8%)</div>
                    <div className="flex-1 h-8 bg-emerald-500 dark:bg-emerald-600 rounded-sm relative" style={{ width: '24.8%' }}>
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">32</div>
                    </div>
                    <div className="w-[75.2%]"></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Custo por Lead</div>
                    <div className="text-lg font-bold">R$ 58,30</div>
                    <div className="flex items-center text-xs font-medium mt-0.5">
                      <ArrowDownRight className="h-3 w-3 text-emerald-500 mr-0.5" />
                      <span className="text-emerald-500">2.1%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Tempo Médio</div>
                    <div className="text-lg font-bold">18 dias</div>
                    <div className="flex items-center text-xs font-medium mt-0.5">
                      <ArrowDownRight className="h-3 w-3 text-emerald-500 mr-0.5" />
                      <span className="text-emerald-500">3.5%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">CAC</div>
                    <div className="text-lg font-bold">R$ 235,15</div>
                    <div className="flex items-center text-xs font-medium mt-0.5">
                      <ArrowUpRight className="h-3 w-3 text-red-500 mr-0.5" />
                      <span className="text-red-500">5.3%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
