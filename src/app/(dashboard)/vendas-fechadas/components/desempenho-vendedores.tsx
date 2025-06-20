"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Users, ChevronRight, Star, TrendingUp, LineChart, Award, Medal, Crown, Target, Activity } from "lucide-react";

interface Vendedor {
  id: string;
  nome: string;
  avatar: string;
  iniciais: string;
  totalVendas: number;
  valorTotal: number;
  ticketMedio: number;
  taxaConversao: number;
  tempoMedioFechamento: number;
  tendencia: number;
  metas: {
    atual: number;
    objetivo: number;
    projecao: number;
  };
  avaliacaoClientes: number;
  pontosFortes: string[];
}

const dadosVendedores: Vendedor[] = [
  {
    id: "v1",
    nome: "Carlos Mendes",
    avatar: "",
    iniciais: "CM",
    totalVendas: 12,
    valorTotal: 245800,
    ticketMedio: 20483,
    taxaConversao: 32,
    tempoMedioFechamento: 12,
    tendencia: 15,
    metas: {
      atual: 85,
      objetivo: 100,
      projecao: 110
    },
    avaliacaoClientes: 4.8,
    pontosFortes: ["Projetos de alto valor", "Reformas completas", "Follow-up eficiente"]
  },
  {
    id: "v2",
    nome: "Ana Costa",
    avatar: "",
    iniciais: "AC",
    totalVendas: 10,
    valorTotal: 198400,
    ticketMedio: 19840,
    taxaConversao: 28,
    tempoMedioFechamento: 14,
    tendencia: 8,
    metas: {
      atual: 75,
      objetivo: 100,
      projecao: 95
    },
    avaliacaoClientes: 4.9,
    pontosFortes: ["Atendimento personalizado", "Closets e dormitórios", "Clientes recorrentes"]
  },
  {
    id: "v3",
    nome: "Roberto Alves",
    avatar: "",
    iniciais: "RA",
    totalVendas: 8,
    valorTotal: 162500,
    ticketMedio: 20312,
    taxaConversao: 24,
    tempoMedioFechamento: 15,
    tendencia: 5,
    metas: {
      atual: 65,
      objetivo: 100,
      projecao: 90
    },
    avaliacaoClientes: 4.7,
    pontosFortes: ["Espaços corporativos", "Negociação", "Soluções técnicas"]
  },
  {
    id: "v4",
    nome: "Juliana Rodrigues",
    avatar: "",
    iniciais: "JR",
    totalVendas: 6,
    valorTotal: 142300,
    ticketMedio: 23716,
    taxaConversao: 22,
    tempoMedioFechamento: 16,
    tendencia: 12,
    metas: {
      atual: 60,
      objetivo: 100,
      projecao: 85
    },
    avaliacaoClientes: 4.6,
    pontosFortes: ["Cozinhas gourmet", "Design inovador", "Apresentações detalhadas"]
  }
];

export function DesempenhoVendedores() {
  const [isLoading, setIsLoading] = useState(true);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [insightsVendedores, setInsightsVendedores] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setTimeout(() => {
        setVendedores(dadosVendedores);
        setInsightsVendedores([
          "Carlos Mendes tem 40% mais conversão em projetos de alto valor (acima de R$35.000)",
          "Ana Costa tem a maior satisfação de clientes (4.9/5) e o menor índice de revisões de projeto",
          "Roberto Alves tem o melhor desempenho em vendas corporativas, com ticket médio 15% maior",
          "Juliana Rodrigues tem crescimento consistente e o maior ticket médio entre a equipe"
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

  // Renderiza o ícone de medalha com base na posição
  const renderPosicaoIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 1:
        return <Medal className="h-4 w-4 text-slate-400" />;
      case 2:
        return <Medal className="h-4 w-4 text-amber-700" />;
      default:
        return <Star className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-base font-medium">Desempenho de Vendedores</CardTitle>
        </div>
        <Button variant="ghost" size="sm" className="gap-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
          <span className="text-xs">Ver todos</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="pb-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center gap-3 animate-pulse">
                <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-full" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
                </div>
                <div className="h-10 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Ranking de vendedores */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center mb-2">
                <Award className="h-4 w-4 text-amber-500 mr-2" />
                Top vendedores por performance
              </h3>
              <div className="space-y-3">
                {vendedores.map((vendedor, index) => (
                  <div key={vendedor.id} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-800 shadow-sm">
                          {vendedor.avatar ? (
                            <AvatarImage src={vendedor.avatar} alt={vendedor.nome} />
                          ) : (
                            <AvatarFallback className={`${
                              index === 0 ? 'bg-amber-100 text-amber-800' :
                              index === 1 ? 'bg-slate-100 text-slate-800' :
                              index === 2 ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                            } dark:bg-slate-800 dark:text-slate-300`}>
                              {vendedor.iniciais}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="absolute -top-1 -right-1 rounded-full bg-white dark:bg-slate-800 p-0.5">
                          {renderPosicaoIcon(index)}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{vendedor.nome}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span>{vendedor.totalVendas} vendas</span>
                          <span>•</span>
                          <span>{formatCurrency(vendedor.valorTotal)}</span>
                          <div className={`flex items-center ${vendedor.tendencia > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            <TrendingUp className="h-3 w-3 mr-0.5" />
                            <span>{vendedor.tendencia}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1 mb-1">
                        <div className="text-xs font-medium">{vendedor.metas.atual}%</div>
                        <div className="text-xs text-slate-500">da meta</div>
                      </div>
                      <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            vendedor.metas.atual >= 100 ? 'bg-emerald-500' :
                            vendedor.metas.atual >= 80 ? 'bg-amber-500' :
                            'bg-blue-500'
                          }`}
                          style={{ width: `${Math.min(vendedor.metas.atual, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-1" />

            {/* Insights sobre vendedores */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center">
                <Activity className="h-4 w-4 text-indigo-500 mr-2" />
                Insights de desempenho
              </h3>
              <ul className="space-y-2">
                {insightsVendedores.map((insight, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="rounded-full p-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 mt-0.5">
                      <Target className="h-3 w-3" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Projeção para o próximo período */}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center mb-2">
                <LineChart className="h-4 w-4 text-emerald-500 mr-2" />
                Projeção para o próximo mês
              </h3>
              <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30">
                <CardContent className="p-3">
                  <p className="text-sm text-emerald-800 dark:text-emerald-300">
                    Com base no ritmo atual e na sazonalidade, a equipe deve atingir <span className="font-bold">110%</span> da meta mensal, um crescimento estimado de <span className="font-bold">8%</span> em relação ao mês atual.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
