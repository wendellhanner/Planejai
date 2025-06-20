"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BrainCircuit, LightbulbIcon, ChevronRight, TrendingUp, LineChart, BarChart4, PieChart, Lightbulb, ArrowUpRight, ArrowDownRight, ChevronsUp } from "lucide-react";

// Tipos
interface VendaFechada {
  id: string;
  cliente: string;
  projeto: string;
  valor: number;
  dataFechamento: string;
  vendedor: string;
  prazoEntrega: string;
  status: string;
  formaPagamento: string;
}

interface InsightProps {
  vendas: VendaFechada[];
}

// Componente de insights de IA
export function InsightsIA({ vendas }: InsightProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [insights, setInsights] = useState<string[]>([]);
  const [trendProductos, setTrendProductos] = useState<{produto: string, valor: number, tendencia: number}[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    // Simulação de carregamento de insights gerados por IA
    const loadInsights = async () => {
      setIsLoading(true);
      // Em um cenário real, seria uma chamada API para um modelo de IA
      setTimeout(() => {
        // Insights gerados com base nos dados de vendas
        const generatedInsights = [
          "Cozinhas representam 45% do faturamento total, um aumento de 12% em relação ao mês anterior",
          "Carlos Mendes tem a maior taxa de conversão (32%) e um ticket médio superior à média da equipe",
          "Projetos com valor acima de R$ 50.000 tem maior probabilidade de parcelamento em 10x ou mais",
          "Vendas de home office aumentaram 28% no último trimestre",
          "O tempo médio de fechamento diminuiu de 18 para 12 dias nos últimos 3 meses"
        ];

        // Tendências de produtos
        const trendingProducts = [
          { produto: "Cozinhas planejadas", valor: 185400, tendencia: 12 },
          { produto: "Home offices", valor: 87500, tendencia: 28 },
          { produto: "Closets", valor: 65200, tendencia: 5 },
          { produto: "Salas de estar", valor: 52300, tendencia: -3 },
          { produto: "Quartos planejados", valor: 42800, tendencia: 8 }
        ];

        // Recomendações baseadas em IA
        const actionRecommendations = [
          "Fortalecer a oferta de home offices com foco em funcionalidade e ergonomia",
          "Criar pacotes promocionais para cozinhas e salas integradas",
          "Ampliar o portfólio de soluções para closets de alto padrão",
          "Implementar treinamento sobre técnicas de venda de Carlos Mendes para a equipe",
          "Revisar condições de parcelamento para projetos entre R$30.000 e R$50.000"
        ];

        setInsights(generatedInsights);
        setTrendProductos(trendingProducts);
        setRecommendations(actionRecommendations);
        setIsLoading(false);
      }, 1200);
    };

    if (vendas.length > 0) {
      loadInsights();
    }
  }, [vendas]);

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
          <BrainCircuit className="h-5 w-5 text-indigo-500" />
          <CardTitle className="text-base font-medium">Insights com Inteligência Artificial</CardTitle>
        </div>
        <Button variant="ghost" size="sm" className="gap-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
          <span className="text-xs">Ver relatório completo</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="pb-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="flex items-start gap-3 animate-pulse">
                <div className="h-5 w-5 bg-slate-200 dark:bg-slate-800 rounded-full mt-0.5" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Insights principais */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center">
                <Lightbulb className="h-4 w-4 text-amber-500 mr-2" />
                Destaques e padrões identificados
              </h3>
              <ul className="space-y-2">
                {insights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="rounded-full p-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 mt-0.5">
                      <ChevronRight className="h-3 w-3" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator className="my-1" />

            {/* Tendências de produtos */}
            <div>
              <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center mb-3">
                <TrendingUp className="h-4 w-4 text-blue-500 mr-2" />
                Tendências por tipo de produto
              </h3>
              <div className="space-y-2">
                {trendProductos.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{
                        backgroundColor: index === 0 ? '#4f46e5' :
                                        index === 1 ? '#0ea5e9' :
                                        index === 2 ? '#10b981' :
                                        index === 3 ? '#f59e0b' : '#ef4444'
                      }}></div>
                      <span className="text-sm text-slate-700 dark:text-slate-300">{product.produto}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{formatCurrency(product.valor)}</span>
                      <div className={`flex items-center text-xs font-medium ${product.tendencia > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {product.tendencia > 0 ? (
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(product.tendencia)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-1" />

            {/* Recomendações */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center">
                <LineChart className="h-4 w-4 text-emerald-500 mr-2" />
                Recomendações estratégicas
              </h3>
              <ul className="space-y-2">
                {recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="rounded-full p-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 mt-0.5">
                      <ChevronsUp className="h-3 w-3" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Call to action para insights mais detalhados */}
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm" className="text-xs gap-1">
                <BrainCircuit className="h-3 w-3" />
                Gerar mais insights
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
