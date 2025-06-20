"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Download,
  Search,
  Plus,
  FileCode,
  CheckSquare,
  PenLine,
  Share2,
  Filter,
  Clock,
  Users,
  CalendarClock,
  BarChart4,
  Layers,
  Calendar,
  ChevronRight,
  ClipboardCheck,
  LayoutPanelLeft,
} from "lucide-react";

// Dados simulados para projetos executivos
const projetos = [
  {
    id: "PE-2025-001",
    cliente: "João Silva",
    tipo: "Cozinha + Sala",
    status: "Em desenvolvimento",
    responsavel: "André Santos",
    designer: "Marina Costa",
    prazoDesenvolvimento: "25/05/2025",
    prioridade: "Alta",
    vendaId: "VF-2025-001",
    aprovado: false,
    detalhes: "Necessita aprovação do cliente para revestimentos"
  },
  {
    id: "PE-2025-002",
    cliente: "Maria Oliveira",
    tipo: "Closet Master",
    status: "Aprovado",
    responsavel: "Juliana Mendes",
    designer: "Roberto Almeida",
    prazoDesenvolvimento: "22/05/2025",
    prioridade: "Média",
    vendaId: "VF-2025-002",
    aprovado: true,
    detalhes: "Aprovado em 12/05/2025 - Pronto para produção"
  },
  {
    id: "PE-2025-003",
    cliente: "Pedro Santos",
    tipo: "Home Office Completo",
    status: "Em produção",
    responsavel: "André Santos",
    designer: "Carla Ferreira",
    prazoDesenvolvimento: "15/05/2025",
    prioridade: "Alta",
    vendaId: "VF-2025-003",
    aprovado: true,
    detalhes: "Em produção desde 16/05/2025"
  },
  {
    id: "PE-2025-004",
    cliente: "Fernanda Lima",
    tipo: "Cozinha Planejada",
    status: "Em desenvolvimento",
    responsavel: "Ricardo Alves",
    designer: "Marina Costa",
    prazoDesenvolvimento: "27/05/2025",
    prioridade: "Média",
    vendaId: "VF-2025-004",
    aprovado: false,
    detalhes: "Aguardando definição de cores e puxadores"
  },
  {
    id: "PE-2025-005",
    cliente: "Lucas Mendes",
    tipo: "Quarto Casal Completo",
    status: "Aprovado",
    responsavel: "Juliana Mendes",
    designer: "Roberto Almeida",
    prazoDesenvolvimento: "19/05/2025",
    prioridade: "Alta",
    vendaId: "VF-2025-005",
    aprovado: true,
    detalhes: "Materiais já separados para produção"
  },
  {
    id: "PE-2025-006",
    cliente: "Camila Ferreira",
    tipo: "Móveis para Escritório",
    status: "Concluído",
    responsavel: "Ricardo Alves",
    designer: "Thiago Mendonça",
    prazoDesenvolvimento: "10/05/2025",
    prioridade: "Concluído",
    vendaId: "VF-2025-006",
    aprovado: true,
    detalhes: "Arquivos enviados para produção em 12/05/2025"
  },
  {
    id: "PE-2025-007",
    cliente: "Thiago Costa",
    tipo: "Móveis para Apartamento",
    status: "Concluído",
    responsavel: "André Santos",
    designer: "Carla Ferreira",
    prazoDesenvolvimento: "05/05/2025",
    prioridade: "Concluído",
    vendaId: "VF-2025-007",
    aprovado: true,
    detalhes: "Projeto enviado para produção"
  },
  {
    id: "PE-2025-008",
    cliente: "Juliana Almeida",
    tipo: "Sala de Estar e Jantar",
    status: "Aprovado",
    responsavel: "Juliana Mendes",
    designer: "Thiago Mendonça",
    prazoDesenvolvimento: "01/06/2025",
    prioridade: "Baixa",
    vendaId: "VF-2025-008",
    aprovado: true,
    detalhes: "Aguardando agendamento de produção"
  },
];

