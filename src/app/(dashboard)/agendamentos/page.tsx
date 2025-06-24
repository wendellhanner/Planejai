"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Plus,
  Search,
  Filter,
  Check,
  Calendar,
  User,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

// Dados mockados para demonstração
const MOCK_APPOINTMENTS = [
  {
    id: 1,
    title: "Medição Residencial",
    client: "João Silva",
    date: "2025-05-25T13:30:00",
    address: "Av. Paulista, 1000, Apto 123",
    type: "medicao",
    status: "scheduled",
    notes: "Cliente pediu para medir todos os cômodos para projeto completo",
  },
  {
    id: 2,
    title: "Entrega de Módulos",
    client: "Maria Oliveira",
    date: "2025-05-26T09:00:00",
    address: "Rua Augusta, 500, Casa 3",
    type: "entrega",
    status: "confirmed",
    notes: "Confirmar com cliente 1 dia antes. Produtos: armários quarto e cozinha",
  },
  {
    id: 3,
    title: "Montagem de Móveis",
    client: "Pedro Santos",
    date: "2025-05-26T14:00:00",
    address: "Rua Oscar Freire, 800",
    type: "montagem",
    status: "scheduled",
    notes: "Montagem estimada em 6 horas. Levar ferramentas para ajustes",
  },
  {
    id: 4,
    title: "Apresentação de Proposta",
    client: "Ana Costa",
    date: "2025-05-27T10:00:00",
    address: "Online - Zoom",
    type: "proposta",
    status: "pending",
    notes: "Apresentação do projeto 3D de cozinha e sala. Verificar materiais",
  },
  {
    id: 5,
    title: "Ajustes pós-montagem",
    client: "Carlos Mendes",
    date: "2025-05-28T16:00:00",
    address: "Alameda Santos, 250, Apto 52",
    type: "ajuste",
    status: "scheduled",
    notes: "Cliente reportou gaveta com dificuldade de abrir",
  },
];

// Tipos de agendamento
const APPOINTMENT_TYPES = [
  { id: "all", label: "Todos" },
  { id: "medicao", label: "Medição", color: "bg-blue-100 text-blue-700" },
  { id: "entrega", label: "Entrega", color: "bg-emerald-100 text-emerald-700" },
  { id: "montagem", label: "Montagem", color: "bg-amber-100 text-amber-700" },
  { id: "proposta", label: "Proposta", color: "bg-purple-100 text-purple-700" },
  { id: "ajuste", label: "Ajuste", color: "bg-red-100 text-red-700" },
];

// Status de agendamento
const APPOINTMENT_STATUS = {
  scheduled: { label: "Agendado", color: "bg-blue-100 text-blue-700" },
  confirmed: { label: "Confirmado", color: "bg-green-100 text-green-700" },
  pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-700" },
  cancelled: { label: "Cancelado", color: "bg-red-100 text-red-700" },
  completed: { label: "Concluído", color: "bg-purple-100 text-purple-700" },
};

// Função para formatar data e hora
function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    weekday: date.toLocaleDateString('pt-BR', { weekday: 'long' }),
  };
}

