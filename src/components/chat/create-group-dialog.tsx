"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPlus, X, Search, Users } from "lucide-react";
import type { ClientReference, ChatParticipant } from "./group-chat";
import { toast } from "sonner";

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateGroup: (
    name: string,
    description: string,
    participantIds: string[],
    clientId?: string
  ) => void;
  availableUsers: ChatParticipant[];
  clients: ClientReference[];
}

export function CreateGroupDialog({
  open,
  onOpenChange,
  onCreateGroup,
  availableUsers,
  clients,
}: CreateGroupDialogProps) {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Reset state when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setGroupName("");
      setGroupDescription("");
      setSelectedParticipants([]);
      setSelectedClientId(null);
      setSearchTerm("");
    }
    onOpenChange(newOpen);
  };

  // Handle group creation
  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      toast.error("O nome do grupo é obrigatório");
      return;
    }

    if (selectedParticipants.length === 0) {
      toast.error("Adicione pelo menos um participante ao grupo");
      return;
    }

    onCreateGroup(
      groupName,
      groupDescription,
      selectedParticipants,
      selectedClientId || undefined
    );

    handleOpenChange(false);
  };

  // Toggle participant selection
  const toggleParticipant = (userId: string) => {
    setSelectedParticipants(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Filter users by search term
  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Novo Grupo</DialogTitle>
          <DialogDescription>
            Crie um novo grupo para comunicação entre a equipe interna
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="group-name" className="text-sm font-medium">
              Nome do Grupo*
            </label>
            <Input
              id="group-name"
              placeholder="Ex: Equipe de Vendas"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="group-description" className="text-sm font-medium">
              Descrição (opcional)
            </label>
            <Textarea
              id="group-description"
              placeholder="Descreva o propósito deste grupo..."
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Vincular a Cliente (opcional)
            </label>
            <select
              className="w-full p-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950"
              value={selectedClientId || ""}
              onChange={(e) => setSelectedClientId(e.target.value || null)}
            >
              <option value="">Selecione um cliente (opcional)</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name} ({client.status === "active" ? "Ativo" : client.status === "prospect" ? "Prospecto" : "Inativo"})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">
                Participantes*
              </label>
              <Badge variant="outline" className="font-normal">
                {selectedParticipants.length} selecionados
              </Badge>
            </div>

            {selectedParticipants.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedParticipants.map(id => {
                  const user = availableUsers.find(u => u.id === id);
                  if (!user) return null;

                  return (
                    <Badge key={id} variant="secondary" className="gap-1 pl-1 pr-2 py-1">
                      <Avatar className="h-4 w-4">
                        <AvatarFallback className="text-[8px]">{user.avatar}</AvatarFallback>
                      </Avatar>
                      <span>{user.name.split(' ')[0]}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 p-0"
                        onClick={() => toggleParticipant(id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  );
                })}

                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs p-1"
                  onClick={() => setSelectedParticipants([])}
                >
                  Limpar
                </Button>
              </div>
            )}

            <div className="relative mb-2">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <ScrollArea className="h-48 border border-slate-200 dark:border-slate-700 rounded-md">
              {filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <Users className="h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Nenhum usuário encontrado
                  </p>
                </div>
              ) : (
                <div className="p-1">
                  {filteredUsers.map(user => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer"
                      onClick={() => toggleParticipant(user.id)}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-xs bg-blue-500 text-white">
                            {user.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          {user.role && <p className="text-xs text-slate-500">{user.role}</p>}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedParticipants.includes(user.id)}
                        onChange={() => toggleParticipant(user.id)}
                        className="h-4 w-4 text-blue-600 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreateGroup}>
            Criar Grupo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
