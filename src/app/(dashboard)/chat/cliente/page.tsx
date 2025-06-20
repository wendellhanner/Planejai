"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  AlertTriangle,
  Loader2,
  MessageCircle,
  RefreshCcw,
  Search,
  MoreVertical,
  Filter,
  Paperclip,
  Send,
  User,
  Users,
  Phone,
  Image as ImageIcon,
  Smile,
  ArrowRight,
  Star,
  Clock,
  Bell,
  BellOff,
  ArrowUpRight,
  ExternalLink,
  FileText
} from "lucide-react";
import NewChat from "../new-chat";
import dynamic from "next/dynamic";
import { Card, CardContent, CardTitle, CardHeader, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

// Importações para integração de estilo WhatsApp e notas internas
import {
  ChatStyleToggle,
  InternalNote,
  AIInsight,
  getStatusIcon,
  getMessageClasses,
  getWhatsAppBackgroundStyles,
  useChatStylePreference,
  useNoteMode
} from "@/components/ui/chat-style-utils";

// Dynamically import the WhatsAppStyleChat component with no SSR
const WhatsAppStyleChat = dynamic(
  () => import("@/components/ui/whatsapp-style-chat-component"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[calc(100vh-220px)] items-center justify-center bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin" />
          <p className="text-gray-500 dark:text-gray-400">Carregando interface de chat...</p>
        </div>
      </div>
    )
  }
);

// Tipos para o chat com cliente
type MessageStatus = "sending" | "sent" | "delivered" | "read" | "error";

interface ClientMessage {
  id: string;
  content: string;
  timestamp: string;
  sender: "client" | "me";
  status: MessageStatus;
  attachments?: {
    type: "image" | "document" | "audio";
    url: string;
    name?: string;
    size?: string;
  }[];
  isInternalNote?: boolean;
}

interface ClientChat {
  id: string;
  clientName: string;
  avatar: string;
  lastMessage: string;
  lastActivity: string;
  unreadCount: number;
  isOnline: boolean;
  hasInternalChat: boolean;
  internalChatId?: string;
  messages: ClientMessage[];
}

