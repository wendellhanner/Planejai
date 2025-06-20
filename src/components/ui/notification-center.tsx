"use client";

import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuHeader,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Bell,
  Settings,
  Check,
  X,
  BellRing,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  Trash2
} from "lucide-react";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { toast } from "sonner";

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

// Mock de notificações para demonstração
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Novo Lead",
    message: "Carlos Silva enviou uma solicitação de orçamento",
    type: "info",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 min atrás
    read: false,
    actionUrl: "/leads"
  },
  {
    id: "2",
    title: "Projeto Aprovado",
    message: "Cozinha da Maria Santos foi aprovada",
    type: "success",
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 min atrás
    read: false,
    actionUrl: "/kanban"
  },
  {
    id: "3",
    title: "Prazo em Atraso",
    message: "Projeto do João tem prazo vencendo hoje",
    type: "warning",
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min atrás
    read: true,
    actionUrl: "/cronograma"
  },
  {
    id: "4",
    title: "Meta Atingida",
    message: "Parabéns! Meta mensal de vendas foi atingida",
    type: "success",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h atrás
    read: true,
    actionUrl: "/analytics"
  }
];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);

  const {
    permission,
    isSupported,
    isSubscribed,
    requestPermission,
    subscribe,
    unsubscribe,
    sendTestNotification
  } = usePushNotifications();

  useEffect(() => {
    setPushEnabled(isSubscribed);
  }, [isSubscribed]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "Agora mesmo";
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d atrás`;
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handlePushToggle = async (enabled: boolean) => {
    if (enabled) {
      if (permission === 'default') {
        const newPermission = await requestPermission();
        if (newPermission !== 'granted') {
          toast.error("Permissão negada para notificações");
          return;
        }
      }

      if (permission === 'granted') {
        const success = await subscribe();
        if (success) {
          setPushEnabled(true);
          toast.success("Notificações push ativadas!");
        } else {
          toast.error("Erro ao ativar notificações");
        }
      }
    } else {
      const success = await unsubscribe();
      if (success) {
        setPushEnabled(false);
        toast.success("Notificações push desativadas");
      } else {
        toast.error("Erro ao desativar notificações");
      }
    }
  };

  const handleTestNotification = () => {
    sendTestNotification();
    toast.success("Notificação de teste enviada!");
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notificações</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                Marcar todas como lidas
              </Button>
            )}
            <Badge variant="secondary" className="text-xs">
              {unreadCount}
            </Badge>
          </div>
        </div>

        {/* Configurações de Push */}
        {isSupported && (
          <>
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BellRing className="h-4 w-4" />
                  <Label className="text-sm">Notificações Push</Label>
                </div>
                <Switch
                  checked={pushEnabled}
                  onCheckedChange={handlePushToggle}
                  disabled={permission === 'denied'}
                />
              </div>
              {permission === 'denied' && (
                <p className="text-xs text-red-500 mt-1">
                  Permissão negada. Habilite nas configurações do navegador.
                </p>
              )}
              {pushEnabled && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestNotification}
                  className="mt-2 text-xs"
                >
                  Testar Notificação
                </Button>
              )}
            </div>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Lista de Notificações */}
        <div className="max-h-64 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Nenhuma notificação</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 border-b hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                  !notification.read ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-medium ${!notification.read ? 'text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'}`}>
                        {notification.title}
                      </h4>
                      <div className="flex items-center gap-1">
                        {!notification.read && (
                          <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-400">
                        {formatTimestamp(notification.timestamp)}
                      </span>

                      <div className="flex items-center gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-6 px-2 text-xs"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Marcar como lida
                          </Button>
                        )}

                        {notification.actionUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              markAsRead(notification.id);
                              window.location.href = notification.actionUrl!;
                            }}
                            className="h-6 px-2 text-xs text-blue-600 hover:text-blue-800"
                          >
                            Ver detalhes
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-3 border-t">
            <Button variant="ghost" size="sm" className="w-full text-xs">
              <Settings className="h-4 w-4 mr-2" />
              Configurações de Notificação
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
