"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  MoreHorizontal,
  Plus,
  Filter,
  Search,
  Star,
  GripVertical,
  X,
  MessageCircle,
  Activity,
  FileText,
  Users,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Send,
  Upload,
  Download,
  Camera,
  File,
  UserPlus,
  Building,
  Bell,
  AlertTriangle
} from "lucide-react";

// Dados dos projetos executivos com informações completas
const projetosExecutivos = {
  "medicao": {
    id: "medicao",
    title: "Medição",
    color: "blue",
    limit: 3,
    items: [
      {
        id: "proj-1",
        titulo: "Cozinha Moderna - Apt 1201",
        cliente: "João Silva",
        endereco: "Rua das Flores, 123 - Centro",
        valor: 65000,
        prioridade: "Alta",
        etapa: "Agendamento medição",
        progresso: 15,
        dataInicio: "20/05/2025",
        prazoEntrega: "15/07/2025",
        responsavelProjeto: "Ana Designer",
        responsavelMedicao: "Carlos Técnico",
        departamento: "Medição",
        categoria: "Cozinha Premium",
        observacoes: "Cliente prefere tons neutros e materiais sustentáveis",
        equipe: ["AD", "CT", "MS"],
        atividades: 8,
        anexos: 3,
        status: "Em medição",
        telefone: "(11) 99999-1234",
        email: "joao@email.com"
      },
      {
        id: "proj-2",
        titulo: "Home Office Executivo",
        cliente: "Maria Santos",
        endereco: "Av. Paulista, 2000 - Bela Vista",
        valor: 35000,
        prioridade: "Média",
        etapa: "Aguardando medição",
        progresso: 5,
        dataInicio: "22/05/2025",
        prazoEntrega: "20/07/2025",
        responsavelProjeto: "Roberto Garcia",
        responsavelMedicao: "Pedro Medidor",
        departamento: "Medição",
        categoria: "Escritório",
        observacoes: "Espaço compacto, aproveitar altura máxima",
        equipe: ["RG", "PM"],
        atividades: 3,
        anexos: 1,
        status: "Aguardando",
        telefone: "(11) 98888-5678",
        email: "maria@email.com"
      }
    ]
  },
  "projeto": {
    id: "projeto",
    title: "Projeto",
    color: "purple",
    limit: 4,
    items: [
      {
        id: "proj-3",
        titulo: "Casa Completa - Zona Sul",
        cliente: "Pedro Costa",
        endereco: "Rua dos Jardins, 456 - Vila Madalena",
        valor: 120000,
        prioridade: "Alta",
        etapa: "Desenvolvimento projeto",
        progresso: 35,
        dataInicio: "15/05/2025",
        prazoEntrega: "30/08/2025",
        responsavelProjeto: "Ana Designer",
        responsavelTecnico: "Lucas Arquiteto",
        departamento: "Projetos",
        categoria: "Casa Completa",
        observacoes: "Projeto amplo incluindo todos os ambientes",
        equipe: ["AD", "LA", "MS", "CT"],
        atividades: 15,
        anexos: 8,
        status: "Em desenvolvimento",
        telefone: "(11) 97777-9012",
        email: "pedro@email.com"
      },
      {
        id: "proj-8",
        titulo: "Loft Industrial - Centro",
        cliente: "Sofia Mendes",
        endereco: "Rua Augusta, 800 - Centro",
        valor: 75000,
        prioridade: "Alta",
        etapa: "Aprovação de planta",
        progresso: 25,
        dataInicio: "18/05/2025",
        prazoEntrega: "15/08/2025",
        responsavelProjeto: "Marina Silva",
        responsavelTecnico: "Lucas Arquiteto",
        departamento: "Projetos",
        categoria: "Loft",
        observacoes: "Estilo industrial com elementos metálicos",
        equipe: ["MS", "LA", "RG"],
        atividades: 10,
        anexos: 5,
        status: "Em desenvolvimento",
        telefone: "(11) 96666-7777",
        email: "sofia@email.com"
      }
    ]
  },
  "producao": {
    id: "producao",
    title: "Produção",
    color: "orange",
    limit: 5,
    items: [
      {
        id: "proj-4",
        titulo: "Closet Casal - Suíte Master",
        cliente: "Ana Carolina",
        endereco: "Rua das Acácias, 789 - Moema",
        valor: 45000,
        prioridade: "Alta",
        etapa: "Fabricação móveis",
        progresso: 60,
        dataInicio: "10/05/2025",
        prazoEntrega: "25/06/2025",
        responsavelProjeto: "Marina Silva",
        responsavelProducao: "Carlos Marceneiro",
        departamento: "Produção",
        categoria: "Quarto",
        observacoes: "Acabamento premium com madeira nobre",
        equipe: ["MS", "CM", "JM"],
        atividades: 12,
        anexos: 6,
        status: "Em produção",
        telefone: "(11) 96666-3456",
        email: "ana@email.com"
      },
      {
        id: "proj-5",
        titulo: "Cozinha Gourmet - Cobertura",
        cliente: "Ricardo Alves",
        endereco: "Av. Faria Lima, 3000 - Itaim",
        valor: 85000,
        prioridade: "Alta",
        etapa: "Finalização produção",
        progresso: 85,
        dataInicio: "25/04/2025",
        prazoEntrega: "10/06/2025",
        responsavelProjeto: "Roberto Garcia",
        responsavelProducao: "João Montador",
        departamento: "Produção",
        categoria: "Cozinha",
        observacoes: "Ilha central com cooktop profissional",
        equipe: ["RG", "JM", "MS"],
        atividades: 20,
        anexos: 12,
        status: "Finalizando",
        telefone: "(11) 95555-7890",
        email: "ricardo@email.com"
      }
    ]
  },
  "entregue": {
    id: "entregue",
    title: "Entregue",
    color: "emerald",
    limit: 0,
    items: [
      {
        id: "proj-7",
        titulo: "Banheiro Spa - Residencial",
        cliente: "Julia Santos",
        endereco: "Condomínio Gardens, 150",
        valor: 55000,
        prioridade: "Baixa",
        etapa: "Projeto concluído",
        progresso: 100,
        dataInicio: "15/04/2025",
        prazoEntrega: "20/05/2025",
        responsavelProjeto: "Marina Silva",
        responsavelEntrega: "Carlos Supervisor",
        departamento: "Finalização",
        categoria: "Banheiro",
        observacoes: "Cliente extremamente satisfeito",
        equipe: ["MS", "CS"],
        atividades: 25,
        anexos: 15,
        status: "Concluído",
        telefone: "(11) 93333-6789",
        email: "julia@email.com"
      }
    ]
  },
  "montagem": {
    id: "montagem",
    title: "Montagem",
    color: "green",
    limit: 3,
    items: [
      {
        id: "proj-6",
        titulo: "Escritório Comercial",
        cliente: "Empresa ABC Ltda",
        endereco: "Rua Comercial, 500 - Centro",
        valor: 95000,
        prioridade: "Média",
        etapa: "Instalação móveis",
        progresso: 70,
        dataInicio: "05/05/2025",
        prazoEntrega: "30/05/2025",
        responsavelProjeto: "Ana Designer",
        responsavelInstalacao: "Pedro Montador",
        departamento: "Instalação",
        categoria: "Comercial",
        observacoes: "Instalação noturna para não interferir no funcionamento",
        equipe: ["AD", "PM", "CM"],
        atividades: 18,
        anexos: 9,
        status: "Instalando",
        telefone: "(11) 94444-2345",
        email: "contato@empresaabc.com"
      }
    ]
  }
};

