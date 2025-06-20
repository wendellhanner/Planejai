"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
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
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ChatSource } from "@/lib/chat-integration";
import { Checkbox } from "@/components/ui/checkbox";

import {
  User,
  Users,
  Paperclip,
  Clock,
  Check,
  CheckCheck,
  Trash2,
  AlertCircle,
  Info,
  Star,
  UserPlus,
  MoreVertical,
  Send,
  FileText,
  Search,
  Link as LinkIcon,
  UserMinus,
  Pin,
  UserCog,
  MessageSquareQuote,
  Forward,
  Reply,
  Edit,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useNotifications } from "@/components/providers/notification-provider";

// Types for group chat
export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "error";

export interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  timestamp: string;
  status: MessageStatus;
  attachments?: {
    type: "file" | "image" | "document";
    url: string;
    name: string;
    size?: string;
  }[];
  isImportant?: boolean;
  replyTo?: {
    id: string;
    content: string;
    sender: string;
  };
  edited?: boolean;
  source?: ChatSource; // Adicionar source à mensagem
}

export interface ClientReference {
  id: string;
  name: string;
  status: "prospect" | "active" | "inactive";
}

export interface ChatParticipant {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  role?: string;
  isAdmin?: boolean;
}

export interface ChatThread {
  id: string;
  type: "direct" | "group" | "client";
  name: string;
  avatar: string;
  participants: ChatParticipant[];
  lastActivity: string;
  unreadCount: number;
  messages: Message[];
  pinned?: boolean;
  client?: ClientReference;
  description?: string;
  createdAt?: string;
  createdBy?: string;
  sources?: ChatSource[]; // Adicionar sources
}

interface GroupChatProps {
  activeChat: ChatThread | null;
  onSendMessage: (content: string, replyToMessageId?: string, sendToWhatsApp?: boolean) => void; // Modificar onSendMessage
  onToggleImportant: (messageId: string) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  onAddMember: (userId: string) => void;
  onRemoveMember: (userId: string) => void;
  onPinChat: () => void;
  onLinkClient: (clientId: string) => void;
  onLeaveGroup: () => void;
  availableUsers: ChatParticipant[];
  clients: ClientReference[];
  onOpenGroupDetails?: () => void; // New prop
}

