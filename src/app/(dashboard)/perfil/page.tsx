"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Save,
  X,
  Building2,
  Briefcase,
  Clock,
  Shield,
  Award,
  TrendingUp
} from "lucide-react";
import { useState } from "react";

export default function PerfilPage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    nome: user?.email?.split('@')[0] || "Administrador",
    email: user?.email || "admin@example.com",
    telefone: "(11) 99999-9999",
    cargo: "Administrador",
    departamento: "Gestão",
    endereco: "São Paulo, SP",
    bio: "Administrador responsável pela gestão geral do sistema CRM de móveis planejados.",
    dataAdmissao: "Janeiro 2024",
    empresa: "Móveis Planejados Corp"
  });

  const handleSave = () => {
    setIsEditing(false);
    // Aqui implementaria a lógica para salvar os dados
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Resetar dados se necessário
  };

  const estadisticas = [
    { label: "Projetos Concluídos", valor: "127", icone: Award, cor: "text-green-600 dark:text-green-400" },
    { label: "Vendas Fechadas", valor: "89", icone: TrendingUp, cor: "text-blue-600 dark:text-blue-400" },
    { label: "Clientes Ativos", valor: "245", icone: User, cor: "text-purple-600 dark:text-purple-400" },
    { label: "Tempo de Empresa", valor: "1 ano", icone: Clock, cor: "text-amber-600 dark:text-amber-400" }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header da página */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Meu Perfil</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Gerencie suas informações pessoais e configurações de conta
          </p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
          className="gap-2"
        >
          {isEditing ? (
            <>
              <X className="h-4 w-4" />
              Cancelar
            </>
          ) : (
            <>
              <Edit3 className="h-4 w-4" />
              Editar Perfil
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">Informações Pessoais</TabsTrigger>
          <TabsTrigger value="stats">Estatísticas</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          {/* Card do perfil principal */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-4 border-white dark:border-slate-800 shadow-lg">
                  <AvatarFallback className="bg-blue-500 text-white text-2xl">
                    {profileData.nome.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {profileData.nome}
                    </h2>
                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                      <Shield className="h-3 w-3 mr-1" />
                      {profileData.cargo}
                    </Badge>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">{profileData.email}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      {profileData.empresa}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Desde {profileData.dataAdmissao}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Informações detalhadas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={profileData.nome}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData(prev => ({ ...prev, nome: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={profileData.telefone}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData(prev => ({ ...prev, telefone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endereco">Localização</Label>
                  <Input
                    id="endereco"
                    value={profileData.endereco}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData(prev => ({ ...prev, endereco: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Informações Profissionais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input
                    id="cargo"
                    value={profileData.cargo}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData(prev => ({ ...prev, cargo: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departamento">Departamento</Label>
                  <Input
                    id="departamento"
                    value={profileData.departamento}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData(prev => ({ ...prev, departamento: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="empresa">Empresa</Label>
                  <Input
                    id="empresa"
                    value={profileData.empresa}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData(prev => ({ ...prev, empresa: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Biografia</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {isEditing && (
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas de Performance</CardTitle>
              <CardDescription>
                Resumo do seu desempenho e atividade na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {estadisticas.map((stat, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-800 ${stat.cor}`}>
                        <stat.icone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {stat.valor}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configurações de Segurança
              </CardTitle>
              <CardDescription>
                Gerencie sua senha e configurações de segurança
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Senha</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    Última alteração: há 30 dias
                  </p>
                  <Button variant="outline">
                    Alterar Senha
                  </Button>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Autenticação em Duas Etapas</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    Adicione uma camada extra de segurança à sua conta
                  </p>
                  <Button variant="outline">
                    Configurar 2FA
                  </Button>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Sessões Ativas</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    Visualize e gerencie suas sessões ativas
                  </p>
                  <Button variant="outline">
                    Ver Sessões
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