// Dados de colaboradores
const colaboradores = [
  { id: "AD", name: "Ana Designer", role: "Designer Sênior", departamento: "Projetos", avatar: "AD", color: "bg-purple-600" },
  { id: "RG", name: "Roberto Garcia", role: "Gerente de Projetos", departamento: "Projetos", avatar: "RG", color: "bg-blue-600" },
  { id: "MS", name: "Marina Silva", role: "Arquiteta", departamento: "Projetos", avatar: "MS", color: "bg-pink-600" },
  { id: "CT", name: "Carlos Técnico", role: "Técnico em Medição", departamento: "Medição", avatar: "CT", color: "bg-green-600" },
  { id: "PM", name: "Pedro Medidor", role: "Especialista Medição", departamento: "Medição", avatar: "PM", color: "bg-cyan-600" },
  { id: "LA", name: "Lucas Arquiteto", role: "Arquiteto Sênior", departamento: "Projetos", avatar: "LA", color: "bg-indigo-600" },
  { id: "CM", name: "Carlos Marceneiro", role: "Supervisor Produção", departamento: "Produção", avatar: "CM", color: "bg-orange-600" },
  { id: "JM", name: "João Montador", role: "Montador Sênior", departamento: "Instalação", avatar: "JM", color: "bg-red-600" },
  { id: "CS", name: "Carlos Supervisor", role: "Supervisor Geral", departamento: "Finalização", avatar: "CS", color: "bg-slate-600" }
];

