"use client";

import { useState } from "react";
import { MessageCircle, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

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
    projeto: "Cozinha Moderna - Apt 1201",
    avatar: "JS"
  },
  {
    id: "2",
    clienteId: "proj-3",
    nome: "Pedro Costa",
    telefone: "(11) 97777-9012",
    ultimaMensagem: "Quando posso ver o projeto 3D?",
    ultimaResposta: new Date(Date.now() - 12 * 60 * 1000), // 12 minutos atrás
    status: "aguardando_resposta",
    projeto: "Casa Completa - Zona Sul",
    avatar: "PC"
  },
  {
    id: "3",
    clienteId: "proj-2",
    nome: "Maria Santos",
    telefone: "(11) 98888-5678",
    ultimaMensagem: "Obrigada pela medição",
    ultimaResposta: new Date(Date.now() - 2 * 60 * 1000), // 2 minutos atrás
    status: "respondido",
    projeto: "Home Office Executivo",
    avatar: "MS"
  },
  {
    id: "4",
    clienteId: "proj-5",
    nome: "Ricardo Alves",
    telefone: "(11) 95555-7890",
    ultimaMensagem: "A produção está no prazo?",
    ultimaResposta: new Date(Date.now() - 15 * 60 * 1000), // 15 minutos atrás
    status: "aguardando_resposta",
    projeto: "Cozinha Gourmet - Cobertura",
    avatar: "RA"
  }
];

export function WhatsAppNotifications() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Função para calcular clientes sem resposta há mais de 5 minutos
  const getClientsWithoutResponse = () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return whatsappChats.filter(chat =>
      chat.status === "aguardando_resposta" &&
      chat.ultimaResposta < fiveMinutesAgo
    );
  };

  const clientsWithoutResponse = getClientsWithoutResponse();

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
    if (minutes < 60) {
      return `${minutes}min atrás`;
    }
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}min atrás`;
  };

  const openWhatsAppChat = (telefone: string) => {
    const phoneNumber = telefone.replace(/\D/g, ''); // Remove formatting
    const whatsappUrl = `https://wa.me/55${phoneNumber}`;
    window.open(whatsappUrl, '_blank');
  };

  if (clientsWithoutResponse.length === 0) {
    return null;
  }

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <MessageCircle className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            {clientsWithoutResponse.length > 0 && (
              <>
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
                  {clientsWithoutResponse.length}
                </Badge>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-80 p-0 border border-slate-200 dark:border-slate-700 shadow-lg"
        >
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-red-500" />
              Clientes sem resposta
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {clientsWithoutResponse.length} cliente(s) aguardando há mais de 5 minutos
            </p>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {clientsWithoutResponse.map((client) => (
              <div
                key={client.id}
                className="p-4 border-b border-slate-100 dark:border-slate-800 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 border-2 border-red-200 dark:border-red-800">
                    <AvatarFallback className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-sm">
                      {client.avatar}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-slate-900 dark:text-white text-sm truncate">
                        {client.nome}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(client.ultimaResposta)}
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 truncate">
                      {client.projeto}
                    </p>

                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-3 line-clamp-2">
                      "{client.ultimaMensagem}"
                    </p>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => openWhatsAppChat(client.telefone)}
                        className="h-7 px-3 bg-green-600 hover:bg-green-700 text-white text-xs"
                      >
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Responder
                      </Button>

                      <Link href="/chat/whatsapp">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-3 text-xs"
                        >
                          Ver Chat
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <Link href="/chat/whatsapp">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
              >
                Ver todos os chats
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
