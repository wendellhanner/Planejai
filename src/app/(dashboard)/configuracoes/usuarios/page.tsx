"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Users,
  UserPlus,
  UserCog,
  Shield,
  Key,
  Lock,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
  RefreshCw,
  Save,
  Loader2,
  User,
  FileText,
  Settings,
  EyeOff
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Tipo para usuário
type UserRole = "ADMIN" | "VENDEDOR" | "DESIGNER" | "PRODUCAO" | "MONTAGEM" | "FINANCEIRO";
type UserStatus = "active" | "inactive" | "pending";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
  perfil: UserRole;
  status: UserStatus;
  ultimoLogin: string;
  dataCriacao: string;
  avatar?: string;
}

// Tipo para perfil de permissões
interface Perfil {
  id: string;
  nome: string;
  descricao: string;
  permissoes: Permissao[];
  usuarios: number;
}

// Tipo para permissão
interface Permissao {
  id: string;
  modulo: string;
  nome: string;
  descricao: string;
  ativo: boolean;
}

// Mockup de dados de usuários
const usuariosMock: Usuario[] = [
  {
    id: "1",
    nome: "Carlos Mendes",
    email: "carlos.mendes@empresa.com",
    cargo: "Gerente de Vendas",
    departamento: "Comercial",
    perfil: "ADMIN",
    status: "active",
    ultimoLogin: "2025-05-22 14:20",
    dataCriacao: "2024-12-01",
    avatar: ""
  },
  {
    id: "2",
    nome: "Ana Costa",
    email: "ana.costa@empresa.com",
    cargo: "Vendedora Senior",
    departamento: "Comercial",
    perfil: "VENDEDOR",
    status: "active",
    ultimoLogin: "2025-05-23 08:45",
    dataCriacao: "2025-01-15",
    avatar: ""
  },
  {
    id: "3",
    nome: "Roberto Alves",
    email: "roberto.alves@empresa.com",
    cargo: "Vendedor",
    departamento: "Comercial",
    perfil: "VENDEDOR",
    status: "active",
    ultimoLogin: "2025-05-22 17:30",
    dataCriacao: "2025-02-10",
    avatar: ""
  },
  {
    id: "4",
    nome: "Juliana Mendes",
    email: "juliana.mendes@empresa.com",
    cargo: "Gerente de Produção",
    departamento: "Produção",
    perfil: "PRODUCAO",
    status: "active",
    ultimoLogin: "2025-05-22 16:15",
    dataCriacao: "2025-01-05",
    avatar: ""
  },
  {
    id: "5",
    nome: "Marina Costa",
    email: "marina.costa@empresa.com",
    cargo: "Designer Sênior",
    departamento: "Design",
    perfil: "DESIGNER",
    status: "active",
    ultimoLogin: "2025-05-23 09:10",
    dataCriacao: "2025-02-20",
    avatar: ""
  },
  {
    id: "6",
    nome: "Lucas Silva",
    email: "lucas.silva@empresa.com",
    cargo: "Coordenador de Montagem",
    departamento: "Operações",
    perfil: "MONTAGEM",
    status: "active",
    ultimoLogin: "2025-05-22 15:40",
    dataCriacao: "2025-03-05",
    avatar: ""
  },
  {
    id: "7",
    nome: "Fernanda Lima",
    email: "fernanda.lima@empresa.com",
    cargo: "Analista Financeiro",
    departamento: "Financeiro",
    perfil: "FINANCEIRO",
    status: "active",
    ultimoLogin: "2025-05-22 17:20",
    dataCriacao: "2025-01-20",
    avatar: ""
  },
  {
    id: "8",
    nome: "Pedro Oliveira",
    email: "pedro.oliveira@empresa.com",
    cargo: "Projetista",
    departamento: "Design",
    perfil: "DESIGNER",
    status: "inactive",
    ultimoLogin: "2025-05-15 10:20",
    dataCriacao: "2025-02-15",
    avatar: ""
  },
  {
    id: "9",
    nome: "Camila Santos",
    email: "camila.santos@empresa.com",
    cargo: "Vendedora Junior",
    departamento: "Comercial",
    perfil: "VENDEDOR",
    status: "pending",
    ultimoLogin: "Nunca",
    dataCriacao: "2025-05-20",
    avatar: ""
  }
];