// Atividades dos projetos com departamentos
const atividadesProjetos = {
  "proj-1": [
    {
      id: 1,
      tipo: "medicao",
      titulo: "Agendamento de medição técnica realizado",
      usuario: "Carlos Técnico",
      departamento: "Medição",
      data: "24/05/2025",
      hora: "09:15",
      status: "concluido",
      descricao: "Cliente confirmou disponibilidade para terça-feira. Medição agendada para 28/05 às 14h."
    },
    {
      id: 2,
      tipo: "contato",
      titulo: "Briefing inicial com cliente",
      usuario: "Ana Designer",
      departamento: "Projetos",
      data: "23/05/2025",
      hora: "14:30",
      status: "concluido",
      descricao: "Briefing completo realizado. Cliente definiu preferências por tons neutros e materiais sustentáveis."
    },
    {
      id: 3,
      tipo: "preparacao",
      titulo: "Preparação de equipamentos de medição",
      usuario: "Carlos Técnico",
      departamento: "Medição",
      data: "24/05/2025",
      hora: "16:45",
      status: "concluido",
      descricao: "Todos os equipamentos calibrados e organizados para a medição técnica."
    }
  ],
  "proj-3": [
    {
      id: 4,
      tipo: "projeto",
      titulo: "Desenvolvimento da planta baixa",
      usuario: "Lucas Arquiteto",
      departamento: "Projetos",
      data: "24/05/2025",
      hora: "16:20",
      status: "em_andamento",
      descricao: "Criação das plantas de todos os ambientes. Aguardando feedback do cliente sobre layout proposto."
    },
    {
      id: 5,
      tipo: "reuniao",
      titulo: "Reunião de alinhamento de projeto",
      usuario: "Roberto Garcia",
      departamento: "Projetos",
      data: "23/05/2025",
      hora: "10:00",
      status: "concluido",
      descricao: "Definidos cronograma detalhado, materiais e fornecedores para o projeto."
    },
    {
      id: 6,
      tipo: "design",
      titulo: "Criação do moodboard",
      usuario: "Ana Designer",
      departamento: "Projetos",
      data: "24/05/2025",
      hora: "11:30",
      status: "concluido",
      descricao: "Moodboard aprovado pelo cliente. Estilo contemporâneo confirmado."
    }
  ],
  "proj-4": [
    {
      id: 7,
      tipo: "producao",
      titulo: "Início da fabricação dos módulos",
      usuario: "Carlos Marceneiro",
      departamento: "Produção",
      data: "24/05/2025",
      hora: "08:00",
      status: "em_andamento",
      descricao: "Produção iniciada. Madeira nobre já cortada e processada."
    }
  ]
};

// Mensagens do chat da equipe
const chatMessages = {
  "proj-1": [
    {
      id: 1,
      usuario: "Ana Designer",
      departamento: "Projetos",
      avatar: "AD",
      color: "bg-purple-600",
      data: "Hoje",
      hora: "14:30",
      mensagem: "Cliente aprovou as modificações no projeto. Podemos seguir para a próxima etapa do desenvolvimento."
    },
    {
      id: 2,
      usuario: "Carlos Técnico",
      departamento: "Medição",
      avatar: "CT",
      color: "bg-green-600",
      data: "Hoje",
      hora: "09:15",
      mensagem: "Medição realizada com sucesso. Todas as medidas foram conferidas e estão aprovadas para produção."
    }
  ],
  "proj-3": [
    {
      id: 3,
      usuario: "Lucas Arquiteto",
      departamento: "Projetos",
      avatar: "LA",
      color: "bg-indigo-600",
      data: "Hoje",
      hora: "16:20",
      mensagem: "Aguardando retorno do cliente sobre as plantas. Já preparei as alternativas solicitadas."
    }
  ]
};

