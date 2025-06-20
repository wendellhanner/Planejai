"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  Search,
  MoreVertical,
  Phone,
  Smile,
  Paperclip,
  Mic,
  ArrowRightCircle,
  Check,
  CheckCheck,
  Clock,
  Filter,
  X,
  Camera,
  MessageSquare,
  AlertTriangle,
  User,
  UserPlus,
  Bot,
  ArrowRight,
} from "lucide-react";
import { useNotifications } from "@/components/providers/notification-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Interface simples para tipos
interface ChatMessage {
  id: string;
  content: string;
  time: string;
  sender: "me" | "them";
  status: "sent" | "delivered" | "read" | "pending";
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  isOnline: boolean;
  messages: ChatMessage[];
  client?: { id: string; name: string; status: string };
}

export default function WhatsAppStyleChatComponent() {
  const { data: session } = useSession();
  const { unreadCount: internalUnreadCount } = useNotifications();
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isCreatingLead, setIsCreatingLead] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  // Add AI suggestions state
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [isGeneratingAiResponse, setIsGeneratingAiResponse] = useState(false);
  const [isForwardingMessage, setIsForwardingMessage] = useState(false);
  const [selectedMessageToForward, setSelectedMessageToForward] = useState<ChatMessage | null>(null);
  const [forwardDestination, setForwardDestination] = useState<string>("interno");

  // Dados de exemplo para chats
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "1",
      name: "João Silva",
      lastMessage: "Olá, queria saber sobre o prazo de entrega",
      time: "09:30",
      unread: 2,
      avatar: "JS",
      isOnline: true,
      client: { id: "client1", name: "João Silva", status: "active" },
      messages: [
        {
          id: "msg1",
          content: "Olá, tudo bem? Queria saber sobre o prazo de entrega dos móveis para meu apartamento.",
          time: "09:30",
          sender: "them",
          status: "read",
        },
        {
          id: "msg2",
          content: "Bom dia, João! Tudo ótimo, espero que com você também.",
          time: "09:32",
          sender: "me",
          status: "read",
        },
      ],
    },
    {
      id: "2",
      name: "Maria Oliveira",
      lastMessage: "Obrigado pelo orçamento",
      time: "Ontem",
      unread: 0,
      avatar: "MO",
      isOnline: false,
      client: { id: "client2", name: "Maria Oliveira", status: "active" },
      messages: [
        {
          id: "msg1",
          content: "Boa tarde, recebi o orçamento para o closet. Muito obrigada!",
          time: "Ontem, 15:43",
          sender: "them",
          status: "read",
        },
      ],
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatFilter, setChatFilter] = useState("all");
  const [isDesktop, setIsDesktop] = useState(true);
  const [whatsappConnectionStatus, setWhatsappConnectionStatus] = useState<
    "connected" | "connecting" | "disconnected"
  >("connecting");

  // Add lead form states
  const [leadFormData, setLeadFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "whatsapp",
    interest: "",
    notes: ""
  });
  const [leadCreationError, setLeadCreationError] = useState("");

  // Function to generate AI suggestions based on chat context
  const generateAiSuggestions = useCallback(() => {
    if (!activeChat) return;

    setIsGeneratingAiResponse(true);

    // Get the last 5 messages for context
    const lastMessages = activeChat.messages
      .slice(-5)
      .map((msg) =>
        `${msg.sender === "them" ? activeChat.name : "Atendente"}: ${msg.content}`
      )
      .join("\n");

    // Simulate AI processing
    setTimeout(() => {
      // Generate contextual responses based on the conversation
      const suggestions: string[] = [];

      // Check if conversation mentions pricing
      if (
        lastMessages.toLowerCase().includes("preço") ||
        lastMessages.toLowerCase().includes("valor") ||
        lastMessages.toLowerCase().includes("custo") ||
        lastMessages.toLowerCase().includes("orçamento")
      ) {
        suggestions.push(
          "Podemos preparar um orçamento personalizado para você. Precisaria de algumas informações adicionais."
        );
        suggestions.push(
          "Nossos valores variam de acordo com o projeto. Podemos agendar uma visita técnica para um orçamento preciso."
        );
      }

      // Check if conversation mentions delivery
      if (
        lastMessages.toLowerCase().includes("entrega") ||
        lastMessages.toLowerCase().includes("prazo")
      ) {
        suggestions.push(
          "Normalmente nosso prazo de entrega é de 30 a 45 dias após a aprovação do projeto."
        );
        suggestions.push(
          "Posso verificar com nossa equipe de produção o prazo exato para seu projeto."
        );
      }

      // Check if conversation mentions design/project
      if (
        lastMessages.toLowerCase().includes("projeto") ||
        lastMessages.toLowerCase().includes("design") ||
        lastMessages.toLowerCase().includes("desenho")
      ) {
        suggestions.push(
          "Nossos designers podem criar um projeto 3D personalizado para visualizar como ficará seu ambiente."
        );
        suggestions.push(
          "Podemos agendar uma visita técnica para avaliar o espaço e desenvolver um projeto sob medida."
        );
      }

      // Default suggestions if no specific context is detected
      if (suggestions.length === 0) {
        suggestions.push(
          "Obrigado pelo contato! Como posso ajudar com seu projeto de móveis planejados?"
        );
        suggestions.push(
          "Temos várias opções que podem atender suas necessidades. Poderia me dizer mais sobre o que está procurando?"
        );
        suggestions.push(
          "Quer agendar uma visita técnica para discutirmos seu projeto pessoalmente?"
        );
      }

      setAiSuggestions(suggestions);
      setShowAiSuggestions(true);
      setIsGeneratingAiResponse(false);
    }, 1500);
  }, [activeChat]);

  // Use AI suggestions when a new chat is selected
  useEffect(() => {
    if (activeChat) {
      generateAiSuggestions();
    }
  }, [activeChat, generateAiSuggestions]);

  // Efeito para simular carregamento inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Simular conexão com WhatsApp
  useEffect(() => {
    const timer = setTimeout(() => {
      setWhatsappConnectionStatus("connected");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Verificar tamanho da tela para responsividade
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Garantir scroll para o final ao mudar de chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeChat?.messages]);

  // Memoize filtered chats to prevent unnecessary re-renders
  const filteredChats = useMemo(() => {
    return chats.filter((chat) => {
      return chat.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [chats, searchTerm]);

  // Enhanced send message function with optimized state updates
  const handleSendMessage = useCallback(() => {
    if (!inputMessage.trim() || !activeChat) return;

    const now = new Date();
    const timeString = `${now
      .getHours()
      .toString()
      .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    const newMessage: ChatMessage = {
      id: `msg${Date.now()}`,
      content: inputMessage,
      time: timeString,
      sender: "me",
      status: "sent",
    };

    // Atualizar chat com nova mensagem - use functional update to avoid stale closures
    setChats(prevChats =>
      prevChats.map((chat) =>
        chat.id === activeChat.id
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: inputMessage,
              time: timeString,
            }
          : chat
      )
    );

    setInputMessage("");
    toast.success("Mensagem enviada");

    // Reset AI suggestions after sending and generate new ones
    setShowAiSuggestions(false);
    setTimeout(() => {
      generateAiSuggestions();
    }, 2000);

    // Simular resposta após um tempo - use the latest chat state
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        if (activeChat) {
          const responseMsg: ChatMessage = {
            id: `msg${Date.now()}`,
            content: "Ok, entendi! Obrigado pela informação.",
            time: `${now
              .getHours()
              .toString()
              .padStart(2, "0")}:${(now.getMinutes() + 2)
              .toString()
              .padStart(2, "0")}`,
            sender: "them",
            status: "read",
          };

          setChats((prevChats) =>
            prevChats.map((chat) =>
              chat.id === activeChat.id
                ? {
                    ...chat,
                    messages: [...chat.messages, responseMsg],
                    lastMessage: responseMsg.content,
                    time: responseMsg.time,
                  }
                : chat
            )
          );
        }
        setIsTyping(false);
      }, 3000);
    }, 1500);
  }, [activeChat, inputMessage, generateAiSuggestions]);

  // Handle input change with proper debounce
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Check className="h-3 w-3 text-gray-400" />;
      case "delivered":
        return <Check className="h-3 w-3 text-gray-400" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return <Clock className="h-3 w-3 text-gray-400" />;
    }
  };

  // Enhanced lead creation function
  const handleCreateLead = () => {
    if (!activeChat) return;

    // Pre-fill lead form data from active chat
    setLeadFormData({
      ...leadFormData,
      name: activeChat.name || "",
      phone: activeChat.id.includes("+") ? activeChat.id : "",
      notes: `Lead gerado a partir de conversa no WhatsApp. Último contato: ${new Date().toLocaleDateString()}`,
      interest: getInterestFromMessages(activeChat.messages)
    });

    setIsCreatingLead(true);
  };

  // Determine interest based on message content
  const getInterestFromMessages = (messages: ChatMessage[]) => {
    const allContent = messages.map(m => m.content.toLowerCase()).join(" ");

    if (allContent.includes("cozinha") || allContent.includes("cozinhas"))
      return "Cozinhas";
    if (allContent.includes("quarto") || allContent.includes("dormitório"))
      return "Dormitórios";
    if (allContent.includes("sala") || allContent.includes("living"))
      return "Salas";
    if (allContent.includes("escritório") || allContent.includes("home office"))
      return "Home Office";
    if (allContent.includes("banheiro"))
      return "Banheiros";

    return "Outros";
  };

  // Memoize lead submission handler
  const submitLeadData = useCallback(async () => {
    // Validate required fields
    if (!leadFormData.name || !leadFormData.phone) {
      setLeadCreationError("Nome e telefone são obrigatórios");
      return;
    }

    try {
      // Simulate API call to create lead
      console.log("Creating lead:", leadFormData);

      // Simulate successful creation
      setTimeout(() => {
        toast.success(`Lead criado para ${leadFormData.name}`);
        setIsCreatingLead(false);
        setLeadCreationError("");

        // Send confirmation message in the chat - use the latest chat state
        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        const newMessage: ChatMessage = {
          id: `msg${Date.now()}`,
          content: `✅ Lead criado com sucesso para ${leadFormData.name}.\nUm de nossos consultores entrará em contato em breve!`,
          time: timeString,
          sender: "me",
          status: "sent"
        };

        setChats(prevChats => prevChats.map(chat =>
          chat.id === activeChat?.id
            ? {
                ...chat,
                messages: [...chat.messages, newMessage],
                lastMessage: newMessage.content,
                time: timeString
              }
            : chat
        ));
      }, 1500);
    } catch (error) {
      console.error("Error creating lead:", error);
      setLeadCreationError("Erro ao criar lead. Tente novamente.");
    }
  }, [leadFormData, activeChat]);

  // Função para adicionar nota
  const handleAddNote = () => {
    if (!activeChat || !noteContent.trim()) return;
    toast.success("Nota adicionada com sucesso");
    setNoteContent("");
    setIsAddingNote(false);
  };

  // Memoize AI suggestion handler
  const useAiSuggestion = useCallback((suggestion: string) => {
    setInputMessage(suggestion);
    setShowAiSuggestions(false);
  }, []);

  // Memoize message forwarding handler
  const handleForwardMessage = useCallback((message: ChatMessage) => {
    setSelectedMessageToForward(message);
    setIsForwardingMessage(true);
  }, []);

  // Memoize forward completion handler
  const completeForwardMessage = useCallback(() => {
    if (!selectedMessageToForward) return;

    toast.success(`Mensagem encaminhada para chat ${forwardDestination}`);
    setIsForwardingMessage(false);
    setSelectedMessageToForward(null);
  }, [selectedMessageToForward, forwardDestination]);

  // Tela de carregamento inicial
  if (isInitialLoading) {
    return (
      <div className="flex h-[calc(100vh-150px)] items-center justify-center bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center animate-pulse">
            <MessageSquare className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">
              Carregando WhatsApp
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Inicializando o chat...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-150px)] overflow-hidden bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
      {/* Lista de chats (lado esquerdo) */}
      <div
        className={`${
          isDesktop || !activeChat ? "flex" : "hidden"
        } flex-col w-full md:w-1/3 border-r border-gray-200 dark:border-gray-800`}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-3 bg-[#f0f2f5] dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-blue-500 text-white">
                {session?.user?.name?.[0] || "A"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-medium text-gray-800 dark:text-gray-200">
                Planej.AI Chat
              </h2>
              {internalUnreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {internalUnreadCount} não lidas (interno)
                </Badge>
              )}
              <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                <span>Conectado ao WhatsApp</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-gray-600 dark:text-gray-300"
            >
              <Camera className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-gray-600 dark:text-gray-300"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Barra de pesquisa */}
        <div className="p-2 bg-[#f0f2f5] dark:bg-gray-800">
          <div className="relative">
            <Input
              placeholder="Pesquisar ou começar nova conversa"
              className="pl-10 py-2 bg-white dark:bg-gray-700 border-0 rounded-lg focus:ring-0 focus:border-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>

          <div className="mt-2">
            <Tabs defaultValue="all" onValueChange={setChatFilter}>
              <TabsList className="grid grid-cols-4 bg-gray-100 dark:bg-gray-700">
                <TabsTrigger value="all" className="text-xs">
                  Todos
                </TabsTrigger>
                <TabsTrigger value="unread" className="text-xs">
                  Não lidos
                </TabsTrigger>
                <TabsTrigger value="online" className="text-xs">
                  Online
                </TabsTrigger>
                <TabsTrigger value="groups" className="text-xs">
                  Grupos
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Lista de chats */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-4">
              <Search className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Nenhuma conversa encontrada
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm text-center mt-1">
                Tente outro termo de busca ou inicie uma nova conversa
              </p>
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={`flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-100 dark:border-gray-800 ${
                  activeChat?.id === chat.id
                    ? "bg-gray-100 dark:bg-gray-800"
                    : ""
                }`}
                onClick={() => setActiveChat(chat)}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                      {chat.avatar}
                    </AvatarFallback>
                  </Avatar>
                  {chat.isOnline && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {chat.name}
                    </h3>
                    <span
                      className={`text-xs ${
                        chat.unread > 0
                          ? "text-green-500 font-medium"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {chat.time}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {chat.lastMessage}
                    </p>
                    {chat.unread > 0 && (
                      <Badge
                        variant="default"
                        className="bg-green-500 hover:bg-green-600 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                      >
                        {chat.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Área de chat (lado direito) */}
      <div
        className={`${
          !isDesktop && activeChat
            ? "flex"
            : isDesktop
            ? "flex"
            : "hidden"
        } flex-col w-full md:w-2/3 bg-[#efeae2] dark:bg-gray-950`}
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%239e9e9e\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
          backgroundRepeat: "repeat",
        }}
      >
        {activeChat ? (
          <>
            {/* Cabeçalho do chat */}
            <div className="flex items-center justify-between p-3 bg-[#f0f2f5] dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                    {activeChat.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {activeChat.name}
                    </h3>
                    {activeChat.client && (
                      <Badge
                        variant="outline"
                        className="text-xs border-blue-200 text-blue-800 dark:border-blue-600 dark:text-blue-300"
                      >
                        Cliente
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activeChat.isOnline
                      ? "Online agora"
                      : "Visto por último hoje às 10:30"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={() => setIsAddingNote(true)}
                >
                  Adicionar Nota
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={handleCreateLead}
                  disabled={isCreatingLead}
                >
                  {isCreatingLead ? "Criando..." : "Criar Lead"}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-gray-600 dark:text-gray-300"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => generateAiSuggestions()}>
                      <Bot className="h-4 w-4 mr-2" />
                      Sugestões de IA
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Phone className="h-4 w-4 mr-2" />
                      Ligar para contato
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Transferir conversa
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="h-4 w-4 mr-2" />
                      Ver perfil do cliente
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Área de mensagens */}
            <ScrollArea className="flex-1 p-4 space-y-3">
              {activeChat.messages.map((message, index) => {
                const isMe = message.sender === "me";
                return (
                  <div key={message.id}>
                    <div
                      className={`flex ${
                        isMe ? "justify-end" : "justify-start"
                      } mt-3 group`}
                    >
                      <div
                        className={`max-w-[75%] relative ${
                          isMe
                            ? "bg-[#d9fdd3] dark:bg-green-900 text-gray-800 dark:text-gray-200"
                            : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                        } px-3 py-2 rounded-lg shadow-sm`}
                      >
                        <div className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </div>
                        <div className="flex justify-end items-center gap-1 mt-1 text-[10px] text-gray-500 dark:text-gray-400">
                          <span>{message.time}</span>
                          {isMe && getStatusIcon(message.status)}
                        </div>

                        {/* Message actions */}
                        <div className="absolute -right-10 top-0 hidden group-hover:flex flex-col gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 rounded-full bg-white dark:bg-gray-700 shadow-sm"
                            onClick={() => handleForwardMessage(message)}
                          >
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex justify-start mt-3">
                  <div className="bg-white dark:bg-gray-800 px-3 py-3 rounded-lg shadow-sm flex items-center gap-1">
                    <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:150ms]"></div>
                    <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:300ms]"></div>
                  </div>
                </div>
              )}

              {/* AI Suggestions */}
              {showAiSuggestions && aiSuggestions.length > 0 && (
                <div className="flex flex-col gap-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800 mt-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-medium text-blue-800 dark:text-blue-400">
                      Sugestões de IA
                    </span>
                  </div>
                  {aiSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start text-xs text-left py-2 h-auto bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 border-blue-100 dark:border-blue-800"
                      onClick={() => useAiSuggestion(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}

              {isGeneratingAiResponse && (
                <div className="flex justify-center mt-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg border border-blue-100 dark:border-blue-800 flex items-center gap-2">
                    <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-pulse" />
                    <span className="text-xs text-blue-600 dark:text-blue-400">
                      Gerando sugestões...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Área de input para mensagem */}
            <div className="p-3 bg-[#f0f2f5] dark:bg-gray-800 flex flex-col gap-2">
              {/* AI Suggestions quick access */}
              {showAiSuggestions && aiSuggestions.length > 0 && (
                <div className="flex gap-1 overflow-x-auto pb-2 no-scrollbar">
                  {aiSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="text-xs whitespace-nowrap py-1 h-7 bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800"
                      onClick={() => useAiSuggestion(suggestion)}
                    >
                      {suggestion.length > 30
                        ? suggestion.substring(0, 30) + "..."
                        : suggestion}
                    </Button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-gray-600 dark:text-gray-300"
                >
                  <Smile className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-gray-600 dark:text-gray-300"
                >
                  <Paperclip className="h-6 w-6" />
                </Button>
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Digite uma mensagem"
                    className="py-6 px-4 bg-white dark:bg-gray-700 border-0 rounded-lg focus:ring-0"
                    value={inputMessage}
                    onChange={handleInputChange}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-gray-600 dark:text-gray-300"
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                >
                  {inputMessage.trim() ? (
                    <ArrowRightCircle className="h-6 w-6 text-blue-500" />
                  ) : (
                    <Mic className="h-6 w-6" />
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="bg-gray-200 dark:bg-gray-700 h-32 w-32 rounded-full flex items-center justify-center mb-6">
              <MessageSquare className="h-16 w-16 text-gray-400 dark:text-gray-500" />
            </div>
            <h2 className="text-2xl font-medium text-gray-800 dark:text-gray-200 mb-2">
              Chat com Clientes
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
              Selecione uma conversa ao lado para iniciar o chat ou iniciar uma
              nova conversa.
            </p>
          </div>
        )}
      </div>

      {/* Dialog para adicionar nota */}
      <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Nota Interna</DialogTitle>
            <DialogDescription>
              Adicione uma nota interna sobre este cliente
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <textarea
              className="w-full p-2 border rounded-md min-h-[100px] dark:bg-gray-800 dark:border-gray-700"
              placeholder="Digite sua nota aqui..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingNote(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddNote} disabled={!noteContent.trim()}>
              Adicionar Nota
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for lead creation */}
      <Dialog open={isCreatingLead} onOpenChange={setIsCreatingLead}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Criar Lead de WhatsApp</DialogTitle>
            <DialogDescription>
              Adicione um novo lead a partir desta conversa de WhatsApp.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {leadCreationError && (
              <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-md border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
                {leadCreationError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="lead-name">Nome</Label>
              <Input
                id="lead-name"
                value={leadFormData.name}
                onChange={(e) => setLeadFormData({...leadFormData, name: e.target.value})}
                placeholder="Nome do cliente"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lead-email">Email</Label>
              <Input
                id="lead-email"
                type="email"
                value={leadFormData.email}
                onChange={(e) => setLeadFormData({...leadFormData, email: e.target.value})}
                placeholder="exemplo@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lead-phone">Telefone</Label>
              <Input
                id="lead-phone"
                value={leadFormData.phone}
                onChange={(e) => setLeadFormData({...leadFormData, phone: e.target.value})}
                placeholder="+55 11 99999-9999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lead-interest">Interesse</Label>
              <Select
                value={leadFormData.interest}
                onValueChange={(value) => setLeadFormData({...leadFormData, interest: value})}
              >
                <SelectTrigger id="lead-interest">
                  <SelectValue placeholder="Selecione o interesse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cozinhas">Cozinhas</SelectItem>
                  <SelectItem value="Dormitórios">Dormitórios</SelectItem>
                  <SelectItem value="Salas">Salas</SelectItem>
                  <SelectItem value="Home Office">Home Office</SelectItem>
                  <SelectItem value="Banheiros">Banheiros</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lead-notes">Observações</Label>
              <Textarea
                id="lead-notes"
                value={leadFormData.notes}
                onChange={(e) => setLeadFormData({...leadFormData, notes: e.target.value})}
                placeholder="Observações adicionais"
                className="h-20"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatingLead(false)}>
              Cancelar
            </Button>
            <Button onClick={submitLeadData}>
              Criar Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para encaminhar mensagem */}
      <Dialog open={isForwardingMessage} onOpenChange={setIsForwardingMessage}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Encaminhar Mensagem</DialogTitle>
            <DialogDescription>
              Encaminhar esta mensagem para outro chat
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="forward-destination" className="mb-2 block">
              Destino
            </Label>
            <Select
              value={forwardDestination}
              onValueChange={setForwardDestination}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o destino" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Chats</SelectLabel>
                  <SelectItem value="interno">Chat Interno</SelectItem>
                  <SelectItem value="vendas">Equipe de Vendas</SelectItem>
                  <SelectItem value="suporte">Suporte Técnico</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {selectedMessageToForward && (
              <div className="mt-4 p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Mensagem:
                </p>
                <p className="text-sm">{selectedMessageToForward.content}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsForwardingMessage(false)}>
              Cancelar
            </Button>
            <Button onClick={completeForwardMessage}>Encaminhar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
