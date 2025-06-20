"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Users,
  Calendar,
  MessagesSquare,
  User,
  Shield,
  FileText,
  Edit,
  UserPlus,
  Link as LinkIcon,
  Pin,
  UserMinus,
  Trash2,
  Smartphone,
  Unlink,
} from "lucide-react";
import { useSession } from "next-auth/react";
import type { ChatThread, ClientReference } from "./group-chat";
import { GroupParticipants } from "./group-participants";
import { toast } from "sonner";
import { ChatSource } from "@/lib/chat-integration";

interface GroupDetailsProps {
  group: ChatThread;
  isOpen: boolean;
  onClose: () => void;
  onUpdateGroup: (groupId: string, updates: Partial<ChatThread>) => void;
  onAddMember: (groupId: string, userId: string) => void;
  onRemoveMember: (groupId: string, userId: string) => void;
  onLeaveGroup: (groupId: string) => void;
  onDeleteGroup: (groupId: string) => void;
  onLinkClient: (groupId: string, clientId: string) => void;
  onPromoteToAdmin: (groupId: string, userId: string) => void;
  onDemoteFromAdmin: (groupId: string, userId: string) => void;
  availableUsers: any[];
  clients: ClientReference[];
  whatsAppNumber?: string; // WhatsApp number for the client
  onLinkWhatsApp: (groupId: string, number: string) => Promise<void>;
  onUnlinkWhatsApp: (groupId: string, clientId?: string) => Promise<void>;
}

