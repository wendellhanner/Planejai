"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  Search,
  MoreVertical,
  Phone,
  Video,
  Smile,
  Paperclip,
  Mic,
  Send,
  Check,
  CheckCheck,
  Clock,
  Image as ImageIcon,
  Filter,
  X,
  Users,
  ChevronDown,
  ChevronLeft,
  ArrowLeft,
  MessageSquare,
  AlertTriangle,
  UserPlus,
  Hash,
  Info,
  Plus,
  Pin,
  ArrowRight,
  FileText,
  ExternalLink,
  Bell,
  BellOff,
  Settings,
  BarChart,
  BadgeCheck,
  User
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

// Tipos para o sistema de chat interno
type MessageStatus = "sent" | "delivered" | "read";
type Role = "ADMIN" | "VENDEDOR" | "DESIGNER" | "PRODUCAO" | "MONTAGEM" | "FINANCEIRO";
type ChatType = "direct" | "group";

interface User {
  id: number;
  name: string;
  avatar: string;
  role: Role;
  online: boolean;
  email?: string;
  department?: string;
}

interface Message {
  id: number;
  sender: number;
  content: string;
  timestamp: string;
  date: string;
  status: MessageStatus;
  attachments?: {
    type: "image" | "document" | "voice";
    url: string;
    name?: string;
    size?: string;
  }[];
  mentions?: number[];
  replyTo?: {
    id: number;
    content: string;
    sender: number;
  };
}

interface DirectChat {
  id: number;
  userId: number;
  unread: number;
  lastMessage: string;
  lastMessageTime: string;
  pinned?: boolean;
  muted?: boolean;
}

interface GroupChat {
  id: number;
  name: string;
  description: string;
  members: number[];
  avatar: string;
  unread: number;
  lastMessage: string;
  lastMessageTime: string;
  pinned?: boolean;
  muted?: boolean;
  createdBy?: number;
  createdAt?: string;
}

// Função para formatar a data e hora
const formatDateTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Dados simulados para o chat interno
const mockUsers: User[] = [
  { id: 1, name: "Carlos Mendes", avatar: "CM", role: "ADMIN", online: true },
  { id: 2, name: "Ana Costa", avatar: "AC", role: "VENDEDOR", online: true },
  { id: 3, name: "Roberto Alves", avatar: "RA", role: "VENDEDOR", online: false },
  { id: 4, name: "Juliana Mendes", avatar: "JM", role: "PRODUCAO", online: true },
  { id: 5, name: "André Santos", avatar: "AS", role: "PRODUCAO", online: true },
  { id: 6, name: "Ricardo Alves", avatar: "RS", role: "PRODUCAO", online: false },
  { id: 7, name: "Marina Costa", avatar: "MC", role: "DESIGNER", online: true },
  { id: 8, name: "Thiago Mendonça", avatar: "TM", role: "DESIGNER", online: false },
  { id: 9, name: "Carla Ferreira", avatar: "CF", role: "DESIGNER", online: true },
  { id: 10, name: "Lucas Silva", avatar: "LS", role: "MONTAGEM", online: true },
  { id: 11, name: "Fernanda Lima", avatar: "FL", role: "FINANCEIRO", online: true },
  { id: 12, name: "Pedro Oliveira", avatar: "PO", role: "MONTAGEM", online: false },
];

const mockGroups: GroupChat[] = [
  {
    id: 1,
    name: "Equipe de Vendas",
    description: "Grupo para discussões da equipe de vendas",
    members: [1, 2, 3],
    avatar: "EV",
    unread: 2,
    lastMessage: "Ana: Alguém pode me ajudar com o orçamento do cliente Silva?",
    lastMessageTime: "10:30",
    pinned: true
  },
  {
    id: 2,
    name: "Equipe de Produção",
    description: "Grupo para coordenação da produção",
    members: [1, 4, 5, 6],
    avatar: "EP",
    unread: 0,
    lastMessage: "André: Acabamos a produção do pedido #123",
    lastMessageTime: "11:15"
  },
  {
    id: 3,
    name: "Designers",
    description: "Grupo dos projetistas e designers",
    members: [7, 8, 9],
    avatar: "DS",
    unread: 3,
    lastMessage: "Marina: Compartilhei os novos templates no drive",
    lastMessageTime: "09:45"
  },
  {
    id: 4,
    name: "Projeto Corporativo ABC",
    description: "Grupo para o projeto da empresa ABC",
    members: [1, 2, 5, 7, 9],
    avatar: "PC",
    unread: 5,
    lastMessage: "Carlos: Reunião com cliente amanhã às 14h",
    lastMessageTime: "Ontem",
    muted: true
  },
  {
    id: 5,
    name: "Geral",
    description: "Grupo geral para todos os colaboradores",
    members: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    avatar: "GR",
    unread: 0,
    lastMessage: "Carlos: Lembrem-se da reunião geral na sexta-feira",
    lastMessageTime: "Seg"
  }
];

