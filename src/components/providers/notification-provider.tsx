"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { BellRing } from "lucide-react";

// Tipos para notificações
export type NotificationType = "info" | "success" | "warning" | "error";

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: NotificationType;
  read: boolean;
  link?: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, "id" | "time" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connectionInitialized, setConnectionInitialized] = useState(false);

  // Inicializar notificações do localStorage
  useEffect(() => {
    if (!session?.user?.id) return;

    try {
      const saved = localStorage.getItem(`notifications-${session.user.id}`);
      if (saved) {
        const parsedNotifications = JSON.parse(saved) as Notification[];
        setNotifications(parsedNotifications);
        setUnreadCount(parsedNotifications.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    }
  }, [session?.user?.id]);

  // Salvar notificações no localStorage quando mudam
  useEffect(() => {
    if (!session?.user?.id || notifications.length === 0) return;

    try {
      localStorage.setItem(`notifications-${session.user.id}`, JSON.stringify(notifications));
    } catch (error) {
      console.error("Erro ao salvar notificações:", error);
    }
  }, [notifications, session?.user?.id]);

  // Simular uma conexão de tempo real
  useEffect(() => {
    if (!session?.user?.id || connectionInitialized) return;

    const interval = setInterval(() => {
      // Simulação: 10% de chance de receber uma notificação a cada 45 segundos
      if (Math.random() < 0.1) {
        const demoNotifications = [
          {
            title: "Novo lead cadastrado",
            message: "Um novo lead foi cadastrado no sistema",
            type: "info" as NotificationType,
            link: "/leads"
          },
          {
            title: "Mensagem recebida",
            message: "Você recebeu uma nova mensagem de Maria Oliveira",
            type: "success" as NotificationType,
            link: "/chat/cliente"
          },
          {
            title: "Prazo próximo",
            message: "Projeto Cozinha Santos vence em 2 dias",
            type: "warning" as NotificationType,
            link: "/cronograma"
          },
          {
            title: "Atraso na produção",
            message: "O projeto Escritório Silva está atrasado",
            type: "error" as NotificationType,
            link: "/producao"
          }
        ];

        const randomNotification = demoNotifications[Math.floor(Math.random() * demoNotifications.length)];
        addNotification(randomNotification);
      }
    }, 45000);

    setConnectionInitialized(true);

    return () => clearInterval(interval);
  }, [session?.user?.id, connectionInitialized]);

  // Adicionar notificação
  const addNotification = (notification: Omit<Notification, "id" | "time" | "read">) => {
    const now = new Date();
    const newNotification: Notification = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      time: now.toISOString(),
      read: false,
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Limite de 50 notificações
    setUnreadCount(prev => prev + 1);

    // Exibir toast para a nova notificação
    toast(
      <div className="flex flex-col gap-1">
        <span className="font-medium">{newNotification.title}</span>
        <span className="text-sm">{newNotification.message}</span>
      </div>,
      {
        icon: <BellRing className="h-5 w-5" />,
        duration: 5000,
        action: {
          label: "Ver",
          onClick: () => {
            if (newNotification.link) {
              window.location.href = newNotification.link;
            }
            markAsRead(newNotification.id);
          }
        }
      }
    );
  };

  // Marcar notificação como lida
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Marcar todas como lidas
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  // Limpar notificações
  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Calcular notificações não lidas
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
