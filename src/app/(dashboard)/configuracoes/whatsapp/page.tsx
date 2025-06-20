"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  AlertTriangle,
  Check,
  Copy,
  KeyRound,
  RefreshCw,
  Save,
  ShieldCheck,
  Smartphone,
  Webhook,
  Loader2
} from "lucide-react";

export default function WhatsAppConfigPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [token, setToken] = useState("");
  const [phoneNumberId, setPhoneNumberId] = useState("");
  const [businessAccountId, setBusinessAccountId] = useState("");
  const [webhookUrl, setWebhookUrl] = useState(`${window.location.origin}/api/webhooks/whatsapp`);
  const [webhookVerifyToken, setWebhookVerifyToken] = useState("");
  const [autoResponderEnabled, setAutoResponderEnabled] = useState(false);
  const [autoResponderMessage, setAutoResponderMessage] = useState(
    "Olá! Obrigado por sua mensagem. Um de nossos consultores irá atendê-lo em breve."
  );

  // Fetch current WhatsApp integration settings
  useEffect(() => {
    async function fetchWhatsAppConfig() {
      try {
        setIsLoadingConfig(true);
        const response = await fetch('/api/whatsapp-integration');

        if (response.ok) {
          const data = await response.json();
          setIsConnected(data.isActive || false);
          setToken(data.apiKey || '');
          setPhoneNumberId(data.phoneNumberId || '');
          setBusinessAccountId(data.businessAccountId || '');
          setWebhookVerifyToken(data.webhookVerifyToken || '');
          setAutoResponderEnabled(data.autoResponderEnabled || false);
          setAutoResponderMessage(data.autoResponderMessage || "Olá! Obrigado por sua mensagem. Um de nossos consultores irá atendê-lo em breve.");
        } else {
          // If 404, it means integration is not configured yet
          if (response.status !== 404) {
            toast.error("Erro ao buscar configurações do WhatsApp");
          }
        }
      } catch (error) {
        console.error('Error fetching WhatsApp config:', error);
      } finally {
        setIsLoadingConfig(false);
      }
    }

    fetchWhatsAppConfig();
  }, []);

  const handleConnect = async () => {
    if (!token || !phoneNumberId || !businessAccountId) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/whatsapp-integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: token,
          phoneNumberId,
          businessAccountId,
          isActive: true,
          webhookVerifyToken,
          autoResponderEnabled,
          autoResponderMessage,
        }),
      });

      if (response.ok) {
        setIsConnected(true);
        toast.success("WhatsApp conectado com sucesso!");
      } else {
        const error = await response.json();
        toast.error(error.error || "Erro ao conectar WhatsApp");
      }
    } catch (error) {
      console.error('Error connecting WhatsApp:', error);
      toast.error("Erro ao conectar WhatsApp");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/whatsapp-integration', {
        method: 'DELETE',
      });

      if (response.ok) {
        setIsConnected(false);
        toast.success("WhatsApp desconectado com sucesso");
      } else {
        const error = await response.json();
        toast.error(error.error || "Erro ao desconectar WhatsApp");
      }
    } catch (error) {
      console.error('Error disconnecting WhatsApp:', error);
      toast.error("Erro ao desconectar WhatsApp");
    } finally {
      setIsLoading(false);
    }
  };

  const generateWebhookToken = async () => {
    try {
      const response = await fetch('/api/whatsapp-integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: token,
          phoneNumberId,
          businessAccountId,
          isActive: isConnected,
          autoResponderEnabled,
          autoResponderMessage,
          generateNewToken: true,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setWebhookVerifyToken(data.webhookVerifyToken);
        toast.success("Token gerado com sucesso");
      } else {
        const error = await response.json();
        toast.error(error.error || "Erro ao gerar token");
      }
    } catch (error) {
      console.error('Error generating webhook token:', error);
      toast.error("Erro ao gerar token");
    }
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };

  const saveAutoResponder = async () => {
    try {
      const response = await fetch('/api/whatsapp-integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: token,
          phoneNumberId,
          businessAccountId,
          isActive: isConnected,
          webhookVerifyToken,
          autoResponderEnabled,
          autoResponderMessage,
        }),
      });

      if (response.ok) {
        toast.success("Configurações de resposta automática salvas");
      } else {
        const error = await response.json();
        toast.error(error.error || "Erro ao salvar configurações");
      }
    } catch (error) {
      console.error('Error saving auto responder settings:', error);
      toast.error("Erro ao salvar configurações");
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Integração WhatsApp Business</h1>
        <p className="text-slate-500">
          Configure a integração com a API do WhatsApp Business para comunicação com seus clientes
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-green-600" />
                  Configuração da API WhatsApp
                </span>
                {isConnected ? (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    Conectado
                  </span>
                ) : (
                  <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Desconectado
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                Insira as credenciais da API do WhatsApp Business para começar a integração
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token">Token de Acesso</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="token"
                    type="password"
                    placeholder="Token de acesso do WhatsApp Business API"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    disabled={isConnected || isLoading}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(token, "Token copiado")}
                    disabled={!token}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number_id">ID do Número de Telefone</Label>
                <Input
                  id="phone_number_id"
                  placeholder="ID do número de telefone"
                  value={phoneNumberId}
                  onChange={(e) => setPhoneNumberId(e.target.value)}
                  disabled={isConnected || isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_account_id">ID da Conta Business</Label>
                <Input
                  id="business_account_id"
                  placeholder="ID da conta business"
                  value={businessAccountId}
                  onChange={(e) => setBusinessAccountId(e.target.value)}
                  disabled={isConnected || isLoading}
                />
              </div>
            </CardContent>
            <CardFooter>
              {isConnected ? (
                <Button
                  onClick={handleDisconnect}
                  variant="destructive"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Desconectando...
                    </>
                  ) : (
                    "Desconectar WhatsApp"
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleConnect}
                  disabled={isLoading || !token || !phoneNumberId || !businessAccountId}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Conectando...
                    </>
                  ) : (
                    "Conectar WhatsApp"
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="webhook">
            <TabsList className="w-full">
              <TabsTrigger value="webhook" className="flex-1">Webhook</TabsTrigger>
              <TabsTrigger value="autoresponder" className="flex-1">Auto-resposta</TabsTrigger>
            </TabsList>

            <TabsContent value="webhook" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Webhook className="h-5 w-5 text-indigo-600" />
                    Configuração de Webhook
                  </CardTitle>
                  <CardDescription>
                    Configure o webhook para receber mensagens
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhook_url">URL do Webhook</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="webhook_url"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(webhookUrl, "URL copiada")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="verify_token">Token de Verificação</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="verify_token"
                        value={webhookVerifyToken}
                        onChange={(e) => setWebhookVerifyToken(e.target.value)}
                      />
                      <Button
                        variant="outline"
                        onClick={generateWebhookToken}
                        size="icon"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(webhookVerifyToken, "Token copiado")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Este token deve ser fornecido na configuração do WhatsApp Business API
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 mt-2">
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4 text-slate-400" />
                    <span>Informações de webhook configuradas com segurança</span>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="autoresponder" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <KeyRound className="h-5 w-5 text-amber-600" />
                    Resposta Automática
                  </CardTitle>
                  <CardDescription>
                    Configure respostas automáticas para clientes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="auto-responder"
                      checked={autoResponderEnabled}
                      onCheckedChange={setAutoResponderEnabled}
                    />
                    <Label htmlFor="auto-responder">
                      Ativar resposta automática
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="auto_message">Mensagem Automática</Label>
                    <Textarea
                      id="auto_message"
                      placeholder="Digite a mensagem automática que será enviada..."
                      rows={4}
                      value={autoResponderMessage}
                      onChange={(e) => setAutoResponderMessage(e.target.value)}
                      disabled={!autoResponderEnabled}
                    />
                    <p className="text-xs text-slate-500">
                      Esta mensagem será enviada automaticamente quando um cliente entrar em contato.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={saveAutoResponder}
                    disabled={!autoResponderEnabled || !autoResponderMessage}
                    className="w-full"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Configurações
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Integrações de IA para WhatsApp</CardTitle>
            <CardDescription>
              Configure como a IA irá interagir com seus clientes via WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start space-x-2">
                  <div>
                    <Switch
                      id="ai-suggestions"
                      defaultChecked
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="ai-suggestions" className="font-medium">
                      Sugestões de Respostas via IA
                    </Label>
                    <p className="text-sm text-slate-500">
                      A IA irá sugerir respostas com base no histórico de conversa
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <div>
                    <Switch
                      id="ai-categorization"
                      defaultChecked
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="ai-categorization" className="font-medium">
                      Categorização Automática
                    </Label>
                    <p className="text-sm text-slate-500">
                      A IA irá categorizar as mensagens dos clientes automaticamente
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <div>
                    <Switch
                      id="ai-sentiment"
                      defaultChecked
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="ai-sentiment" className="font-medium">
                      Análise de Sentimento
                    </Label>
                    <p className="text-sm text-slate-500">
                      A IA irá analisar o sentimento das mensagens dos clientes
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <div>
                    <Switch
                      id="ai-summary"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="ai-summary" className="font-medium">
                      Resumo de Conversas
                    </Label>
                    <p className="text-sm text-slate-500">
                      A IA irá gerar resumos das conversas para facilitar o acompanhamento
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Salvar Configurações de IA
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
