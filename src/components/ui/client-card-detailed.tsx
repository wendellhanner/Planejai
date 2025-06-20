"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  MessageSquare,
  FileText,
  Images,
  CheckSquare,
  Calendar,
  Clock,
  User,
  Users,
  DollarSign,
  Send,
  PlusCircle,
  CheckCircle,
  Archive,
  Trash2,
  Tag,
  PencilLine,
  Paperclip,
  Download,
  Eye,
  Printer,
  BrainCircuit,
  ClipboardList,
  X,
  CreditCard,
  Phone,
  Mail,
  Home,
  Info,
  BarChart,
  Ruler,
  ClipboardCheck,
  AlertCircle,
  Upload,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  MapPin,
  ArrowRight,
  Hammer,
  Factory
} from "lucide-react";

// Definição de tipos
type ChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  attachments?: {type: string, url: string, name: string}[];
};

type CardActivity = {
  id: string;
  type: string;
  user: string;
  timestamp: string;
  description: string;
  details?: string;
};

type ClientDocument = {
  id: string;
  type: string;
  name: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
  preview?: string;
};

type ChecklistItem = {
  id: string;
  text: string;
  checked: boolean;
  createdAt: string;
};

type CardTodo = {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  assignedTo?: string;
  completed: boolean;
};