// Mockup de perfis de acesso
const perfisMock: Perfil[] = [
  {
    id: "1",
    nome: "Administrador",
    descricao: "Acesso completo a todas as funcionalidades do sistema",
    permissoes: [],
    usuarios: 1
  },
  {
    id: "2",
    nome: "Vendedor",
    descricao: "Acesso a módulos de vendas, propostas e clientes",
    permissoes: [],
    usuarios: 3
  },
  {
    id: "3",
    nome: "Designer",
    descricao: "Acesso a módulos de projetos e design",
    permissoes: [],
    usuarios: 2
  },
  {
    id: "4",
    nome: "Produção",
    descricao: "Acesso a módulos de produção e materiais",
    permissoes: [],
    usuarios: 1
  },
  {
    id: "5",
    nome: "Montagem",
    descricao: "Acesso a módulos de cronograma de montagem",
    permissoes: [],
    usuarios: 1
  },
  {
    id: "6",
    nome: "Financeiro",
    descricao: "Acesso a módulos financeiros e faturamento",
    permissoes: [],
    usuarios: 1
  }
];

// Mockup de permissões
const permissoesMock: Permissao[] = [
  { id: "1", modulo: "dashboard", nome: "Ver Dashboard", descricao: "Visualizar dashboard principal", ativo: true },
  { id: "2", modulo: "dashboard", nome: "Editar Dashboard", descricao: "Personalizar componentes do dashboard", ativo: false },
  { id: "3", modulo: "leads", nome: "Ver Leads", descricao: "Visualizar lista de leads", ativo: true },
  { id: "4", modulo: "leads", nome: "Adicionar Leads", descricao: "Cadastrar novos leads no sistema", ativo: true },
  { id: "5", modulo: "leads", nome: "Editar Leads", descricao: "Editar informações de leads", ativo: true },
  { id: "6", modulo: "leads", nome: "Excluir Leads", descricao: "Remover leads do sistema", ativo: false },
  { id: "7", modulo: "vendas", nome: "Ver Vendas", descricao: "Visualizar vendas realizadas", ativo: true },
  { id: "8", modulo: "vendas", nome: "Adicionar Vendas", descricao: "Registrar novas vendas", ativo: true },
  { id: "9", modulo: "vendas", nome: "Editar Vendas", descricao: "Modificar vendas existentes", ativo: true },
  { id: "10", modulo: "vendas", nome: "Cancelar Vendas", descricao: "Cancelar vendas registradas", ativo: false },
  { id: "11", modulo: "producao", nome: "Ver Produção", descricao: "Visualizar itens em produção", ativo: true },
  { id: "12", modulo: "producao", nome: "Gerenciar Produção", descricao: "Gerenciar fluxo de produção", ativo: true },
  { id: "13", modulo: "configuracoes", nome: "Ver Configurações", descricao: "Visualizar configurações do sistema", ativo: true },
  { id: "14", modulo: "configuracoes", nome: "Editar Configurações", descricao: "Modificar configurações do sistema", ativo: false },
  { id: "15", modulo: "usuarios", nome: "Ver Usuários", descricao: "Visualizar usuários cadastrados", ativo: true },
  { id: "16", modulo: "usuarios", nome: "Adicionar Usuários", descricao: "Cadastrar novos usuários", ativo: false },
  { id: "17", modulo: "usuarios", nome: "Editar Usuários", descricao: "Modificar usuários existentes", ativo: false },
  { id: "18", modulo: "usuarios", nome: "Excluir Usuários", descricao: "Remover usuários do sistema", ativo: false },
  { id: "19", modulo: "relatorios", nome: "Ver Relatórios", descricao: "Visualizar relatórios do sistema", ativo: true },
  { id: "20", modulo: "relatorios", nome: "Exportar Relatórios", descricao: "Exportar relatórios para Excel/PDF", ativo: true }
];