export default function ChatClientePage() {
  const { data: session } = useSession();
  const [isWhatsAppConnected, setIsWhatsAppConnected] = useState(true);
  const [activeTab, setActiveTab] = useState("whatsapp");
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [chats, setChats] = useState<ClientChat[]>([]);
  const [filteredChats, setFilteredChats] = useState<ClientChat[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddNoteDialogOpen, setIsAddNoteDialogOpen] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [chatFilter, setChatFilter] = useState<"all" | "unread" | "has_internal">("all");
  const [isCreateInternalChatDialogOpen, setIsCreateInternalChatDialogOpen] = useState(false);

  // Hooks para preferências de estilo e modo nota
  const [chatStyle, setChatStyle] = useChatStylePreference("whatsapp");
  const [isNoteMode, setIsNoteMode] = useNoteMode(false);

  const updateChatStyle = (style: string) => setChatStyle(style);
  const toggleNoteMode = () => setIsNoteMode((prev: boolean) => !prev);

  useEffect(() => {
    setIsLoaded(true);

    const checkWhatsAppStatus = () => {
      const isConnected = Math.random() > 0.2;
      setIsWhatsAppConnected(isConnected);
    };

    checkWhatsAppStatus();
    const interval = setInterval(checkWhatsAppStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadChatData = async () => {
      setIsLoading(true);
      setTimeout(() => {
        const demoChats: ClientChat[] = [
          {
            id: "client1",
            clientName: "João Silva",
            avatar: "JS",
            lastMessage: "Obrigado! Vou aguardar a entrega.",
            lastActivity: "10:30",
            unreadCount: 0,
            isOnline: true,
            hasInternalChat: true,
            internalChatId: "chat1",
            messages: [
              {
                id: "msg1",
                content: "Olá, tudo bem? Queria saber sobre o prazo de entrega dos móveis para meu apartamento.",
                timestamp: "09:30",
                sender: "client",
                status: "read"
              },
              {
                id: "msg2",
                content: "Bom dia, João! Tudo ótimo, espero que com você também.",
                timestamp: "09:32",
                sender: "me",
                status: "read"
              },
              {
                id: "msg3",
                content: "Sobre seu pedido, os móveis estão em fase final de produção. A previsão de entrega é para a próxima semana, entre quarta e sexta-feira.",
                timestamp: "09:33",
                sender: "me",
                status: "read"
              },
              {
                id: "msg4",
                content: "Ah, perfeito! Vou me programar para estar em casa nesses dias.",
                timestamp: "09:36",
                sender: "client",
                status: "read"
              },
              {
                id: "msg5",
                content: "Você consegue me confirmar o dia exato com antecedência?",
                timestamp: "09:37",
                sender: "client",
                status: "read"
              },
              {
                id: "msg6",
                content: "Com certeza! Assim que a produção finalizar, entraremos em contato para agendar o dia específico. Geralmente conseguimos avisar com 2 dias de antecedência. Funciona para você?",
                timestamp: "09:40",
                sender: "me",
                status: "read"
              },
              {
                id: "msg7",
                content: "Sim, está ótimo! Obrigado pela atenção.",
                timestamp: "09:42",
                sender: "client",
                status: "read"
              },
              {
                id: "msg8",
                content: "Cliente precisa de confirmação de entrega até terça-feira para se programar.",
                timestamp: "09:50",
                sender: "me",
                status: "read",
                isInternalNote: true
              },
              {
                id: "msg9",
                content: "Acabei de receber a confirmação da produção. Sua entrega está agendada para quinta-feira, dia 25, período da manhã entre 8h e 12h.",
                timestamp: "10:25",
                sender: "me",
                status: "read"
              },
              {
                id: "msg10",
                content: "Obrigado! Vou aguardar a entrega.",
                timestamp: "10:30",
                sender: "client",
                status: "read"
              }
            ]
          },
          {
            id: "client2",
            clientName: "Maria Oliveira",
            avatar: "MO",
            lastMessage: "Claro, vou enviar as medidas atualizadas hoje ainda.",
            lastActivity: "Ontem",
            unreadCount: 0,
            isOnline: false,
            hasInternalChat: true,
            internalChatId: "chat2",
            messages: [
              {
                id: "msg1",
                content: "Bom dia, enviei por e-mail o orçamento do closet conforme conversamos.",
                timestamp: "Ontem, 09:15",
                sender: "me",
                status: "read"
              },
              {
                id: "msg2",
                content: "Verifiquei que esqueci de incluir as dimensões do espaço para sapatos. Pode refazer?",
                timestamp: "Ontem, 11:30",
                sender: "client",
                status: "read"
              },
              {
                id: "msg3",
                content: "Claro, Maria! Você pode me enviar as medidas atualizadas?",
                timestamp: "Ontem, 13:40",
                sender: "me",
                status: "read"
              },
              {
                id: "msg4",
                content: "Claro, vou enviar as medidas atualizadas hoje ainda.",
                timestamp: "Ontem, 14:20",
                sender: "client",
                status: "read"
              }
            ]
          },
          {
            id: "client3",
            clientName: "Pedro Santos",
            avatar: "PS",
            lastMessage: "Vocês atendem na região do Morumbi?",
            lastActivity: "08:15",
            unreadCount: 3,
            isOnline: true,
            hasInternalChat: false,
            messages: [
              {
                id: "msg1",
                content: "Bom dia! Estou interessado nos móveis planejados para meu escritório. Podemos marcar uma visita para vocês fazerem a medição?",
                timestamp: "08:10",
                sender: "client",
                status: "read"
              },
              {
                id: "msg2",
                content: "Tenho disponibilidade na próxima semana, de preferência no período da tarde.",
                timestamp: "08:12",
                sender: "client",
                status: "read"
              },
              {
                id: "msg3",
                content: "Vocês atendem na região do Morumbi?",
                timestamp: "08:15",
                sender: "client",
                status: "delivered"
              }
            ]
          },
          {
            id: "client4",
            clientName: "Ana Costa",
            avatar: "AC",
            lastMessage: "Queria mudar a cor dos armários para branco e adicionar mais gavetas.",
            lastActivity: "Seg",
            unreadCount: 0,
            isOnline: false,
            hasInternalChat: false,
            messages: [
              {
                id: "msg1",
                content: "Olá! Depois de pensar melhor, gostaria de fazer algumas alterações no projeto da cozinha.",
                timestamp: "Segunda, 14:22",
                sender: "client",
                status: "read"
              },
              {
                id: "msg2",
                content: "Claro Ana! Quais alterações você gostaria de fazer?",
                timestamp: "Segunda, 14:30",
                sender: "me",
                status: "read"
              },
              {
                id: "msg3",
                content: "Queria mudar a cor dos armários para branco e adicionar mais gavetas.",
                timestamp: "Segunda, 14:45",
                sender: "client",
                status: "read"
              }
            ]
          }
        ];

        setChats(demoChats);
        setFilteredChats(demoChats);
        if (!activeChatId && demoChats.length > 0) {
          setActiveChatId(demoChats[0].id);
        }
        setIsLoading(false);
      }, 1500);
    };

    loadChatData();
  }, [activeChatId]);

  useEffect(() => {
    let filtered = chats;

    if (chatFilter === "unread") {
      filtered = filtered.filter(chat => chat.unreadCount > 0);
    } else if (chatFilter === "has_internal") {
      filtered = filtered.filter(chat => chat.hasInternalChat);
    }

    if (searchTerm) {
      filtered = filtered.filter(chat =>
        chat.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredChats(filtered);
  }, [chats, chatFilter, searchTerm]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeChatId, chats]);

  const handleReconnect = () => {
    setIsWhatsAppConnected(false);
    setTimeout(() => setIsWhatsAppConnected(true), 1500);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !activeChatId) return;

    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newMessage: ClientMessage = {
      id: `msg_${Date.now()}`,
      content: inputMessage.trim(),
      timestamp: timeString,
      sender: "me",
      status: "sent",
      isInternalNote: isNoteMode,
    };

    const updatedChats = chats.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: isNoteMode ? chat.lastMessage : inputMessage.trim(),
          lastActivity: isNoteMode ? chat.lastActivity : timeString,
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setInputMessage("");

    setTimeout(() => {
      if (messageEndRef.current) {
        messageEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);

    if (!isNoteMode) {
      setTimeout(() => {
        setChats(prev => prev.map(chat => {
          if (chat.id === activeChatId) {
            return {
              ...chat,
              messages: chat.messages.map(msg =>
                msg.id === newMessage.id ? { ...msg, status: "delivered" as MessageStatus } : msg
              ),
            };
          }
          return chat;
        }));

        setTimeout(() => {
          setChats(prev => prev.map(chat => {
            if (chat.id === activeChatId) {
              return {
                ...chat,
                messages: chat.messages.map(msg =>
                  msg.id === newMessage.id ? { ...msg, status: "read" as MessageStatus } : msg
                ),
              };
            }
            return chat;
          }));
        }, 2000);
      }, 1000);
    }

    toast.success(isNoteMode ? "Nota interna adicionada" : "Mensagem enviada");
  };

  const handleAddNote = () => {
    if (!noteContent.trim() || !activeChatId) {
      toast.error("O conteúdo da nota não pode estar vazio");
      return;
    }

    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newNote: ClientMessage = {
      id: `note_${Date.now()}`,
      content: noteContent.trim(),
      timestamp: timeString,
      sender: "me",
      status: "read",
      isInternalNote: true,
    };

    setChats(prev => prev.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          messages: [...chat.messages, newNote],
        };
      }
      return chat;
    }));

    setNoteContent("");
    setIsAddNoteDialogOpen(false);

    setTimeout(() => {
      if (messageEndRef.current) {
        messageEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);

    toast.success("Nota interna adicionada");
  };

  const handleCreateInternalChat = () => {
    if (!activeChatId) return;

    const activeChat = chats.find(chat => chat.id === activeChatId);
    if (!activeChat) return;

    const internalChatId = `internal_${Date.now()}`;

    setChats(prev => prev.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          hasInternalChat: true,
          internalChatId,
        };
      }
      return chat;
    }));

    setIsCreateInternalChatDialogOpen(false);

    toast.success(
      <div className="flex flex-col gap-1">
        <div>Chat interno criado com sucesso!</div>
        <div className="text-xs">Você pode acessá-lo na seção de Chat Interno</div>
      </div>
    );
  };

  const activeChat = chats.find(chat => chat.id === activeChatId);

  // Função para renderizar indicador de status da mensagem (mantida para fallback)
  const getStatusIndicator = (status: MessageStatus) => {
    switch (status) {
      case "sending":
        return <Clock className="h-3.5 w-3.5 text-slate-400" />;
      case "sent":
        return <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" />;
      case "delivered":
        return <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />;
      case "read":
        return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />;
      case "error":
        return <AlertTriangle className="h-3.5 w-3.5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">Chat com Clientes</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Comunicação com clientes via sistema e WhatsApp
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isWhatsAppConnected ? "outline" : "destructive"}
            size="sm"
            className="gap-2 dark:border-slate-700 dark:text-slate-300"
            onClick={handleReconnect}
          >
            {isWhatsAppConnected ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span className="hidden md:inline">WhatsApp</span>
                <span className="inline md:hidden">WA</span>
                <span className="inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden md:inline">WhatsApp</span>
                <span className="inline md:hidden">WA</span>
                <span className="inline-flex h-2 w-2 rounded-full bg-red-500"></span>
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleReconnect}
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            <span className="hidden md:inline text-xs">Atualizar</span>
          </Button>
          <NewChat chatType="CLIENTE" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-160px)]">
        {/* Lista de Conversas */}
        <div className="lg:col-span-1 border rounded-md overflow-hidden bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 flex flex-col">
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="relative w-full">
                <Input
                  placeholder="Buscar conversas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Filtrar conversas</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setChatFilter(value as any)}>
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="all" className="text-xs">Todos</TabsTrigger>
                <TabsTrigger value="unread" className="text-xs">Não lidos</TabsTrigger>
                <TabsTrigger value="has_internal" className="text-xs">Com chat interno</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <ScrollArea className="flex-1">
            {isLoading ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <div key={index} className="flex items-center gap-3 p-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <MessageCircle className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-2" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-200 mb-1">
                  Nenhuma conversa encontrada
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  {searchTerm
                    ? "Tente outro termo de busca"
                    : chatFilter !== "all"
                      ? "Tente outro filtro ou inicie uma nova conversa"
                      : "Inicie uma nova conversa com um cliente"}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setChatFilter("all");
                  }}
                >
                  Limpar Filtros
                </Button>
              </div>
            ) : (
              <div className="p-1">
                {filteredChats.map(chat => (
                  <div
                    key={chat.id}
                    className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${
                      activeChatId === chat.id
                        ? "bg-slate-100 dark:bg-slate-800"
                        : "hover:bg-slate-50 dark:hover:bg-slate-900"
                    }`}
                    onClick={() => setActiveChatId(chat.id)}
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm">
                          {chat.avatar}
                        </AvatarFallback>
                      </Avatar>
                      {chat.isOnline && (
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-white dark:bg-slate-950 rounded-full flex items-center justify-center">
                          <div className="h-3 w-3 bg-emerald-500 rounded-full" />
                        </div>
                      )}
                      {chat.hasInternalChat && (
                        <div className="absolute -top-1 -right-1 h-4 w-4 bg-white dark:bg-slate-950 rounded-full border border-white dark:border-slate-950 flex items-center justify-center">
                          <MessageCircle className="h-2.5 w-2.5 text-blue-500" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">
                          {chat.clientName}
                        </h3>
                        <span className="text-xs text-slate-500 whitespace-nowrap">
                          {chat.lastActivity}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {chat.messages.length > 0
                            ? (chat.messages[chat.messages.length - 1].isInternalNote
                                ? "📝 "
                                : chat.messages[chat.messages.length - 1].sender === "me"
                                  ? "Você: "
                                  : "")
                            + chat.lastMessage
                            : "Nenhuma mensagem ainda"}
                        </p>
                        {chat.unreadCount > 0 && (
                          <Badge variant="default" className="ml-2 h-5 min-w-5 rounded-full px-1.5">
                            {chat.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Área de Mensagens */}
        <div className="lg:col-span-2 border rounded-md overflow-hidden bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="h-8 w-8 border-2 border-t-blue-500 border-slate-200 dark:border-slate-700 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 dark:text-slate-400">Carregando mensagens...</p>
              </div>
            </div>
          ) : !activeChat ? (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="flex flex-col items-center text-center max-w-md">
                <MessageCircle className="h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
                <h2 className="text-xl font-medium text-slate-900 dark:text-slate-100 mb-2">
                  Selecione uma conversa
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                  Escolha uma conversa existente para visualizar as mensagens ou inicie uma nova conversa.
                </p>
                <NewChat chatType="CLIENTE">
                  <Button className="gap-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>Iniciar Nova Conversa</span>
                  </Button>
                </NewChat>
              </div>
            </div>
          ) : (
            <>
              {/* Cabeçalho do Chat */}
              <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm">
                      {activeChat.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-medium text-slate-900 dark:text-slate-100">
                        {activeChat.clientName}
                      </h2>
                      <Badge variant="outline" className={`text-xs ${activeChat.isOnline ? 'text-emerald-500 border-emerald-200 dark:border-emerald-800' : 'text-slate-500 border-slate-200 dark:border-slate-700'}`}>
                        {activeChat.isOnline ? 'Online' : 'Offline'}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      {activeChat.unreadCount > 0 ? (
                        <>
                          <span className="text-blue-500">{activeChat.unreadCount} mensagens não lidas</span>
                        </>
                      ) : (
                        'Última atividade: ' + activeChat.lastActivity
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {activeChat.hasInternalChat ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1" onClick={() => {
                            toast.success(
                              <div className="flex flex-col gap-1">
                                <div>Redirecionando para o chat interno</div>
                                <div className="text-xs">Para acompanhar discussões internas sobre este cliente</div>
                              </div>
                            );
                          }}>
                            <MessageCircle className="h-3.5 w-3.5 text-blue-500" />
                            <span>Ver Chat Interno</span>
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Acesse o chat interno da equipe sobre este cliente</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <Dialog open={isCreateInternalChatDialogOpen} onOpenChange={setIsCreateInternalChatDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1">
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>Criar Chat Interno</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Criar Chat Interno</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                            Você está prestes a criar um chat interno para discussão com a equipe sobre o cliente <span className="font-medium text-slate-900 dark:text-slate-100">{activeChat.clientName}</span>.
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Este chat permite que você e sua equipe conversem internamente sobre detalhes do projeto, alinhamento e informações sensíveis sem que o cliente tenha acesso.
                          </p>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsCreateInternalChatDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleCreateInternalChat}>
                            Criar Chat Interno
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <FileText className="h-4 w-4 mr-2" />
                        <span>Ver arquivos compartilhados</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Search className="h-4 w-4 mr-2" />
                        <span>Buscar nesta conversa</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Phone className="h-4 w-4 mr-2" />
                        <span>Ligar para cliente</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        {activeChat.isOnline ? (
                          <>
                            <BellOff className="h-4 w-4 mr-2" />
                            <span>Silenciar notificações</span>
                          </>
                        ) : (
                          <>
                            <Bell className="h-4 w-4 mr-2" />
                            <span>Ativar notificações</span>
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Integração do estilo WhatsApp e notas internas */}
              <div className="flex flex-col flex-1 min-h-0">
                <ChatStyleToggle
                  activeStyle={chatStyle}
                  onChange={updateChatStyle}
                  isNoteMode={isNoteMode}
                  onToggleNoteMode={toggleNoteMode}
                />

                <div
                  className="relative flex-1 overflow-y-auto p-4"
                  style={chatStyle === 'whatsapp' ? getWhatsAppBackgroundStyles() : {}}
                >
                  <ScrollArea className="flex-1 h-full">
                    <div className="flex flex-col">
                      {activeChat.messages.map((message, index) => {
                        const isCurrentUser = message.sender === 'me';
                        const isNote = message.isInternalNote;

                        if (isNote) {
                          return (
                            <InternalNote
                              key={message.id}
                              content={message.content}
                              sender="Você"
                              timestamp={message.timestamp}
                            />
                          );
                        }

                        return (
                          <div
                            key={message.id}
                            className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`relative p-3 rounded-lg max-w-[75%] ${
                              getMessageClasses({
                                isCurrentUser,
                                isNoteMode,
                                chatStyle
                              })
                            }`}>
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                              <div className="flex items-center justify-end gap-1 mt-1 text-xs opacity-70">
                                <span>{message.timestamp}</span>
                                {isCurrentUser && getStatusIcon(message.status, chatStyle)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messageEndRef} />
                    </div>
                  </ScrollArea>
                </div>

                {/* Campo de Entrada de Mensagem */}
                <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1">
                            <Switch
                              checked={isNoteMode}
                              onCheckedChange={setIsNoteMode}
                              id="note-mode"
                            />
                            <label
                              htmlFor="note-mode"
                              className={`text-xs cursor-pointer ${
                                isNoteMode ? "text-amber-500 font-medium" : "text-slate-500"
                              }`}
                            >
                              Modo Nota Interna
                            </label>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Notas internas são visíveis apenas para a equipe, não para o cliente</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <Dialog open={isAddNoteDialogOpen} onOpenChange={setIsAddNoteDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-xs h-7 gap-1 ml-auto">
                          <FileText className="h-3 w-3" />
                          <span>Adicionar Nota Detalhada</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Adicionar Nota Interna</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <label className="text-sm font-medium">
                            Texto da nota (visível apenas para a equipe)
                          </label>
                          <textarea
                            className="w-full p-2 mt-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 min-h-[120px]"
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            placeholder="Digite informações importantes sobre este cliente ou conversa..."
                          />
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsAddNoteDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleAddNote}>
                            Adicionar Nota
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="flex gap-2 items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <Paperclip className="h-5 w-5 text-slate-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Anexar arquivo</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <Input
                      placeholder={isNoteMode ? "Digite uma nota interna (visível apenas para a equipe)..." : "Digite sua mensagem..."}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className={`flex-1 ${isNoteMode ? "bg-amber-50 dark:bg-amber-900/20 placeholder:text-amber-500" : ""}`}
                    />

                    <Button
                      size="icon"
                      className="rounded-full"
                      disabled={!inputMessage.trim()}
                      onClick={handleSendMessage}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