// Componente de estatísticas
function StatCard({ title, value, icon, color }: {
  title: string,
  value: string,
  icon: React.ReactNode,
  color: string
}) {
  return (
    <div className={`bg-${color}-50 dark:bg-${color}-900/20 rounded-lg p-4 flex items-center gap-4 border border-${color}-100 dark:border-${color}-800`}>
      <div className={`p-3 rounded-lg bg-${color}-100 dark:bg-${color}-900/30 text-${color}-500 dark:text-${color}-400`}>
        {icon}
      </div>
      <div>
        <p className={`text-sm font-medium text-${color}-600 dark:text-${color}-400`}>{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

export default function ProjetoExecutivoPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("todos");

  // Filtrar projetos baseado na pesquisa e tab ativa
  const filteredProjetos = projetos.filter(projeto => {
    const matchesSearch = projeto.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         projeto.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         projeto.tipo.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "todos") return matchesSearch;
    if (activeTab === "desenvolvimento") return matchesSearch && projeto.status === "Em desenvolvimento";
    if (activeTab === "aprovados") return matchesSearch && projeto.status === "Aprovado";
    if (activeTab === "producao") return matchesSearch && projeto.status === "Em produção";
    if (activeTab === "concluidos") return matchesSearch && projeto.status === "Concluído";

    return matchesSearch;
  });

  // Contagem por status
  const emDesenvolvimento = projetos.filter(p => p.status === "Em desenvolvimento").length;
  const aprovados = projetos.filter(p => p.status === "Aprovado").length;
  const emProducao = projetos.filter(p => p.status === "Em produção").length;
  const concluidos = projetos.filter(p => p.status === "Concluído").length;

  // Funções de manipulação de status (simuladas, precisariam de endpoints reais)
  const handleStatusChange = (id: string, newStatus: string) => {
    console.log(`Alterando status do projeto ${id} para ${newStatus}`);
    // Em um ambiente real, faria uma chamada API para atualizar o status
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">
            Projeto Executivo
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie e acompanhe o desenvolvimento dos projetos técnicos.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-3.5 w-3.5" />
            <span>Filtros</span>
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>Cronograma</span>
          </Button>
          <Button size="sm" className="h-8 gap-1">
            <Plus className="h-3.5 w-3.5" />
            <span>Novo Projeto</span>
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Em Desenvolvimento"
          value={`${emDesenvolvimento}`}
          icon={<PenLine className="h-5 w-5" />}
          color="amber"
        />
        <StatCard
          title="Aprovados"
          value={`${aprovados}`}
          icon={<CheckSquare className="h-5 w-5" />}
          color="emerald"
        />
        <StatCard
          title="Em Produção"
          value={`${emProducao}`}
          icon={<LayoutPanelLeft className="h-5 w-5" />}
          color="blue"
        />
        <StatCard
          title="Concluídos"
          value={`${concluidos}`}
          icon={<ClipboardCheck className="h-5 w-5" />}
          color="purple"
        />
      </div>

      {/* Tabs e Pesquisa */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <CardTitle>Projetos Executivos</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar projetos..."
                className="w-full pl-8 h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <CardDescription>
            Acompanhe o desenvolvimento dos projetos técnicos e seu status atual.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="todos"
            className="mb-6"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="todos">
                Todos
              </TabsTrigger>
              <TabsTrigger value="desenvolvimento">
                Em Desenvolvimento
              </TabsTrigger>
              <TabsTrigger value="aprovados">
                Aprovados
              </TabsTrigger>
              <TabsTrigger value="producao">
                Em Produção
              </TabsTrigger>
              <TabsTrigger value="concluidos">
                Concluídos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="todos" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Designer</TableHead>
                      <TableHead>Prazo</TableHead>
                      <TableHead>Prioridade</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjetos.map((projeto) => (
                      <TableRow key={projeto.id}>
                        <TableCell className="font-medium">{projeto.id}</TableCell>
                        <TableCell>{projeto.cliente}</TableCell>
                        <TableCell>{projeto.tipo}</TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                            projeto.status === "Em desenvolvimento"
                              ? "border-amber-200 bg-amber-100 text-amber-800"
                              : projeto.status === "Aprovado"
                              ? "border-emerald-200 bg-emerald-100 text-emerald-800"
                              : projeto.status === "Em produção"
                              ? "border-blue-200 bg-blue-100 text-blue-800"
                              : "border-purple-200 bg-purple-100 text-purple-800"
                          }`}>
                            {projeto.status}
                          </div>
                        </TableCell>
                        <TableCell>{projeto.responsavel}</TableCell>
                        <TableCell>{projeto.designer}</TableCell>
                        <TableCell>{projeto.prazoDesenvolvimento}</TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                            projeto.prioridade === "Alta"
                              ? "border-red-200 bg-red-100 text-red-800"
                              : projeto.prioridade === "Média"
                              ? "border-amber-200 bg-amber-100 text-amber-800"
                              : projeto.prioridade === "Baixa"
                              ? "border-blue-200 bg-blue-100 text-blue-800"
                              : "border-slate-200 bg-slate-100 text-slate-800"
                          }`}>
                            {projeto.prioridade}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <FileCode className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Share2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <ChevronRight className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* As outras tabs usariam o mesmo conteúdo filtrado baseado no status */}
            {["desenvolvimento", "aprovados", "producao", "concluidos"].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Responsável</TableHead>
                        <TableHead>Designer</TableHead>
                        <TableHead>Prazo</TableHead>
                        <TableHead>Prioridade</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProjetos.map((projeto) => (
                        <TableRow key={projeto.id}>
                          <TableCell className="font-medium">{projeto.id}</TableCell>
                          <TableCell>{projeto.cliente}</TableCell>
                          <TableCell>{projeto.tipo}</TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                              projeto.status === "Em desenvolvimento"
                                ? "border-amber-200 bg-amber-100 text-amber-800"
                                : projeto.status === "Aprovado"
                                ? "border-emerald-200 bg-emerald-100 text-emerald-800"
                                : projeto.status === "Em produção"
                                ? "border-blue-200 bg-blue-100 text-blue-800"
                                : "border-purple-200 bg-purple-100 text-purple-800"
                            }`}>
                              {projeto.status}
                            </div>
                          </TableCell>
                          <TableCell>{projeto.responsavel}</TableCell>
                          <TableCell>{projeto.designer}</TableCell>
                          <TableCell>{projeto.prazoDesenvolvimento}</TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                              projeto.prioridade === "Alta"
                                ? "border-red-200 bg-red-100 text-red-800"
                                : projeto.prioridade === "Média"
                                ? "border-amber-200 bg-amber-100 text-amber-800"
                                : projeto.prioridade === "Baixa"
                                ? "border-blue-200 bg-blue-100 text-blue-800"
                                : "border-slate-200 bg-slate-100 text-slate-800"
                            }`}>
                              {projeto.prioridade}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <FileCode className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Share2 className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <ChevronRight className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
