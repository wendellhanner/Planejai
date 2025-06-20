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
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Save,
  Image,
  Paintbrush,
  Palette,
  Sun,
  Moon,
  Monitor,
  Layout,
  AlignLeft,
  Smartphone,
  Loader2,
  Upload,
  Check,
  RefreshCw,
  CheckCircle,
  Laptop,
  LucideImagePlus
} from "lucide-react";

export default function AparenciaConfigPage() {
  const [isLoading, setIsLoading] = useState(false);

  // Tema e cores
  const [temaAtual, setTemaAtual] = useState("sistema");
  const [corPrimaria, setCorPrimaria] = useState("#3366FF");
  const [corSecundaria, setCorSecundaria] = useState("#9333EA");
  const [corTexto, setCorTexto] = useState("#1E293B");
  const [corFundo, setCorFundo] = useState("#FFFFFF");

  // Layout
  const [visualizacaoMenu, setVisualizacaoMenu] = useState("expandido");
  const [posicaoMenu, setPosicaoMenu] = useState("lateral");
  const [tamanhoFonte, setTamanhoFonte] = useState("medio");
  const [modoDensidade, setModoDensidade] = useState("normal");

  // Personalização
  const [ocultarLogo, setOcultarLogo] = useState(false);
  const [nomeEmpresa, setNomeEmpresa] = useState("Planej.AI");
  const [mostrarNotificacoes, setMostrarNotificacoes] = useState(true);
  const [animacoesAtivadas, setAnimacoesAtivadas] = useState(true);

  // Paletas de cores pré-definidas
  const paletas = [
    { nome: "Azul Corporativo", primaria: "#1E40AF", secundaria: "#3B82F6", texto: "#1E293B", fundo: "#FFFFFF" },
    { nome: "Verde Natureza", primaria: "#047857", secundaria: "#10B981", texto: "#1E293B", fundo: "#F5F7FA" },
    { nome: "Roxo Elegante", primaria: "#6D28D9", secundaria: "#8B5CF6", texto: "#1E293B", fundo: "#FFFFFF" },
    { nome: "Vermelho Energia", primaria: "#B91C1C", secundaria: "#EF4444", texto: "#1E293B", fundo: "#FFFFFF" },
    { nome: "Azul Escuro", primaria: "#1E3A8A", secundaria: "#3B82F6", texto: "#FFFFFF", fundo: "#0F172A" },
    { nome: "Verde Escuro", primaria: "#064E3B", secundaria: "#059669", texto: "#FFFFFF", fundo: "#0F172A" },
  ];

  const aplicarPaleta = (paleta) => {
    setCorPrimaria(paleta.primaria);
    setCorSecundaria(paleta.secundaria);
    setCorTexto(paleta.texto);
    setCorFundo(paleta.fundo);
    toast.success(`Paleta "${paleta.nome}" aplicada`);
  };

  const handleSalvarTema = () => {
    setIsLoading(true);

    // Simulando chamada de API para salvar o tema
    setTimeout(() => {
      toast.success("Tema e cores atualizados com sucesso!");
      setIsLoading(false);
    }, 800);
  };

  const handleSalvarLayout = () => {
    setIsLoading(true);

    // Simulando chamada de API para salvar o layout
    setTimeout(() => {
      toast.success("Configurações de layout atualizadas com sucesso!");
      setIsLoading(false);
    }, 800);
  };

  const handleSalvarPersonalizacao = () => {
    setIsLoading(true);

    // Simulando chamada de API para salvar a personalização
    setTimeout(() => {
      toast.success("Personalização salva com sucesso!");
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Aparência e Tema</h1>
        <p className="text-slate-500">
          Personalize o visual do sistema de acordo com sua marca e preferências
        </p>
      </div>

      <Tabs defaultValue="tema" className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tema" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span>Tema e Cores</span>
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            <span>Layout e Visualização</span>
          </TabsTrigger>
          <TabsTrigger value="personalizacao" className="flex items-center gap-2">
            <Paintbrush className="h-4 w-4" />
            <span>Personalização</span>
          </TabsTrigger>
        </TabsList>

        {/* Aba de Tema e Cores */}
        <TabsContent value="tema" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-blue-600" />
                Configuração de Tema e Cores
              </CardTitle>
              <CardDescription>
                Escolha o tema e as cores que melhor representam sua marca
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Modo do Tema</h3>

                <div className="grid grid-cols-3 gap-4">
                  <div
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border ${temaAtual === 'claro' ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700'} cursor-pointer`}
                    onClick={() => setTemaAtual('claro')}
                  >
                    <Sun className="h-10 w-10 text-amber-500" />
                    <span className="font-medium">Claro</span>
                    {temaAtual === 'claro' && (
                      <CheckCircle className="h-5 w-5 text-green-500 absolute top-2 right-2" />
                    )}
                  </div>

                  <div
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border ${temaAtual === 'escuro' ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700'} cursor-pointer`}
                    onClick={() => setTemaAtual('escuro')}
                  >
                    <Moon className="h-10 w-10 text-indigo-500" />
                    <span className="font-medium">Escuro</span>
                    {temaAtual === 'escuro' && (
                      <CheckCircle className="h-5 w-5 text-green-500 absolute top-2 right-2" />
                    )}
                  </div>

                  <div
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border ${temaAtual === 'sistema' ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700'} cursor-pointer`}
                    onClick={() => setTemaAtual('sistema')}
                  >
                    <Monitor className="h-10 w-10 text-slate-500" />
                    <span className="font-medium">Sistema</span>
                    {temaAtual === 'sistema' && (
                      <CheckCircle className="h-5 w-5 text-green-500 absolute top-2 right-2" />
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Cores Personalizadas</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="cor_primaria" className="flex items-center gap-2">
                        Cor Primária
                        <div
                          className="h-4 w-4 rounded-full border border-slate-300"
                          style={{ backgroundColor: corPrimaria }}
                        ></div>
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="cor_primaria"
                          value={corPrimaria}
                          onChange={(e) => setCorPrimaria(e.target.value)}
                        />
                        <input
                          type="color"
                          value={corPrimaria}
                          onChange={(e) => setCorPrimaria(e.target.value)}
                          className="h-9 w-10 rounded cursor-pointer border border-slate-300 p-0"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cor_secundaria" className="flex items-center gap-2">
                        Cor Secundária
                        <div
                          className="h-4 w-4 rounded-full border border-slate-300"
                          style={{ backgroundColor: corSecundaria }}
                        ></div>
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="cor_secundaria"
                          value={corSecundaria}
                          onChange={(e) => setCorSecundaria(e.target.value)}
                        />
                        <input
                          type="color"
                          value={corSecundaria}
                          onChange={(e) => setCorSecundaria(e.target.value)}
                          className="h-9 w-10 rounded cursor-pointer border border-slate-300 p-0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="cor_texto" className="flex items-center gap-2">
                        Cor do Texto
                        <div
                          className="h-4 w-4 rounded-full border border-slate-300"
                          style={{ backgroundColor: corTexto }}
                        ></div>
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="cor_texto"
                          value={corTexto}
                          onChange={(e) => setCorTexto(e.target.value)}
                        />
                        <input
                          type="color"
                          value={corTexto}
                          onChange={(e) => setCorTexto(e.target.value)}
                          className="h-9 w-10 rounded cursor-pointer border border-slate-300 p-0"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cor_fundo" className="flex items-center gap-2">
                        Cor de Fundo
                        <div
                          className="h-4 w-4 rounded-full border border-slate-300"
                          style={{ backgroundColor: corFundo }}
                        ></div>
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="cor_fundo"
                          value={corFundo}
                          onChange={(e) => setCorFundo(e.target.value)}
                        />
                        <input
                          type="color"
                          value={corFundo}
                          onChange={(e) => setCorFundo(e.target.value)}
                          className="h-9 w-10 rounded cursor-pointer border border-slate-300 p-0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Paletas Pré-definidas</h3>
                <ScrollArea className="h-[120px] rounded-md border p-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {paletas.map((paleta, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-2 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                        onClick={() => aplicarPaleta(paleta)}
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex gap-1">
                            <div className="h-4 w-10 rounded" style={{ backgroundColor: paleta.primaria }}></div>
                            <div className="h-4 w-10 rounded" style={{ backgroundColor: paleta.secundaria }}></div>
                          </div>
                          <div className="h-2 w-20 rounded-sm" style={{ backgroundColor: paleta.texto }}></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{paleta.nome}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div className="mt-2 p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <h3 className="font-medium">Pré-visualização</h3>
                <div
                  className="mt-2 rounded-lg p-4 flex flex-col gap-2 border"
                  style={{
                    backgroundColor: corFundo,
                    color: corTexto
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-md" style={{ backgroundColor: corPrimaria }}></div>
                    <span className="font-bold text-lg">Planej.AI</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div
                      className="px-3 py-1.5 rounded-md font-medium text-white text-sm"
                      style={{ backgroundColor: corPrimaria }}
                    >
                      Botão Primário
                    </div>
                    <div
                      className="px-3 py-1.5 rounded-md font-medium text-white text-sm"
                      style={{ backgroundColor: corSecundaria }}
                    >
                      Botão Secundário
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t pt-5 mt-4">
              <Button
                onClick={handleSalvarTema}
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
                    Salvar Tema e Cores
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Aba de Layout e Visualização */}
        <TabsContent value="layout" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5 text-purple-600" />
                Layout e Visualização
              </CardTitle>
              <CardDescription>
                Configure como o sistema será exibido e organizado para os usuários
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Menu e Navegação</h3>

                  <div className="space-y-2">
                    <Label htmlFor="visualizacao_menu">Visualização do Menu</Label>
                    <Select value={visualizacaoMenu} onValueChange={setVisualizacaoMenu}>
                      <SelectTrigger id="visualizacao_menu">
                        <SelectValue placeholder="Selecione o tipo de visualização" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="expandido">Expandido</SelectItem>
                        <SelectItem value="compacto">Compacto</SelectItem>
                        <SelectItem value="icones">Apenas Ícones</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="posicao_menu">Posição do Menu</Label>
                    <Select value={posicaoMenu} onValueChange={setPosicaoMenu}>
                      <SelectTrigger id="posicao_menu">
                        <SelectValue placeholder="Selecione a posição do menu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lateral">Lateral</SelectItem>
                        <SelectItem value="superior">Superior</SelectItem>
                        <SelectItem value="hibrido">Híbrido (adaptável)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="animacoes">Animações de Interface</Label>
                    <Switch
                      id="animacoes"
                      checked={animacoesAtivadas}
                      onCheckedChange={setAnimacoesAtivadas}
                    />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="notificacoes" className="block">Notificações do Sistema</Label>
                      <p className="text-xs text-slate-500 mt-1">Exibe notificações de eventos e atualizações</p>
                    </div>
                    <Switch
                      id="notificacoes"
                      checked={mostrarNotificacoes}
                      onCheckedChange={setMostrarNotificacoes}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Densidade e Formatação</h3>

                  <div className="space-y-2">
                    <Label htmlFor="tamanho_fonte">Tamanho da Fonte</Label>
                    <Select value={tamanhoFonte} onValueChange={setTamanhoFonte}>
                      <SelectTrigger id="tamanho_fonte">
                        <SelectValue placeholder="Selecione o tamanho da fonte" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pequeno">Pequeno</SelectItem>
                        <SelectItem value="medio">Médio (Padrão)</SelectItem>
                        <SelectItem value="grande">Grande</SelectItem>
                        <SelectItem value="muito_grande">Muito Grande</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modo_densidade">Densidade de Informações</Label>
                    <Select value={modoDensidade} onValueChange={setModoDensidade}>
                      <SelectTrigger id="modo_densidade">
                        <SelectValue placeholder="Selecione a densidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compacto">Compacto (mais itens por tela)</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="confortavel">Confortável (menos itens por tela)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
                    <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300 flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      Visualização em Dispositivos Móveis
                    </h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      As configurações de layout serão adaptadas automaticamente em dispositivos móveis para garantir a melhor experiência.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <h3 className="font-medium mb-3">Pré-visualização do Layout</h3>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-blue-500 text-white p-2 text-sm font-medium">Barra de Navegação</div>
                  <div className="flex">
                    {posicaoMenu === 'lateral' && (
                      <div
                        className="w-1/4 min-h-[180px] bg-slate-100 dark:bg-slate-700 border-r border-slate-300 dark:border-slate-600 p-2"
                      >
                        {visualizacaoMenu === 'expandido' && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                              <div className="h-3 w-20 bg-slate-300 dark:bg-slate-500 rounded"></div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 rounded-full bg-slate-400"></div>
                              <div className="h-3 w-16 bg-slate-300 dark:bg-slate-500 rounded"></div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 rounded-full bg-slate-400"></div>
                              <div className="h-3 w-24 bg-slate-300 dark:bg-slate-500 rounded"></div>
                            </div>
                          </div>
                        )}

                        {visualizacaoMenu === 'icones' && (
                          <div className="flex flex-col items-center space-y-3 pt-2">
                            <div className="h-6 w-6 rounded-full bg-blue-500"></div>
                            <div className="h-6 w-6 rounded-full bg-slate-400"></div>
                            <div className="h-6 w-6 rounded-full bg-slate-400"></div>
                          </div>
                        )}

                        {visualizacaoMenu === 'compacto' && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-1">
                              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                              <div className="h-2 w-12 bg-slate-300 dark:bg-slate-500 rounded"></div>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="h-3 w-3 rounded-full bg-slate-400"></div>
                              <div className="h-2 w-10 bg-slate-300 dark:bg-slate-500 rounded"></div>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="h-3 w-3 rounded-full bg-slate-400"></div>
                              <div className="h-2 w-14 bg-slate-300 dark:bg-slate-500 rounded"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className={`${posicaoMenu === 'lateral' ? 'w-3/4' : 'w-full'} min-h-[180px] bg-white dark:bg-slate-800 p-3`}>
                      {posicaoMenu === 'superior' && (
                        <div className="flex items-center gap-4 pb-2 mb-2 border-b border-slate-200 dark:border-slate-700">
                          <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                          <div className="h-4 w-4 rounded-full bg-slate-400"></div>
                          <div className="h-4 w-4 rounded-full bg-slate-400"></div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        <div className="h-20 bg-slate-100 dark:bg-slate-700 rounded"></div>
                        <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t pt-5 mt-4">
              <Button
                onClick={handleSalvarLayout}
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
                    Salvar Layout
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Aba de Personalização */}
        <TabsContent value="personalizacao" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Paintbrush className="h-5 w-5 text-green-600" />
                Personalização
              </CardTitle>
              <CardDescription>
                Personalize elementos de marca e identidade visual
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Logo e Identidade</h3>

                    <div className="border rounded-lg p-4 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800">
                      <div className="h-24 w-24 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-2xl">
                        P.AI
                      </div>
                      <div className="mt-4 space-y-3 w-full">
                        <Button className="w-full">
                          <Upload className="mr-2 h-4 w-4" />
                          Enviar Novo Logo
                        </Button>
                        <Button variant="outline" className="w-full">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Restaurar Padrão
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nome_empresa">Nome da Empresa</Label>
                      <Input
                        id="nome_empresa"
                        value={nomeEmpresa}
                        onChange={(e) => setNomeEmpresa(e.target.value)}
                        placeholder="Nome exibido no sistema"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="ocultar_logo" className="cursor-pointer">Ocultar Logo</Label>
                        <Switch
                          id="ocultar_logo"
                          checked={ocultarLogo}
                          onCheckedChange={setOcultarLogo}
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        Se ativado, apenas o nome da empresa será exibido
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Elementos de Interface</h3>

                    <div className="space-y-4">
                      <div className="rounded-lg border p-4">
                        <h4 className="text-sm font-medium">Favicon do Sistema</h4>
                        <p className="text-xs text-slate-500 mb-3">
                          Ícone exibido na aba do navegador
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="h-10 w-10 bg-blue-500 rounded-md flex items-center justify-center text-white font-bold">
                            P
                          </div>
                          <Button size="sm">
                            <Upload className="mr-2 h-3 w-3" />
                            Alterar
                          </Button>
                        </div>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h4 className="text-sm font-medium">Email e Documentos</h4>
                        <p className="text-xs text-slate-500 mb-3">
                          Personalização utilizada em documentos e emails enviados
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-blue-500 rounded-md"></div>
                            <span className="text-sm font-medium">{nomeEmpresa}</span>
                          </div>
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="backgrounds_personalizados" className="cursor-pointer">Imagens de fundo personalizadas</Label>
                          <Switch id="backgrounds_personalizados" />
                        </div>
                        <p className="text-xs text-slate-500">
                          Permite carregar imagens de fundo para o painel
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-100 dark:border-green-800">
                <h3 className="font-medium text-green-800 dark:text-green-300 flex items-center gap-2">
                  <Laptop className="h-4 w-4" />
                  Visualização Multi-dispositivo
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Suas personalizações serão aplicadas em todos os dispositivos e plataformas de acesso.
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center">
                    <Monitor className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-xs ml-1">Desktop</span>
                  </div>
                  <div className="flex items-center">
                    <Laptop className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-xs ml-1">Laptop</span>
                  </div>
                  <div className="flex items-center">
                    <Smartphone className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-xs ml-1">Mobile</span>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t pt-5 mt-4">
              <Button
                onClick={handleSalvarPersonalizacao}
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
                    Salvar Personalização
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
