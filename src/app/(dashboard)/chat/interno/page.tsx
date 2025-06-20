"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useNotifications } from "@/components/providers/notification-provider";

// Components
import { ChatList } from "@/components/chat/chat-list";
import { GroupChat, type ChatThread, type ChatParticipant, type ClientReference, type Message } from "@/components/chat/group-chat";
import { CreateGroupDialog } from "@/components/chat/create-group-dialog";
import { GroupDetails } from "@/components/chat/group-details";

import * as ChatIntegration from "@/lib/chat-integration";

export default function ChatInternoPage() {
  const { data: session } = useSession();
  const { addNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(true);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
  const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);
  const [isGroupDetailsOpen, setIsGroupDetailsOpen] = useState(false);

  // Equipe (usuários que podem ser adicionados aos grupos)
  const [teamMembers, setTeamMembers] = useState<ChatParticipant[]>([
    { id: "user1", name: "Carlos Santos", avatar: "CS", isOnline: true, role: "Vendedor", isAdmin: true },
    { id: "user2", name: "Ana Lima", avatar: "AL", isOnline: true, role: "Designer" },
    { id: "user3", name: "Rafael Mendes", avatar: "RM", isOnline: false, role: "Gerente", isAdmin: true },
    { id: "user4", name: "Juliana Costa", avatar: "JC", isOnline: true, role: "Montador" },
    { id: "user5", name: "Fernando Gomes", avatar: "FG", isOnline: false, role: "Financeiro" },
    { id: "user6", name: "Mariana Silva", avatar: "MS", isOnline: true, role: "Atendimento" },
    { id: "user7", name: "Pedro Alves", avatar: "PA", isOnline: false, role: "Produção" },
    { id: "user8", name: "Luciana Torres", avatar: "LT", isOnline: true, role: "Marketing" },
  ]);

  // Clientes que podem ser vinculados
  const [clients, setClients] = useState<ClientReference[]>([
    { id: "client1", name: "João Silva", status: "active" },
    { id: "client2", name: "Maria Oliveira", status: "active" },
    { id: "client3", name: "Pedro Santos", status: "prospect" },
    { id: "client4", name: "Ana Costa", status: "inactive" },
    { id: "client5", name: "Carlos Mendes", status: "active" },
    { id: "client6", name: "Fernanda Lima", status: "prospect" },
    { id: "client7", name: "Ricardo Ferreira", status: "active" },
    { id: "client8", name: "Camila Rocha", status: "inactive" },
  ]);

  const [whatsAppNumbers, setWhatsAppNumbers] = useState<Record<string, string>>({}); // Store WhatsApp numbers for clients

  useEffect(() => {
    const loadChatData = async () => {
      setIsLoading(true);
      // Simulação de carregamento de dados
      setTimeout(() => {
        const demoChats: ChatThread[] = [
          {
            id: "chat1",
            type: "client",
            name: "Projeto João Silva",
            avatar: "JS",
            participants: [
              { id: "user1", name: "Carlos Santos", avatar: "CS", isOnline: true, isAdmin: true },
              { id: "user2", name: "Ana Lima", avatar: "AL", isOnline: true },
              { id: "user3", name: "Rafael Mendes", avatar: "RM", isOnline: false },
            ],
            lastActivity: "10:30",
            unreadCount: 2,
            pinned: true,
            client: { id: "client1", name: "João Silva", status: "active" },
            description: "Grupo para discussão do projeto de cozinha planejada para o cliente João Silva",
            createdAt: "15/05/2025",
            createdBy: "Carlos Santos",
            sources: ChatIntegration.getConnectedChatSources("client1"),
            messages: [
              {
                id: "msg1",
                content: "Equipe, o Sr. João aprovou o orçamento da cozinha.",
                sender: { id: "user1", name: "Carlos Santos", avatar: "CS" },
                timestamp: "10:15",
                status: "read",
                source: "internal",
              },
              {
                id: "msg2",
                content: "Ótimo! Quando podemos começar a produção?",
                sender: { id: "user2", name: "Ana Lima", avatar: "AL" },
                timestamp: "10:20",
                status: "read",
                source: "internal",
              },
              {
                id: "msg3",
                content: "Assim que ele realizar o primeiro pagamento. Já enviei os dados por e-mail.",
                sender: { id: "user1", name: "Carlos Santos", avatar: "CS" },
                timestamp: "10:22",
                status: "read",
                source: "internal",
              },
              {
                id: "msg4",
                content: "Ana, pode preparar os desenhos técnicos para produção?",
                sender: { id: "user3", name: "Rafael Mendes", avatar: "RM" },
                timestamp: "10:25",
                status: "read",
                source: "internal",
              },
              {
                id: "msg5",
                content: "Claro, vou iniciar hoje mesmo.",
                sender: { id: "user2", name: "Ana Lima", avatar: "AL" },
                timestamp: "10:30",
                status: "read",
                source: "internal",
              }
            ],
          },
          {
            id: "chat2",
            type: "client",
            name: "Closet Maria Oliveira",
            avatar: "MO",
            participants: [
              { id: "user1", name: "Carlos Santos", avatar: "CS", isOnline: true, isAdmin: true },
              { id: "user2", name: "Ana Lima", avatar: "AL", isOnline: true },
            ],
            lastActivity: "09:45",
            unreadCount: 0,
            client: { id: "client2", name: "Maria Oliveira", status: "active" },
            createdAt: "12/05/2025",
            createdBy: "Carlos Santos",
            description: "Acompanhamento do projeto de closet para a cliente Maria Oliveira",
            sources: ChatIntegration.getConnectedChatSources("client2"),
            messages: [
              {
                id: "msg1",
                content: "Preciso fazer alguns ajustes no projeto do closet da Maria.",
                sender: { id: "user2", name: "Ana Lima", avatar: "AL" },
                timestamp: "09:30",
                status: "read",
                isImportant: false,
                source: "internal",
              },
              {
                id: "msg2",
                content: "Quais ajustes? Ela solicitou algo específico?",
                sender: { id: "user1", name: "Carlos Santos", avatar: "CS" },
                timestamp: "09:35",
                status: "read",
                source: "internal",
              },
              {
                id: "msg3",
                content: "Sim, ela quer aumentar o número de gavetas e reduzir o espaço para cabides.",
                sender: { id: "user2", name: "Ana Lima", avatar: "AL" },
                timestamp: "09:40",
                status: "read",
                isImportant: true,
                source: "internal",
              },
              {
                id: "msg4",
                content: "Ok, faça os ajustes e me envie para que eu possa revisar o orçamento.",
                sender: { id: "user1", name: "Carlos Santos", avatar: "CS" },
                timestamp: "09:45",
                status: "read",
                source: "internal",
              }
            ],
          },
          {
            id: "chat3",
            type: "group",
            name: "Equipe de Design",
            avatar: "ED",
            participants: [
              { id: "user2", name: "Ana Lima", avatar: "AL", isOnline: true, isAdmin: true },
              { id: "user4", name: "Juliana Costa", avatar: "JC", isOnline: true },
              { id: "user5", name: "Fernando Gomes", avatar: "FG", isOnline: false },
              { id: "user8", name: "Luciana Torres", avatar: "LT", isOnline: true },
            ],
            lastActivity: "Ontem",
            unreadCount: 5,
            createdAt: "10/05/2025",
            createdBy: "Ana Lima",
            description: "Grupo para compartilhamento de projetos e referências de design",
            sources: ["internal"],
            messages: [
              {
                id: "msg1",
                content: "Pessoal, vamos padronizar os projetos de cozinha usando o novo catálogo.",
                sender: { id: "user2", name: "Ana Lima", avatar: "AL" },
                timestamp: "Ontem, 15:30",
                status: "read",
                source: "internal",
              },
              {
                id: "msg2",
                content: "Concordo, vai facilitar o trabalho e padronizar as propostas.",
                sender: { id: "user4", name: "Juliana Costa", avatar: "JC" },
                timestamp: "Ontem, 15:35",
                status: "read",
                source: "internal",
              },
              {
                id: "msg3",
                content: "Também acho uma boa ideia. Quando começa a valer?",
                sender: { id: "user5", name: "Fernando Gomes", avatar: "FG" },
                timestamp: "Ontem, 15:40",
                status: "read",
                source: "internal",
              },
              {
                id: "msg4",
                content: "A partir da próxima semana. Vou compartilhar o template com todos.",
                sender: { id: "user2", name: "Ana Lima", avatar: "AL" },
                timestamp: "Ontem, 15:45",
                status: "read",
                source: "internal",
              },
              {
                id: "msg5",
                content: "Podemos agendar uma reunião para alinhar todos os detalhes?",
                sender: { id: "user8", name: "Luciana Torres", avatar: "LT" },
                timestamp: "Ontem, 16:00",
                status: "read",
                source: "internal",
              }
            ],
          },
          {
            id: "chat4",
            type: "direct",
            name: "Rafael Mendes",
            avatar: "RM",
            participants: [
              { id: "user1", name: "Carlos Santos", avatar: "CS", isOnline: true },
              { id: "user3", name: "Rafael Mendes", avatar: "RM", isOnline: false },
            ],
            lastActivity: "Segunda",
            unreadCount: 0,
            sources: ["internal"],
            messages: [
              {
                id: "msg1",
                content: "Carlos, precisamos conversar sobre as metas do mês.",
                sender: { id: "user3", name: "Rafael Mendes", avatar: "RM" },
                timestamp: "Segunda, 14:00",
                status: "read",
                source: "internal",
              },
              {
                id: "msg2",
                content: "Claro, Rafael. Estou disponível hoje à tarde.",
                sender: { id: "user1", name: "Carlos Santos", avatar: "CS" },
                timestamp: "Segunda, 14:10",
                status: "read",
                source: "internal",
              },
              {
                id: "msg3",
                content: "Ótimo. Vamos nos reunir às 15h na sala de reuniões?",
                sender: { id: "user3", name: "Rafael Mendes", avatar: "RM" },
                timestamp: "Segunda, 14:15",
                status: "read",
                source: "internal",
              },
              {
                id: "msg4",
                content: "Confirmado. Vou preparar um resumo das vendas.",
                sender: { id: "user1", name: "Carlos Santos", avatar: "CS" },
                timestamp: "Segunda, 14:20",
                status: "read",
                source: "internal",
              }
            ],
          },
          {
            id: "chat5",
            type: "group",
            name: "Equipe Comercial",
            avatar: "EC",
            participants: [
              { id: "user1", name: "Carlos Santos", avatar: "CS", isOnline: true, isAdmin: true },
              { id: "user3", name: "Rafael Mendes", avatar: "RM", isOnline: false, isAdmin: true },
              { id: "user6", name: "Mariana Silva", avatar: "MS", isOnline: true },
              { id: "user7", name: "Pedro Alves", avatar: "PA", isOnline: false },
            ],
            lastActivity: "Hoje",
            unreadCount: 3,
            createdAt: "05/05/2025",
            createdBy: "Rafael Mendes",
            description: "Grupo da equipe comercial para discutir estratégias de vendas e acompanhar metas",
            sources: ["internal"],
            messages: [
              {
                id: "msg1",
                content: "Bom dia equipe! Nossos números estão bons, mas precisamos melhorar a conversão dos leads.",
                sender: { id: "user3", name: "Rafael Mendes", avatar: "RM" },
                timestamp: "Hoje, 09:00",
                status: "read",
                source: "internal",
              },
              {
                id: "msg2",
                content: "Concordo Rafael. Estou notando que muitos leads estão demorando para fechar.",
                sender: { id: "user1", name: "Carlos Santos", avatar: "CS" },
                timestamp: "Hoje, 09:15",
                status: "read",
                source: "internal",
              },
              {
                id: "msg3",
                content: "Vamos fazer uma reunião para analisar o funil de vendas?",
                sender: { id: "user6", name: "Mariana Silva", avatar: "MS" },
                timestamp: "Hoje, 09:30",
                status: "read",
                source: "internal",
              },
              {
                id: "msg4",
                content: "Boa ideia. Podemos marcar para amanhã às 10h?",
                sender: { id: "user3", name: "Rafael Mendes", avatar: "RM" },
                timestamp: "Hoje, 09:45",
                status: "delivered",
                source: "internal",
              }
            ],
          }
        ];

        setChatThreads(demoChats.map(chat => ({
          ...chat,
          messages: chat.messages.map(msg => ({ ...msg, source: msg.source || "internal"})),
          sources: chat.sources || (chat.client ? ChatIntegration.getConnectedChatSources(chat.client.id) : ["internal"])
        })));

        // Simular carregamento de números de WhatsApp de clientes
        setWhatsAppNumbers({
          "client1": "+5511912345678", // Exemplo de número
          "client2": "+5521987654321",
        });

        if (!activeChatId && demoChats.length > 0) {
          setActiveChatId(demoChats[0].id);
        }
        setIsLoading(false);
      }, 1500);
    };
    loadChatData();
  }, []);

  // Obter o chat ativo
  const activeChat = chatThreads.find(thread => thread.id === activeChatId);

  // Função para lidar com a seleção de chat
  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);

    // Marcar mensagens como lidas
    setChatThreads(prev => prev.map(thread => {
      if (thread.id === chatId && thread.unreadCount > 0) {
        return {
          ...thread,
          unreadCount: 0
        };
      }
      return thread;
    }));
  };

  // Função para enviar mensagem (agora com integração WhatsApp)
  const handleSendMessage = async (content: string, replyToMessageId?: string, sendToWhatsApp?: boolean) => {
    if (!content.trim() || !activeChatId) return;

    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    let replyToInfo;
    if (replyToMessageId) {
      const activeThread = chatThreads.find(t => t.id === activeChatId);
      const replyToMessage = activeThread?.messages.find(m => m.id === replyToMessageId);
      if (replyToMessage) {
        replyToInfo = {
          id: replyToMessage.id,
          content: replyToMessage.content,
          sender: replyToMessage.sender.name,
        };
      }
    }

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      content: content.trim(),
      sender: {
        id: session?.user?.id || "user1",
        name: session?.user?.name || "Carlos Santos",
        avatar: session?.user?.name?.[0] || "CS",
      },
      timestamp: timeString,
      status: "sent",
      replyTo: replyToInfo,
      source: "internal", // Definir a origem da mensagem
    };

    setChatThreads(prev => prev.map(thread => {
      if (thread.id === activeChatId) {
        return {
          ...thread,
          messages: [...thread.messages, newMessage],
          lastActivity: "Agora",
        };
      }
      return thread;
    }));

    // Simulação de status de mensagem
    setTimeout(() => {
      setChatThreads(prev => prev.map(thread => {
        if (thread.id === activeChatId) {
          return {
            ...thread,
            messages: thread.messages.map(msg =>
              msg.id === newMessage.id ? { ...msg, status: "delivered" as const } : msg
            ),
          };
        }
        return thread;
      }));
      setTimeout(() => {
        setChatThreads(prev => prev.map(thread => {
          if (thread.id === activeChatId) {
            return {
              ...thread,
              messages: thread.messages.map(msg =>
                msg.id === newMessage.id ? { ...msg, status: "read" as const } : msg
              ),
            };
          }
          return thread;
        }));
      }, 2000);
    }, 1000);

    // Enviar para WhatsApp se aplicável
    const currentChat = chatThreads.find(t => t.id === activeChatId);
    if (sendToWhatsApp && currentChat?.client && currentChat.sources?.includes("whatsapp")) {
      const clientWhatsAppNumber = whatsAppNumbers[currentChat.client.id];
      if (clientWhatsAppNumber) {
        const syncResult = await ChatIntegration.syncInternalToWhatsApp(clientWhatsAppNumber, {
          ...newMessage,
          source: "whatsapp", // Marcar como originada para WhatsApp
        });
        if (syncResult.success) {
          toast.success("Mensagem enviada também para o WhatsApp do cliente.");
        } else {
          toast.error(`Falha ao enviar para WhatsApp: ${syncResult.error}`);
        }
      } else {
        toast.warning("Número de WhatsApp do cliente não encontrado para sincronização.");
      }
    }

    // Notificar participantes internos
    if (currentChat) {
      currentChat.participants.forEach(participant => {
        if (participant.id !== (session?.user?.id || "user1")) {
          addNotification({
            title: `Nova mensagem de ${session?.user?.name || "Carlos Santos"}`,
            message: `No grupo ${currentChat.name}: ${content.slice(0, 50)}${content.length > 50 ? '...' : ''}`,
            type: "info",
            link: "/chat/interno",
          });
        }
      });
    }
  };

  // Função para marcar uma mensagem como importante
  const handleToggleImportant = (messageId: string) => {
    setChatThreads(prev => prev.map(thread => {
      if (thread.id === activeChatId) {
        return {
          ...thread,
          messages: thread.messages.map(msg =>
            msg.id === messageId ? { ...msg, isImportant: !msg.isImportant } : msg
          ),
        };
      }
      return thread;
    }));
  };

  // Função para editar mensagem
  const handleEditMessage = (messageId: string, newContent: string) => {
    setChatThreads(prev => prev.map(thread => {
      if (thread.id === activeChatId) {
        return {
          ...thread,
          messages: thread.messages.map(msg =>
            msg.id === messageId ? {
              ...msg,
              content: newContent,
              edited: true
            } : msg
          ),
        };
      }
      return thread;
    }));

    toast.success("Mensagem editada com sucesso");
  };

  // Função para criar um novo grupo
  const handleCreateGroup = (name: string, description: string, participantIds: string[], clientId?: string) => {
    // Criar avatares a partir das iniciais do nome do grupo
    const initials = name
      .split(' ')
      .map(word => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    // Encontrar os participantes selecionados
    const groupParticipants = teamMembers
      .filter(member => participantIds.includes(member.id))
      .map(member => ({
        id: member.id,
        name: member.name,
        avatar: member.avatar,
        isOnline: member.isOnline,
        role: member.role,
        isAdmin: member.id === (session?.user?.id || "user1") // O criador é administrador
      }));

    // Adicionar o usuário atual ao grupo se não estiver incluído
    const currentUser = {
      id: session?.user?.id || "user1",
      name: session?.user?.name || "Carlos Santos",
      avatar: session?.user?.name?.[0] || "CS",
      isOnline: true,
      role: "Vendedor",
      isAdmin: true
    };

    if (!groupParticipants.some(p => p.id === currentUser.id)) {
      groupParticipants.push(currentUser);
    }

    // Definir o tipo de grupo
    let groupType: "group" | "client" = "group";
    let clientInfo = undefined;

    // Se um cliente foi selecionado, vincular ao grupo
    if (clientId) {
      groupType = "client";
      const client = clients.find(c => c.id === clientId);
      if (client) {
        clientInfo = {
          id: client.id,
          name: client.name,
          status: client.status
        };
      }
    }

    // Criar mensagem do sistema
    const systemMessage: Message = {
      id: `msg_system_${Date.now()}`,
      content: `Grupo "${name}" criado${clientInfo ? ` e vinculado ao cliente ${clientInfo.name}` : ''}.`,
      sender: {
        id: "system",
        name: "Sistema",
        avatar: "SI",
      },
      timestamp: "Agora",
      status: "read",
      source: "internal",
    };

    // Criar novo grupo
    const newGroup: ChatThread = {
      id: `group_${Date.now()}`,
      type: groupType,
      name,
      avatar: initials,
      participants: groupParticipants,
      lastActivity: "Agora",
      unreadCount: 0,
      messages: [systemMessage],
      description,
      client: clientInfo,
      createdAt: new Date().toLocaleDateString('pt-BR'),
      createdBy: session?.user?.name || "Carlos Santos",
      sources: clientInfo ? ChatIntegration.getConnectedChatSources(clientInfo.id) : ["internal"],
    };

    // Adicionar o novo grupo aos chats
    setChatThreads(prev => [newGroup, ...prev]);

    // Selecionar o novo grupo
    setActiveChatId(newGroup.id);

    toast.success("Grupo criado com sucesso!");

    // Notificar participantes (simulação)
    groupParticipants.forEach(participant => {
      if (participant.id !== (session?.user?.id || "user1")) {
        addNotification({
          title: "Você foi adicionado a um novo grupo",
          message: `Você foi adicionado ao grupo "${name}" por ${session?.user?.name || "Carlos Santos"}`,
          type: "info",
          link: "/chat/interno"
        });
      }
    });
  };

  // Função para adicionar membro a um grupo
  const handleAddMember = (groupId: string, userId: string) => {
    const user = teamMembers.find(u => u.id === userId);
    if (!user) return;

    setChatThreads(prev => prev.map(thread => {
      if (thread.id === groupId) {
        // Adicionar o usuário como participante
        const updatedParticipants = [...thread.participants, {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          isOnline: user.isOnline,
          role: user.role
        }];

        // Adicionar mensagem do sistema
        const systemMessage: Message = {
          id: `msg_system_${Date.now()}`,
          content: `${user.name} foi adicionado ao grupo por ${session?.user?.name || "Carlos Santos"}.`,
          sender: {
            id: "system",
            name: "Sistema",
            avatar: "SI",
          },
          timestamp: "Agora",
          status: "read",
          source: "internal",
        };

        return {
          ...thread,
          participants: updatedParticipants,
          messages: [...thread.messages, systemMessage],
          lastActivity: "Agora"
        };
      }
      return thread;
    }));

    toast.success(`${user.name} adicionado ao grupo`);

    // Notificar o usuário adicionado
    addNotification({
      title: "Você foi adicionado a um grupo",
      message: `Você foi adicionado ao grupo "${chatThreads.find(t => t.id === groupId)?.name}" por ${session?.user?.name || "Carlos Santos"}`,
      type: "info",
      link: "/chat/interno"
    });
  };

  // Função para remover membro de um grupo
  const handleRemoveMember = (groupId: string, userId: string) => {
    const isCurrentUser = userId === (session?.user?.id || "user1");
    const thread = chatThreads.find(t => t.id === groupId);
    const user = thread?.participants.find(p => p.id === userId);

    if (!thread || !user) return;

    setChatThreads(prev => prev.map(thread => {
      if (thread.id === groupId) {
        // Remover o usuário da lista de participantes
        const updatedParticipants = thread.participants.filter(p => p.id !== userId);

        // Adicionar mensagem do sistema
        const systemMessage: Message = {
          id: `msg_system_${Date.now()}`,
          content: isCurrentUser
            ? `${user.name} saiu do grupo.`
            : `${user.name} foi removido do grupo por ${session?.user?.name || "Carlos Santos"}.`,
          sender: {
            id: "system",
            name: "Sistema",
            avatar: "SI",
          },
          timestamp: "Agora",
          status: "read",
          source: "internal",
        };

        return {
          ...thread,
          participants: updatedParticipants,
          messages: [...thread.messages, systemMessage],
          lastActivity: "Agora"
        };
      }
      return thread;
    }));

    if (isCurrentUser) {
      // Se o usuário atual saiu, desselecionar o chat
      setActiveChatId(null);
      toast.success(`Você saiu do grupo ${thread.name}`);
    } else {
      toast.success(`${user.name} removido do grupo`);

      // Notificar o usuário removido
      addNotification({
        title: "Você foi removido de um grupo",
        message: `Você foi removido do grupo "${thread.name}" por ${session?.user?.name || "Carlos Santos"}`,
        type: "warning",
        link: "/chat/interno"
      });
    }
  };

  // Função para atualizar um grupo
  const handleUpdateGroup = (groupId: string, updates: Partial<ChatThread>) => {
    setChatThreads(prev => prev.map(thread => {
      if (thread.id === groupId) {
        const updatedThread = { ...thread, ...updates };

        // Se o nome foi alterado, adicionar mensagem do sistema
        if (updates.name && updates.name !== thread.name) {
          const systemMessage: Message = {
            id: `msg_system_${Date.now()}`,
            content: `O nome do grupo foi alterado para "${updates.name}" por ${session?.user?.name || "Carlos Santos"}.`,
            sender: {
              id: "system",
              name: "Sistema",
              avatar: "SI",
            },
            timestamp: "Agora",
            status: "read",
            source: "internal",
          };

          updatedThread.messages = [...thread.messages, systemMessage];
          updatedThread.lastActivity = "Agora";
        }

        return updatedThread;
      }
      return thread;
    }));
  };

  // Função para promover usuário a administrador
  const handlePromoteToAdmin = (groupId: string, userId: string) => {
    const thread = chatThreads.find(t => t.id === groupId);
    const user = thread?.participants.find(p => p.id === userId);

    if (!thread || !user) return;

    setChatThreads(prev => prev.map(thread => {
      if (thread.id === groupId) {
        // Atualizar o usuário para administrador
        const updatedParticipants = thread.participants.map(p =>
          p.id === userId ? { ...p, isAdmin: true } : p
        );

        // Adicionar mensagem do sistema
        const systemMessage: Message = {
          id: `msg_system_${Date.now()}`,
          content: `${user.name} agora é administrador do grupo.`,
          sender: {
            id: "system",
            name: "Sistema",
            avatar: "SI",
          },
          timestamp: "Agora",
          status: "read",
          source: "internal",
        };

        return {
          ...thread,
          participants: updatedParticipants,
          messages: [...thread.messages, systemMessage],
          lastActivity: "Agora"
        };
      }
      return thread;
    }));

    toast.success(`${user.name} promovido a administrador`);

    // Notificar o usuário promovido
    addNotification({
      title: "Você foi promovido a administrador",
      message: `Você agora é administrador do grupo "${thread.name}"`,
      type: "success",
      link: "/chat/interno"
    });
  };

  // Função para remover privilégios de administrador
  const handleDemoteFromAdmin = (groupId: string, userId: string) => {
    const thread = chatThreads.find(t => t.id === groupId);
    const user = thread?.participants.find(p => p.id === userId);

    if (!thread || !user) return;

    setChatThreads(prev => prev.map(thread => {
      if (thread.id === groupId) {
        // Remover privilégios de administrador
        const updatedParticipants = thread.participants.map(p =>
          p.id === userId ? { ...p, isAdmin: false } : p
        );

        // Adicionar mensagem do sistema
        const systemMessage: Message = {
          id: `msg_system_${Date.now()}`,
          content: `${user.name} não é mais administrador do grupo.`,
          sender: {
            id: "system",
            name: "Sistema",
            avatar: "SI",
          },
          timestamp: "Agora",
          status: "read",
          source: "internal",
        };

        return {
          ...thread,
          participants: updatedParticipants,
          messages: [...thread.messages, systemMessage],
          lastActivity: "Agora"
        };
      }
      return thread;
    }));

    toast.success(`${user.name} não é mais administrador`);

    // Notificar o usuário
    addNotification({
      title: "Você não é mais administrador",
      message: `Seus privilégios de administrador do grupo "${thread.name}" foram removidos`,
      type: "info",
      link: "/chat/interno"
    });
  };

  // Função para vincular cliente a um grupo
  const handleLinkClient = (groupId: string, clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    setChatThreads(prev => prev.map(thread => {
      if (thread.id === groupId) {
        // Adicionar mensagem do sistema
        const systemMessage: Message = {
          id: `msg_system_${Date.now()}`,
          content: `Grupo vinculado ao cliente ${client.name}.`,
          sender: {
            id: "system",
            name: "Sistema",
            avatar: "SI",
          },
          timestamp: "Agora",
          status: "read",
          source: "internal",
        };

        return {
          ...thread,
          type: "client",
          client: {
            id: client.id,
            name: client.name,
            status: client.status
          },
          messages: [...thread.messages, systemMessage],
          lastActivity: "Agora",
          sources: ChatIntegration.getConnectedChatSources(client.id),
        };
      }
      return thread;
    }));

    toast.success(`Grupo vinculado ao cliente ${client.name}`);
  };

  // Função para excluir um grupo
  const handleDeleteGroup = (groupId: string) => {
    const thread = chatThreads.find(t => t.id === groupId);
    if (!thread) return;

    // Remover o grupo
    setChatThreads(prev => prev.filter(thread => thread.id !== groupId));

    // Se o grupo excluído era o ativo, desselecionar
    if (activeChatId === groupId) {
      setActiveChatId(null);
    }

    toast.success(`Grupo ${thread.name} excluído com sucesso`);

    // Notificar participantes
    thread.participants.forEach(participant => {
      if (participant.id !== (session?.user?.id || "user1")) {
        addNotification({
          title: "Grupo excluído",
          message: `O grupo "${thread.name}" foi excluído por ${session?.user?.name || "Carlos Santos"}`,
          type: "info"
        });
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">Chat Interno</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Comunicação entre colaboradores e equipes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-160px)]">
        {/* Lista de Conversas */}
        <div className="lg:col-span-1 h-full">
          <ChatList
            isLoading={isLoading}
            chatThreads={chatThreads}
            activeChatId={activeChatId}
            onSelectChat={handleSelectChat}
            onCreateNewGroup={() => setIsCreateGroupDialogOpen(true)}
          />
        </div>

        {/* Área de chat */}
        <div className="lg:col-span-2 border rounded-md overflow-hidden bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 flex flex-col h-full">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="h-8 w-8 border-2 border-t-blue-500 border-slate-200 dark:border-slate-700 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 dark:text-slate-400">Carregando mensagens...</p>
              </div>
            </div>
          ) : (
            <GroupChat
              activeChat={activeChat}
              onSendMessage={handleSendMessage} // handleSendMessage agora aceita sendToWhatsApp
              onToggleImportant={handleToggleImportant}
              onEditMessage={handleEditMessage}
              onAddMember={(userId) => handleAddMember(activeChatId!, userId)}
              onRemoveMember={(userId) => handleRemoveMember(activeChatId!, userId)}
              onPinChat={() => handleUpdateGroup(activeChatId!, { pinned: !activeChat?.pinned })}
              onLinkClient={(clientId) => handleLinkClient(activeChatId!, clientId)}
              onLeaveGroup={() => handleRemoveMember(activeChatId!, session?.user?.id || "user1")}
              availableUsers={teamMembers}
              clients={clients}
              onOpenGroupDetails={() => setIsGroupDetailsOpen(true)}
            />
          )}
        </div>
      </div>

      {/* Dialog para criar novo grupo */}
      <CreateGroupDialog
        open={isCreateGroupDialogOpen}
        onOpenChange={setIsCreateGroupDialogOpen}
        onCreateGroup={handleCreateGroup}
        availableUsers={teamMembers}
        clients={clients}
      />

      {/* Dialog para detalhes do grupo */}
      {activeChat && activeChat.type !== "direct" && (
        <GroupDetails
          group={activeChat}
          isOpen={isGroupDetailsOpen}
          onClose={() => setIsGroupDetailsOpen(false)}
          onUpdateGroup={handleUpdateGroup}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
          onLeaveGroup={(groupId) => handleRemoveMember(groupId, session?.user?.id || "user1")}
          onDeleteGroup={handleDeleteGroup}
          onLinkClient={handleLinkClient} // Isso já existe
          onPromoteToAdmin={handlePromoteToAdmin}
          onDemoteFromAdmin={handleDemoteFromAdmin}
          availableUsers={teamMembers}
          clients={clients}
          // Adicionar props para gerenciar a vinculação com WhatsApp
          whatsAppNumber={activeChat.client ? whatsAppNumbers[activeChat.client.id] : undefined}
          onLinkWhatsApp={async (groupId, number) => {
            const result = await ChatIntegration.linkWhatsAppToInternalChat(groupId, number);
            if (result.success) {
              setWhatsAppNumbers(prev => ({ ...prev, [activeChat.client!.id]: number }));
              // Atualizar as sources do chat para incluir WhatsApp
              setChatThreads(prevThreads => prevThreads.map(t =>
                t.id === groupId && t.client ? { ...t, sources: [...(t.sources || []), "whatsapp"].filter((s,i,a) => a.indexOf(s) === i) as ChatIntegration.ChatSource[] } : t
              ));
              toast.success("Número de WhatsApp vinculado com sucesso!");
            } else {
              toast.error(`Falha ao vincular WhatsApp: ${result.error}`);
            }
          }}
          onUnlinkWhatsApp={async (groupId, clientId) => {
            // Simulação de desvincular (remover o número e a source)
            setWhatsAppNumbers(prev => {
              const newNumbers = {...prev};
              if (clientId) delete newNumbers[clientId];
              return newNumbers;
            });
            setChatThreads(prevThreads => prevThreads.map(t =>
              t.id === groupId ? { ...t, sources: (t.sources || []).filter(s => s !== "whatsapp") as ChatIntegration.ChatSource[] } : t
            ));
            toast.info("Número de WhatsApp desvinculado (simulação).");
          }}
        />
      )}
    </div>
  );
}