export function GroupChat({
  activeChat,
  onSendMessage,
  onToggleImportant,
  onEditMessage,
  onAddMember,
  onRemoveMember,
  onPinChat,
  onLinkClient,
  onLeaveGroup,
  availableUsers,
  clients,
  onOpenGroupDetails // New prop
}: GroupChatProps) {
  const { data: session } = useSession();
  const [inputMessage, setInputMessage] = useState("");
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [isClientLinkDialogOpen, setIsClientLinkDialogOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<{ id: string, content: string } | null>(null);
  const [sendToWhatsApp, setSendToWhatsApp] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const { addNotification } = useNotifications();

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages]);

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Function to handle sending message
  const handleSendMessage = () => {
    if (!inputMessage.trim() || !activeChat) return;

    onSendMessage(inputMessage, replyToMessage?.id, sendToWhatsApp); // Passar sendToWhatsApp
    setInputMessage("");
    setReplyToMessage(null);
    // Não resetar sendToWhatsApp aqui, pode ser uma preferência
  };

  // Function to handle editing message
  const handleEditMessage = () => {
    if (!editingMessage || !inputMessage.trim()) return;

    onEditMessage(editingMessage.id, inputMessage);
    setInputMessage("");
    setEditingMessage(null);
  };

  // Function to handle adding member
  const handleAddMember = () => {
    if (!selectedMemberId) {
      toast.error("Selecione um usuário para adicionar");
      return;
    }

    onAddMember(selectedMemberId);
    setSelectedMemberId(null);
    setIsAddMemberDialogOpen(false);

    // Notify users about new member
    addNotification({
      title: "Novo membro adicionado",
      message: `Um novo membro foi adicionado ao grupo ${activeChat?.name}`,
      type: "info",
      link: "/chat/interno"
    });
  };

  // Function to handle linking client
  const handleLinkClient = () => {
    if (!selectedClientId) {
      toast.error("Selecione um cliente para vincular");
      return;
    }

    onLinkClient(selectedClientId);
    setSelectedClientId(null);
    setIsClientLinkDialogOpen(false);
  };

  // Function to render message status icon
  const getStatusIcon = (status: MessageStatus) => {
    switch (status) {
      case "sending":
        return <Clock className="h-3.5 w-3.5 text-slate-400" />;
      case "sent":
        return <Check className="h-3.5 w-3.5 text-slate-400" />;
      case "delivered":
        return <Check className="h-3.5 w-3.5 text-blue-500" />;
      case "read":
        return <CheckCheck className="h-3.5 w-3.5 text-blue-500" />;
      case "error":
        return <AlertCircle className="h-3.5 w-3.5 text-red-500" />;
      default:
        return null;
    }
  };

  // Check if current user is admin
  const isCurrentUserAdmin = activeChat?.participants.find(
    p => p.id === (session?.user?.id || "user1")
  )?.isAdmin;

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="flex flex-col items-center text-center max-w-md">
          <Users className="h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
          <h2 className="text-xl font-medium text-slate-900 dark:text-slate-100 mb-2">
            Selecione uma conversa
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Escolha uma conversa existente para visualizar as mensagens ou crie um novo grupo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className={`text-sm ${
              activeChat.type === "client"
                ? "bg-emerald-500 text-white"
                : activeChat.type === "group"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-500 text-white"
            }`}>
              {activeChat.avatar}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-medium text-slate-900 dark:text-slate-100">
                {activeChat.name}
              </h2>
              {activeChat.type === "client" && (
                <Badge variant="outline" className="text-emerald-500 border-emerald-200 dark:border-emerald-800 text-xs">
                  Cliente
                </Badge>
              )}
              {activeChat.pinned && (
                <Badge variant="outline" className="text-amber-500 border-amber-200 dark:border-amber-800 text-xs">
                  Fixado
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {activeChat.type === "direct"
                ? activeChat.participants.find(p => p.id !== (session?.user?.id || "user1"))?.isOnline
                  ? "Online agora"
                  : "Offline"
                : `${activeChat.participants.length} participantes · ${activeChat.participants.filter(p => p.isOnline).length} online`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {activeChat.type !== "direct" && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={onOpenGroupDetails}
            >
              <Info className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Detalhes</span>
            </Button>
          )}

          {!activeChat.client && activeChat.type !== "direct" && (
            <Dialog open={isClientLinkDialogOpen} onOpenChange={setIsClientLinkDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <LinkIcon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Vincular Cliente</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Vincular Cliente a este Chat</DialogTitle>
                  <DialogDescription>
                    Associe este grupo de chat a um cliente específico
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <label className="text-sm font-medium">
                    Selecione o Cliente
                  </label>
                  <select
                    className="w-full p-2 mt-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950"
                    value={selectedClientId || ""}
                    onChange={(e) => setSelectedClientId(e.target.value || null)}
                  >
                    <option value="">Selecione um cliente</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name} ({client.status === "active" ? "Ativo" : client.status === "prospect" ? "Prospecto" : "Inativo"})
                      </option>
                    ))}
                  </select>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsClientLinkDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleLinkClient}>
                    Vincular Cliente
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {activeChat.type === "group" && (
            <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <UserPlus className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Adicionar</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Adicionar Membro ao Grupo</DialogTitle>
                  <DialogDescription>
                    Adicione novos participantes ao grupo {activeChat.name}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <label className="text-sm font-medium">
                    Selecione um Usuário
                  </label>
                  <select
                    className="w-full p-2 mt-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950"
                    value={selectedMemberId || ""}
                    onChange={(e) => setSelectedMemberId(e.target.value || null)}
                  >
                    <option value="">Selecione um usuário</option>
                    {availableUsers
                      .filter(user => !activeChat.participants.some(p => p.id === user.id))
                      .map(user => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.role || "Membro"})
                        </option>
                      ))}
                  </select>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddMemberDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddMember}>
                    Adicionar ao Grupo
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

              {activeChat.type === "group" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <UserCog className="h-4 w-4 mr-2" />
                    <span>Gerenciar membros</span>
                  </DropdownMenuItem>
                </>
              )}

              <DropdownMenuSeparator />

              {activeChat.pinned ? (
                <DropdownMenuItem onClick={onPinChat}>
                  <Star className="h-4 w-4 mr-2 text-amber-500" />
                  <span>Remover dos favoritos</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={onPinChat}>
                  <Pin className="h-4 w-4 mr-2" />
                  <span>Fixar conversa</span>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              {activeChat.type === "group" && (
                <DropdownMenuItem className="text-red-500" onClick={onLeaveGroup}>
                  <UserMinus className="h-4 w-4 mr-2" />
                  <span>Sair do grupo</span>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem className="text-red-500">
                <Trash2 className="h-4 w-4 mr-2" />
                <span>Arquivar conversa</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Message Area */}
      <ScrollArea className="flex-1 p-4">
        {activeChat.client && (
          <div className="mb-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-md p-3 flex items-center gap-3">
            <div className="bg-amber-100 dark:bg-amber-900/50 p-1.5 rounded-md">
              <Info className="h-5 w-5 text-amber-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                Chat vinculado ao cliente {activeChat.client.name}
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400">
                As conversas aqui são para alinhamento interno sobre este cliente e não são compartilhadas com ele.
              </p>
            </div>
          </div>
        )}

        {activeChat.messages.map((message, index) => {
          const isCurrentUser = message.sender.id === (session?.user?.id || "user1");
          const isSystemMessage = message.sender.id === "system";
          const showReplyInfo = message.replyTo !== undefined;

          return isSystemMessage ? (
            <div key={message.id} className="my-2 flex justify-center">
              <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs text-slate-500 dark:text-slate-400">
                {message.content}
              </div>
            </div>
          ) : (
            <div
              key={message.id}
              className={`mb-4 flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
            >
              <div className="flex gap-3 max-w-[85%]">
                {!isCurrentUser && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="text-xs bg-blue-500 text-white">
                      {message.sender.avatar}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div>
                  {!isCurrentUser && (
                    <p className="text-xs font-medium mb-1 text-slate-700 dark:text-slate-300">
                      {message.sender.name}
                    </p>
                  )}

                  <div className={`relative p-3 rounded-md ${
                    isCurrentUser
                      ? "bg-blue-500 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  }`}>
                    {/* Show reply info if this is a reply */}
                    {showReplyInfo && (
                      <div className={`mb-2 px-2 py-1 text-xs border-l-2 ${
                        isCurrentUser
                          ? "border-blue-300 bg-blue-600/50 text-blue-100"
                          : "border-slate-300 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      } rounded-sm`}>
                        <p className="font-medium">{message.replyTo?.sender}</p>
                        <p className="truncate">{message.replyTo?.content}</p>
                      </div>
                    )}

                    {message.isImportant && (
                      <div className="absolute -left-1 -top-1 h-4 w-4 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                    )}

                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                    <div className={`flex justify-end items-center gap-1 mt-1 text-xs ${
                      isCurrentUser ? "text-blue-100" : "text-slate-500"
                    }`}>
                      <span>
                        {message.edited && "Editado • "}{message.timestamp}
                      </span>
                      {isCurrentUser && getStatusIcon(message.status)}
                    </div>
                  </div>

                  <div className={`flex items-center gap-1 mt-1 ${!isCurrentUser ? "justify-start" : "justify-end"}`}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setReplyToMessage(message)}
                          >
                            <Reply className="h-3.5 w-3.5 text-slate-400" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Responder</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => onToggleImportant(message.id)}
                          >
                            <Star className={`h-3.5 w-3.5 ${message.isImportant ? "text-amber-500 fill-amber-500" : "text-slate-400"}`} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{message.isImportant ? "Remover destaque" : "Marcar como importante"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {isCurrentUser && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => {
                                setEditingMessage({ id: message.id, content: message.content });
                                setInputMessage(message.content);
                              }}
                            >
                              <Edit className="h-3.5 w-3.5 text-slate-400" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Editar mensagem</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreVertical className="h-3.5 w-3.5 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align={isCurrentUser ? "end" : "start"} side="top">
                        <DropdownMenuItem onClick={() => setReplyToMessage(message)}>
                          <Reply className="h-4 w-4 mr-2" />
                          <span>Responder</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                          <Forward className="h-4 w-4 mr-2" />
                          <span>Encaminhar</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => onToggleImportant(message.id)}>
                          <Star className={`h-4 w-4 mr-2 ${message.isImportant ? "text-amber-500" : ""}`} />
                          <span>{message.isImportant ? "Remover destaque" : "Destacar mensagem"}</span>
                        </DropdownMenuItem>

                        {isCurrentUser && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                              setEditingMessage({ id: message.id, content: message.content });
                              setInputMessage(message.content);
                            }}>
                              <Edit className="h-4 w-4 mr-2" />
                              <span>Editar mensagem</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem className="text-red-500">
                              <Trash2 className="h-4 w-4 mr-2" />
                              <span>Apagar mensagem</span>
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messageEndRef} />
      </ScrollArea>

      {/* Reply or Edit Indicator */}
      {(replyToMessage || editingMessage) && (
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
          {replyToMessage && (
            <div className="flex items-center gap-2 text-sm">
              <MessageSquareQuote className="h-4 w-4 text-blue-500" />
              <div>
                <span className="text-slate-600 dark:text-slate-300">Respondendo para {replyToMessage.sender.name}:</span>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px] sm:max-w-[300px] md:max-w-[500px]">
                  {replyToMessage.content}
                </p>
              </div>
            </div>
          )}

          {editingMessage && (
            <div className="flex items-center gap-2 text-sm">
              <Edit className="h-4 w-4 text-amber-500" />
              <span className="text-slate-600 dark:text-slate-300">Editando mensagem</span>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => {
              setReplyToMessage(null);
              setEditingMessage(null);
              setInputMessage("");
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Message Input */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
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
            placeholder={editingMessage ? "Edite sua mensagem..." : "Digite sua mensagem..."}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (editingMessage) {
                  handleEditMessage();
                } else {
                  handleSendMessage();
                }
              }
            }}
            className="flex-1"
          />

          <Button
            size="icon"
            className="rounded-full"
            disabled={!inputMessage.trim()}
            onClick={editingMessage ? handleEditMessage : handleSendMessage}
          >
            {editingMessage ? <Edit className="h-5 w-5" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>
        {activeChat.client && activeChat.sources?.includes("whatsapp") && !editingMessage && (
          <div className="flex items-center space-x-2 mt-1">
            <Checkbox
              id={`send-whatsapp-${activeChat.id}`}
              checked={sendToWhatsApp}
              onCheckedChange={(checked) => setSendToWhatsApp(checked as boolean)}
            />
            <label
              htmlFor={`send-whatsapp-${activeChat.id}`}
              className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600 dark:text-slate-400"
            >
              Enviar também para o WhatsApp do cliente ({activeChat.client.name})
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