// Componente principal de card detalhado
export function ClientCardDetailed({
  client = {
    id: "client-1",
    name: "João Silva",
    email: "joao.silva@exemplo.com",
    phone: "(11) 98765-4321",
    address: "Rua das Flores, 123 - Jardim Primavera",
    city: "São Paulo",
    state: "SP",
    postalCode: "01234-567",
    project: {
      title: "Cozinha Planejada - Apartamento 302",
      description: "Projeto de cozinha completa com ilha e armários superiores",
      budget: "R$ 35.000,00",
      startDate: "2023-05-10",
      currentStage: "medicao",
      priority: "high",
      tags: ["cozinha", "apartamento", "ilha"]
    }
  },
  onClose
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "msg1",
      senderId: "user-1",
      senderName: "Carlos (Vendedor)",
      content: "Acabei de cadastrar as informações da medição. Vamos agendar a visita técnica.",
      timestamp: "10:30"
    },
    {
      id: "msg2",
      senderId: "user-2",
      senderName: "Paulo (Medidor)",
      content: "Tenho disponibilidade na quinta-feira às 14h. O cliente confirmou?",
      timestamp: "10:35"
    },
    {
      id: "msg3",
      senderId: "user-1",
      senderName: "Carlos (Vendedor)",
      content: "Sim, cliente confirmou. Vou enviar no grupo do WhatsApp a confirmação.",
      timestamp: "10:40"
    },
    {
      id: "msg4",
      senderId: "user-3",
      senderName: "Ana (Designer)",
      content: "Já recebi as referências que o cliente enviou. Vou preparar algumas opções de layout antes da medição.",
      timestamp: "11:15",
      attachments: [
        {type: "image", url: "/referencias.jpg", name: "Referencias.jpg"}
      ]
    },
  ]);

  const [clientDocuments, setClientDocuments] = useState<ClientDocument[]>([
    {
      id: "doc1",
      type: "pdf",
      name: "Contrato.pdf",
      url: "/contrato.pdf",
      uploadedBy: "Carlos",
      uploadedAt: "15/05/2023",
      size: "2.4 MB"
    },
    {
      id: "doc2",
      type: "image",
      name: "Planta_Apartamento.jpg",
      url: "/planta.jpg",
      uploadedBy: "João (Cliente)",
      uploadedAt: "12/05/2023",
      size: "1.8 MB",
      preview: "/planta_thumb.jpg"
    },
    {
      id: "doc3",
      type: "dwg",
      name: "Projeto_Executivo_V1.dwg",
      url: "/projeto.dwg",
      uploadedBy: "Ana",
      uploadedAt: "18/05/2023",
      size: "4.2 MB"
    },
    {
      id: "doc4",
      type: "pdf",
      name: "Orçamento_Aprovado.pdf",
      url: "/orcamento.pdf",
      uploadedBy: "Carlos",
      uploadedAt: "20/05/2023",
      size: "1.2 MB"
    }
  ]);

  const [activities, setActivities] = useState<CardActivity[]>([
    {
      id: "act1",
      type: "stage_change",
      user: "Carlos",
      timestamp: "20/05/2023 15:30",
      description: "Moveu o projeto para Medição",
      details: "De: Venda → Para: Medição"
    },
    {
      id: "act2",
      type: "document",
      user: "Carlos",
      timestamp: "20/05/2023 15:25",
      description: "Adicionou documento",
      details: "Orçamento_Aprovado.pdf"
    },
    {
      id: "act3",
      type: "comment",
      user: "Ana",
      timestamp: "18/05/2023 11:20",
      description: "Adicionou comentário",
      details: "Projeto executivo finalizado e pronto para aprovação"
    },
    {
      id: "act4",
      type: "task",
      user: "Paulo",
      timestamp: "17/05/2023 09:45",
      description: "Agendou medição",
      details: "Data: 25/05/2023 às 14:00"
    }
  ]);

  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: "check1", text: "Contrato assinado", checked: true, createdAt: "15/05/2023" },
    { id: "check2", text: "Pagamento de entrada confirmado", checked: true, createdAt: "16/05/2023" },
    { id: "check3", text: "Agendamento de medição", checked: true, createdAt: "17/05/2023" },
    { id: "check4", text: "Medição realizada", checked: false, createdAt: "17/05/2023" },
    { id: "check5", text: "Projeto executivo aprovado", checked: false, createdAt: "18/05/2023" },
    { id: "check6", text: "Produção iniciada", checked: false, createdAt: "18/05/2023" }
  ]);

  const [todos, setTodos] = useState<CardTodo[]>([
    {
      id: "todo1",
      title: "Confirmar horário da medição",
      description: "Ligar para o cliente para confirmar o horário da medição",
      dueDate: "24/05/2023",
      assignedTo: "Carlos",
      completed: false
    },
    {
      id: "todo2",
      title: "Preparar equipamento para medição",
      description: "Verificar se o laser e a trena estão disponíveis",
      dueDate: "24/05/2023",
      assignedTo: "Paulo",
      completed: false
    },
    {
      id: "todo3",
      title: "Enviar catálogo de materiais",
      description: "Enviar amostra de materiais para o cliente escolher",
      dueDate: "23/05/2023",
      assignedTo: "Ana",
      completed: true
    }
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [clientInfo, setClientInfo] = useState(client);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg${chatMessages.length + 1}`,
      senderId: "current-user",
      senderName: "Você",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };

    setChatMessages([...chatMessages, newMsg]);
    setNewMessage("");

    // Adiciona à atividade
    const newActivity: CardActivity = {
      id: `act${activities.length + 1}`,
      type: "comment",
      user: "Você",
      timestamp: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      description: "Adicionou comentário",
      details: newMessage.length > 30 ? newMessage.substring(0, 30) + "..." : newMessage
    };

    setActivities([newActivity, ...activities]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim()) return;

    const newItem: ChecklistItem = {
      id: `check${checklist.length + 1}`,
      text: newChecklistItem,
      checked: false,
      createdAt: new Date().toLocaleDateString()
    };

    setChecklist([...checklist, newItem]);
    setNewChecklistItem("");
  };

  const handleToggleChecklistItem = (id: string) => {
    setChecklist(
      checklist.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleAddTodo = () => {
    if (!newTodoTitle.trim()) return;

    const newItem: CardTodo = {
      id: `todo${todos.length + 1}`,
      title: newTodoTitle,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      assignedTo: "Você",
      completed: false
    };

    setTodos([...todos, newItem]);
    setNewTodoTitle("");
  };

  const handleToggleTodo = (id: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Renderiza o ícone apropriado para o tipo do documento
  const renderDocIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'image':
        return <Images className="h-6 w-6 text-blue-500" />;
      case 'dwg':
        return <PencilLine className="h-6 w-6 text-green-500" />;
      default:
        return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };

  // Renderiza o ícone apropriado para o tipo de atividade
  const renderActivityIcon = (type: string) => {
    switch (type) {
      case 'stage_change':
        return <ArrowRight className="h-4 w-4 text-blue-500" />;
      case 'document':
        return <FileText className="h-4 w-4 text-amber-500" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-emerald-500" />;
      case 'task':
        return <CheckSquare className="h-4 w-4 text-violet-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border overflow-hidden w-full max-w-5xl h-[80vh]">
      {/* Cabeçalho do Card */}
      <div className="bg-slate-900 text-white p-4 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">{clientInfo.project.title}</h2>
            <span className={`text-xs px-2 py-1 rounded-full ${
              clientInfo.project.priority === 'high' ? 'bg-red-500' :
              clientInfo.project.priority === 'medium' ? 'bg-amber-500' :
              'bg-green-500'
            }`}>
              {clientInfo.project.priority === 'high' ? 'Alta' :
               clientInfo.project.priority === 'medium' ? 'Média' :
               'Baixa'}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <User className="h-4 w-4 text-slate-300" />
            <span className="text-sm font-medium text-slate-300">{clientInfo.name}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-white border-white hover:bg-slate-800">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button variant="outline" size="sm" className="text-white border-white hover:bg-slate-800">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="text-white border-white hover:bg-slate-800" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Abas do Card */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b px-4">
          <TabsList className="bg-transparent border-b-0 h-12">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-slate-900 data-[state=active]:shadow-none rounded-none h-12">
              <Info className="mr-2 h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-slate-900 data-[state=active]:shadow-none rounded-none h-12">
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat Interno
            </TabsTrigger>
            <TabsTrigger value="docs" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-slate-900 data-[state=active]:shadow-none rounded-none h-12">
              <FileText className="mr-2 h-4 w-4" />
              Documentos
            </TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-slate-900 data-[state=active]:shadow-none rounded-none h-12">
              <ClipboardList className="mr-2 h-4 w-4" />
              Tarefas
            </TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-slate-900 data-[state=active]:shadow-none rounded-none h-12">
              <BarChart className="mr-2 h-4 w-4" />
              Atividades
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Conteúdo da Aba: Visão Geral */}
        <TabsContent value="overview" className="p-0 h-[calc(80vh-132px)] overflow-y-auto">
          <div className="grid grid-cols-3 gap-4 p-6">
            <div className="col-span-2 space-y-6">
              {/* Informações do Projeto */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg flex items-center">
                      <ClipboardCheck className="mr-2 h-5 w-5 text-blue-500" />
                      Detalhes do Projeto
                    </CardTitle>
                    {!editMode ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditMode(true)}
                      >
                        <PencilLine className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => setEditMode(false)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Salvar
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Descrição</p>
                      {editMode ? (
                        <Textarea
                          value={clientInfo.project.description}
                          onChange={(e) => setClientInfo({
                            ...clientInfo,
                            project: {
                              ...clientInfo.project,
                              description: e.target.value
                            }
                          })}
                          className="h-20"
                        />
                      ) : (
                        <p className="text-sm">{clientInfo.project.description}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Orçamento</p>
                        {editMode ? (
                          <Input
                            value={clientInfo.project.budget}
                            onChange={(e) => setClientInfo({
                              ...clientInfo,
                              project: {
                                ...clientInfo.project,
                                budget: e.target.value
                              }
                            })}
                          />
                        ) : (
                          <p className="text-sm font-medium">{clientInfo.project.budget}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Data de Início</p>
                        {editMode ? (
                          <Input
                            type="date"
                            value={clientInfo.project.startDate}
                            onChange={(e) => setClientInfo({
                              ...clientInfo,
                              project: {
                                ...clientInfo.project,
                                startDate: e.target.value
                              }
                            })}
                          />
                        ) : (
                          <p className="text-sm">
                            {new Date(clientInfo.project.startDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Etapa Atual</p>
                      <div className="flex items-center gap-2">
                        {clientInfo.project.currentStage === 'pre-venda' && (
                          <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Users className="h-3 w-3" /> Pré-Venda
                          </span>
                        )}
                        {clientInfo.project.currentStage === 'venda' && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                            <CreditCard className="h-3 w-3" /> Venda
                          </span>
                        )}
                        {clientInfo.project.currentStage === 'medicao' && (
                          <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Ruler className="h-3 w-3" /> Medição
                          </span>
                        )}
                        {clientInfo.project.currentStage === 'projeto-executivo' && (
                          <span className="bg-indigo-100 text-indigo-800 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                            <PencilLine className="h-3 w-3" /> Projeto Executivo
                          </span>
                        )}
                        {clientInfo.project.currentStage === 'producao' && (
                          <span className="bg-pink-100 text-pink-800 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Factory className="h-3 w-3" /> Produção
                          </span>
                        )}
                        {clientInfo.project.currentStage === 'entrega' && (
                          <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Truck className="h-3 w-3" /> Entrega
                          </span>
                        )}
                        {clientInfo.project.currentStage === 'montagem' && (
                          <span className="bg-orange-100 text-orange-800 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Hammer className="h-3 w-3" /> Montagem
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {clientInfo.project.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {editMode && (
                          <Button variant="outline" size="sm" className="h-6 px-2 rounded-full">
                            <PlusCircle className="h-3 w-3 mr-1" />
                            <span className="text-xs">Adicionar</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Checklist */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <CheckSquare className="mr-2 h-5 w-5 text-green-500" />
                    Checklist do Projeto
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {checklist.map(item => (
                      <div key={item.id} className="flex items-start gap-2 py-1 border-b">
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border ${
                            item.checked
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-primary"
                          }`}
                          onClick={() => handleToggleChecklistItem(item.id)}
                        >
                          {item.checked && <CheckCircle className="h-4 w-4 text-white" />}
                        </div>
                        <div className="grid gap-1 leading-none">
                          <label
                            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                              item.checked ? "line-through text-muted-foreground" : ""
                            }`}
                          >
                            {item.text}
                          </label>
                          <p className="text-xs text-muted-foreground">
                            Adicionado em {item.createdAt}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 mt-4">
                      <Input
                        placeholder="Adicionar novo item..."
                        value={newChecklistItem}
                        onChange={e => setNewChecklistItem(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddChecklistItem();
                          }
                        }}
                      />
                      <Button onClick={handleAddChecklistItem} disabled={!newChecklistItem.trim()}>
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Adicionar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Coluna lateral com informações do cliente */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <User className="mr-2 h-5 w-5 text-amber-500" />
                    Informações do Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarFallback className="bg-slate-200 text-slate-700 font-semibold">
                          {clientInfo.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{clientInfo.name}</h3>
                        <p className="text-xs text-muted-foreground">Cliente desde {new Date(clientInfo.project.startDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{clientInfo.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{clientInfo.phone}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <span className="text-sm">{clientInfo.address}<br />{clientInfo.city}, {clientInfo.state} - {clientInfo.postalCode}</span>
                      </div>
                    </div>

                    <div className="flex justify-center gap-2 mt-2">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-1" />
                        Ligar
                      </Button>
                      <Button variant="default" size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        WhatsApp
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tarefas Pendentes */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-violet-500" />
                    Tarefas Pendentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {todos.map(todo => (
                      <div key={todo.id} className="flex items-start gap-2 py-1 border-b">
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border mt-0.5 ${
                            todo.completed
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-primary"
                          }`}
                          onClick={() => handleToggleTodo(todo.id)}
                        >
                          {todo.completed && <CheckCircle className="h-4 w-4 text-white" />}
                        </div>
                        <div className="grid gap-1 leading-none">
                          <label
                            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                              todo.completed ? "line-through text-muted-foreground" : ""
                            }`}
                          >
                            {todo.title}
                          </label>
                          {todo.description && (
                            <p className={`text-xs ${todo.completed ? "text-muted-foreground line-through" : "text-slate-700"}`}>
                              {todo.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-1">
                            <p className="text-xs text-muted-foreground flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {todo.dueDate}
                            </p>
                            {todo.assignedTo && (
                              <p className="text-xs text-muted-foreground flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                {todo.assignedTo}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 mt-4">
                      <Input
                        placeholder="Nova tarefa..."
                        value={newTodoTitle}
                        onChange={e => setNewTodoTitle(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTodo();
                          }
                        }}
                      />
                      <Button
                        onClick={handleAddTodo}
                        disabled={!newTodoTitle.trim()}
                        size="sm"
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Conteúdo da Aba: Chat Interno */}
        <TabsContent value="chat" className="p-0 h-[calc(80vh-132px)] overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
            <div className="space-y-4">
              {chatMessages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.senderId !== 'current-user' && (
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                      <AvatarFallback className="bg-slate-200 text-slate-700 text-xs">
                        {message.senderName.split(' ')[0][0]}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.senderId === 'current-user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white border shadow-sm'
                    }`}
                  >
                    {message.senderId !== 'current-user' && (
                      <p className="text-xs font-medium text-blue-600 mb-1">{message.senderName}</p>
                    )}

                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {message.attachments.map((attachment, idx) => (
                          <div key={idx} className="bg-slate-100 p-2 rounded flex items-center text-xs">
                            {attachment.type === 'image' ? (
                              <Images className="h-4 w-4 mr-2 text-blue-500" />
                            ) : (
                              <FileText className="h-4 w-4 mr-2 text-red-500" />
                            )}
                            {attachment.name}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className={`text-xs mt-1 flex justify-end ${
                      message.senderId === 'current-user' ? 'text-blue-100' : 'text-slate-400'
                    }`}>
                      {message.timestamp}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Textarea
                  placeholder="Digite uma mensagem para a equipe..."
                  className="min-h-[80px] pr-10 resize-none"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 bottom-2"
                  onClick={() => {}}
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  size="icon"
                  className="shrink-0"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                >
                  <BrainCircuit className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Conteúdo da Aba: Documentos */}
        <TabsContent value="docs" className="p-0 h-[calc(80vh-132px)] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar
                </Button>
                <Input
                  placeholder="Buscar documentos..."
                  className="w-80"
                />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Enviar Documento
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Enviar novo documento</DialogTitle>
                    <DialogDescription>
                      Arraste arquivos ou clique para selecionar
                    </DialogDescription>
                  </DialogHeader>
                  <div className="border-2 border-dashed rounded-lg p-10 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Arraste e solte arquivos aqui ou clique para selecionar
                    </p>
                    <input type="file" className="hidden" />
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancelar</Button>
                    <Button>Enviar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-sm mb-3">Documentos do Projeto</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {clientDocuments.map(doc => (
                    <div
                      key={doc.id}
                      className="flex border rounded-lg p-3 hover:bg-slate-50 transition-colors"
                    >
                      <div className="mr-3 bg-slate-100 p-3 rounded-md">
                        {renderDocIcon(doc.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{doc.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {doc.uploadedAt} • {doc.size}
                          </span>
                          <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                            {doc.type.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Enviado por: {doc.uploadedBy}
                        </p>
                        <div className="flex gap-2 mt-2">
                          {doc.type === 'image' && doc.preview && (
                            <Button variant="outline" size="sm" className="h-7 px-2">
                              <Eye className="h-3 w-3 mr-1" />
                              <span className="text-xs">Visualizar</span>
                            </Button>
                          )}
                          <Button variant="outline" size="sm" className="h-7 px-2">
                            <Download className="h-3 w-3 mr-1" />
                            <span className="text-xs">Baixar</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-sm mb-3">Modelos e Templates</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex border rounded-lg p-3 hover:bg-slate-50 transition-colors">
                    <div className="mr-3 bg-slate-100 p-3 rounded-md">
                      <FileText className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Template_Contrato.docx</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Template padrão para contratos
                      </p>
                      <Button variant="outline" size="sm" className="h-7 px-2 mt-2">
                        <Download className="h-3 w-3 mr-1" />
                        <span className="text-xs">Usar Template</span>
                      </Button>
                    </div>
                  </div>
                  <div className="flex border rounded-lg p-3 hover:bg-slate-50 transition-colors">
                    <div className="mr-3 bg-slate-100 p-3 rounded-md">
                      <FileText className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Template_Orcamento.xlsx</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Planilha para cálculo de orçamentos
                      </p>
                      <Button variant="outline" size="sm" className="h-7 px-2 mt-2">
                        <Download className="h-3 w-3 mr-1" />
                        <span className="text-xs">Usar Template</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Conteúdo da Aba: Tarefas */}
        <TabsContent value="tasks" className="p-0 h-[calc(80vh-132px)] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-medium">Lista de Tarefas</h3>
                <p className="text-sm text-muted-foreground">
                  Gerencie as tarefas relacionadas a este projeto
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Nova Tarefa
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Criar nova tarefa</DialogTitle>
                    <DialogDescription>
                      Adicione uma nova tarefa para este projeto
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Título</label>
                      <Input placeholder="Digite o título da tarefa" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Descrição</label>
                      <Textarea placeholder="Descreva a tarefa em detalhes" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Data de vencimento</label>
                        <Input type="date" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Responsável</label>
                        <select className="w-full p-2 rounded-md border border-gray-300">
                          <option>Selecione</option>
                          <option>Carlos (Vendedor)</option>
                          <option>Paulo (Medidor)</option>
                          <option>Ana (Designer)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancelar</Button>
                    <Button>Criar Tarefa</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-md flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                    Tarefas para Hoje
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {todos.filter(todo => !todo.completed).map(todo => (
                      <div
                        key={todo.id}
                        className="flex items-start gap-3 p-3 border rounded-md hover:bg-slate-50 transition-colors"
                      >
                        <div
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-primary mt-0.5"
                          onClick={() => handleToggleTodo(todo.id)}
                        >
                          {todo.completed && <CheckCircle className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">{todo.title}</h4>
                          {todo.description && (
                            <p className="text-xs text-slate-600 mt-1">{todo.description}</p>
                          )}
                        </div>
                        <div className="text-xs flex flex-col items-end">
                          <span className="text-red-500 font-medium flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {todo.dueDate}
                          </span>
                          {todo.assignedTo && (
                            <span className="text-slate-500 mt-1">{todo.assignedTo}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-md flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Tarefas Concluídas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {todos.filter(todo => todo.completed).map(todo => (
                      <div
                        key={todo.id}
                        className="flex items-start gap-3 p-3 border rounded-md bg-slate-50"
                      >
                        <div
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-primary bg-primary text-primary-foreground mt-0.5"
                          onClick={() => handleToggleTodo(todo.id)}
                        >
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium line-through text-muted-foreground">{todo.title}</h4>
                          {todo.description && (
                            <p className="text-xs text-muted-foreground line-through mt-1">{todo.description}</p>
                          )}
                        </div>
                        <div className="text-xs flex flex-col items-end">
                          <span className="text-slate-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {todo.dueDate}
                          </span>
                          {todo.assignedTo && (
                            <span className="text-slate-500 mt-1">{todo.assignedTo}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Conteúdo da Aba: Atividades */}
        <TabsContent value="timeline" className="p-0 h-[calc(80vh-132px)] overflow-y-auto">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Histórico de Atividades</h3>

            <div className="relative border-l-2 border-slate-200 pl-6 ml-4">
              {activities.map((activity, index) => (
                <div key={activity.id} className="mb-8 relative">
                  <div className="absolute -left-8 top-0 h-6 w-6 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center">
                    {renderActivityIcon(activity.type)}
                  </div>

                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{activity.user}</span>
                      <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                    </div>
                    <p className="text-sm">{activity.description}</p>
                    {activity.details && (
                      <p className="text-xs mt-1 bg-slate-50 p-2 rounded">{activity.details}</p>
                    )}
                  </div>
                </div>
              ))}

              <div className="absolute -left-[0.4375rem] top-0 h-3 w-3 rounded-full bg-slate-300"></div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
