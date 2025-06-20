"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { ChatThread } from "./group-chat";
import {
  Search,
  Filter,
  MessageSquare,
  Star,
  Users,
  Pin,
  Clock,
  CalendarClock,
  CheckCircle,
  X,
  Smartphone // Adicionar Smartphone icon
} from "lucide-react";
import { useSession } from "next-auth/react";

interface ChatListProps {
  isLoading: boolean;
  chatThreads: ChatThread[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onCreateNewGroup: () => void;
}

export function ChatList({
  isLoading,
  chatThreads,
  activeChatId,
  onSelectChat,
  onCreateNewGroup,
}: ChatListProps) {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "direct" | "group" | "client">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [pinnedFilter, setPinnedFilter] = useState(false);
  const [unreadFilter, setUnreadFilter] = useState(false);
  const [recentFilter, setRecentFilter] = useState(false);

  // Filter chat threads based on search, type, and additional filters
  const filteredThreads = chatThreads.filter(thread => {
    // Text search filter
    const matchesSearch = !searchTerm ||
      thread.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.participants.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (thread.client && thread.client.name.toLowerCase().includes(searchTerm.toLowerCase()));

    // Type filter
    const matchesTypeFilter = filter === "all" || thread.type === filter;

    // Additional filters
    const matchesPinnedFilter = !pinnedFilter || thread.pinned;
    const matchesUnreadFilter = !unreadFilter || thread.unreadCount > 0;

    // Recent filter (last 24 hours) - using lastActivity as a simple string check for this demo
    // In real app, you would compare actual dates
    const matchesRecentFilter = !recentFilter || ["Agora", "Hoje", "Ontem"].some(term =>
      thread.lastActivity.includes(term) || !isNaN(Number.parseInt(thread.lastActivity.split(":")[0]))
    );

    return matchesSearch && matchesTypeFilter && matchesPinnedFilter &&
           matchesUnreadFilter && matchesRecentFilter;
  });

  // Reset search and filters
  const resetFilters = () => {
    setSearchTerm("");
    setFilter("all");
    setPinnedFilter(false);
    setUnreadFilter(false);
    setRecentFilter(false);
  };

  // Sort threads: pinned first, then by unread count, then by lastActivity
  const sortedThreads = [...filteredThreads].sort((a, b) => {
    // Pinned threads first
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;

    // Then by unread count
    if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
    if (a.unreadCount === 0 && b.unreadCount > 0) return 1;

    // Lastly by activity (just for demo - would need real date comparison)
    if (a.lastActivity === "Agora" && b.lastActivity !== "Agora") return -1;
    if (a.lastActivity !== "Agora" && b.lastActivity === "Agora") return 1;

    return 0;
  });

  return (
    <div className="border rounded-md overflow-hidden bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 flex flex-col h-full">
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
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-6 w-6"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button
            variant={showFilters ? "default" : "outline"}
            size="icon"
            className="shrink-0"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-1">
            <Button
              variant={pinnedFilter ? "default" : "outline"}
              size="sm"
              className="text-xs h-6 gap-1"
              onClick={() => setPinnedFilter(!pinnedFilter)}
            >
              <Pin className="h-3 w-3" />
              <span>Fixados</span>
            </Button>
            <Button
              variant={unreadFilter ? "default" : "outline"}
              size="sm"
              className="text-xs h-6 gap-1"
              onClick={() => setUnreadFilter(!unreadFilter)}
            >
              <Badge variant="secondary" className="h-3.5 w-3.5 flex items-center justify-center p-0">
                <span className="text-[10px]">!</span>
              </Badge>
              <span>Não lidos</span>
            </Button>
            <Button
              variant={recentFilter ? "default" : "outline"}
              size="sm"
              className="text-xs h-6 gap-1"
              onClick={() => setRecentFilter(!recentFilter)}
            >
              <Clock className="h-3 w-3" />
              <span>Recentes</span>
            </Button>

            {(pinnedFilter || unreadFilter || recentFilter || searchTerm || filter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-6 ml-auto"
                onClick={resetFilters}
              >
                Limpar filtros
              </Button>
            )}
          </div>
        )}

        <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setFilter(value as any)}>
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="all" className="text-xs">Todas</TabsTrigger>
            <TabsTrigger value="direct" className="text-xs">Diretas</TabsTrigger>
            <TabsTrigger value="group" className="text-xs">Grupos</TabsTrigger>
            <TabsTrigger value="client" className="text-xs">Clientes</TabsTrigger>
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
        ) : sortedThreads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <MessageSquare className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-2" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-200 mb-1">
              Nenhuma conversa encontrada
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              {searchTerm
                ? "Tente outro termo de busca"
                : filter !== "all"
                  ? "Tente outro filtro ou crie um novo grupo"
                  : "Crie um novo grupo para começar a conversar"}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
              >
                Limpar Filtros
              </Button>
              <Button
                size="sm"
                onClick={onCreateNewGroup}
              >
                Novo Grupo
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-1">
            {sortedThreads.map(thread => (
              <div
                key={thread.id}
                className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${
                  activeChatId === thread.id
                    ? "bg-slate-100 dark:bg-slate-800"
                    : "hover:bg-slate-50 dark:hover:bg-slate-900"
                }`}
                onClick={() => onSelectChat(thread.id)}
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={`text-sm ${
                      thread.type === "client"
                        ? "bg-emerald-500 text-white"
                        : thread.type === "group"
                          ? "bg-blue-500 text-white"
                          : "bg-slate-500 text-white"
                    }`}>
                      {thread.avatar}
                    </AvatarFallback>
                  </Avatar>
                  {thread.type === "client" && (
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-white dark:bg-slate-950 rounded-full flex items-center justify-center">
                      {thread.sources?.includes('whatsapp') ? (
                        <Smartphone className="h-3 w-3 text-green-500" />
                      ) : (
                        <div className="h-3 w-3 bg-emerald-500 rounded-full" />
                      )}
                    </div>
                  )}
                  {thread.type === "group" && (
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-white dark:bg-slate-950 rounded-full flex items-center justify-center">
                      <Users className="h-3 w-3 text-blue-500" />
                    </div>
                  )}
                  {thread.type === "direct" && thread.participants.some(p => p.isOnline && p.id !== (session?.user?.id || "user1")) && (
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-white dark:bg-slate-950 rounded-full flex items-center justify-center">
                      <div className="h-3 w-3 bg-emerald-500 rounded-full" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">
                      {thread.name}
                      {thread.pinned && (
                        <span className="ml-1 text-amber-500">
                          <Pin className="h-3 w-3 inline" />
                        </span>
                      )}
                    </h3>
                    <span className="text-xs text-slate-500 whitespace-nowrap">
                      {thread.lastActivity}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {thread.messages.length > 0
                        ? (thread.messages[thread.messages.length - 1].sender.id === (session?.user?.id || "user1")
                            ? "Você: "
                            : thread.messages[thread.messages.length - 1].sender.id === "system"
                              ? ""
                              : `${thread.messages[thread.messages.length - 1].sender.name.split(' ')[0]}: `)
                        + thread.messages[thread.messages.length - 1].content
                        : "Nenhuma mensagem ainda"}
                    </p>
                    {thread.unreadCount > 0 && (
                      <Badge variant="default" className="ml-2 h-5 min-w-5 rounded-full px-1.5">
                        {thread.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="p-3 border-t border-slate-200 dark:border-slate-800">
        <Button
          className="w-full gap-2"
          onClick={onCreateNewGroup}
        >
          <Users className="h-4 w-4" />
          <span>Criar Novo Grupo</span>
        </Button>
      </div>
    </div>
  );
}