// Arquivos dos projetos organizados por categoria
const arquivosProjetos = {
  "proj-1": {
    "contrato": [
      { nome: "contrato_compra.pdf", tamanho: "2.1 MB", data: "20/05/2025" },
      { nome: "termo_garantia.pdf", tamanho: "450 KB", data: "20/05/2025" }
    ],
    "fotos_medicao": [
      { nome: "medicao_cozinha_01.jpg", tamanho: "1.8 MB", data: "23/05/2025" },
      { nome: "medicao_cozinha_02.jpg", tamanho: "2.2 MB", data: "23/05/2025" },
      { nome: "medicao_cozinha_03.jpg", tamanho: "1.9 MB", data: "23/05/2025" }
    ],
    "projeto_executivo": [
      { nome: "projeto_cozinha_v1.dwg", tamanho: "5.2 MB", data: "24/05/2025" },
      { nome: "projeto_cozinha_3d.pdf", tamanho: "8.7 MB", data: "24/05/2025" }
    ],
    "outros": [
      { nome: "especificacoes_materiais.pdf", tamanho: "1.2 MB", data: "22/05/2025" }
    ]
  },
  "proj-3": {
    "contrato": [
      { nome: "contrato_casa_completa.pdf", tamanho: "3.2 MB", data: "15/05/2025" }
    ],
    "projeto_executivo": [
      { nome: "plantas_casa_completa.dwg", tamanho: "12.5 MB", data: "20/05/2025" },
      { nome: "renders_3d.pdf", tamanho: "15.8 MB", data: "21/05/2025" }
    ],
    "outros": [
      { nome: "cronograma_execucao.xlsx", tamanho: "890 KB", data: "18/05/2025" }
    ]
  }
};

// Dados do WhatsApp - Clientes com conversas recentes
const whatsappChats = [
  {
    id: "1",
    clienteId: "proj-1",
    nome: "João Silva",
    telefone: "(11) 99999-1234",
    ultimaMensagem: "Olá, queria saber sobre o prazo de entrega",
    ultimaResposta: new Date(Date.now() - 7 * 60 * 1000), // 7 minutos atrás
    status: "aguardando_resposta",
    projeto: "Cozinha Moderna - Apt 1201"
  },
  {
    id: "2",
    clienteId: "proj-3",
    nome: "Pedro Costa",
    telefone: "(11) 97777-9012",
    ultimaMensagem: "Quando posso ver o projeto 3D?",
    ultimaResposta: new Date(Date.now() - 12 * 60 * 1000), // 12 minutos atrás
    status: "aguardando_resposta",
    projeto: "Casa Completa - Zona Sul"
  },
  {
    id: "3",
    clienteId: "proj-2",
    nome: "Maria Santos",
    telefone: "(11) 98888-5678",
    ultimaMensagem: "Obrigada pela medição",
    ultimaResposta: new Date(Date.now() - 2 * 60 * 1000), // 2 minutos atrás
    status: "respondido",
    projeto: "Home Office Executivo"
  },
  {
    id: "4",
    clienteId: "proj-5",
    nome: "Ricardo Alves",
    telefone: "(11) 95555-7890",
    ultimaMensagem: "A produção está no prazo?",
    ultimaResposta: new Date(Date.now() - 15 * 60 * 1000), // 15 minutos atrás
    status: "aguardando_resposta",
    projeto: "Cozinha Gourmet - Cobertura"
  }
];

// Dados do Kanban comercial
const kanbanComercial = {
  "novos-leads": {
    id: "novos-leads",
    title: "Novos Leads",
    color: "blue",
    limit: 5,
    items: [
      {
        id: "1",
        title: "João Silva",
        description: "Apartamento no Centro - Cozinha e Sala",
        value: 45000,
        priority: "Alta",
        days: 2,
        tags: ["Cozinha", "Planejados"],
        avatar: "CS",
        starred: true,
        comments: 3,
        attachments: 4,
        team: ["CS", "MA", "RG"],
        status: "Novo",
        phone: "(11) 99999-1234",
        email: "joao@email.com"
      }
    ]
  },
  "em-contato": {
    id: "em-contato",
    title: "Em Contato",
    color: "gray",
    limit: 5,
    items: []
  },
  "reuniao-agendada": {
    id: "reuniao-agendada",
    title: "Reunião Agendada",
    color: "purple",
    limit: 4,
    items: []
  },
  "proposta-enviada": {
    id: "proposta-enviada",
    title: "Proposta Enviada",
    color: "cyan",
    limit: 4,
    items: []
  },
  "fechado": {
    id: "fechado",
    title: "Fechado",
    color: "green",
    limit: 0,
    items: []
  }
};

