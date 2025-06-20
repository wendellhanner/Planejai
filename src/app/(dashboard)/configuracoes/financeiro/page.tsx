"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Save,
  DollarSign,
  BarChart4,
  Target,
  ArrowUp,
  Clock,
  Calendar,
  Percent,
  Loader2,
  LucideImagePlus,
  BadgePercent,
  CircleDollarSign,
  Calculator,
  LineChart,
  Wallet,
} from "lucide-react";

export default function FinanceiroConfigPage() {
  const [isLoading, setIsLoading] = useState(false);

  // Dados de metas
  const [metaMensal, setMetaMensal] = useState("3000000");
  const [metaAnual, setMetaAnual] = useState("36000000");
  const [metaEquipe, setMetaEquipe] = useState({
    "vendas": "2400000",
    "producao": "2800000",
    "design": "1600000",
    "montagem": "2200000",
  });

  const [mesSelecionado, setMesSelecionado] = useState("maio");
  const [anoSelecionado, setAnoSelecionado] = useState("2025");

  // Configurações financeiras
  const [moeda, setMoeda] = useState("BRL");
  const [prazoMaximo, setPrazoMaximo] = useState("12");
  const [descontoMaximo, setDescontoMaximo] = useState("10");
  const [taxaJuros, setTaxaJuros] = useState("1.99");
  const [comissaoBase, setComissaoBase] = useState("2");
  const [comissaoPremium, setComissaoPremium] = useState("3.5");

  // Dados de margens
  const [margens, setMargens] = useState({
    "cozinhas": "42",
    "dormitorios": "38",
    "home_office": "45",
    "salas": "40",
    "outros": "35",
  });

  // Configurações de relatórios financeiros
  const [relatorioAutomatico, setRelatorioAutomatico] = useState(true);
  const [alertaMetasBaixas, setAlertaMetasBaixas] = useState(true);
  const [limiteAlertaMeta, setLimiteAlertaMeta] = useState("80");

  const handleSalvarMetas = () => {
    setIsLoading(true);

    // Simulando chamada de API para salvar as metas
    setTimeout(() => {
      toast.success("Metas de vendas atualizadas com sucesso!");
      setIsLoading(false);
    }, 800);
  };

  const handleSalvarFinanceiro = () => {
    setIsLoading(true);

    // Simulando chamada de API para salvar as configurações financeiras
    setTimeout(() => {
      toast.success("Configurações financeiras atualizadas com sucesso!");
      setIsLoading(false);
    }, 800);
  };

  const handleSalvarMargens = () => {
    setIsLoading(true);

    // Simulando chamada de API para salvar as margens
    setTimeout(() => {
      toast.success("Margens de produtos atualizadas com sucesso!");
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Configurações Financeiras</h1>
        <p className="text-slate-500">
          Configure parâmetros financeiros, metas de vendas e margens de produtos
        </p>
      </div>

      <Tabs defaultValue="metas" className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metas" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span>Metas de Vendas</span>
          </TabsTrigger>
          <TabsTrigger value="financeiro" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>Parâmetros Financeiros</span>
          </TabsTrigger>
          <TabsTrigger value="margens" className="flex items-center gap-2">
            <Percent className="h-4 w-4" />
            <span>Margens e Precificação</span>
          </TabsTrigger>
        </TabsList>

        {/* Aba de Metas de Vendas */}
        <TabsContent value="metas" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                Configuração de Metas de Vendas
              </CardTitle>
              <CardDescription>
                Defina as metas de vendas para sua empresa e equipes
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <Select value={mesSelecionado} onValueChange={setMesSelecionado}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecione o mês" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="janeiro">Janeiro</SelectItem>
                    <SelectItem value="fevereiro">Fevereiro</SelectItem>
                    <SelectItem value="marco">Março</SelectItem>
                    <SelectItem value="abril">Abril</SelectItem>
                    <SelectItem value="maio">Maio</SelectItem>
                    <SelectItem value="junho">Junho</SelectItem>
                    <SelectItem value="julho">Julho</SelectItem>
                    <SelectItem value="agosto">Agosto</SelectItem>
                    <SelectItem value="setembro">Setembro</SelectItem>
                    <SelectItem value="outubro">Outubro</SelectItem>
                    <SelectItem value="novembro">Novembro</SelectItem>
                    <SelectItem value="dezembro">Dezembro</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={anoSelecionado} onValueChange={setAnoSelecionado}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                  </SelectContent>
                </Select>

                <div className="p-2 px-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-md border border-purple-100 dark:border-purple-800">
                  Configurando metas para: {mesSelecionado.charAt(0).toUpperCase() + mesSelecionado.slice(1)}/{anoSelecionado}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Metas Gerais</h3>

                  <div className="space-y-2">
                    <Label htmlFor="meta_mensal">Meta Mensal de Vendas (R$)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="meta_mensal"
                        className="pl-9"
                        value={metaMensal}
                        onChange={(e) => setMetaMensal(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meta_anual">Meta Anual de Vendas (R$)</Label>
                    <div className="relative">
                      <BarChart4 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="meta_anual"
                        className="pl-9"
                        value={metaAnual}
                        onChange={(e) => setMetaAnual(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="alert_metas">Alertas de metas não alcançadas</Label>
                      <Switch
                        id="alert_metas"
                        checked={alertaMetasBaixas}
                        onCheckedChange={setAlertaMetasBaixas}
                      />
                    </div>
                    <p className="text-xs text-slate-500">
                      Enviar alertas quando o percentual da meta estiver abaixo do limite
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="limite_alerta">Limite para alerta de meta (%)</Label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="limite_alerta"
                        className="pl-9"
                        value={limiteAlertaMeta}
                        onChange={(e) => setLimiteAlertaMeta(e.target.value)}
                        disabled={!alertaMetasBaixas}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Metas por Equipe</h3>

                  <div className="space-y-2">
                    <Label htmlFor="meta_vendas">Equipe de Vendas (R$)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="meta_vendas"
                        className="pl-9"
                        value={metaEquipe.vendas}
                        onChange={(e) => setMetaEquipe({...metaEquipe, vendas: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meta_producao">Equipe de Produção (R$)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="meta_producao"
                        className="pl-9"
                        value={metaEquipe.producao}
                        onChange={(e) => setMetaEquipe({...metaEquipe, producao: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meta_design">Equipe de Design (R$)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="meta_design"
                        className="pl-9"
                        value={metaEquipe.design}
                        onChange={(e) => setMetaEquipe({...metaEquipe, design: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meta_montagem">Equipe de Montagem (R$)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="meta_montagem"
                        className="pl-9"
                        value={metaEquipe.montagem}
                        onChange={(e) => setMetaEquipe({...metaEquipe, montagem: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t pt-5 mt-4">
              <Button
                onClick={handleSalvarMetas}
                disabled={isLoading}
                className="w-full md:w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Metas de Vendas
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Aba de Parâmetros Financeiros */}
        <TabsContent value="financeiro" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CircleDollarSign className="h-5 w-5 text-green-600" />
                Parâmetros Financeiros
              </CardTitle>
              <CardDescription>
                Configure os parâmetros financeiros para propostas e vendas
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Configurações Gerais</h3>

                  <div className="space-y-2">
                    <Label htmlFor="moeda">Moeda</Label>
                    <Select value={moeda} onValueChange={setMoeda}>
                      <SelectTrigger id="moeda">
                        <SelectValue placeholder="Selecione a moeda" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BRL">Real Brasileiro (R$)</SelectItem>
                        <SelectItem value="USD">Dólar Americano ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rel_automatico">Relatórios Financeiros Automáticos</Label>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="rel_automatico"
                        checked={relatorioAutomatico}
                        onCheckedChange={setRelatorioAutomatico}
                      />
                      <span className="text-sm text-slate-500">
                        {relatorioAutomatico ? "Ativado" : "Desativado"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="juros">Taxa de Juros de Financiamento (%)</Label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="juros"
                        className="pl-9"
                        value={taxaJuros}
                        onChange={(e) => setTaxaJuros(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Limites e Comissões</h3>

                  <div className="space-y-2">
                    <Label htmlFor="prazo_max">Prazo Máximo de Parcelamento (meses)</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="prazo_max"
                        className="pl-9"
                        value={prazoMaximo}
                        onChange={(e) => setPrazoMaximo(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="desconto_max">Desconto Máximo Permitido (%)</Label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="desconto_max"
                        className="pl-9"
                        value={descontoMaximo}
                        onChange={(e) => setDescontoMaximo(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comissao_base">Comissão Base (%)</Label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="comissao_base"
                        className="pl-9"
                        value={comissaoBase}
                        onChange={(e) => setComissaoBase(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comissao_premium">Comissão para Vendas Premium (%)</Label>
                    <div className="relative">
                      <BadgePercent className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="comissao_premium"
                        className="pl-9"
                        value={comissaoPremium}
                        onChange={(e) => setComissaoPremium(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t pt-5 mt-4">
              <Button
                onClick={handleSalvarFinanceiro}
                disabled={isLoading}
                className="w-full md:w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Parâmetros Financeiros
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Aba de Margens e Precificação */}
        <TabsContent value="margens" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-600" />
                Margens e Precificação
              </CardTitle>
              <CardDescription>
                Configure as margens de lucro por tipo de produto
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
                <div className="space-y-2">
                  <Label htmlFor="margem_cozinhas">Margem para Cozinhas (%)</Label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="margem_cozinhas"
                      className="pl-9"
                      value={margens.cozinhas}
                      onChange={(e) => setMargens({...margens, cozinhas: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="margem_dormitorios">Margem para Dormitórios (%)</Label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="margem_dormitorios"
                      className="pl-9"
                      value={margens.dormitorios}
                      onChange={(e) => setMargens({...margens, dormitorios: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="margem_home_office">Margem para Home Office (%)</Label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="margem_home_office"
                      className="pl-9"
                      value={margens.home_office}
                      onChange={(e) => setMargens({...margens, home_office: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="margem_salas">Margem para Salas (%)</Label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="margem_salas"
                      className="pl-9"
                      value={margens.salas}
                      onChange={(e) => setMargens({...margens, salas: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="margem_outros">Margem para Outros Produtos (%)</Label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="margem_outros"
                      className="pl-9"
                      value={margens.outros}
                      onChange={(e) => setMargens({...margens, outros: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 space-y-2">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 flex items-center gap-2">
                  <LineChart className="h-4 w-4" />
                  Análise de Desempenho de Margens
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  A equipe de vendas está alcançando margens médias de 41% nos últimos 3 meses, acima da meta de 38%.
                </p>
                <div className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                  <span className="font-medium">Produtos de maior rentabilidade:</span>
                  <ul className="list-disc list-inside mt-1 text-sm">
                    <li>Cozinhas planejadas premium (margem média: 46%)</li>
                    <li>Home office completo (margem média: 44%)</li>
                    <li>Dormitórios com closet (margem média: 42%)</li>
                  </ul>
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t pt-5 mt-4">
              <Button
                onClick={handleSalvarMargens}
                disabled={isLoading}
                className="w-full md:w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Margens
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