export function GroupDetails({
  group,
  isOpen,
  onClose,
  onUpdateGroup,
  onAddMember,
  onRemoveMember,
  onLeaveGroup,
  onDeleteGroup,
  onLinkClient,
  onPromoteToAdmin,
  onDemoteFromAdmin,
  availableUsers,
  clients,
  whatsAppNumber,
  onLinkWhatsApp,
  onUnlinkWhatsApp,
}: GroupDetailsProps) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"info" | "participants" | "files">("info");
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(group?.name || "");
  const [editedDescription, setEditedDescription] = useState(group?.description || "");
  const [isConfirmLeaveOpen, setIsConfirmLeaveOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isLinkClientOpen, setIsLinkClientOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isLinkWhatsAppOpen, setIsLinkWhatsAppOpen] = useState(false);
  const [newWhatsAppNumber, setNewWhatsAppNumber] = useState("");

  // Check if current user is admin
  const isCurrentUserAdmin = group?.participants.find(
    p => p.id === (session?.user?.id || "user1")
  )?.isAdmin;

  // Handle editing group info
  const handleSaveEdit = () => {
    if (!editedName.trim()) {
      toast.error("O nome do grupo é obrigatório");
      return;
    }

    onUpdateGroup(group.id, {
      name: editedName,
      description: editedDescription,
    });

    setIsEditing(false);
    toast.success("Informações do grupo atualizadas");
  };

  // Handle linking client
  const handleLinkClient = () => {
    if (!selectedClientId) {
      toast.error("Selecione um cliente para vincular");
      return;
    }

    onLinkClient(group.id, selectedClientId);
    setIsLinkClientOpen(false);
    setSelectedClientId(null);
  };

  // Handle linking WhatsApp
  const handleLinkWhatsApp = async () => {
    if (!newWhatsAppNumber.trim()) {
      toast.error("Digite um número de WhatsApp válido.");
      return;
    }
    await onLinkWhatsApp(group.id, newWhatsAppNumber);
    setIsLinkWhatsAppOpen(false);
    setNewWhatsAppNumber("");
  };

  // Format date string for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Data desconhecida";
    // This is a simplified version for the demo
    // In a real app, you would parse and format a real date
    return dateString;
  };

  if (!group) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-blue-500 text-white text-xs">
                {group.avatar}
              </AvatarFallback>
            </Avatar>
            <span>Detalhes do Grupo</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex border-b">
          <Button
            variant={activeTab === "info" ? "default" : "ghost"}
            className="rounded-none flex-1 h-10"
            onClick={() => setActiveTab("info")}
          >
            Informações
          </Button>
          <Button
            variant={activeTab === "participants" ? "default" : "ghost"}
            className="rounded-none flex-1 h-10"
            onClick={() => setActiveTab("participants")}
          >
            Participantes ({group.participants.length})
          </Button>
          <Button
            variant={activeTab === "files" ? "default" : "ghost"}
            className="rounded-none flex-1 h-10"
            onClick={() => setActiveTab("files")}
          >
            Arquivos
          </Button>
        </div>

        <ScrollArea className="flex-1 max-h-[60vh]">
          {activeTab === "info" && (
            <div className="p-4 space-y-4">
              {!isEditing ? (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{group.name}</h2>
                    {isCurrentUserAdmin && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => {
                          setEditedName(group.name);
                          setEditedDescription(group.description || "");
                          setIsEditing(true);
                        }}
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Editar</span>
                      </Button>
                    )}
                  </div>

                  {group.description && (
                    <div className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
                      {group.description}
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-slate-500" />
                      <span>
                        {group.participants.length} participantes · {group.participants.filter(p => p.isOnline).length} online
                      </span>
                    </div>

                    {group.client && (
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-emerald-500" />
                        <span className="flex items-center gap-1">
                          Vinculado ao cliente:
                          <Badge variant="outline" className="ml-1 text-emerald-500 border-emerald-200 dark:border-emerald-800 gap-1">
                            {group.client.name}
                            <Badge variant="secondary" className="ml-1 text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                              {group.client.status === "active" ? "Ativo" :
                              group.client.status === "prospect" ? "Prospecto" : "Inativo"}
                            </Badge>
                          </Badge>
                        </span>
                      </div>
                    )}
                    {/* WhatsApp Info */}
                    {group.client && group.sources?.includes("whatsapp") && (
                      <div className="flex items-center gap-2 text-sm">
                        <Smartphone className="h-4 w-4 text-green-500" />
                        {whatsAppNumber ? (
                          <span className="flex items-center gap-1">
                            WhatsApp vinculado: {whatsAppNumber}
                            {isCurrentUserAdmin && (
                              <Button variant="link" size="sm" className="h-auto p-0 ml-1 text-red-500 hover:text-red-700" onClick={() => onUnlinkWhatsApp(group.id, group.client?.id)}>
                                <Unlink className="h-3 w-3 mr-1" /> Desvincular
                              </Button>
                            )}
                          </span>
                        ) : (
                          isCurrentUserAdmin && (
                            <Button variant="link" size="sm" className="h-auto p-0 text-green-600 hover:text-green-800" onClick={() => setIsLinkWhatsAppOpen(true)}>
                              <LinkIcon className="h-3 w-3 mr-1" />Vincular WhatsApp
                            </Button>
                          )
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <span>Criado em: {formatDate(group.createdAt || "21/05/2025")}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <MessagesSquare className="h-4 w-4 text-slate-500" />
                      <span>{group.messages.length} mensagens no total</span>
                    </div>

                    {group.createdBy && (
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="h-4 w-4 text-slate-500" />
                        <span>Criado por: {group.createdBy || "Administrador"}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Administradores do grupo</h3>
                    <div className="flex flex-wrap gap-2">
                      {group.participants.filter(p => p.isAdmin).map(admin => (
                        <Badge key={admin.id} variant="outline" className="gap-1 py-1 px-2">
                          <Avatar className="h-4 w-4">
                            <AvatarFallback className="text-[10px] bg-blue-500 text-white">
                              {admin.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <span>{admin.name}</span>
                        </Badge>
                      ))}
                      {!group.participants.some(p => p.isAdmin) && (
                        <span className="text-sm text-slate-500">Nenhum administrador definido</span>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex flex-wrap gap-2">
                    {!group.client && isCurrentUserAdmin && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => setIsLinkClientOpen(true)}
                      >
                        <LinkIcon className="h-3.5 w-3.5" />
                        <span>Vincular Cliente</span>
                      </Button>
                    )}

                    {group.client && !group.sources?.includes("whatsapp") && isCurrentUserAdmin && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-green-600 border-green-200 hover:bg-green-50 dark:border-green-900 dark:text-green-400 dark:hover:bg-green-950"
                        onClick={() => setIsLinkWhatsAppOpen(true)}
                      >
                        <Smartphone className="h-3.5 w-3.5" />
                        <span>Vincular WhatsApp</span>
                      </Button>
                    )}

                    {isCurrentUserAdmin && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => onUpdateGroup(group.id, { pinned: !group.pinned })}
                      >
                        <Pin className="h-3.5 w-3.5" />
                        <span>{group.pinned ? "Desafixar" : "Fixar Grupo"}</span>
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-amber-500 border-amber-200 hover:bg-amber-50 dark:border-amber-900 dark:text-amber-400 dark:hover:bg-amber-950"
                      onClick={() => setIsConfirmLeaveOpen(true)}
                    >
                      <UserMinus className="h-3.5 w-3.5" />
                      <span>Sair do Grupo</span>
                    </Button>

                    {isCurrentUserAdmin && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-red-500 border-red-200 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                        onClick={() => setIsConfirmDeleteOpen(true)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Excluir Grupo</span>
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Editar Informações do Grupo</h2>

                  <div className="space-y-2">
                    <Label htmlFor="group-name">Nome do Grupo*</Label>
                    <Input
                      id="group-name"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      placeholder="Nome do grupo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="group-description">Descrição</Label>
                    <Textarea
                      id="group-description"
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      placeholder="Descrição do propósito deste grupo..."
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveEdit}>
                      Salvar Alterações
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "participants" && (
            <GroupParticipants
              groupId={group.id}
              groupName={group.name}
              participants={group.participants}
              availableUsers={availableUsers}
              onAddMember={(userId) => onAddMember(group.id, userId)}
              onRemoveMember={(userId) => onRemoveMember(group.id, userId)}
              onPromoteToAdmin={(userId) => onPromoteToAdmin(group.id, userId)}
              onDemoteFromAdmin={(userId) => onDemoteFromAdmin(group.id, userId)}
            />
          )}

          {activeTab === "files" && (
            <div className="p-4 flex flex-col items-center justify-center h-full text-center py-12">
              <FileText className="h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                Nenhum arquivo compartilhado
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
                Os arquivos compartilhados neste grupo aparecerão aqui. Compartilhe arquivos na conversa para visualizá-los nesta seção.
              </p>
            </div>
          )}
        </ScrollArea>

        {/* Link Client Dialog */}
        <Dialog open={isLinkClientOpen} onOpenChange={setIsLinkClientOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Vincular Cliente ao Grupo</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Label>Selecione o Cliente</Label>
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
              <Button variant="outline" onClick={() => setIsLinkClientOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleLinkClient}>
                Vincular Cliente
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Link WhatsApp Dialog */}
        {group.client && (
          <Dialog open={isLinkWhatsAppOpen} onOpenChange={setIsLinkWhatsAppOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Vincular Número de WhatsApp</DialogTitle>
                <p className="text-sm text-slate-500">
                  Vincule o número de WhatsApp do cliente {group.client.name} a este chat.
                </p>
              </DialogHeader>
              <div className="py-4 space-y-2">
                <Label htmlFor="whatsapp-number">Número do WhatsApp</Label>
                <Input
                  id="whatsapp-number"
                  placeholder="+55 (XX) XXXXX-XXXX"
                  value={newWhatsAppNumber}
                  onChange={(e) => setNewWhatsAppNumber(e.target.value)}
                />
                <p className="text-xs text-slate-500">
                  Inclua o código do país (ex: +55 para Brasil).
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsLinkWhatsAppOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleLinkWhatsApp} disabled={!newWhatsAppNumber.trim()}>
                  Vincular WhatsApp
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Confirm Leave Dialog */}
        <Dialog open={isConfirmLeaveOpen} onOpenChange={setIsConfirmLeaveOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Sair do Grupo</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Tem certeza que deseja sair do grupo "{group.name}"?</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Você não receberá mais mensagens deste grupo e precisará ser adicionado por um administrador para retornar.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConfirmLeaveOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onLeaveGroup(group.id);
                  setIsConfirmLeaveOpen(false);
                  onClose();
                }}
              >
                Sair do Grupo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirm Delete Dialog */}
        <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-red-500">Excluir Grupo</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Tem certeza que deseja excluir permanentemente o grupo "{group.name}"?</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Esta ação não pode ser desfeita. Todas as mensagens e arquivos compartilhados serão perdidos.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConfirmDeleteOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onDeleteGroup(group.id);
                  setIsConfirmDeleteOpen(false);
                  onClose();
                }}
              >
                Excluir Permanentemente
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