const mockDirectChats: DirectChat[] = [
  {
    id: 101,
    userId: 2,
    unread: 1,
    lastMessage: "Podemos conversar sobre o cliente João Silva?",
    lastMessageTime: "12:05"
  },
  {
    id: 102,
    userId: 7,
    unread: 0,
    lastMessage: "Os projetos da semana estão prontos",
    lastMessageTime: "Ontem",
    pinned: true
  },
  {
    id: 103,
    userId: 4,
    unread: 2,
    lastMessage: "Precisamos revisar o cronograma de produção",
    lastMessageTime: "09:30"
  },
  {
    id: 104,
    userId: 11,
    unread: 0,
    lastMessage: "Os pagamentos foram processados",
    lastMessageTime: "Qua",
    muted: true
  }
];

const mockMessages: Record<string, Message[]> = {
  group1: [
    {
      id: 1,
      sender: 2,
      content: "Bom dia pessoal! Alguém pode me ajudar com o orçamento do cliente Silva?",
      timestamp: "10:30",
      date: "Hoje",
      status: "read"
    },
    {
      id: 2,
      sender: 3,
      content: "Qual orçamento? O da cozinha ou do escritório?",
      timestamp: "10:32",
      date: "Hoje",
      status: "read"
    },
    {
      id: 3,
      sender: 2,
      content: "Da cozinha. Estou com dúvidas sobre os valores dos acessórios.",
      timestamp: "10:33",
      date: "Hoje",
      status: "read"
    },
    {
      id: 4,
      sender: 1,
      content: "Ana, enviei uma tabela atualizada por e-mail com os novos valores. Dá uma olhada lá.",
      timestamp: "10:35",
      date: "Hoje",
      status: "delivered"
    }
  ],
  group4: [
    {
      id: 1,
      sender: 1,
      content: "Pessoal, teremos reunião com o cliente ABC amanhã às 14h. Todos confirmados?",
      timestamp: "16:45",
      date: "Ontem",
      status: "read"
    },
    {
      id: 2,
      sender: 2,
      content: "Confirmado para mim!",
      timestamp: "16:50",
      date: "Ontem",
      status: "read"
    },
    {
      id: 3,
      sender: 7,
      content: "Eu também estarei presente. Vou levar as últimas atualizações do projeto.",
      timestamp: "17:05",
      date: "Ontem",
      status: "read"
    },
    {
      id: 4,
      sender: 5,
      content: "Confirmado. Trago as informações de produção atualizadas.",
      timestamp: "17:30",
      date: "Ontem",
      status: "read"
    }
  ],
  user2: [
    {
      id: 1,
      sender: 2,
      content: "Oi Carlos, podemos conversar sobre o cliente João Silva?",
      timestamp: "12:05",
      date: "Hoje",
      status: "read"
    },
    {
      id: 2,
      sender: 1,
      content: "Claro, Ana. O que você precisa saber?",
      timestamp: "12:08",
      date: "Hoje",
      status: "read"
    },
    {
      id: 3,
      sender: 2,
      content: "Ele solicitou algumas alterações no projeto. Posso passar para a Marina implementar?",
      timestamp: "12:10",
      date: "Hoje",
      status: "read"
    },
    {
      id: 4,
      sender: 1,
      content: "Sim, pode passar para ela. Só certifique-se de que não haverá cobrança adicional, pois já incluímos uma revisão no orçamento.",
      timestamp: "12:15",
      date: "Hoje",
      status: "delivered"
    }
  ],
  user7: [
    {
      id: 1,
      sender: 7,
      content: "Carlos, os projetos da semana estão prontos para revisão.",
      timestamp: "14:30",
      date: "Ontem",
      status: "read"
    },
    {
      id: 2,
      sender: 1,
      content: "Ótimo, Marina! Vou dar uma olhada ainda hoje.",
      timestamp: "14:45",
      date: "Ontem",
      status: "read"
    },
    {
      id: 3,
      sender: 7,
      content: "Perfeito! Qualquer ajuste me avise.",
      timestamp: "15:00",
      date: "Ontem",
      status: "read"
    },
    {
      id: 4,
      sender: 1,
      content: "Claro, assim que terminar a revisão te dou um retorno.",
      timestamp: "15:05",
      date: "Ontem",
      status: "read",
      replyTo: {
        id: 3,
        content: "Perfeito! Qualquer ajuste me avise.",
        sender: 7
      }
    }
  ],
  user4: [
    {
      id: 1,
      sender: 4,
      content: "Carlos, precisamos revisar o cronograma de produção desta semana.",
      timestamp: "09:25",
      date: "Hoje",
      status: "read"
    },
    {
      id: 2,
      sender: 4,
      content: "Temos três entregas agendadas e estamos com falta de material para uma delas.",
      timestamp: "09:27",
      date: "Hoje",
      status: "read"
    },
    {
      id: 3,
      sender: 4,
      content: "Precisamos decidir se vamos postergar ou fazer um pedido emergencial.",
      timestamp: "09:30",
      date: "Hoje",
      status: "read"
    }
  ]
};