export default function UsuariosConfigPage() {
  const [activeTab, setActiveTab] = useState("usuarios");
  const [isLoading, setIsLoading] = useState(true);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [perfis, setPerfis] = useState<Perfil[]>([]);
  const [permissoes, setPermissoes] = useState<Permissao[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<Usuario[]>([]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddPerfilOpen, setIsAddPerfilOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isLoggingOperation, setIsLoggingOperation] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [selectedPerfil, setSelectedPerfil] = useState<Perfil | null>(null);

  // Form state para novo usuário
  const [newUser, setNewUser] = useState({
    nome: "",
    email: "",
    cargo: "",
    departamento: "",
    perfil: "VENDEDOR",
    status: "active",
  });

  // Form state para novo perfil
  const [newPerfil, setNewPerfil] = useState({
    nome: "",
    descricao: ""
  });

  // Carregar dados
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Simular chamada de API
      setTimeout(() => {
        setUsuarios(usuariosMock);
        setFilteredUsers(usuariosMock);
        setPerfis(perfisMock);
        setPermissoes(permissoesMock);
        setIsLoading(false);
      }, 800);
    };

    loadData();
  }, []);

  // Filtrar usuários
  useEffect(() => {
    if (searchTerm) {
      const filtered = usuarios.filter(
        user =>
          user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.departamento.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(usuarios);
    }
  }, [searchTerm, usuarios]);

  // Lidar com adição de novo usuário
  const handleAddUser = () => {
    setIsLoggingOperation(true);

    // Simular chamada de API para criar usuário
    setTimeout(() => {
      // Criar novo usuário com ID único
      const newUserWithId: Usuario = {
        id: String(usuarios.length + 1),
        nome: newUser.nome,
        email: newUser.email,
        cargo: newUser.cargo,
        departamento: newUser.departamento,
        perfil: newUser.perfil as UserRole,
        status: newUser.status as UserStatus,
        ultimoLogin: "Nunca",
        dataCriacao: new Date().toISOString().split('T')[0],
        avatar: ""
      };

      // Adicionar à lista de usuários
      setUsuarios([...usuarios, newUserWithId]);
      setFilteredUsers([...usuarios, newUserWithId]);

      // Resetar form e fechar dialog
      setNewUser({
        nome: "",
        email: "",
        cargo: "",
        departamento: "",
        perfil: "VENDEDOR",
        status: "active",
      });

      setIsAddUserOpen(false);
      setIsLoggingOperation(false);
      toast.success("Usuário adicionado com sucesso!");
    }, 1000);
  };

  // Lidar com edição de usuário
  const handleEditUser = () => {
    if (!selectedUser) return;

    setIsLoggingOperation(true);

    // Simular chamada de API para atualizar usuário
    setTimeout(() => {
      // Atualizar usuário na lista
      const updatedUsers = usuarios.map(user =>
        user.id === selectedUser.id ? selectedUser : user
      );

      setUsuarios(updatedUsers);
      setFilteredUsers(updatedUsers);

      setIsEditUserOpen(false);
      setIsLoggingOperation(false);
      toast.success("Usuário atualizado com sucesso!");
    }, 1000);
  };

  // Lidar com alteração de status do usuário
  const handleToggleUserStatus = (userId: string, newStatus: UserStatus) => {
    const updatedUsers = usuarios.map(user =>
      user.id === userId ? { ...user, status: newStatus } : user
    );

    setUsuarios(updatedUsers);
    setFilteredUsers(updatedUsers);

    toast.success(`Status do usuário alterado para ${newStatus === 'active' ? 'Ativo' : newStatus === 'inactive' ? 'Inativo' : 'Pendente'}`);
  };

  // Lidar com remoção de usuário
  const handleDeleteUser = (userId: string) => {
    // Confirmar antes de remover
    if (!window.confirm("Tem certeza que deseja remover este usuário?")) return;

    const updatedUsers = usuarios.filter(user => user.id !== userId);
    setUsuarios(updatedUsers);
    setFilteredUsers(updatedUsers);

    toast.success("Usuário removido com sucesso!");
  };

  // Adicionar novo perfil
  const handleAddPerfil = () => {
    setIsLoggingOperation(true);

    // Simular chamada de API para criar perfil
    setTimeout(() => {
      // Criar novo perfil com ID único
      const newPerfilWithId: Perfil = {
        id: String(perfis.length + 1),
        nome: newPerfil.nome,
        descricao: newPerfil.descricao,
        permissoes: [],
        usuarios: 0
      };

      // Adicionar à lista de perfis
      setPerfis([...perfis, newPerfilWithId]);

      // Resetar form e fechar dialog
      setNewPerfil({
        nome: "",
        descricao: ""
      });

      setIsAddPerfilOpen(false);
      setIsLoggingOperation(false);
      toast.success("Perfil adicionado com sucesso!");
    }, 1000);
  };

  // Renderizar badge de status
  const renderStatusBadge = (status: UserStatus) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
            Ativo
          </Badge>
        );
      case 'inactive':
        return (
          <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800">
            Inativo
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
            Pendente
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  // Renderizar avatar do usuário
  const renderUserAvatar = (user: Usuario) => {
    return (
      <Avatar className="h-8 w-8">
        {user.avatar ? (
          <AvatarImage src={user.avatar} alt={user.nome} />
        ) : (
          <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            {user.nome.split(' ').map(n => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        )}
      </Avatar>
    );
  };

  // Renderizar badge de perfil
  const renderRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300">
            Administrador
          </Badge>
        );
      case 'VENDEDOR':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300">
            Vendedor
          </Badge>
        );
      case 'DESIGNER':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300">
            Designer
          </Badge>
        );
      case 'PRODUCAO':
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-300">
            Produção
          </Badge>
        );
      case 'MONTAGEM':
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-300">
            Montagem
          </Badge>
        );
      case 'FINANCEIRO':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300">
            Financeiro
          </Badge>
        );
      default:
        return (
          <Badge>
            {role}
          </Badge>
        );
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gerenciamento de Usuários</h1>
        <p className="text-slate-500">
          Configure usuários, perfis e permissões de acesso ao sistema
        </p>
      </div>

      <Tabs defaultValue="usuarios" value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="usuarios" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Usuários</span>
          </TabsTrigger>
          <TabsTrigger value="perfis" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Perfis e Permissões</span>
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Segurança e Acesso</span>
          </TabsTrigger>
        </TabsList>

        {/* Aba de Usuários */}
        <TabsContent value="usuarios" className="mt-6 space-y-4">
          <Card>
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Gerenciar Usuários
                </CardTitle>
                <CardDescription className="mt-1">
                  Adicione, edite e gerencie o acesso dos usuários ao sistema
                </CardDescription>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Buscar usuários..."
                    className="pl-9 w-full sm:w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <Button
                  onClick={() => setIsAddUserOpen(true)}
                  className="gap-1"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Novo Usuário</span>
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
                  <p className="text-slate-500">Carregando usuários...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Users className="h-10 w-10 text-slate-300 mb-4" />
                  <p className="text-slate-500">Nenhum usuário encontrado</p>
                  <p className="text-slate-400 text-sm mt-1">Tente ajustar sua busca ou adicione novos usuários</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead style={{ width: '25%' }}>Nome / Email</TableHead>
                        <TableHead style={{ width: '20%' }}>Cargo / Departamento</TableHead>
                        <TableHead style={{ width: '15%' }}>Perfil</TableHead>
                        <TableHead style={{ width: '15%' }}>Status</TableHead>
                        <TableHead style={{ width: '15%' }}>Último Acesso</TableHead>
                        <TableHead style={{ width: '10%' }}>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {renderUserAvatar(user)}
                              <div>
                                <div className="font-medium">{user.nome}</div>
                                <div className="text-xs text-slate-500">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{user.cargo}</div>
                            <div className="text-xs text-slate-500">{user.departamento}</div>
                          </TableCell>
                          <TableCell>
                            {renderRoleBadge(user.perfil)}
                          </TableCell>
                          <TableCell>
                            {renderStatusBadge(user.status)}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{user.ultimoLogin !== "Nunca" ? user.ultimoLogin : "—"}</div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setIsEditUserOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {user.status === 'active' ? (
                                  <DropdownMenuItem onClick={() => handleToggleUserStatus(user.id, 'inactive')}>
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Desativar
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => handleToggleUserStatus(user.id, 'active')}>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Ativar
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDeleteUser(user.id)}>
                                  <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                                  <span className="text-red-500">Excluir</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resumo de Usuários */}
          {!isLoading && filteredUsers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <UserPlus className="h-4 w-4 text-blue-500" />
                    Resumo de Usuários
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="text-sm">Total de usuários:</div>
                      <div className="font-semibold">{usuarios.length}</div>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <div className="text-sm">Usuários ativos:</div>
                      <div className="font-semibold text-green-600">
                        {usuarios.filter(user => user.status === 'active').length}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm">Usuários inativos:</div>
                      <div className="font-semibold text-slate-500">
                        {usuarios.filter(user => user.status === 'inactive').length}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm">Usuários pendentes:</div>
                      <div className="font-semibold text-amber-600">
                        {usuarios.filter(user => user.status === 'pending').length}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-500" />
                    Distribuição por Perfil
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {perfis.map((perfil) => (
                      <div key={perfil.id} className="flex justify-between items-center">
                        <div className="text-sm">{perfil.nome}:</div>
                        <div className="font-semibold">
                          {usuarios.filter(user => user.perfil.toLowerCase() === perfil.nome.toUpperCase()).length}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <UserCog className="h-4 w-4 text-blue-500" />
                    Atividade Recente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="text-sm">Novos usuários (30 dias):</div>
                      <div className="font-semibold text-blue-600">2</div>
                    </div>
                    <Separator />
                    <div className="text-sm">Últimos acessos:</div>
                    <div className="space-y-2 mt-1">
                      {usuarios
                        .filter(user => user.ultimoLogin !== "Nunca")
                        .sort((a, b) => new Date(b.ultimoLogin).getTime() - new Date(a.ultimoLogin).getTime())
                        .slice(0, 3)
                        .map((user) => (
                          <div key={user.id} className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2">
                              {renderUserAvatar(user)}
                              <span>{user.nome}</span>
                            </div>
                            <div className="text-slate-500">{user.ultimoLogin}</div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Aba de Perfis e Permissões */}
        <TabsContent value="perfis" className="mt-6 space-y-4">
          <Card>
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Perfis e Permissões
                </CardTitle>
                <CardDescription className="mt-1">
                  Configure os perfis de acesso e defina permissões para cada grupo
                </CardDescription>
              </div>

              <Button
                onClick={() => setIsAddPerfilOpen(true)}
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                <span>Novo Perfil</span>
              </Button>
            </CardHeader>

            <CardContent>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
                  <p className="text-slate-500">Carregando perfis...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {perfis.map((perfil) => (
                    <Card key={perfil.id} className="border-2 border-slate-200 dark:border-slate-800">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{perfil.nome}</CardTitle>
                          <Badge variant="outline">{perfil.usuarios} usuários</Badge>
                        </div>
                        <CardDescription>{perfil.descricao}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="text-xs text-slate-500 mb-2">Permissões do perfil:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {["Visualizar", "Adicionar", "Editar"].map((perm) => (
                            <Badge key={perm} variant="outline" className="text-xs border-green-200 text-green-700 dark:border-green-800 dark:text-green-400">
                              {perm}
                            </Badge>
                          ))}
                          <Badge variant="outline" className="text-xs border-red-200 text-red-700 dark:border-red-800 dark:text-red-400">
                            Excluir
                          </Badge>
                        </div>
                      </CardContent>
                      <CardFooter className="justify-end pt-2">
                        <Button variant="outline" size="sm" className="h-7 gap-1">
                          <Edit className="h-3 w-3" />
                          <span className="text-xs">Configurar</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Permissões Detalhadas */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                Detalhamento de Permissões por Módulo
              </CardTitle>
              <CardDescription>
                Defina permissões específicas para cada perfil de usuário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="vendas">
                <TabsList className="grid grid-cols-5 mb-4">
                  <TabsTrigger value="vendas">Vendas</TabsTrigger>
                  <TabsTrigger value="projetos">Projetos</TabsTrigger>
                  <TabsTrigger value="producao">Produção</TabsTrigger>
                  <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
                  <TabsTrigger value="sistema">Sistema</TabsTrigger>
                </TabsList>

                <TabsContent value="vendas">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead style={{ width: '40%' }}>Permissão</TableHead>
                          <TableHead style={{ width: '15%' }}>Administrador</TableHead>
                          <TableHead style={{ width: '15%' }}>Vendedor</TableHead>
                          <TableHead style={{ width: '15%' }}>Gerente</TableHead>
                          <TableHead style={{ width: '15%' }}>Financeiro</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { id: "1", nome: "Ver listagem de vendas", descricao: "Visualizar todas as vendas realizadas" },
                          { id: "2", nome: "Registrar nova venda", descricao: "Cadastrar uma nova venda no sistema" },
                          { id: "3", nome: "Editar venda existente", descricao: "Modificar dados de uma venda já cadastrada" },
                          { id: "4", nome: "Cancelar venda", descricao: "Cancelar uma venda realizada" },
                          { id: "5", nome: "Aplicar desconto", descricao: "Aplicar desconto em uma venda" },
                          { id: "6", nome: "Relatórios de vendas", descricao: "Visualizar relatórios de desempenho de vendas" },
                        ].map((permissao) => (
                          <TableRow key={permissao.id}>
                            <TableCell>
                              <div className="font-medium">{permissao.nome}</div>
                              <div className="text-xs text-slate-500">{permissao.descricao}</div>
                            </TableCell>
                            <TableCell className="text-center">
                              <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                            </TableCell>
                            <TableCell className="text-center">
                              {['1', '2', '6'].includes(permissao.id) ? (
                                <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-300 mx-auto" />
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {['1', '2', '3', '5', '6'].includes(permissao.id) ? (
                                <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-300 mx-auto" />
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {['1', '6'].includes(permissao.id) ? (
                                <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-300 mx-auto" />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="projetos">
                  <div className="flex flex-col items-center justify-center py-8">
                    <FileText className="h-10 w-10 text-slate-300 mb-4" />
                    <p className="text-slate-500">Selecione um perfil para configurar as permissões de Projetos</p>
                  </div>
                </TabsContent>

                <TabsContent value="producao">
                  <div className="flex flex-col items-center justify-center py-8">
                    <FileText className="h-10 w-10 text-slate-300 mb-4" />
                    <p className="text-slate-500">Selecione um perfil para configurar as permissões de Produção</p>
                  </div>
                </TabsContent>

                <TabsContent value="financeiro">
                  <div className="flex flex-col items-center justify-center py-8">
                    <FileText className="h-10 w-10 text-slate-300 mb-4" />
                    <p className="text-slate-500">Selecione um perfil para configurar as permissões de Financeiro</p>
                  </div>
                </TabsContent>

                <TabsContent value="sistema">
                  <div className="flex flex-col items-center justify-center py-8">
                    <Settings className="h-10 w-10 text-slate-300 mb-4" />
                    <p className="text-slate-500">Selecione um perfil para configurar as permissões de Sistema</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Segurança */}
        <TabsContent value="seguranca" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Lock className="h-5 w-5 text-red-600" />
                Políticas de Segurança
              </CardTitle>
              <CardDescription className="mt-1">
                Configure as políticas de segurança, senhas e acesso ao sistema
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Política de Senhas</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between space-x-2">
                      <div>
                        <Label htmlFor="password_expiration" className="block">Expiração de senha</Label>
                        <p className="text-xs text-slate-500 mt-1">Força o usuário a trocar a senha periodicamente</p>
                      </div>
                      <Switch id="password_expiration" defaultChecked />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password_days">Validade da senha (dias)</Label>
                      <Input id="password_days" type="number" defaultValue="90" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password_min_length">Tamanho mínimo da senha</Label>
                      <Input id="password_min_length" type="number" defaultValue="8" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password_complexity">Complexidade da senha</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger id="password_complexity">
                          <SelectValue placeholder="Selecione a complexidade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baixa (apenas letras)</SelectItem>
                          <SelectItem value="medium">Média (letras e números)</SelectItem>
                          <SelectItem value="high">Alta (letras, números e símbolos)</SelectItem>
                          <SelectItem value="very_high">Muito Alta (letras maiúsculas/minúsculas, números e símbolos)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between space-x-2">
                      <div>
                        <Label htmlFor="password_history" className="block">Histórico de senhas</Label>
                        <p className="text-xs text-slate-500 mt-1">Impede o uso de senhas anteriores</p>
                      </div>
                      <Switch id="password_history" defaultChecked />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password_history_count">Quantidade de senhas no histórico</Label>
                      <Input id="password_history_count" type="number" defaultValue="5" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Controle de Acesso</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between space-x-2">
                      <div>
                        <Label htmlFor="lock_attempts" className="block">Bloqueio por tentativas</Label>
                        <p className="text-xs text-slate-500 mt-1">Bloqueia o acesso após várias tentativas incorretas</p>
                      </div>
                      <Switch id="lock_attempts" defaultChecked />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max_attempts">Número máximo de tentativas</Label>
                      <Input id="max_attempts" type="number" defaultValue="5" />
                    </div>

                    <div className="flex items-center justify-between space-x-2">
                      <div>
                        <Label htmlFor="two_factor" className="block">Autenticação de dois fatores</Label>
                        <p className="text-xs text-slate-500 mt-1">Requer confirmação adicional no login</p>
                      </div>
                      <Switch id="two_factor" />
                    </div>

                    <div className="flex items-center justify-between space-x-2">
                      <div>
                        <Label htmlFor="inactive_logout" className="block">Logout por inatividade</Label>
                        <p className="text-xs text-slate-500 mt-1">Encerra a sessão após período sem atividade</p>
                      </div>
                      <Switch id="inactive_logout" defaultChecked />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="inactive_time">Tempo de inatividade (minutos)</Label>
                      <Input id="inactive_time" type="number" defaultValue="30" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="session_duration">Duração máxima da sessão (horas)</Label>
                      <Input id="session_duration" type="number" defaultValue="8" />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Registro de Atividades</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="log_login" className="block">Registrar entradas e saídas</Label>
                      <p className="text-xs text-slate-500 mt-1">Guarda histórico de logins no sistema</p>
                    </div>
                    <Switch id="log_login" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="log_actions" className="block">Registrar ações críticas</Label>
                      <p className="text-xs text-slate-500 mt-1">Guarda histórico de operações importantes</p>
                    </div>
                    <Switch id="log_actions" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="log_data_access" className="block">Registrar acesso a dados</Label>
                      <p className="text-xs text-slate-500 mt-1">Guarda histórico de visualização de informações</p>
                    </div>
                    <Switch id="log_data_access" />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="log_failed_attempts" className="block">Registrar tentativas falhas</Label>
                      <p className="text-xs text-slate-500 mt-1">Guarda histórico de tentativas incorretas de login</p>
                    </div>
                    <Switch id="log_failed_attempts" defaultChecked />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="log_retention">Período de retenção dos logs (dias)</Label>
                  <Input id="log_retention" type="number" defaultValue="180" />
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800">
                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300 flex items-center gap-2">
                  <EyeOff className="h-4 w-4" />
                  Exportação de Logs de Segurança
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  Os logs de segurança podem ser exportados para análise por meio de relatórios específicos, acessíveis aos administradores do sistema.
                </p>
                <div className="mt-3">
                  <Button variant="outline" size="sm" className="bg-white dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60">
                    Exportar Logs de Segurança
                  </Button>
                </div>
              </div>

              <div className="flex justify-center mt-4">
                <Button className="px-6 gap-2">
                  <Save className="h-4 w-4" />
                  Salvar Configurações de Segurança
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal para adicionar usuário */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Usuário</DialogTitle>
            <DialogDescription>
              Preencha os dados para criar um novo usuário no sistema
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  value={newUser.nome}
                  onChange={(e) => setNewUser({...newUser, nome: e.target.value})}
                  placeholder="Nome do usuário"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="email@exemplo.com.br"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cargo">Cargo</Label>
                <Input
                  id="cargo"
                  value={newUser.cargo}
                  onChange={(e) => setNewUser({...newUser, cargo: e.target.value})}
                  placeholder="Ex: Vendedor, Gerente, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="departamento">Departamento</Label>
                <Input
                  id="departamento"
                  value={newUser.departamento}
                  onChange={(e) => setNewUser({...newUser, departamento: e.target.value})}
                  placeholder="Ex: Comercial, Produção, etc."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="perfil">Perfil</Label>
                <Select
                  value={newUser.perfil}
                  onValueChange={(value) => setNewUser({...newUser, perfil: value as UserRole})}
                >
                  <SelectTrigger id="perfil">
                    <SelectValue placeholder="Selecione o perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                    <SelectItem value="VENDEDOR">Vendedor</SelectItem>
                    <SelectItem value="DESIGNER">Designer</SelectItem>
                    <SelectItem value="PRODUCAO">Produção</SelectItem>
                    <SelectItem value="MONTAGEM">Montagem</SelectItem>
                    <SelectItem value="FINANCEIRO">Financeiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newUser.status}
                  onValueChange={(value) => setNewUser({...newUser, status: value as UserStatus})}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
              <Mail className="h-4 w-4 mt-0.5" />
              <div>
                <p>Uma senha temporária será gerada e enviada por email ao novo usuário.</p>
                <p>Eles serão solicitados a criar uma nova senha no primeiro acesso.</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              onClick={handleAddUser}
              disabled={!newUser.nome || !newUser.email || !newUser.cargo || !newUser.departamento || isLoggingOperation}
            >
              {isLoggingOperation ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adicionando...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Adicionar Usuário
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para adicionar perfil */}
      <Dialog open={isAddPerfilOpen} onOpenChange={setIsAddPerfilOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Perfil</DialogTitle>
            <DialogDescription>
              Crie um novo perfil de acesso ao sistema
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="perfil_nome">Nome do Perfil</Label>
              <Input
                id="perfil_nome"
                value={newPerfil.nome}
                onChange={(e) => setNewPerfil({...newPerfil, nome: e.target.value})}
                placeholder="Ex: Gerente de Produção"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="perfil_descricao">Descrição</Label>
              <Textarea
                id="perfil_descricao"
                value={newPerfil.descricao}
                onChange={(e) => setNewPerfil({...newPerfil, descricao: e.target.value})}
                placeholder="Descreva as responsabilidades deste perfil"
                rows={3}
              />
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md border border-slate-200 dark:border-slate-700">
              <h4 className="text-sm font-medium mb-2">Módulos com permissão:</h4>
              <div className="grid grid-cols-2 gap-2">
                {["Dashboard", "Leads", "Vendas", "Projetos", "Produção", "Entregas", "Relatórios", "Configurações"].map((modulo) => (
                  <div key={modulo} className="flex items-center space-x-2">
                    <Checkbox id={`modulo-${modulo.toLowerCase()}`} />
                    <Label htmlFor={`modulo-${modulo.toLowerCase()}`} className="text-sm font-normal">
                      {modulo}
                    </Label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Você poderá configurar permissões detalhadas depois de criar o perfil.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              onClick={handleAddPerfil}
              disabled={!newPerfil.nome || isLoggingOperation}
            >
              {isLoggingOperation ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adicionando...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Criar Perfil
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para editar usuário */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Modifique os dados do usuário
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_nome">Nome Completo</Label>
                  <Input
                    id="edit_nome"
                    value={selectedUser.nome}
                    onChange={(e) => setSelectedUser({...selectedUser, nome: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_email">Email</Label>
                  <Input
                    id="edit_email"
                    type="email"
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_cargo">Cargo</Label>
                  <Input
                    id="edit_cargo"
                    value={selectedUser.cargo}
                    onChange={(e) => setSelectedUser({...selectedUser, cargo: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_departamento">Departamento</Label>
                  <Input
                    id="edit_departamento"
                    value={selectedUser.departamento}
                    onChange={(e) => setSelectedUser({...selectedUser, departamento: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_perfil">Perfil</Label>
                  <Select
                    value={selectedUser.perfil}
                    onValueChange={(value) => setSelectedUser({...selectedUser, perfil: value as UserRole})}
                  >
                    <SelectTrigger id="edit_perfil">
                      <SelectValue placeholder="Selecione o perfil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Administrador</SelectItem>
                      <SelectItem value="VENDEDOR">Vendedor</SelectItem>
                      <SelectItem value="DESIGNER">Designer</SelectItem>
                      <SelectItem value="PRODUCAO">Produção</SelectItem>
                      <SelectItem value="MONTAGEM">Montagem</SelectItem>
                      <SelectItem value="FINANCEIRO">Financeiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_status">Status</Label>
                  <Select
                    value={selectedUser.status}
                    onValueChange={(value) => setSelectedUser({...selectedUser, status: value as UserStatus})}
                  >
                    <SelectTrigger id="edit_status">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-amber-600 border-amber-200 hover:bg-amber-50 dark:text-amber-400 dark:border-amber-800 dark:hover:bg-amber-900/20 gap-1.5"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Resetar Senha</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Enviar Email</span>
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="submit"
              onClick={handleEditUser}
              disabled={!selectedUser || isLoggingOperation}
            >
              {isLoggingOperation ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
