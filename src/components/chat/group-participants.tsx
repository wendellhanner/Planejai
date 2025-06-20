"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Input } from "@/components/ui/input";

import {
  UserCog,
  UserPlus,
  MoreVertical,
  UserMinus,
  Shield,
  Search,
  ShieldCheck,
  ShieldAlert,
  Users,
  Crown,
  UserCheck,
  Filter,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import type { ChatParticipant } from "./group-chat";

interface GroupParticipantsProps {
  groupId: string;
  groupName: string;
  participants: ChatParticipant[];
  availableUsers: ChatParticipant[];
  onAddMember: (userId: string) => void;
  onRemoveMember: (userId: string) => void;
  onPromoteToAdmin: (userId: string) => void;
  onDemoteFromAdmin: (userId: string) => void;
}

export function GroupParticipants({
  groupId,
  groupName,
  participants,
  availableUsers,
  onAddMember,
  onRemoveMember,
  onPromoteToAdmin,
  onDemoteFromAdmin,
}: GroupParticipantsProps) {
  const { data: session } = useSession();
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOnline, setFilterOnline] = useState(false);
  const [filterAdmins, setFilterAdmins] = useState(false);

  // Check if current user is admin
  const isCurrentUserAdmin = participants.find(
    p => p.id === (session?.user?.id || "user1")
  )?.isAdmin;

  // Filter participants by search term and filters
  const filteredParticipants = participants.filter(p => {
    const matchesSearch = !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.role && p.role.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesOnlineFilter = !filterOnline || p.isOnline;
    const matchesAdminFilter = !filterAdmins || p.isAdmin;

    return matchesSearch && matchesOnlineFilter && matchesAdminFilter;
  });

  // Handle adding member
  const handleAddMember = () => {
    if (!selectedMemberId) {
      toast.error("Selecione um usuário para adicionar");
      return;
    }

    onAddMember(selectedMemberId);
    setSelectedMemberId(null);
    setIsAddMemberDialogOpen(false);
    toast.success("Usuário adicionado ao grupo com sucesso!");
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">Participantes do Grupo</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {participants.length} usuários · {participants.filter(p => p.isOnline).length} online
          </p>
        </div>

        <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <UserPlus className="h-4 w-4" />
              <span>Adicionar</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Membro ao Grupo</DialogTitle>
              <DialogDescription>
                Adicione novos participantes ao grupo {groupName}
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
                  .filter(user => !participants.some(p => p.id === user.id))
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
      </div>

      {/* Search and Filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar participantes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={filterOnline ? "default" : "outline"}
            size="sm"
            className="gap-1 text-xs"
            onClick={() => setFilterOnline(!filterOnline)}
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span>Online</span>
          </Button>

          <Button
            variant={filterAdmins ? "default" : "outline"}
            size="sm"
            className="gap-1 text-xs"
            onClick={() => setFilterAdmins(!filterAdmins)}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Administradores</span>
          </Button>

          {(filterOnline || filterAdmins || searchTerm) && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs ml-auto"
              onClick={() => {
                setFilterOnline(false);
                setFilterAdmins(false);
                setSearchTerm("");
              }}
            >
              <Filter className="h-3.5 w-3.5" />
              <span>Limpar filtros</span>
            </Button>
          )}
        </div>
      </div>

      {/* Participants List */}
      <ScrollArea className="h-[400px] pr-4">
        {filteredParticipants.length === 0 ? (
          <div className="py-8 text-center">
            <Users className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-slate-500 dark:text-slate-400">
              Nenhum participante encontrado
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredParticipants.map(participant => {
              const isCreator = participant.id === "user1"; // Just for demo, replace with actual creator ID
              const isCurrentUser = participant.id === (session?.user?.id || "user1");

              return (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className={`${participant.isOnline ? "bg-green-500" : "bg-slate-500"} text-white`}>
                          {participant.avatar}
                        </AvatarFallback>
                      </Avatar>
                      {participant.isOnline && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-slate-950"></span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {participant.name}
                          {isCurrentUser && " (Você)"}
                        </p>

                        {participant.isAdmin && (
                          <Badge variant="outline" className="text-xs font-normal px-1.5 h-5 border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        )}

                        {isCreator && (
                          <Badge variant="outline" className="text-xs font-normal px-1.5 h-5 border-amber-200 dark:border-amber-900 text-amber-600 dark:text-amber-400">
                            <Crown className="h-3 w-3 mr-1" />
                            Criador
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {participant.role || "Membro"} • {participant.isOnline ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>

                  {(isCurrentUserAdmin || isCurrentUser) && !isCreator && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {isCurrentUserAdmin && !isCurrentUser && (
                          <>
                            {participant.isAdmin ? (
                              <DropdownMenuItem onClick={() => onDemoteFromAdmin(participant.id)}>
                                <ShieldAlert className="h-4 w-4 mr-2" />
                                <span>Remover privilégios de admin</span>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => onPromoteToAdmin(participant.id)}>
                                <ShieldCheck className="h-4 w-4 mr-2" />
                                <span>Promover a administrador</span>
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              className="text-red-500"
                              onClick={() => onRemoveMember(participant.id)}
                            >
                              <UserMinus className="h-4 w-4 mr-2" />
                              <span>Remover do grupo</span>
                            </DropdownMenuItem>
                          </>
                        )}

                        {isCurrentUser && (
                          <DropdownMenuItem
                            className="text-red-500"
                            onClick={() => onRemoveMember(participant.id)}
                          >
                            <UserMinus className="h-4 w-4 mr-2" />
                            <span>Sair do grupo</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
