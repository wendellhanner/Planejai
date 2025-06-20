"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  Star,
  Check,
  Zap,
  Shield,
  Users,
  Database,
  Headphones
} from "lucide-react";

export default function FaturamentoPage() {
  const planoAtual = {
    nome: "Plano PRO",
    preco: "R$ 299,90",
    periodo: "mensal",
    status: "ativo",
    proximaCobranca: "15/06/2025",
    metodoPagamento: "Cartão •••• 4532"
  };

  const faturas = [
    { id: "1", data: "15/05/2025", valor: "R$ 299,90", status: "pago", descricao: "Plano PRO - Maio 2025" },
    { id: "2", data: "15/04/2025", valor: "R$ 299,90", status: "pago", descricao: "Plano PRO - Abril 2025" },
    { id: "3", data: "15/03/2025", valor: "R$ 299,90", status: "pago", descricao: "Plano PRO - Março 2025" },
    { id: "4", data: "15/02/2025", valor: "R$ 299,90", status: "pago", descricao: "Plano PRO - Fevereiro 2025" },
    { id: "5", data: "15/01/2025", valor: "R$ 299,90", status: "pago", descricao: "Plano PRO - Janeiro 2025" }
  ];

  const planos = [
    {
      nome: "Básico",
      preco: "R$ 99,90",
      periodo: "mensal",
      descricao: "Ideal para pequenas empresas",
      recursos: [
        "Até 50 clientes",
        "5 usuários",
        "10GB de armazenamento",
        "Suporte por email",
        "Relatórios básicos"
      ],
      popular: false
    },
    {
      nome: "PRO",
      preco: "R$ 299,90",
      periodo: "mensal",
      descricao: "Para empresas em crescimento",
      recursos: [
        "Clientes ilimitados",
        "20 usuários",
        "100GB de armazenamento",
        "Suporte prioritário",
        "Relatórios avançados",
        "Integração WhatsApp",
        "IA Assistant"
      ],
      popular: true
    },
    {
      nome: "Enterprise",
      preco: "R$ 599,90",
      periodo: "mensal",
      descricao: "Para grandes empresas",
      recursos: [
        "Tudo do PRO",
        "Usuários ilimitados",
        "500GB de armazenamento",
        "Suporte 24/7",
        "API customizada",
        "Manager dedicado",
        "Treinamento incluso"
      ],
      popular: false
    }
  ];

  const estatisticas = [
    { label: "Valor Total Gasto", valor: "R$ 1.499,50", icone: DollarSign, cor: "text-green-600" },
    { label: "Faturas Pagas", valor: "5", icone: Check, cor: "text-blue-600" },
    { label: "Economia anual", valor: "R$ 720,00", icone: TrendingUp, cor: "text-purple-600" },
    { label: "Dias de uso", valor: "150", icone: Calendar, cor: "text-amber-600" }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header da página */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Faturamento</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Gerencie seu plano, faturas e métodos de pagamento
          </p>
        </div>
      </div>

      {/* Estatísticas */}
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

      <Tabs defaultValue="plano" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="plano">Plano Atual</TabsTrigger>
          <TabsTrigger value="faturas">Histórico de Faturas</TabsTrigger>
          <TabsTrigger value="planos">Alterar Plano</TabsTrigger>
        </TabsList>

        <TabsContent value="plano" className="space-y-6">
          {/* Plano atual */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    {planoAtual.nome}
                  </CardTitle>
                  <CardDescription>Seu plano ativo no momento</CardDescription>
                </div>
                <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                  Ativo
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Preço</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {planoAtual.preco}<span className="text-base font-normal text-slate-500">/{planoAtual.periodo}</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Próxima cobrança</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {planoAtual.proximaCobranca}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Método de pagamento</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    {planoAtual.metodoPagamento}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex gap-3">
                <Button variant="outline">
                  Alterar Método de Pagamento
                </Button>
                <Button variant="outline">
                  Cancelar Plano
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faturas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Faturas</CardTitle>
              <CardDescription>
                Visualize e baixe suas faturas anteriores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faturas.map((fatura) => (
                  <div key={fatura.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {fatura.descricao}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {fatura.data}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {fatura.valor}
                        </p>
                        <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                          {fatura.status}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planos" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {planos.map((plano, index) => (
              <Card key={index} className={`relative ${plano.popular ? 'border-blue-500 shadow-lg' : ''}`}>
                {plano.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white">
                      Mais Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {plano.nome === "Básico" && <Database className="h-5 w-5 text-green-600" />}
                    {plano.nome === "PRO" && <Zap className="h-5 w-5 text-blue-600" />}
                    {plano.nome === "Enterprise" && <Shield className="h-5 w-5 text-purple-600" />}
                    {plano.nome}
                  </CardTitle>
                  <CardDescription>{plano.descricao}</CardDescription>
                  <div className="pt-2">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">
                      {plano.preco}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">/{plano.periodo}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plano.recursos.map((recurso, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {recurso}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plano.nome === "PRO" ? "outline" : "default"}
                    disabled={plano.nome === "PRO"}
                  >
                    {plano.nome === "PRO" ? "Plano Atual" : "Alterar para este plano"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
