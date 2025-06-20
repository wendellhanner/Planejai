"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  MessageSquare,
  Settings,
  Zap,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  Download,
  Upload,
  Play,
  Pause,
  MessageCircle,
  Clock,
  Users,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";

// Tipos para configuração
interface WhatsAppConfig {
  phoneNumberId: string;
  accessToken: string;
  webhookUrl: string;
  webhookToken: string;
  businessAccountId: string;
  appId: string;
  isActive: boolean;
}

interface MessageTemplate {
  id: string;
  name: string;
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  language: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  content: string;
}

interface AutoReply {
  id: string;
  trigger: string;
  response: string;
  isActive: boolean;
  conditions: string[];
}

export default function WhatsAppConfigPage() {
  const [activeTab, setActiveTab] = useState("config");
  const [isConnected, setIsConnected] = useState(false);
  const [config, setConfig] = useState<WhatsAppConfig>({
    phoneNumberId: "",
    accessToken: "",
    webhookUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/api/whatsapp/webhook`,
    webhookToken: "",
    businessAccountId: "",
    appId: "",
    isActive: false
  });

  const [templates] = useState<MessageTemplate[]>([
    {
      id: "1",
      name: "welcome_message",
      category: "UTILITY",
      language: "pt_BR",
      status: "APPROVED",
      content: "Olá {{1}}! Obrigado por entrar em contato com nossa empresa de móveis planejados. Como podemos ajudá-lo hoje?"
    },
    {
      id: "2",
      name: "orcamento_pronto",
      category: "UTILITY",
      language: "pt_BR",
      status: "APPROVED",
      content: "Olá {{1}}! Seu orçamento para {{2}} está pronto. O valor é de {{3}}. Gostaria de agendar uma reunião para apresentação?"
    },
    {
      id: "3",
      name: "lembrete_medicao",
      category: "UTILITY",
      language: "pt_BR",
      status: "PENDING",
      content: "Olá {{1}}! Lembrete: sua medição está agendada para {{2}} às {{3}}. Confirme sua presença."
    }
  ]);

  const [autoReplies, setAutoReplies] = useState<AutoReply[]>([
    {
      id: "1",
      trigger: "horário|funcionamento|horarios",
      response: "Nosso horário de funcionamento é:\n🕘 Segunda a Sexta: 8h às 18h\n🕘 Sábado: 8h às 12h\n🕘 Domingo: Fechado",
      isActive: true,
      conditions: ["contém_palavras"]
    },
    {
      id: "2",
      trigger: "preço|valor|orçamento|quanto custa",
      response: "Para orçamentos personalizados, nossa equipe precisa conhecer suas necessidades. Vou transferir você para um de nossos consultores. Um momento...",
      isActive: true,
      conditions: ["contém_palavras", "horário_comercial"]
    }
  ]);

  // Stats mock para demonstração
  const stats = {
    totalMessages: 1247,
    activeChats: 23,
    responseTime: "2.3 min",
    conversionRate: "18.5%"
  };

  const handleTestConnection = () => {
    if (!config.accessToken || !config.phoneNumberId) {
      toast.error("Preencha o Token de Acesso e ID do Número de Telefone");
      return;
    }

    // Simular teste de conexão
    toast.loading("Testando conexão...");

    setTimeout(() => {
      toast.dismiss();
      setIsConnected(true);
      toast.success("Conexão estabelecida com sucesso!");
    }, 2000);
  };

  const handleSaveConfig = () => {
    toast.loading("Salvando configurações...");

    setTimeout(() => {
      toast.dismiss();
      toast.success("Configurações salvas com sucesso!");
    }, 1000);
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(config.webhookUrl);
    toast.success("URL do webhook copiada!");
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'APPROVED': 'bg-green-100 text-green-800 border-green-200',
      'PENDING': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'REJECTED': 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <Badge className={colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Configuração WhatsApp Business
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Configure a integração com WhatsApp Business API
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Conectado
              </Badge>
            ) : (
              <Badge className="bg-red-100 text-red-800 border-red-200">
                <AlertCircle className="h-3 w-3 mr-1" />
                Desconectado
              </Badge>
            )}
          </div>

          <Button onClick={handleTestConnection} disabled={isConnected}>
            Testar Conexão
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuração
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Automação
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Configuração Básica */}
        <TabsContent value="config" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Credenciais da API</CardTitle>
                <CardDescription>
                  Configure suas credenciais do Meta Business Platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="accessToken">Token de Acesso</Label>
                  <Input
                    id="accessToken"
                    type="password"
                    placeholder="EAAxxxxxxxxxxxxx..."
                    value={config.accessToken}
                    onChange={(e) => setConfig(prev => ({ ...prev, accessToken: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="phoneNumberId">ID do Número de Telefone</Label>
                  <Input
                    id="phoneNumberId"
                    placeholder="123456789012345"
                    value={config.phoneNumberId}
                    onChange={(e) => setConfig(prev => ({ ...prev, phoneNumberId: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="businessAccountId">ID da Conta Business</Label>
                  <Input
                    id="businessAccountId"
                    placeholder="123456789012345"
                    value={config.businessAccountId}
                    onChange={(e) => setConfig(prev => ({ ...prev, businessAccountId: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="appId">ID do Aplicativo</Label>
                  <Input
                    id="appId"
                    placeholder="123456789012345"
                    value={config.appId}
                    onChange={(e) => setConfig(prev => ({ ...prev, appId: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuração do Webhook</CardTitle>
                <CardDescription>
                  Configure o webhook para receber mensagens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>URL do Webhook</Label>
                  <div className="flex gap-2">
                    <Input
                      value={config.webhookUrl}
                      readOnly
                      className="bg-slate-50 dark:bg-slate-900"
                    />
                    <Button variant="outline" size="sm" onClick={copyWebhookUrl}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Cole esta URL na configuração do webhook no Meta Business Platform
                  </p>
                </div>

                <div>
                  <Label htmlFor="webhookToken">Token de Verificação</Label>
                  <Input
                    id="webhookToken"
                    placeholder="seu_token_personalizado"
                    value={config.webhookToken}
                    onChange={(e) => setConfig(prev => ({ ...prev, webhookToken: e.target.value }))}
                  />
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Ativar Integração</h4>
                      <p className="text-sm text-slate-500">
                        Habilitar recebimento de mensagens
                      </p>
                    </div>
                    <Switch
                      checked={config.isActive}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, isActive: checked }))}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveConfig} className="w-full">
                  Salvar Configurações
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Templates de Mensagem */}
        <TabsContent value="templates" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Templates de Mensagem</h3>
            <Button>
              <MessageSquare className="h-4 w-4 mr-2" />
              Novo Template
            </Button>
          </div>

          <div className="grid gap-4">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-slate-500">
                        {template.category} • {template.language}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(template.status)}
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
                    <p className="text-sm whitespace-pre-line">{template.content}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Automação */}
        <TabsContent value="automation" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Respostas Automáticas</h3>
            <Button>
              <Zap className="h-4 w-4 mr-2" />
              Nova Automação
            </Button>
          </div>

          <div className="grid gap-4">
            {autoReplies.map((autoReply) => (
              <Card key={autoReply.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">Gatilho: {autoReply.trigger}</h4>
                        <Switch
                          checked={autoReply.isActive}
                          onCheckedChange={(checked) => {
                            setAutoReplies(prev =>
                              prev.map(ar =>
                                ar.id === autoReply.id ? { ...ar, isActive: checked } : ar
                              )
                            );
                          }}
                        />
                      </div>
                      <div className="flex gap-1 mb-3">
                        {autoReply.conditions.map((condition, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
                    <p className="text-sm whitespace-pre-line">{autoReply.response}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Total de Mensagens
                    </p>
                    <p className="text-2xl font-bold">{stats.totalMessages.toLocaleString()}</p>
                  </div>
                  <MessageCircle className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Conversas Ativas
                    </p>
                    <p className="text-2xl font-bold">{stats.activeChats}</p>
                  </div>
                  <Users className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Tempo de Resposta
                    </p>
                    <p className="text-2xl font-bold">{stats.responseTime}</p>
                  </div>
                  <Clock className="h-8 w-8 text-amber-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Taxa de Conversão
                    </p>
                    <p className="text-2xl font-bold">{stats.conversionRate}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Documentação e Links Úteis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start h-auto p-4">
                  <ExternalLink className="h-4 w-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Meta Business Platform</div>
                    <div className="text-sm text-slate-500">Gerenciar conta e configurações</div>
                  </div>
                </Button>

                <Button variant="outline" className="justify-start h-auto p-4">
                  <Download className="h-4 w-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">WhatsApp Business API Docs</div>
                    <div className="text-sm text-slate-500">Documentação completa da API</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
