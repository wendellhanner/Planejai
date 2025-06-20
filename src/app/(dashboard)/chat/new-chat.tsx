"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { PlusCircle, Search, MessageSquare, Users, UserPlus, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

type NewChatProps = {
  chatType?: "CLIENTE" | "INTERNO";
};

export default function NewChat({ chatType = "CLIENTE" }: NewChatProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState<"CLIENTE" | "INTERNO">(chatType);
  const [title, setTitle] = useState("");
  const [leadId, setLeadId] = useState("");
  const [participantIds, setParticipantIds] = useState<string[]>([]);

  // Data states
  const [leads, setLeads] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Fetch leads on open for client chats
  useEffect(() => {
    if (isOpen && selectedTab === "CLIENTE") {
      fetchLeads();
    }
  }, [isOpen, selectedTab]);

  // Fetch users on open for internal chats
  useEffect(() => {
    if (isOpen && selectedTab === "INTERNO") {
      fetchUsers();
    }
  }, [isOpen, selectedTab]);

  const fetchLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const response = await fetch('/api/leads');
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      } else {
        toast.error("Erro ao carregar clientes");
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error("Erro ao carregar clientes");
    } finally {
      setIsLoadingLeads(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        toast.error("Erro ao carregar usuários");
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error("Erro ao carregar usuários");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleCreateChat = async () => {
    // Validate based on chat type
    if (selectedTab === "CLIENTE" && !leadId) {
      toast.error("Selecione um cliente");
      return;
    }

    if (selectedTab === "INTERNO" && !title) {
      toast.error("Digite um título para o chat");
      return;
    }

    if (selectedTab === "INTERNO" && participantIds.length === 0) {
      toast.error("Selecione pelo menos um participante");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: selectedTab,
          title: selectedTab === "INTERNO" ? title : undefined,
          leadId: selectedTab === "CLIENTE" ? leadId : undefined,
          participantIds: selectedTab === "INTERNO" ? participantIds : undefined,
        }),
      });

      if (response.ok) {
        const newChat = await response.json();
        toast.success(`Chat ${selectedTab === "CLIENTE" ? "com cliente" : "interno"} criado com sucesso`);
        setIsOpen(false);
        resetForm();
        router.push(`/chat/${selectedTab === "CLIENTE" ? "cliente" : "interno"}`);
        router.refresh();
      } else {
        const error = await response.json();
        toast.error(error.error || "Erro ao criar chat");
      }
    } catch (error) {
      console.error('Error creating chat:', error);
      toast.error("Erro ao criar chat");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setLeadId("");
    setParticipantIds([]);
    setSearchTerm("");
  };

  // Filter leads based on search term
  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.phone && lead.phone.includes(searchTerm))
  );

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1 dark:border-slate-700 dark:text-slate-300"
          onClick={() => {
            setSelectedTab(chatType);
            resetForm();
          }}
        >
          <PlusCircle className="h-4 w-4" />
          <span>Novo Chat</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Chat</DialogTitle>
          <DialogDescription>
            Crie uma nova conversa com clientes ou entre a equipe interna
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={selectedTab} onValueChange={(value) => setSelectedTab(value as "CLIENTE" | "INTERNO")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="CLIENTE" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              Chat com Cliente
            </TabsTrigger>
            <TabsTrigger value="INTERNO" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Chat Interno
            </TabsTrigger>
          </TabsList>

          <TabsContent value="CLIENTE" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client">Cliente</Label>
              <div className="relative">
                <Input
                  id="searchClient"
                  placeholder="Buscar cliente por nome, email ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="border rounded-md h-56 overflow-y-auto mt-2">
                {isLoadingLeads ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 text-slate-400 animate-spin" />
                  </div>
                ) : filteredLeads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                    <Search className="h-8 w-8 text-slate-300 mb-2" />
                    <p className="text-sm text-slate-500">Nenhum cliente encontrado</p>
                    <p className="text-xs text-slate-400 mt-1">Tente outro termo de busca</p>
                  </div>
                ) : (
                  <Command>
                    <CommandList>
                      <CommandGroup heading="Clientes">
                        {filteredLeads.map((lead) => (
                          <CommandItem
                            key={lead.id}
                            onSelect={() => setLeadId(lead.id)}
                            className={`flex items-center gap-2 cursor-pointer ${leadId === lead.id ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
                          >
                            <div className={`w-2 h-2 rounded-full ${leadId === lead.id ? 'bg-blue-500' : 'bg-transparent'}`} />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{lead.name}</p>
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-slate-500">{lead.email}</p>
                                {lead.phone && (
                                  <p className="text-xs text-slate-500">{lead.phone}</p>
                                )}
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="INTERNO" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Chat</Label>
              <Input
                id="title"
                placeholder="Ex: Equipe de Produção"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="participants">Participantes</Label>
              <div className="relative">
                <Input
                  id="searchUsers"
                  placeholder="Buscar usuários por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="border rounded-md h-56 overflow-y-auto mt-2">
                {isLoadingUsers ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 text-slate-400 animate-spin" />
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                    <Search className="h-8 w-8 text-slate-300 mb-2" />
                    <p className="text-sm text-slate-500">Nenhum usuário encontrado</p>
                    <p className="text-xs text-slate-400 mt-1">Tente outro termo de busca</p>
                  </div>
                ) : (
                  <Command>
                    <CommandList>
                      <CommandGroup heading="Participantes">
                        {filteredUsers.map((user) => (
                          <CommandItem
                            key={user.id}
                            onSelect={() => {
                              if (participantIds.includes(user.id)) {
                                setParticipantIds(participantIds.filter(id => id !== user.id));
                              } else {
                                setParticipantIds([...participantIds, user.id]);
                              }
                            }}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <div className={`w-4 h-4 border rounded flex items-center justify-center ${
                              participantIds.includes(user.id)
                                ? 'bg-blue-500 border-blue-500 text-white'
                                : 'border-slate-300 dark:border-slate-600'
                            }`}>
                              {participantIds.includes(user.id) && (
                                <Check className="h-3 w-3" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{user.name}</p>
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-slate-500">{user.email}</p>
                                <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                  {user.role}
                                </span>
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                )}
              </div>

              {/* Selected participants summary */}
              {participantIds.length > 0 && (
                <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-md">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {participantIds.length} participante(s) selecionado(s)
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {participantIds.map(id => {
                      const user = users.find(u => u.id === id);
                      return user ? (
                        <div
                          key={id}
                          className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full flex items-center gap-1"
                        >
                          {user.name}
                          <button
                            onClick={() => setParticipantIds(participantIds.filter(pid => pid !== id))}
                            className="h-3 w-3 rounded-full bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-300 flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreateChat} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Criar Chat
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
