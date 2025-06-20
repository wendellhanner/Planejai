"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  MessageSquareText,
  Clock,
  Check,
  CheckCheck,
  StickyNote,
  Lightbulb,
  Settings,
  X,
  MessageCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatStyleToggleProps {
  activeStyle: "default" | "whatsapp";
  onChange: (style: "default" | "whatsapp") => void;
  isNoteMode: boolean;
  onToggleNoteMode: () => void;
}

// Componente para alternar entre estilos de chat
export function ChatStyleToggle({ activeStyle, onChange, isNoteMode, onToggleNoteMode }: ChatStyleToggleProps) {
  return (
    <div className="flex flex-col gap-3 p-3 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-medium">Estilo do chat</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Escolha a aparência das mensagens</p>
        </div>
        <Tabs
          defaultValue={activeStyle}
          value={activeStyle}
          className="h-8"
          onValueChange={(value) => onChange(value as "default" | "whatsapp")}
        >
          <TabsList className="h-8 p-0.5">
            <TabsTrigger value="default" className="h-7 px-3 py-0.5 text-xs">
              <MessageSquareText className="h-3.5 w-3.5 mr-1.5" />
              Padrão
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="h-7 px-3 py-0.5 text-xs">
              <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
              WhatsApp
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex items-center justify-between space-x-2">
        <div className="flex flex-col gap-1">
          <Label htmlFor="note-mode" className="text-sm font-medium">Modo de anotação</Label>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isNoteMode ? "Notas visíveis apenas para a equipe" : "Modo de mensagem normal"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="note-mode"
            checked={isNoteMode}
            onCheckedChange={onToggleNoteMode}
          />
          <Badge
            variant="outline"
            className={cn(
              "text-xs",
              isNoteMode
                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
            )}
          >
            {isNoteMode ? "Modo nota" : "Modo chat"}
          </Badge>
        </div>
      </div>
    </div>
  );
}

// Componente para mostrar uma nota interna
export function InternalNote({
  content,
  sender,
  timestamp,
  onDismiss
}: {
  content: string;
  sender: string;
  timestamp: string;
  onDismiss?: () => void;
}) {
  return (
    <Card className="mb-3 p-3 border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/20">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-2">
          <StickyNote className="h-4 w-4 text-amber-500 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                Nota interna
              </p>
              <span className="text-xs text-amber-700/70 dark:text-amber-400/70">
                {timestamp}
              </span>
            </div>
            <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">{content}</p>
            <p className="text-xs text-amber-700/70 dark:text-amber-400/70 mt-1">
              Adicionada por {sender}
            </p>
          </div>
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-amber-600 hover:text-amber-700 dark:text-amber-400"
            onClick={onDismiss}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </Card>
  );
}

// Componente para mostrar um insight de IA
export function AIInsight({
  content,
  onDismiss
}: {
  content: string;
  onDismiss?: () => void;
}) {
  return (
    <Card className="mb-3 p-3 border-indigo-200 dark:border-indigo-800/50 bg-indigo-50 dark:bg-indigo-900/20">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-2">
          <Lightbulb className="h-4 w-4 text-indigo-500 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-medium text-indigo-800 dark:text-indigo-300">
              Insight da IA
            </p>
            <p className="text-sm text-indigo-800 dark:text-indigo-200 mt-1">{content}</p>
          </div>
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            onClick={onDismiss}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </Card>
  );
}

// Obter ícone de status para mensagens
export function getStatusIcon(status: string, style: "default" | "whatsapp" = "default") {
  const commonClasses = "h-3.5 w-3.5";
  const defaultStatusColor = style === "default" ? "text-slate-400" : "text-gray-400";
  const readStatusColor = style === "default" ? "text-blue-500" : "text-blue-500";

  switch (status) {
    case "sending":
      return <Clock className={`${commonClasses} ${defaultStatusColor}`} />;
    case "sent":
      return <Check className={`${commonClasses} ${defaultStatusColor}`} />;
    case "delivered":
      return style === "default"
        ? <Check className={`${commonClasses} ${readStatusColor}`} />
        : <CheckCheck className={`${commonClasses} ${defaultStatusColor}`} />;
    case "read":
      return <CheckCheck className={`${commonClasses} ${readStatusColor}`} />;
    case "error":
      return <X className={`${commonClasses} text-red-500`} />;
    default:
      return null;
  }
}

// Obter classes CSS para bolhas de mensagem baseadas no estilo
export function getMessageClasses({
  isCurrentUser,
  isNoteMode,
  chatStyle
}: {
  isCurrentUser: boolean,
  isNoteMode: boolean,
  chatStyle: "default" | "whatsapp"
}) {
  if (isNoteMode) {
    return isCurrentUser
      ? "bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200"
      : "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300";
  }

  if (chatStyle === "whatsapp") {
    return isCurrentUser
      ? "bg-[#d9fdd3] dark:bg-green-900 text-gray-800 dark:text-gray-100"
      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100";
  }

  return isCurrentUser
    ? "bg-blue-500 text-white"
    : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100";
}

// Obtém o fundo personalizado para o estilo WhatsApp
export function getWhatsAppBackgroundStyles() {
  return {
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%239e9e9e' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E\")",
    backgroundRepeat: "repeat",
    backgroundColor: "#efeae2",
  };
}

// Hook para persistir a preferência de estilo do chat
export function useChatStylePreference(initialStyle: "default" | "whatsapp" = "default") {
  const [chatStyle, setChatStyle] = useState<"default" | "whatsapp">(initialStyle);

  useEffect(() => {
    const savedStyle = localStorage.getItem('chatStyle');
    if (savedStyle === 'default' || savedStyle === 'whatsapp') {
      setChatStyle(savedStyle);
    }
  }, []);

  const updateChatStyle = (style: "default" | "whatsapp") => {
    setChatStyle(style);
    localStorage.setItem('chatStyle', style);
  };

  return [chatStyle, updateChatStyle] as const;
}

// Hook para gerenciar o modo de notas
export function useNoteMode(initialMode = false) {
  const [isNoteMode, setIsNoteMode] = useState(initialMode);

  const toggleNoteMode = () => {
    setIsNoteMode(prev => !prev);
  };

  return [isNoteMode, toggleNoteMode] as const;
}