export default function AgendamentosPage() {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentDay, setCurrentDay] = useState(new Date());

  // Filtrar os agendamentos
  const filteredAppointments = MOCK_APPOINTMENTS.filter(appointment => {
    const matchesType = filterType === "all" || appointment.type === filterType;
    const matchesSearch =
      appointment.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.address.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesSearch;
  });

  // Agrupar os agendamentos por data para visualização do calendário
  const groupedByDate = filteredAppointments.reduce((acc, appointment) => {
    const dateTime = formatDateTime(appointment.date);
    const dateKey = dateTime.date;
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(appointment);
    return acc;
  }, {} as Record<string, typeof MOCK_APPOINTMENTS>);

  // Função para confirmar agendamento
  const handleConfirmAppointment = (id: number) => {
    toast.success("Agendamento confirmado com sucesso!");
  };

  // Função para reagendar
  const handleReschedule = (id: number) => {
    toast.info("Abra o formulário de reagendamento");
  };

  // Função para cancelar
  const handleCancel = (id: number) => {
    toast.warning("Agendamento cancelado. Um email foi enviado ao cliente.", {
      duration: 3000,
    });
  };

  // Função para mostrar detalhes
  const handleShowDetails = (id: number) => {
    const appointment = MOCK_APPOINTMENTS.find(a => a.id === id);
    if (appointment) {
      toast.info(`Detalhes do agendamento: ${appointment.title}`, {
        description: appointment.notes,
        duration: 5000,
      });
    }
  };

  // Função para criar novo agendamento
  const handleNewAppointment = () => {
    toast.info("Formulário de novo agendamento", {
      description: "Aqui seria aberto um modal para criar um novo agendamento",
      duration: 3000,
    });
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agendamentos</h1>
          <p className="text-muted-foreground">
            Gerencie suas medições, entregas, montagens e outros compromissos
          </p>
        </div>
        <Button onClick={handleNewAppointment} className="gap-2 md:self-end">
          <Plus className="h-4 w-4" />
          <span>Novo Agendamento</span>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-auto flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente, título ou endereço"
            className="pl-9 max-w-full md:max-w-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="gap-2 w-full md:w-[180px]">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              {APPOINTMENT_TYPES.map(type => (
                <SelectItem key={type.id} value={type.id}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Tabs defaultValue="list" className="hidden md:flex" onValueChange={(value) => setView(value as "list" | "calendar")}>
            <TabsList>
              <TabsTrigger value="list">Lista</TabsTrigger>
              <TabsTrigger value="calendar">Calendário</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {view === "list" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAppointments.map((appointment) => {
            const dateTime = formatDateTime(appointment.date);
            const typeInfo = APPOINTMENT_TYPES.find(t => t.id === appointment.type) || APPOINTMENT_TYPES[0];
            const statusInfo = APPOINTMENT_STATUS[appointment.status as keyof typeof APPOINTMENT_STATUS];

            return (
              <Card key={appointment.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{appointment.title}</CardTitle>
                      <CardDescription className="text-sm flex items-center mt-1">
                        <User className="h-3.5 w-3.5 mr-1 text-slate-400" />
                        {appointment.client}
                      </CardDescription>
                    </div>
                    <div className={`${statusInfo.color} text-xs rounded-full px-2 py-1 font-medium`}>
                      {statusInfo.label}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2 pb-3 space-y-3">
                  <div className="flex items-start gap-3 text-sm">
                    <div className="flex items-center text-slate-600">
                      <Calendar className="h-4 w-4 mr-1.5 text-blue-500" />
                      <div>
                        <div className="font-medium">{dateTime.date}</div>
                        <div className="text-xs text-slate-500 capitalize">{dateTime.weekday}</div>
                      </div>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Clock className="h-4 w-4 mr-1.5 text-blue-500" />
                      <span>{dateTime.time}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 mr-1 mt-0.5 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-600">{appointment.address}</span>
                  </div>

                  <div className={`${typeInfo.color} text-xs inline-block rounded-full px-2 py-0.5 font-medium`}>
                    {typeInfo.label}
                  </div>
                </CardContent>
                <CardFooter className="p-3 pt-0 flex gap-2 justify-between bg-slate-50 dark:bg-slate-800 border-t dark:border-slate-700 flex-wrap">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs flex-1"
                    onClick={() => handleShowDetails(appointment.id)}
                  >
                    Detalhes
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs flex-1"
                    onClick={() => handleReschedule(appointment.id)}
                  >
                    Reagendar
                  </Button>
                  {appointment.status === "pending" ? (
                    <Button
                      variant="default"
                      size="sm"
                      className="h-8 text-xs flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleConfirmAppointment(appointment.id)}
                    >
                      <Check className="h-3 w-3 mr-1" /> Confirmar
                    </Button>
                  ) : (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-8 text-xs flex-1"
                      onClick={() => handleCancel(appointment.id)}
                    >
                      Cancelar
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardHeader className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4">
            <div className="flex justify-between items-center">
              <Button variant="outline" size="sm" onClick={() => setCurrentDay(new Date())}>
                Hoje
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-semibold">
                  {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </h2>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <Button variant="outline" size="sm">
                  Mês
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-7 text-center">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                <div key={day} className="py-2 border-b font-medium text-sm">
                  {day}
                </div>
              ))}
            </div>
            <div className="min-h-[500px] p-4 grid gap-4">
              {Object.keys(groupedByDate).length > 0 ? (
                Object.entries(groupedByDate).map(([date, appointments]) => (
                  <div key={date} className="border rounded-md p-3 shadow-sm">
                    <div className="font-medium mb-2">{date}</div>
                    <div className="space-y-2">
                      {appointments.map((apt) => {
                        const dateTime = formatDateTime(apt.date);
                        const typeInfo = APPOINTMENT_TYPES.find(t => t.id === apt.type) || APPOINTMENT_TYPES[0];

                        return (
                          <div
                            key={apt.id}
                            className={`p-2 rounded-md border-l-4 border-l-blue-500 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer`}
                            onClick={() => handleShowDetails(apt.id)}
                          >
                            <div className="flex justify-between">
                              <div className="font-medium">{apt.title}</div>
                              <div className="text-sm">{dateTime.time}</div>
                            </div>
                            <div className="text-sm text-slate-500">{apt.client}</div>
                            <div className={`${typeInfo.color} text-xs inline-block rounded-full mt-1 px-2 py-0.5 font-medium`}>
                              {typeInfo.label}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center col-span-7 h-64 text-muted-foreground">
                  <div className="text-center">
                    <CalendarIcon className="mx-auto h-12 w-12 text-slate-300" />
                    <h3 className="mt-2 text-lg font-medium">Sem agendamentos</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Não há agendamentos para o período selecionado
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ChevronLeft(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRight(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