export default function KanbanPage() {
  const [activeTab, setActiveTab] = useState("projetos");
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState("atividades");
  const [chatMessage, setChatMessage] = useState("");
  const [newTeamMember, setNewTeamMember] = useState("");

  const currentData = activeTab === "comercial" ? kanbanComercial : projetosExecutivos;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === "Alta") {
      return <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs">Alta</Badge>;
    }
    if (priority === "Média") {
      return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs">Média</Badge>;
    }
    return <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs">Baixa</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Em medição":
      case "Em desenvolvimento":
      case "Em produção":
      case "Instalando":
        return <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />;
      case "Aguardando":
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />;
      case "Finalizando":
        return <div className="w-2 h-2 bg-orange-500 rounded-full" />;
      case "Concluído":
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-muted-foreground rounded-full" />;
    }
  };

  const getDepartmentIcon = (departamento: string) => {
    switch (departamento) {
      case "Projetos":
        return <Building className="w-4 h-4 text-purple-400" />;
      case "Medição":
        return <MapPin className="w-4 h-4 text-blue-400" />;
      case "Produção":
        return <Activity className="w-4 h-4 text-orange-400" />;
      case "Instalação":
        return <Users className="w-4 h-4 text-green-400" />;
      case "Finalização":
        return <FileText className="w-4 h-4 text-emerald-400" />;
      default:
        return <Building className="w-4 h-4 text-slate-400" />;
    }
  };

  const getFileIcon = (categoria: string) => {
    switch (categoria) {
      case "contrato":
        return <FileText className="w-5 h-5 text-blue-500" />;
      case "fotos_medicao":
        return <Camera className="w-5 h-5 text-green-500" />;
      case "projeto_executivo":
        return <Building className="w-5 h-5 text-purple-500" />;
      case "fotos_entrega":
        return <Camera className="w-5 h-5 text-emerald-500" />;
      case "fotos_montagem":
        return <Camera className="w-5 h-5 text-orange-500" />;
      default:
        return <File className="w-5 h-5 text-slate-500" />;
    }
  };

  const addTeamMember = () => {
    if (newTeamMember && selectedCard) {
      const updatedCard = {
        ...selectedCard,
        equipe: [...selectedCard.equipe, newTeamMember]
      };
      setSelectedCard(updatedCard);
      setNewTeamMember("");
    }
  };

  const removeTeamMember = (memberId: string) => {
    if (selectedCard) {
      const updatedCard = {
        ...selectedCard,
        equipe: selectedCard.equipe.filter((id: string) => id !== memberId)
      };
      setSelectedCard(updatedCard);
    }
  };

  // Função para calcular clientes sem resposta há mais de 5 minutos
  const getClientsWithoutResponse = () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return whatsappChats.filter(chat =>
      chat.status === "aguardando_resposta" &&
      chat.ultimaResposta < fiveMinutesAgo
    );
  };

  const clientsWithoutResponse = getClientsWithoutResponse();

  const onDragEnd = (result: any) => {
    // Implementação do drag and drop aqui
  };

  const openCardDetails = (item: any) => {
    setSelectedCard(item);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      {/* Clean Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Kanban</h1>
        <p className="text-muted-foreground text-sm">Gestão visual de projetos e clientes</p>
      </div>

      {/* Clean Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-muted border-border">
              <TabsTrigger
                value="comercial"
                className="data-[state=active]:bg-slate-700 text-foreground text-sm"
              >
                Comercial
              </TabsTrigger>
              <TabsTrigger
                value="projetos"
                className="data-[state=active]:bg-blue-600 text-muted-foreground data-[state=active]:text-white text-sm"
              >
                Projetos
              </TabsTrigger>
            </TabsList>
          </Tabs>

        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder={activeTab === "projetos" ? "Buscar projetos..." : "Buscar clientes..."}
              className="pl-10 bg-input border-border text-foreground placeholder-muted-foreground w-full sm:w-64 text-sm"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="border-border text-muted-foreground hover:bg-accent flex-1 sm:flex-none text-sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex-1 sm:flex-none text-sm">
              <Plus className="h-4 w-4 mr-2" />
              Novo Projeto
            </Button>
          </div>
        </div>
      </div>

      {/* Clean Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {Object.values(currentData).map((column) => (
            <div key={column.id} className="flex flex-col">
              {/* Clean Column Header */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-${column.color}-500`}></div>
                    <h3 className="font-semibold text-foreground text-sm">{column.title}</h3>
                  </div>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground p-0 h-auto">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {column.items.length} {activeTab === "projetos" ? "projetos" : "itens"}
                  </span>
                  {column.limit > 0 && (
                    <span className="text-muted-foreground/70">
                      Limite: {column.limit}
                    </span>
                  )}
                </div>
              </div>

              {/* Column Items */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-3 min-h-[200px] flex-1 ${
                      snapshot.isDraggingOver ? 'bg-accent/50 rounded-lg p-2' : ''
                    }`}
                  >
                    {column.items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`bg-card border-border hover:border-input transition-all cursor-pointer group ${
                              snapshot.isDragging ? 'shadow-lg rotate-1 scale-105' : ''
                            }`}
                            onClick={() => openCardDetails(item)}
                          >
                            <CardContent className="p-4">
                              {/* Clean Card Header */}
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div {...provided.dragHandleProps}>
                                    <GripVertical className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                  {activeTab === "projetos" && getStatusIcon(item.status)}
                                  {(item.starred || item.prioridade === "Alta") && (
                                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                  )}
                                </div>
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground p-0 h-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </div>

                              {/* Clean Title and Description */}
                              <div className="mb-3">
                                <h4 className="font-semibold text-foreground text-sm mb-1 line-clamp-1">
                                  {activeTab === "projetos" ? item.titulo : item.title}
                                </h4>
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  {activeTab === "projetos" ? item.cliente : item.description}
                                </p>
                                {activeTab === "projetos" && (
                                  <>
                                    <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-1">
                                      {item.categoria}
                                    </p>
                                    <p className="text-xs text-muted-foreground/70 line-clamp-1">
                                      {item.endereco}
                                    </p>
                                  </>
                                )}
                              </div>

                              {/* Clean Progress for Projects */}
                              {activeTab === "projetos" && (
                                <div className="mb-3">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-muted-foreground">Progresso</span>
                                    <span className="text-xs text-foreground">{item.progresso}%</span>
                                  </div>
                                  <Progress value={item.progresso} className="h-1" />
                                  <div className="flex items-center justify-between mt-1 text-xs">
                                    <span className="text-muted-foreground/70">Início: {item.dataInicio}</span>
                                    <span className="text-muted-foreground/70">Entrega: {item.prazoEntrega}</span>
                                  </div>
                                </div>
                              )}

                              {/* Clean Value Display */}
                              <div className="mb-3">
                                <span className="text-sm font-bold text-green-400">
                                  {formatCurrency(item.valor || item.value)}
                                </span>
                              </div>

                              {/* Clean Tags */}
                              {item.tags && item.tags.length > 0 && (
                                <div className="flex gap-1 mb-3">
                                  {item.tags.map((tag, tagIndex) => (
                                    <Badge key={tagIndex} variant="outline" className="text-xs border-slate-600 text-slate-300 px-1 py-0">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              {/* Clean Footer */}
                              <div className="flex items-center justify-between">
                                {getPriorityBadge(item.prioridade || item.priority)}

                                <div className="flex items-center gap-2">
                                  {((item.atividades && item.anexos) || (item.comments > 0 || item.attachments > 0)) && (
                                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                                      {(item.atividades || item.comments > 0) && (
                                        <span>{item.atividades || item.comments}</span>
                                      )}
                                      {(item.anexos || item.attachments > 0) && (
                                        <span>{item.anexos || item.attachments}</span>
                                      )}
                                    </div>
                                  )}

                                  <div className="flex -space-x-1">
                                    {(item.equipe || item.team)?.slice(0, 2).map((memberId: string, idx: number) => {
                                      const member = colaboradores.find(m => m.id === memberId);
                                      return (
                                        <Avatar key={idx} className="h-5 w-5 border border-slate-600">
                                          <AvatarFallback className={`${member?.color} text-white text-xs`}>
                                            {member?.avatar}
                                          </AvatarFallback>
                                        </Avatar>
                                      );
                                    })}
                                    {(item.equipe || item.team)?.length > 2 && (
                                      <div className="h-5 w-5 rounded-full bg-slate-600 border border-slate-500 flex items-center justify-center">
                                        <span className="text-xs text-foreground">+{(item.equipe || item.team).length - 2}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Modal Colaborativo Completo */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-7xl h-[90vh] p-0 bg-background text-foreground overflow-hidden border-border">
          {selectedCard && (
            <>
              <DialogHeader className="p-6 pb-0 border-b border-border">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <DialogTitle className="text-2xl font-bold text-foreground">
                        {activeTab === "projetos" ? selectedCard.titulo : selectedCard.title}
                      </DialogTitle>
                      {getStatusIcon(selectedCard.status)}
                      <Badge className="bg-blue-600 text-white">
                        {activeTab === "projetos" ? selectedCard.etapa : selectedCard.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">
                      {activeTab === "projetos" ? `${selectedCard.cliente} - ${selectedCard.categoria}` : selectedCard.description}
                    </p>
                    {activeTab === "projetos" && (
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{selectedCard.endereco}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-green-400 font-semibold">{formatCurrency(selectedCard.valor)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </DialogHeader>

              <div className="flex-1 flex overflow-hidden">
                {/* Área de Colaboração - Lado Esquerdo */}
                <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                  <Tabs value={activeModalTab} onValueChange={setActiveModalTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-muted">
                      <TabsTrigger value="atividades" className="data-[state=active]:bg-blue-600 text-muted-foreground">
                        <Activity className="w-4 h-4 mr-2" />
                        Atividades
                      </TabsTrigger>
                      <TabsTrigger value="chat" className="data-[state=active]:bg-blue-600 text-muted-foreground">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat
                      </TabsTrigger>
                      <TabsTrigger value="arquivos" className="data-[state=active]:bg-blue-600 text-muted-foreground">
                        <FileText className="w-4 h-4 mr-2" />
                        Arquivos
                      </TabsTrigger>
                      <TabsTrigger value="equipe" className="data-[state=active]:bg-blue-600 text-muted-foreground">
                        <Users className="w-4 h-4 mr-2" />
                        Equipe
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="atividades" className="mt-6">
                      <div className="space-y-4 max-h-80 overflow-y-auto bg-card">
                        {atividadesProjetos[selectedCard.id]?.map((atividade) => (
                          <div key={atividade.id} className="flex gap-3 p-4 rounded-lg border border-border hover:border-input">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium text-foreground">{atividade.titulo}</h4>
                                <Badge
                                  variant={atividade.status === 'concluido' ? 'default' : 'secondary'}
                                  className={atividade.status === 'concluido' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'}
                                >
                                  {atividade.status === 'concluido' ? 'Concluído' : 'Em andamento'}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground text-sm mb-3">{atividade.descricao}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <span className="font-medium text-foreground">{atividade.usuario}</span>
                                  <div className="flex items-center gap-1">
                                    {getDepartmentIcon(atividade.departamento)}
                                    <span className="bg-muted px-2 py-1 rounded text-xs">{atividade.departamento}</span>
                                  </div>
                                </div>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {atividade.data}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {atividade.hora}
                                </span>
                              </div>
                            </div>
                          </div>
                        )) || (
                          <div className="text-center py-8 text-muted-foreground">
                            <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>Nenhuma atividade registrada ainda</p>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 p-4 bg-card rounded-lg border border-border">
                        <h4 className="font-medium text-foreground mb-3">Registrar Nova Atividade</h4>
                        <div className="space-y-3">
                          <Input placeholder="Título da atividade" />
                          <Textarea placeholder="Descrição da atividade" />
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar Atividade
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="chat" className="mt-6 space-y-4">
                      <div className="space-y-3 max-h-80 overflow-y-auto bg-card rounded-lg p-4 border border-border">
                        {chatMessages[selectedCard.id]?.map((msg) => (
                          <div key={msg.id} className="flex gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className={`text-xs ${msg.color} text-white`}>
                                {msg.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-foreground">{msg.usuario}</span>
                                <div className="flex items-center gap-1">
                                  {getDepartmentIcon(msg.departamento)}
                                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{msg.departamento}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">{msg.data}, {msg.hora}</span>
                              </div>
                              <p className="text-muted-foreground text-sm bg-muted p-2 rounded">{msg.mensagem}</p>
                            </div>
                          </div>
                        )) || (
                          <div className="text-center py-8 text-muted-foreground">
                            <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>Nenhuma mensagem ainda</p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Digite sua mensagem..."
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                        />
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="arquivos" className="mt-6">
                      <div className="space-y-6">
                        {arquivosProjetos[selectedCard.id] && Object.entries(arquivosProjetos[selectedCard.id]).map(([categoria, arquivos]) => (
                          <Card key={categoria} className="bg-card rounded-lg border border-border hover:border-input">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  {getFileIcon(categoria)}
                                  <span className="text-foreground font-medium">
                                    {categoria === 'contrato' && 'Contratos de Compra'}
                                    {categoria === 'fotos_medicao' && 'Fotos da Medição'}
                                    {categoria === 'projeto_executivo' && 'Projeto Executivo'}
                                    {categoria === 'fotos_entrega' && 'Fotos da Entrega'}
                                    {categoria === 'fotos_montagem' && 'Fotos da Montagem'}
                                    {categoria === 'outros' && 'Outros Documentos'}
                                  </span>
                                  <Badge variant="outline" className="text-xs">{arquivos.length}</Badge>
                                </div>
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                  <Upload className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="space-y-2">
                                {arquivos.map((arquivo, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                      <span className="text-foreground">{arquivo.nome}</span>
                                      <span className="text-muted-foreground text-xs">({arquivo.tamanho})</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-muted-foreground text-xs">{arquivo.data}</span>
                                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground p-0">
                                        <Download className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}

                        {/* Botão para adicionar nova categoria */}
                        <Button variant="outline" className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar Arquivos
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="equipe" className="mt-6 space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Select value={newTeamMember} onValueChange={setNewTeamMember}>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Adicionar colaborador" />
                          </SelectTrigger>
                          <SelectContent>
                            {colaboradores
                              .filter(member => !(selectedCard.equipe || selectedCard.team)?.includes(member.id))
                              .map((member) => (
                                <SelectItem key={member.id} value={member.id}>
                                  <div className="flex items-center gap-2">
                                    {getDepartmentIcon(member.departamento)}
                                    <span>{member.name} - {member.role}</span>
                                  </div>
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <Button onClick={addTeamMember} className="bg-blue-600 hover:bg-blue-700">
                          <UserPlus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {(selectedCard.equipe || selectedCard.team)?.map((memberId: string) => {
                          const member = colaboradores.find(m => m.id === memberId);
                          return member ? (
                            <div key={memberId} className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:border-input">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarFallback className={`${member.color} text-white`}>
                                    {member.avatar}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-semibold text-foreground">{member.name}</h4>
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm text-muted-foreground">{member.role}</p>
                                    <div className="flex items-center gap-1">
                                      {getDepartmentIcon(member.departamento)}
                                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{member.departamento}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeTeamMember(memberId)}
                                className="text-destructive hover:text-destructive/90"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Dados do Cliente - Lado Direito */}
                <div className="w-80 bg-background border-l border-border p-6 space-y-6 overflow-y-auto">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-foreground">
                      {activeTab === "projetos" ? "Dados do Cliente" : "Detalhes do Lead"}
                    </h3>
                    <div className="space-y-4">
                      {activeTab === "projetos" ? (
                        <>
                          <div>
                            <label className="text-sm text-muted-foreground">Cliente</label>
                            <p className="text-foreground font-medium mt-1">{selectedCard.cliente}</p>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Telefone</label>
                            <div className="flex items-center gap-2 mt-1">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <p className="text-foreground">{selectedCard.telefone}</p>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Email</label>
                            <div className="flex items-center gap-2 mt-1">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              <p className="text-foreground">{selectedCard.email}</p>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Endereço</label>
                            <div className="flex items-center gap-2 mt-1">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <p className="text-white text-sm">{selectedCard.endereco}</p>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Valor do Projeto</label>
                            <p className="text-2xl font-bold text-green-400 mt-1">
                              {formatCurrency(selectedCard.valor)}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Status</label>
                            <div className="flex items-center gap-2 mt-1">
                              {getStatusIcon(selectedCard.status)}
                              <span className="text-foreground font-medium">{selectedCard.status}</span>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Progresso</label>
                            <div className="mt-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-foreground font-bold">{selectedCard.progresso}%</span>
                              </div>
                              <Progress value={selectedCard.progresso} className="h-2" />
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Responsável</label>
                            <p className="text-foreground font-medium mt-1">{selectedCard.responsavelProjeto}</p>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Prazo de Entrega</label>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <p className="text-foreground">{selectedCard.prazoEntrega}</p>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Observações</label>
                            <p className="text-muted-foreground text-sm mt-1 bg-muted p-3 rounded">{selectedCard.observacoes}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <label className="text-sm text-muted-foreground">Status</label>
                            <Badge className="bg-blue-600 text-white mt-1 block w-fit">
                              {selectedCard.status}
                            </Badge>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Valor</label>
                            <p className="text-2xl font-bold text-green-400 mt-1">
                              {formatCurrency(selectedCard.value)}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Telefone</label>
                            <div className="flex items-center gap-2 mt-1">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <p className="text-foreground">{selectedCard.phone}</p>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Email</label>
                            <div className="flex items-center gap-2 mt-1">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              <p className="text-foreground">{selectedCard.email}</p>
                            </div>
                          </div>
                        </>
                      )}
                      <div>
                        <label className="text-sm text-muted-foreground">Prioridade</label>
                        <div className="mt-1">
                          {getPriorityBadge(selectedCard.prioridade || selectedCard.priority)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