export default function InternalChatComponent() {
  // Estado e session
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeChat, setActiveChat] = useState<null | GroupChat | (DirectChat & {name: string, avatar: string, online: boolean})>(null);
  const [chatType, setChatType] = useState<ChatType | "">("");
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    members: [] as number[]
  });
  const [sendingMessage, setSendingMessage] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState<Role | "">("");
  const [createDirectChatOpen, setCreateDirectChatOpen] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Rolar para o final das mensagens sempre que elas mudarem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Carregar preferência de visualização compacta do localStorage
  useEffect(() => {
    const savedCompactView = localStorage.getItem('chatCompactView');
    if (savedCompactView !== null) {
      setCompactView(savedCompactView === 'true');
    }
  }, []);

  // Simular carregamento de mensagens quando um chat é selecionado
  useEffect(() => {
    if (activeChat) {
      setLoading(true);
      setTimeout(() => {
        if (chatType === "group") {
          const groupMessages = mockMessages[`group${activeChat.id}`] || [];
          setMessages(groupMessages);
        } else if (chatType === "direct") {
          const directChat = activeChat as DirectChat & {userId: number};
          const userMessages = mockMessages[`user${directChat.userId}`] || [];
          setMessages(userMessages);
        }
        setLoading(false);
      }, 700);
    } else {
      setMessages([]);
    }
  }, [activeChat, chatType]);

  // Função para alternar visualização compacta
  const toggleCompactView = () => {
    const newState = !compactView;
    setCompactView(newState);
    localStorage.setItem('chatCompactView', String(newState));
  };

  // Obter conversas filtradas com base na pesquisa e na aba
  const getFilteredChats = () => {
    // Enriquecer os chats diretos com informações do usuário
    const allDirectChats = mockDirectChats.map(chat => {
      const user = mockUsers.find(u => u.id === chat.userId);
      return {
        ...chat,
        name: user?.name || "Usuário",
        avatar: user?.avatar || "??",
        online: user?.online || false,
        role: user?.role
      };
    });

    // Filtrar por termo de busca
    const filteredGroups = mockGroups.filter(group =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredDirects = allDirectChats.filter(chat =>
      chat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filtrar por departamento se o filtro estiver ativo
    const deptFilteredDirects = departmentFilter
      ? filteredDirects.filter(chat => chat.role === departmentFilter)
      : filteredDirects;

    // Filtrar por tipo
    if (activeTab === "todos") {
      const allChats = [...filteredGroups, ...deptFilteredDirects];
      // Ordenar chats fixados primeiro
      return allChats.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    } else if (activeTab === "grupos") {
      return filteredGroups;
    } else if (activeTab === "diretos") {
      return deptFilteredDirects;
    } else if (activeTab === "unread") {
      return [...filteredGroups, ...deptFilteredDirects].filter(chat => chat.unread > 0);
    } else if (activeTab === "pinned") {
      return [...filteredGroups, ...deptFilteredDirects].filter(chat => chat.pinned);
    }

    return [];
  };

  // Função para enviar mensagem
  const handleSendMessage = () => {
    if (!inputMessage.trim() || !activeChat) return;

    setSendingMessage(true);
    const now = new Date();
    const timeString = formatDateTime(now);

    const newMessage: Message = {
      id: Date.now(),
      sender: 1, // ID do usuário atual (Carlos)
      content: inputMessage,
      timestamp: timeString,
      date: "Hoje",
      status: "sent",
      ...(replyingTo && { replyTo: {
        id: replyingTo.id,
        content: replyingTo.content,
        sender: replyingTo.sender
      }})
    };

    setTimeout(() => {
      setMessages(prev => [...prev, newMessage]);
      setInputMessage("");
      setSendingMessage(false);
      setReplyingTo(null);

      // Atualizar o último status da mensagem na lista de chats
      if (chatType === "direct") {
        const updatedDirectChats = mockDirectChats.map(chat => {
          if ((activeChat as DirectChat).userId === chat.userId) {
            return {
              ...chat,
              lastMessage: inputMessage,
              lastMessageTime: timeString,
              unread: 0 // Reset unread count for the current user
            };
          }
          return chat;
        });
        //mockDirectChats = updatedDirectChats;
      } else if (chatType === "group") {
        const updatedGroups = mockGroups.map(group => {
          if ((activeChat as GroupChat).id === group.id) {
            return {
              ...group,
              lastMessage: `Você: ${inputMessage}`,
              lastMessageTime: timeString,
              unread: 0 // Reset unread count for the current user
            };
          }
          return group;
        });
        //mockGroups = updatedGroups;
      }

      // Focar novamente no input depois de enviar
      if (messageInputRef.current) {
        messageInputRef.current.focus();
      }

      // Simular resposta em conversas diretas
      if (chatType === "direct" && Math.random() > 0.6) {
        setTimeout(() => {
          const responseMessage: Message = {
            id: Date.now() + 1,
            sender: (activeChat as DirectChat & {userId: number}).userId,
            content: "Ok, entendi! Obrigado pela informação.",
            timestamp: formatDateTime(new Date(now.getTime() + 120000)), // 2 minutos depois
            date: "Hoje",
            status: "read"
          };

          setMessages(prev => [...prev, responseMessage]);

          // Notificar com toast
          const userName = mockUsers.find(u => u.id === (activeChat as DirectChat & {userId: number}).userId)?.name;
          toast.info(`Nova mensagem de ${userName}`, {
            duration: 3000,
            position: "bottom-right"
          });
        }, 3000);
      }
    }, 700);
  };

  // Função para criar novo grupo
  const handleCreateGroup = () => {
    if (newGroup.name.trim() === "") {
      toast.error("Preencha o nome do grupo");
      return;
    }

    if (newGroup.members.length === 0) {
      toast.error("Selecione pelo menos um membro para o grupo");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Adiciona o usuário atual ao grupo
      const membersWithCurrentUser = [1, ...newGroup.members];

      // Criar um novo grupo
      const newGroupChat: GroupChat = {
        id: mockGroups.length + 10, // ID único
        name: newGroup.name,
        description: newGroup.description || "Novo grupo de discussão",
        members: membersWithCurrentUser,
        avatar: newGroup.name.substring(0, 2).toUpperCase(),
        unread: 0,
        lastMessage: "Grupo criado por você",
        lastMessageTime: formatDateTime(new Date()),
        createdBy: 1,
        createdAt: new Date().toISOString()
      };

      // Adicionar o grupo à lista e selecioná-lo
      mockGroups.unshift(newGroupChat);

      setActiveChat(newGroupChat);
      setChatType("group");
      setCreateGroupOpen(false);
      setLoading(false);

      // Criar mensagem de sistema para o novo grupo
      const systemMessage: Message = {
        id: Date.now(),
        sender: 1,
        content: `Grupo "${newGroup.name}" criado por você`,
        timestamp: formatDateTime(new Date()),
        date: "Hoje",
        status: "read"
      };

      // Adicionar a mensagem ao novo grupo
      mockMessages[`group${newGroupChat.id}`] = [systemMessage];

      // Reset form
      setNewGroup({
        name: "",
        description: "",
        members: []
      });

      toast.success("Grupo criado com sucesso!");
    }, 1000);
  };

  // Função para iniciar um chat direto
  const handleStartDirectChat = (userId: number) => {
    // Verificar se já existe um chat com este usuário
    const existingChat = mockDirectChats.find(chat => chat.userId === userId);

    if (existingChat) {
      // Se já existe, seleciona o chat
      const user = mockUsers.find(u => u.id === userId);
      if (user) {
        setActiveChat({
          ...existingChat,
          name: user.name,
          avatar: user.avatar,
          online: user.online
        });
        setChatType("direct");
      }
    } else {
      // Se não existe, cria um novo chat
      const user = mockUsers.find(u => u.id === userId);
      if (user) {
        const newDirectChat: DirectChat & {name: string, avatar: string, online: boolean} = {
          id: Date.now(),
          userId: userId,
          unread: 0,
          lastMessage: "Iniciando conversa",
          lastMessageTime: formatDateTime(new Date()),
          name: user.name,
          avatar: user.avatar,
          online: user.online
        };

        // Adicionar à lista de chats
        mockDirectChats.unshift({
          id: newDirectChat.id,
          userId: newDirectChat.userId,
          unread: 0,
          lastMessage: "Iniciando conversa",
          lastMessageTime: formatDateTime(new Date())
        });

        setActiveChat(newDirectChat);
        setChatType("direct");

        // Criar mensagem de sistema
        mockMessages[`user${userId}`] = [];
      }
    }
    setCreateDirectChatOpen(false);
  };

  // Funções de utilidade
  const getUserById = (id: number) => {
    return mockUsers.find(user => user.id === id) || { id: 0, name: "Usuário", avatar: "?", role: "ADMIN" as Role, online: false };
  };

  const getMessageStatusIcon = (status: MessageStatus) => {
    switch (status) {
      case "sent":
        return <Check className="h-3 w-3" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-green-400" />;
      default:
        return null;
    }
  };

  // Handler para upload de arquivos
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Simular envio de arquivo
      toast.info(`Enviando arquivo: ${files[0].name}`);

      // Limpar input para permitir o mesmo arquivo ser selecionado novamente
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Renderização de itens de chat
  const renderChatItem = (chat: GroupChat | (DirectChat & {name: string, avatar: string, online: boolean})) => {
    const isGroup = 'members' in chat;
    const isActive = activeChat && (
      (chatType === "group" && isGroup && activeChat.id === chat.id) ||
      (chatType === "direct" && !isGroup && (activeChat as DirectChat & {userId: number}).userId === (chat as DirectChat & {userId: number}).userId)
    );

    return (
      <div
        key={isGroup ? `group-${chat.id}` : `direct-${chat.id}`}
        className={`flex items-center gap-3 p-3 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer border-b border-slate-200 dark:border-slate-700 transition-colors ${
          isActive ? 'bg-slate-100 dark:bg-slate-800' : ''
        } ${chat.pinned ? 'border-l-2 border-l-blue-500 dark:border-l-blue-400' : ''}`}
        onClick={() => {
          setLoading(true);
          setActiveChat(chat);
          setChatType(isGroup ? "group" : "direct");
        }}
      >
        <div className="relative">
          <Avatar className={`${compactView ? 'h-9 w-9' : 'h-11 w-11'} transition-all`}>
            <AvatarFallback className={`${isGroup ? 'bg-indigo-600' : 'bg-blue-600'} text-white`}>
              {chat.avatar}
            </AvatarFallback>
          </Avatar>
          {!isGroup && chat.online && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-slate-900"></span>
          )}
          {chat.muted && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 flex items-center justify-center">
              <BellOff className="h-2.5 w-2.5 text-slate-500 dark:text-slate-400" />
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <h3 className={`font-medium text-slate-900 dark:text-slate-100 truncate ${compactView ? 'text-sm' : ''} ${chat.pinned ? 'font-semibold' : ''}`}>
              {chat.name}
              {isGroup && !compactView && (
                <span className="ml-2 text-xs font-normal text-slate-500 dark:text-slate-400">
                  {(chat as GroupChat).members.length} membros
                </span>
              )}
            </h3>
            <div className="flex items-center">
              {chat.pinned && (
                <Pin className="h-3 w-3 text-blue-500 mr-1.5" />
              )}
              <span className={`text-xs ${chat.unread > 0 ? 'text-blue-600 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                {chat.lastMessageTime}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-1">
            <p className={`text-sm text-slate-500 dark:text-slate-400 truncate ${compactView ? 'text-xs' : ''}`}>
              {chat.lastMessage}
            </p>
            {chat.unread > 0 && (
              <Badge
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {chat.unread}
              </Badge>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Renderização do componente principal
  return (
    <div className="h-[calc(100vh-170px)] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
      <div className="h-full flex flex-col md:flex-row">
        {/* Sidebar - Lista de Chats */}
        <div className={`${activeChat ? 'hidden md:block' : 'block'} w-full md:w-80 border-r border-slate-200 dark:border-slate-700 flex flex-col`}>
          {/* Header da lista de chats */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold dark:text-white flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
              Conversas
            </h2>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-slate-500"
                      onClick={() => setCreateDirectChatOpen(true)}
                    >
                      <User className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Nova conversa direta</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-slate-500"
                      onClick={() => setCreateGroupOpen(true)}
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Novo grupo</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-slate-500"
                      onClick={() => setShowFilterPanel(!showFilterPanel)}
                    >
                      <Filter className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Filtrar conversas</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Barra de pesquisa e filtros */}
          <div className="p-3 border-b border-slate-200 dark:border-slate-700">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <Input
                placeholder="Buscar conversas..."
                className="pl-9 h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {showFilterPanel && (
              <div className="mb-3 p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs text-slate-500">Filtrar por departamento</Label>
                    {departmentFilter && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 py-0 text-xs"
                        onClick={() => setDepartmentFilter("")}
                      >
                        Limpar
                      </Button>
                    )}
                  </div>
                  <Select value={departmentFilter} onValueChange={(value) => setDepartmentFilter(value as Role)}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Todos departamentos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos departamentos</SelectItem>
                      <SelectItem value="VENDEDOR">Vendas</SelectItem>
                      <SelectItem value="DESIGNER">Design</SelectItem>
                      <SelectItem value="PRODUCAO">Produção</SelectItem>
                      <SelectItem value="MONTAGEM">Montagem</SelectItem>
                      <SelectItem value="FINANCEIRO">Financeiro</SelectItem>
                      <SelectItem value="ADMIN">Administração</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex justify-between items-center">
                    <Label className="text-xs text-slate-500">Visualização</Label>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="compact-view" className="text-xs text-slate-500">Compactar</Label>
                      <Switch
                        id="compact-view"
                        checked={compactView}
                        onCheckedChange={toggleCompactView}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-5 w-full h-8">
                <TabsTrigger value="todos" className="text-xs">Todos</TabsTrigger>
                <TabsTrigger value="grupos" className="text-xs">Grupos</TabsTrigger>
                <TabsTrigger value="diretos" className="text-xs">Diretos</TabsTrigger>
                <TabsTrigger value="unread" className="text-xs relative">
                  Não lidos
                  {getFilteredChats().filter(chat => chat.unread > 0).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 rounded-full w-4 h-4 flex items-center justify-center text-[8px] text-white">
                      {getFilteredChats().filter(chat => chat.unread > 0).length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="pinned" className="text-xs">
                  Fixados
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Lista de chats */}
          <ScrollArea className="flex-1">
            {getFilteredChats().length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <MessageSquare className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-slate-500 dark:text-slate-400">
                  Nenhuma conversa encontrada
                </p>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
                  Tente outro termo de busca ou crie uma nova conversa
                </p>
              </div>
            ) : (
              <div>
                {getFilteredChats().map(chat => renderChatItem(chat))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Área do Chat */}
        <div className={`${activeChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col h-full`}>
          {activeChat ? (
            <>
              {/* Header do chat */}
              <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 mr-1 md:hidden"
                    onClick={() => {
                      setActiveChat(null);
                      setChatType("");
                    }}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>

                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={`${chatType === 'group' ? 'bg-indigo-600' : 'bg-blue-600'} text-white`}>
                      {activeChat.avatar}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-slate-900 dark:text-slate-100">
                        {activeChat.name}
                      </h3>
                      {chatType === 'direct' && (activeChat as any).online && (
                        <Badge variant="outline" className="h-5 px-1 text-[10px] border-green-500 text-green-600 dark:text-green-400 gap-1 flex items-center">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                          Online
                        </Badge>
                      )}
                      {activeChat.muted && (
                        <Badge variant="outline" className="h-5 px-1 text-[10px] border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 gap-1 flex items-center">
                          <BellOff className="h-3 w-3" />
                          Silenciado
                        </Badge>
                      )}
                    </div>
                    {chatType === 'group' ? (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {(activeChat as GroupChat).members.length} membros • {(activeChat as GroupChat).description}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {(activeChat as any).online ? 'Disponível para chat' : 'Offline'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {chatType === 'direct' && (
                    <>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hidden md:flex">
                              <Phone className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Chamada de voz</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hidden md:flex">
                              <Video className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Chamada de vídeo</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </>
                  )}

                  {chatType === 'group' && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hidden md:flex">
                            <Users className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Ver membros</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Opções</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {chatType === 'group' && (
                        <>
                          <DropdownMenuItem>
                            <Users className="h-4 w-4 mr-2" />
                            Ver membros
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Adicionar membros
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem>
                        <Search className="h-4 w-4 mr-2" />
                        Buscar mensagens
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        {activeChat.pinned ? (
                          <>
                            <Pin className="h-4 w-4 mr-2 text-blue-500" />
                            Desafixar conversa
                          </>
                        ) : (
                          <>
                            <Pin className="h-4 w-4 mr-2" />
                            Fixar conversa
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        {activeChat.muted ? (
                          <>
                            <Bell className="h-4 w-4 mr-2" />
                            Ativar notificações
                          </>
                        ) : (
                          <>
                            <BellOff className="h-4 w-4 mr-2" />
                            Silenciar notificações
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <X className="h-4 w-4 mr-2 text-red-600" />
                        {chatType === 'group' ? 'Sair do grupo' : 'Apagar conversa'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Área de mensagens */}
              <ScrollArea className="flex-1 p-4 bg-slate-50 dark:bg-slate-900">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((_, index) => (
                      <div key={index} className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'} mb-4`}>
                        <div className={`max-w-[75%] flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} gap-2`}>
                          {index % 2 === 0 && (
                            <Skeleton className="h-8 w-8 rounded-full" />
                          )}
                          <div>
                            {index % 2 === 0 && (
                              <Skeleton className="h-4 w-24 mb-1" />
                            )}
                            <Skeleton className={`h-16 w-64 rounded-lg ${index % 2 === 0 ? 'rounded-tl-none' : 'rounded-tr-none'}`} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <MessageSquare className="h-16 w-16 text-slate-300 dark:text-slate-700 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                      {chatType === 'group' ? 'Novo Grupo' : 'Nova Conversa'}
                    </h3>
                    <p className="text-center text-slate-500 dark:text-slate-400 max-w-md mb-4">
                      {chatType === 'group'
                        ? 'Este grupo foi criado para colaboração. Comece enviando uma mensagem.'
                        : 'Comece a conversar enviando uma mensagem.'}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        messageInputRef.current?.focus();
                      }}
                    >
                      Iniciar conversa
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => {
                      const isMe = message.sender === 1; // ID do usuário atual
                      const user = getUserById(message.sender);
                      const previousMessage = index > 0 ? messages[index - 1] : null;
                      const showSender = !previousMessage || previousMessage.sender !== message.sender;
                      const showDate = !previousMessage || previousMessage.date !== message.date;

                      return (
                        <div key={message.id}>
                          {showDate && (
                            <div className="flex justify-center my-4">
                              <span className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded-full">
                                {message.date}
                              </span>
                            </div>
                          )}

                          <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-2 group`}>
                            <div className={`max-w-[75%] flex ${isMe ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
                              {!isMe && showSender && (
                                <Avatar className="h-8 w-8 mt-1">
                                  <AvatarFallback className="bg-blue-600 text-white">
                                    {user.avatar}
                                  </AvatarFallback>
                                </Avatar>
                              )}

                              <div>
                                {!isMe && showSender && (
                                  <div className="text-xs font-medium text-slate-900 dark:text-slate-300 mb-1 ml-1">
                                    {user.name}
                                  </div>
                                )}

                                {message.replyTo && (
                                  <div className={`mx-1 p-2 mb-1 text-xs border-l-2 rounded ${
                                    isMe
                                      ? 'border-blue-300 bg-blue-50 dark:bg-blue-950 dark:border-blue-700'
                                      : 'border-slate-300 bg-slate-50 dark:bg-slate-800 dark:border-slate-600'
                                  }`}>
                                    <div className="font-medium mb-1">
                                      {message.replyTo.sender === 1 ? 'Você' : getUserById(message.replyTo.sender).name}
                                    </div>
                                    <div className="line-clamp-2 text-slate-600 dark:text-slate-400">
                                      {message.replyTo.content}
                                    </div>
                                  </div>
                                )}

                                <div className={`relative px-4 py-2 rounded-lg ${
                                  isMe
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700'
                                } group-hover:shadow-sm transition-shadow`}>
                                  <div className="whitespace-pre-wrap">{message.content}</div>
                                  <div className={`text-[10px] mt-1 flex justify-end items-center gap-1 ${
                                    isMe ? 'text-blue-200' : 'text-slate-500 dark:text-slate-400'
                                  }`}>
                                    {message.timestamp}
                                    {isMe && getMessageStatusIcon(message.status)}
                                  </div>

                                  <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-500 dark:text-slate-400">
                                          <MoreVertical className="h-3 w-3" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align={isMe ? "end" : "start"} side="top" className="w-40">
                                        <DropdownMenuItem className="text-xs py-1.5" onClick={() => setReplyingTo(message)}>
                                          <ArrowRight className="h-3.5 w-3.5 mr-2" />
                                          Responder
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-xs py-1.5">
                                          <Pin className="h-3.5 w-3.5 mr-2" />
                                          Fixar mensagem
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-xs py-1.5">
                                          <Copy className="h-3.5 w-3.5 mr-2" />
                                          Copiar texto
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-xs py-1.5 text-red-600">
                                          <X className="h-3.5 w-3.5 mr-2" />
                                          {isMe ? 'Apagar' : 'Reportar'}
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Responder a mensagem */}
              {replyingTo && (
                <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-start">
                  <div className="flex-1 pl-4 border-l-2 border-blue-500">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        Respondendo para {replyingTo.sender === 1 ? 'Você' : getUserById(replyingTo.sender).name}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => setReplyingTo(null)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {replyingTo.content}
                    </p>
                  </div>
                </div>
              )}

              {/* Área de input */}
              <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full" onClick={handleFileUpload}>
                          <Paperclip className="h-5 w-5 text-slate-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Anexar arquivo</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <div className="relative flex-1">
                    <Textarea
                      ref={messageInputRef}
                      placeholder="Digite sua mensagem..."
                      className="resize-none pl-3 py-2 min-h-[40px] max-h-[120px] pr-10 focus:ring-1 focus:ring-blue-500 transition-all"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      rows={1}
                    />
                  </div>

                  {inputMessage.trim() ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0 rounded-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                      onClick={handleSendMessage}
                      disabled={sendingMessage}
                    >
                      {sendingMessage ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </Button>
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full">
                            <Mic className="h-5 w-5 text-slate-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enviar áudio</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
                <MessageSquare className="h-12 w-12 text-slate-400 dark:text-slate-600" />
              </div>
              <h2 className="text-xl font-medium text-slate-900 dark:text-slate-100 mb-2">Chat Interno</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-md">
                Selecione uma conversa para começar a comunicação com a equipe
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => setCreateGroupOpen(true)}
                >
                  <UserPlus className="h-4 w-4" />
                  Criar novo grupo
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => setCreateDirectChatOpen(true)}
                >
                  <User className="h-4 w-4" />
                  Iniciar chat direto
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal para criar novo grupo */}
      <Dialog open={createGroupOpen} onOpenChange={setCreateGroupOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Criar Novo Grupo</DialogTitle>
            <DialogDescription>
              Crie um grupo para comunicação entre colaboradores
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={newGroup.name}
                onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                placeholder="Nome do grupo"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descrição
              </Label>
              <Input
                id="description"
                value={newGroup.description}
                onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                placeholder="Descrição do grupo"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Membros
              </Label>
              <div className="col-span-3">
                <Select
                  value=""
                  onValueChange={(value) => {
                    if (value && !newGroup.members.includes(Number.parseInt(value))) {
                      setNewGroup({
                        ...newGroup,
                        members: [...newGroup.members, Number.parseInt(value)]
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Adicionar membros" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Colaboradores</SelectLabel>
                      {mockUsers
                        .filter(user => user.id !== 1) // Excluir usuário atual
                        .map(user => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.name} ({user.role})
                          </SelectItem>
                        ))
                      }
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <div className="mt-3 flex flex-wrap gap-2">
                  {newGroup.members.map(memberId => {
                    const user = getUserById(memberId);
                    return (
                      <Badge key={memberId} variant="secondary" className="gap-1 px-2 py-1">
                        {user.name}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1 text-slate-500 hover:text-slate-700"
                          onClick={() => setNewGroup({
                            ...newGroup,
                            members: newGroup.members.filter(id => id !== memberId)
                          })}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    );
                  })}
                  {newGroup.members.length === 0 && (
                    <span className="text-sm text-slate-500">Nenhum membro selecionado</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateGroupOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateGroup} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Grupo'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para criar chat direto */}
      <Dialog open={createDirectChatOpen} onOpenChange={setCreateDirectChatOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Iniciar Conversa</DialogTitle>
            <DialogDescription>
              Selecione um colaborador para iniciar uma conversa
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-4">
              <Label className="text-sm mb-2 block">Filtrar por departamento</Label>
              <Select
                value={departmentFilter}
                onValueChange={(value) => setDepartmentFilter(value as Role)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos departamentos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos departamentos</SelectItem>
                  <SelectItem value="VENDEDOR">Vendas</SelectItem>
                  <SelectItem value="DESIGNER">Design</SelectItem>
                  <SelectItem value="PRODUCAO">Produção</SelectItem>
                  <SelectItem value="MONTAGEM">Montagem</SelectItem>
                  <SelectItem value="FINANCEIRO">Financeiro</SelectItem>
                  <SelectItem value="ADMIN">Administração</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4">
              <Label className="text-sm mb-2 block">Pesquisar colaborador</Label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Digite o nome..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto">
              {mockUsers
                .filter(user => user.id !== 1) // Excluir usuário atual
                .filter(user => !departmentFilter || user.role === departmentFilter)
                .filter(user => !searchTerm || user.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(user => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer rounded-md"
                    onClick={() => handleStartDirectChat(user.id)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-600 text-white">
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-slate-900 dark:text-slate-100">
                          {user.name}
                        </h3>
                        {user.online && (
                          <Badge variant="outline" className="h-5 px-1 text-[10px] border-green-500 text-green-600 dark:text-green-400 gap-1 flex items-center">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                            Online
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {user.role}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <MessageSquare className="h-4 w-4 text-blue-500" />
                    </Button>
                  </div>
                ))}

              {mockUsers
                .filter(user => user.id !== 1) // Excluir usuário atual
                .filter(user => !departmentFilter || user.role === departmentFilter)
                .filter(user => !searchTerm || user.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .length === 0 && (
                  <div className="text-center p-4">
                    <p className="text-slate-500 dark:text-slate-400">
                      Nenhum colaborador encontrado
                    </p>
                  </div>
                )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDirectChatOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
