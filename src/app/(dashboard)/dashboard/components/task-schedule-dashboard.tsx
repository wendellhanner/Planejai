"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarClock,
  Clock,
  CheckCircle2,
  AlarmClock,
  ArrowRight,
  Calendar,
  ChevronRight,
  Users,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

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

export function TaskScheduleDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
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
          }
        ];

        setTasks(demoTasks);
        setIsLoading(false);
      }, 1000);
    };

    loadTasks();
  }, []);

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

  // Função para formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit'
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

  const pendingTasks = tasks.filter(t => t.status === "pendente" || t.status === "em_andamento" || t.status === "atrasada");
  const urgentTasks = tasks.filter(t => (t.priority === "alta" || t.priority === "urgente") && t.status !== "concluida");
  const upcomingTasks = tasks.filter(t => isDateNear(t.dueDate) && t.status !== "concluida").sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 px-4">
        <CardTitle className="text-base font-medium">Cronograma de Tarefas</CardTitle>
        <Link href="/cronograma">
          <Button variant="ghost" size="sm" className="gap-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
            <span className="text-xs">Ver tudo</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="px-4 pb-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center p-2 animate-pulse">
                <div className="h-9 w-9 bg-slate-200 dark:bg-slate-800 rounded-full mr-3" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : pendingTasks.length === 0 ? (
          <div className="text-center p-4">
            <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-2" />
            <h3 className="text-base font-medium text-slate-900 dark:text-slate-100 mb-1">Sem tarefas pendentes</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              Você está em dia com suas atividades.
            </p>
            <Link href="/cronograma">
              <Button size="sm">Criar nova tarefa</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-1">
            {/* Seção de tarefas urgentes */}
            {urgentTasks.length > 0 && (
              <div className="mb-2">
                <div className="flex items-center px-2 py-1">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  <span className="text-xs font-medium text-red-500">Prioridades</span>
                </div>
                {urgentTasks.slice(0, 2).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center p-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-md"
                  >
                    <Avatar className="h-9 w-9 mr-3">
                      <AvatarFallback className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-xs">
                        {task.assignedTo.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate max-w-[170px]">
                          {task.title}
                        </p>
                        <Badge variant="outline" className={`${getStatusBadgeStyle(task.status)} text-xs ml-1`}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <span className={isTaskOverdue(task.dueDate) ? "text-red-500" : ""}>
                          {formatDate(task.dueDate)}
                        </span>
                        {task.client && (
                          <>
                            <span className="mx-1">•</span>
                            <Users className="h-3.5 w-3.5 mr-1" />
                            <span className="truncate max-w-[80px]">{task.client.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Seção de próximas tarefas */}
            {upcomingTasks.length > 0 && (
              <div className="mb-2">
                <div className="flex items-center px-2 py-1">
                  <Clock className="h-4 w-4 text-amber-500 mr-2" />
                  <span className="text-xs font-medium text-amber-500">Próximos prazos</span>
                </div>
                {upcomingTasks.slice(0, 2).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center p-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-md"
                  >
                    <Avatar className="h-9 w-9 mr-3">
                      <AvatarFallback className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 text-xs">
                        {task.assignedTo.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate max-w-[170px]">
                          {task.title}
                        </p>
                        <Badge variant="outline" className={`${getStatusBadgeStyle(task.status)} text-xs ml-1`}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <AlarmClock className="h-3.5 w-3.5 mr-1" />
                        <span>
                          {formatDate(task.dueDate)}
                        </span>
                        {task.client && (
                          <>
                            <span className="mx-1">•</span>
                            <Users className="h-3.5 w-3.5 mr-1" />
                            <span className="truncate max-w-[80px]">{task.client.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Seção de tarefas em andamento */}
            {tasks.filter(t => t.status === "em_andamento").length > 0 && (
              <div>
                <div className="flex items-center px-2 py-1">
                  <CalendarClock className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="text-xs font-medium text-blue-500">Em andamento</span>
                </div>
                {tasks.filter(t => t.status === "em_andamento").slice(0, 2).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center p-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-md"
                  >
                    <Avatar className="h-9 w-9 mr-3">
                      <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs">
                        {task.assignedTo.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate max-w-[240px]">
                        {task.title}
                      </p>
                      <div className="mt-1">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-slate-500 dark:text-slate-400">Progresso</span>
                          <span className="font-medium">{task.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 dark:bg-blue-600"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
