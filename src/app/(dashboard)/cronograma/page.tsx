"use client";

import { useState, useEffect } from "react";
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  Filter,
  Plus,
  Search,
  CalendarDays,
  AlertCircle,
  ChevronDown,
  Users,
  Calendar,
  ListFilter,
  LayoutGrid,
  LayoutList
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Tipos
type TaskStatus = "pendente" | "em_andamento" | "concluida" | "atrasada";
type TaskPriority = "baixa" | "media" | "alta" | "urgente";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: {
    id: string;
    name: string;
    avatar: string;
  };
  project?: {
    id: string;
    name: string;
  };
  client?: {
    id: string;
    name: string;
  };
  createdAt: string;
  progress?: number;
}

// Componente principal
export default function CronogramaPage() {
  const [viewMode, setViewMode] = useState<"list" | "grid" | "calendar">("list");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar tarefas
  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      // Simulação de carregamento de dados
      setTimeout(() => {
        const demoTasks: Task[] = [
          {
            id: "task1",
            title: "Finalizar projeto da cozinha para João Silva",
            description: "Concluir os desenhos técnicos e enviar para aprovação",
            dueDate: "2025-06-01",
            status: "em_andamento",
            priority: "alta",
            assignedTo: {
              id: "user1",
              name: "Ana Lima",
              avatar: "AL"
            },
            project: {
              id: "proj1",
              name: "Cozinha Planejada"
            },
            client: {
              id: "client1",
              name: "João Silva"
            },
            createdAt: "2025-05-15",
            progress: 60
          },
          {
            id: "task2",
            title: "Orçamento para cliente Maria Oliveira",
            description: "Preparar orçamento detalhado para o closet",
            dueDate: "2025-05-25",
            status: "pendente",
            priority: "urgente",
            assignedTo: {
              id: "user2",
              name: "Carlos Santos",
              avatar: "CS"
            },
            project: {
              id: "proj2",
              name: "Closet Planejado"
            },
            client: {
              id: "client2",
              name: "Maria Oliveira"
            },
            createdAt: "2025-05-18",
            progress: 0
          },
          {
            id: "task3",
            title: "Agendar medição no apartamento de Pedro Santos",
            description: "Contatar cliente para agendar visita técnica",
            dueDate: "2025-05-24",
            status: "atrasada",
            priority: "alta",
            assignedTo: {
              id: "user3",
              name: "Rafael Mendes",
              avatar: "RM"
            },
            client: {
              id: "client3",
              name: "Pedro Santos"
            },
            createdAt: "2025-05-15",
            progress: 10
          },
          {
            id: "task4",
            title: "Apresentar proposta de escritório",
            description: "Preparar apresentação para reunião com cliente",
            dueDate: "2025-05-30",
            status: "pendente",
            priority: "media",
            assignedTo: {
              id: "user1",
              name: "Ana Lima",
              avatar: "AL"
            },
            client: {
              id: "client4",
              name: "Ana Costa"
            },
            createdAt: "2025-05-19",
            progress: 30
          },
          {
            id: "task5",
            title: "Revisar projeto para ajustes finais",
            description: "Verificar medidas e acabamentos",
            dueDate: "2025-05-27",
            status: "pendente",
            priority: "media",
            assignedTo: {
              id: "user2",
              name: "Carlos Santos",
              avatar: "CS"
            },
            project: {
              id: "proj3",
              name: "Sala de Estar"
            },
            client: {
              id: "client5",
              name: "Carlos Mendes"
            },
            createdAt: "2025-05-20",
            progress: 15
          },
          {
            id: "task6",
            title: "Acompanhar produção de móveis",
            description: "Verificar status da produção na fábrica",
            dueDate: "2025-06-05",
            status: "em_andamento",
            priority: "baixa",
            assignedTo: {
              id: "user4",
              name: "Juliana Costa",
              avatar: "JC"
            },
            project: {
              id: "proj1",
              name: "Cozinha Planejada"
            },
            client: {
              id: "client1",
              name: "João Silva"
            },
            createdAt: "2025-05-17",
            progress: 40
          },
          {
            id: "task7",
            title: "Entregar projeto finalizado",
            description: "Entrega e instalação de móveis",
            dueDate: "2025-05-22",
            status: "concluida",
            priority: "alta",
            assignedTo: {
              id: "user5",
              name: "Fernando Gomes",
              avatar: "FG"
            },
            project: {
              id: "proj4",
              name: "Quarto Infantil"
            },
            client: {
              id: "client6",
              name: "Roberta Alves"
            },
            createdAt: "2025-05-10",
            progress: 100
          }
        ];

        setTasks(demoTasks);
        setFilteredTasks(demoTasks);
        setIsLoading(false);
      }, 1000);
    };

    loadTasks();
  }, []);

  // Filtrar tarefas
  useEffect(() => {
    let filtered = [...tasks];

    // Aplicar filtro por status
    if (filterStatus !== "all") {
      filtered = filtered.filter(task => task.status === filterStatus);
    }

    // Aplicar filtro por prioridade
    if (filterPriority !== "all") {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    // Aplicar filtro por busca
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.client?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  }, [tasks, filterStatus, filterPriority, searchQuery]);

  // Função para obter estilo/cor baseado no status
  const getStatusBadgeStyle = (status: TaskStatus) => {
    switch (status) {
      case "pendente":
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700";
      case "em_andamento":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50";
      case "concluida":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50";
      case "atrasada":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  // Função para obter o ícone do status
  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case "pendente":
        return <Clock className="h-4 w-4" />;
      case "em_andamento":
        return <Clock className="h-4 w-4" />;
      case "concluida":
        return <CheckCircle2 className="h-4 w-4" />;
      case "atrasada":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Função para obter estilo/cor baseado na prioridade
  const getPriorityBadgeStyle = (priority: TaskPriority) => {
    switch (priority) {
      case "baixa":
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
      case "media":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "alta":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case "urgente":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  // Função para formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  // Função para verificar se a data está próxima
  const isDateNear = (dateString: string) => {
    const today = new Date();
    const dueDate = new Date(dateString);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  // Função para verificar se a tarefa está atrasada
  const isTaskOverdue = (dateString: string) => {
    const today = new Date();
    const dueDate = new Date(dateString);
    return dueDate < today;
  };

  const handleMarkAsComplete = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, status: "concluida" as TaskStatus, progress: 100 }
        : task
    ));
    toast.success("Tarefa marcada como concluída");
  };

  const handleMarkAsInProgress = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, status: "em_andamento" as TaskStatus, progress: Math.max(task.progress || 0, 10) }
        : task
    ));
    toast.success("Tarefa marcada como em andamento");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">Cronograma de Tarefas</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Gerencie suas tarefas e acompanhe prazos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
              <Input
                type="search"
                placeholder="Buscar tarefas..."
                className="pl-8 h-9 md:w-[200px] lg:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <Filter className="h-4 w-4" />
                <span className="hidden md:inline">Filtros</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <div className="p-2">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Status</p>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="em_andamento">Em andamento</SelectItem>
                    <SelectItem value="concluida">Concluída</SelectItem>
                    <SelectItem value="atrasada">Atrasada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DropdownMenuSeparator />
              <div className="p-2">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Prioridade</p>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="hidden md:flex border border-slate-200 dark:border-slate-800 rounded-md p-0.5 h-9">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="h-7 px-2"
              onClick={() => setViewMode("list")}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className="h-7 px-2"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "ghost"}
              size="sm"
              className="h-7 px-2"
              onClick={() => setViewMode("calendar")}
            >
              <CalendarDays className="h-4 w-4" />
            </Button>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="h-9 gap-1">
                <Plus className="h-4 w-4" />
                <span className="hidden md:inline">Nova Tarefa</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Tarefa</DialogTitle>
                <DialogDescription>
                  Preencha as informações para adicionar uma nova tarefa ao cronograma.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Título
                  </label>
                  <Input id="title" placeholder="Digite o título da tarefa" />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Descrição
                  </label>
                  <textarea
                    id="description"
                    className="min-h-[80px] w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm"
                    placeholder="Descreva a tarefa em detalhes"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="dueDate" className="text-sm font-medium">
                      Data de Entrega
                    </label>
                    <Input id="dueDate" type="date" />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="priority" className="text-sm font-medium">
                      Prioridade
                    </label>
                    <Select>
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixa">Baixa</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="urgente">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="assignedTo" className="text-sm font-medium">
                    Responsável
                  </label>
                  <Select>
                    <SelectTrigger id="assignedTo">
                      <SelectValue placeholder="Selecione um responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user1">Ana Lima</SelectItem>
                      <SelectItem value="user2">Carlos Santos</SelectItem>
                      <SelectItem value="user3">Rafael Mendes</SelectItem>
                      <SelectItem value="user4">Juliana Costa</SelectItem>
                      <SelectItem value="user5">Fernando Gomes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="client" className="text-sm font-medium">
                    Cliente
                  </label>
                  <Select>
                    <SelectTrigger id="client">
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client1">João Silva</SelectItem>
                      <SelectItem value="client2">Maria Oliveira</SelectItem>
                      <SelectItem value="client3">Pedro Santos</SelectItem>
                      <SelectItem value="client4">Ana Costa</SelectItem>
                      <SelectItem value="client5">Carlos Mendes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancelar</Button>
                <Button onClick={() => toast.success("Tarefa criada com sucesso!")}>Criar Tarefa</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tarefas Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.filter(t => t.status === "pendente").length}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {tasks.filter(t => t.status === "pendente" && isDateNear(t.dueDate)).length} com prazo próximo
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.filter(t => t.status === "em_andamento").length}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Progresso médio: {Math.round(tasks.filter(t => t.status === "em_andamento").reduce((sum, t) => sum + (t.progress || 0), 0) / Math.max(1, tasks.filter(t => t.status === "em_andamento").length))}%
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.filter(t => t.status === "concluida").length}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {tasks.filter(t => t.status === "concluida" && new Date(t.dueDate) > new Date(t.createdAt)).length} antes do prazo
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Atrasadas</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.filter(t => t.status === "atrasada").length}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {tasks.filter(t => t.status !== "concluida" && isTaskOverdue(t.dueDate)).length} precisam de atenção
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tarefas em visão de lista */}
      {viewMode === "list" && (
        <div className="bg-white dark:bg-slate-950 rounded-md border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm font-medium text-slate-500 dark:text-slate-400">
            <div className="col-span-5 md:col-span-6">Tarefa</div>
            <div className="col-span-3 md:col-span-2">Status</div>
            <div className="col-span-2 hidden md:block">Prioridade</div>
            <div className="col-span-2 md:col-span-1">Data</div>
            <div className="col-span-2 md:col-span-1">Ações</div>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {isLoading ? (
              Array(5).fill(0).map((_, index) => (
                <div key={index} className="p-4 grid grid-cols-12 gap-4 items-center animate-pulse">
                  <div className="col-span-5 md:col-span-6 h-6 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  <div className="col-span-3 md:col-span-2 h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  <div className="col-span-2 hidden md:block h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  <div className="col-span-2 md:col-span-1 h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  <div className="col-span-2 md:col-span-1 h-6 w-12 bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>
              ))
            ) : filteredTasks.length === 0 ? (
              <div className="p-8 text-center">
                <Clock className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">Nenhuma tarefa encontrada</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4 max-w-md mx-auto">
                  {searchQuery || filterStatus !== "all" || filterPriority !== "all"
                    ? "Tente ajustar os filtros para ver mais resultados"
                    : "Adicione suas primeiras tarefas para começar a acompanhar seu cronograma"}
                </p>
                <Button onClick={() => {
                  setSearchQuery("");
                  setFilterStatus("all");
                  setFilterPriority("all");
                }}>
                  Limpar filtros
                </Button>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div key={task.id} className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-slate-50 dark:hover:bg-slate-900">
                  <div className="col-span-5 md:col-span-6">
                    <div className="font-medium text-slate-900 dark:text-slate-100">{task.title}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {task.client && (
                        <span className="inline-flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {task.client.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-span-3 md:col-span-2">
                    <Badge variant="outline" className={`gap-1 ${getStatusBadgeStyle(task.status)}`}>
                      {getStatusIcon(task.status)}
                      <span className="capitalize">{task.status.replace('_', ' ')}</span>
                    </Badge>
                    {task.progress !== undefined && task.progress > 0 && task.status !== "concluida" && (
                      <div className="mt-2 h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 dark:bg-blue-600"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="col-span-2 hidden md:block">
                    <Badge variant="outline" className={getPriorityBadgeStyle(task.priority)}>
                      <span className="capitalize">{task.priority}</span>
                    </Badge>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <span className={`text-xs ${isTaskOverdue(task.dueDate) && task.status !== "concluida" ? "text-red-500" : "text-slate-500 dark:text-slate-400"}`}>
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleMarkAsComplete(task.id)}>
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                          <span>Concluir</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleMarkAsInProgress(task.id)}>
                          <Clock className="h-4 w-4 mr-2 text-blue-500" />
                          <span>Em andamento</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Users className="h-4 w-4 mr-2" />
                          <span>Atribuir</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tarefas em visão de grid */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            Array(6).fill(0).map((_, index) => (
              <Card key={index} className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 animate-pulse">
                <CardHeader className="p-4">
                  <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full mb-2"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
                </CardContent>
              </Card>
            ))
          ) : filteredTasks.length === 0 ? (
            <div className="col-span-full p-8 text-center bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
              <Clock className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">Nenhuma tarefa encontrada</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4 max-w-md mx-auto">
                {searchQuery || filterStatus !== "all" || filterPriority !== "all"
                  ? "Tente ajustar os filtros para ver mais resultados"
                  : "Adicione suas primeiras tarefas para começar a acompanhar seu cronograma"}
              </p>
              <Button onClick={() => {
                setSearchQuery("");
                setFilterStatus("all");
                setFilterPriority("all");
              }}>
                Limpar filtros
              </Button>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <Card key={task.id} className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow">
                <div className={`h-1 w-full ${
                  task.status === "concluida" ? "bg-green-500" :
                  task.status === "atrasada" ? "bg-red-500" :
                  task.status === "em_andamento" ? "bg-blue-500" :
                  "bg-slate-300 dark:bg-slate-700"
                }`}></div>
                <CardHeader className="p-4 pb-0">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base line-clamp-1">{task.title}</CardTitle>
                    <Badge variant="outline" className={getPriorityBadgeStyle(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center mt-2 gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-blue-500 text-white">
                        {task.assignedTo.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{task.assignedTo.name}</span>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                    {task.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span className={`text-xs ${isTaskOverdue(task.dueDate) && task.status !== "concluida" ? "text-red-500" : "text-slate-500 dark:text-slate-400"}`}>
                        {formatDate(task.dueDate)}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full"
                        onClick={() => handleMarkAsComplete(task.id)}
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full"
                        onClick={() => handleMarkAsInProgress(task.id)}
                      >
                        <Clock className="h-4 w-4 text-blue-500" />
                      </Button>
                    </div>
                  </div>
                  {task.progress !== undefined && task.progress > 0 && (
                    <div className="mt-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-slate-500 dark:text-slate-400">Progresso</span>
                        <span className="text-xs font-medium">{task.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${task.status === "concluida" ? "bg-green-500" : "bg-blue-500 dark:bg-blue-600"}`}
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Tarefas em visão de calendário */}
      {viewMode === "calendar" && (
        <div className="bg-white dark:bg-slate-950 rounded-md border border-slate-200 dark:border-slate-800 p-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-medium">Maio 2025</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Visualização de tarefas por datas</p>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
            <div>Dom</div>
            <div>Seg</div>
            <div>Ter</div>
            <div>Qua</div>
            <div>Qui</div>
            <div>Sex</div>
            <div>Sáb</div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {/* Dias do calendário (apenas para demonstração) */}
            {[...Array(35)].map((_, index) => {
              const day = index - 2; // Começar do dia 29 de abril (ajustar conforme necessário)
              const isCurrentMonth = day > 0 && day <= 31;
              const date = isCurrentMonth ? `2025-05-${String(day).padStart(2, '0')}` : "";
              const tasksForDay = isCurrentMonth ? filteredTasks.filter(task =>
                new Date(task.dueDate).getDate() === day &&
                new Date(task.dueDate).getMonth() === 4 && // Maio = 4 (0-indexed)
                new Date(task.dueDate).getFullYear() === 2025
              ) : [];

              return (
                <div
                  key={index}
                  className={`aspect-square p-1 border ${
                    isCurrentMonth
                      ? "border-slate-200 dark:border-slate-800"
                      : "border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-900"
                  } rounded-md overflow-hidden relative`}
                >
                  <div className="text-xs font-medium p-1 text-right">
                    {isCurrentMonth ? day : ""}
                  </div>
                  <div className="absolute top-6 left-0 right-0 bottom-0 overflow-y-auto p-1">
                    {tasksForDay.map((task, taskIndex) => (
                      <div
                        key={taskIndex}
                        className={`text-xs p-1 mb-1 rounded-sm truncate ${
                          task.status === "concluida"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                            : task.status === "atrasada"
                            ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                            : task.status === "em_andamento"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300"
                        }`}
                        title={task.title}
                      >
                        {task.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
