"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Settings,
  Bell,
  Eye,
  Volume2,
  Mail,
  MessageSquare,
  Clock,
  Globe,
  Monitor,
  Moon,
  Sun,
  Palette,
  Zap,
  Shield,
  Database,
  Save,
} from "lucide-react";
import { useState } from "react";

export default function PreferenciasPage() {
  const [preferences, setPreferences] = useState({
    // Notificações
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    newLeadNotification: true,
    projectUpdateNotification: true,
    paymentNotification: true,

    // Aparência
    theme: "system",
    fontSize: 14,
    sidebarCollapsed: false,
    compactMode: false,

    // Idioma e Região
    language: "pt-BR",
    timezone: "America/Sao_Paulo",
    dateFormat: "DD/MM/YYYY",
    currency: "BRL",

    // Performance
    autoSave: true,
    backgroundSync: true,
    animationsEnabled: true,

    // Privacidade
    profileVisibility: "team",
    activityTracking: true,
    analyticsConsent: true,
  });

  const handleSave = () => {
    // Implementar lógica para salvar preferências
    console.log("Preferências salvas:", preferences);
  };

  const updatePreference = (key: string, value: any) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header da página */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Preferências
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Personalize sua experiência na plataforma
          </p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>

      <Tabs defaultValue="notificacoes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          <TabsTrigger value="aparencia">Aparência</TabsTrigger>
          <TabsTrigger value="idioma">Idioma & Região</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="privacidade">Privacidade</TabsTrigger>
        </TabsList>

        {/* Notificações */}
        <TabsContent value="notificacoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Configurações de Notificação
              </CardTitle>
              <CardDescription>
                Escolha como e quando você quer receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Métodos de notificação */}
              <div className="space-y-4">
                <h4 className="font-medium">Métodos de Notificação</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-slate-600" />
                      <div>
                        <Label htmlFor="email-notifications">
                          Notificações por Email
                        </Label>
                        <p className="text-sm text-slate-500">
                          Receba atualizações no seu email
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={preferences.emailNotifications}
                      onCheckedChange={(checked) =>
                        updatePreference("emailNotifications", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-4 w-4 text-slate-600" />
                      <div>
                        <Label htmlFor="push-notifications">
                          Notificações Push
                        </Label>
                        <p className="text-sm text-slate-500">
                          Notificações no navegador
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={preferences.pushNotifications}
                      onCheckedChange={(checked) =>
                        updatePreference("pushNotifications", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-4 w-4 text-slate-600" />
                      <div>
                        <Label htmlFor="sms-notifications">
                          Notificações por SMS
                        </Label>
                        <p className="text-sm text-slate-500">
                          SMS para casos urgentes
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={preferences.smsNotifications}
                      onCheckedChange={(checked) =>
                        updatePreference("smsNotifications", checked)
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Tipos de notificação */}
              <div className="space-y-4">
                <h4 className="font-medium">Tipos de Notificação</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="new-lead">Novos Leads</Label>
                    <Switch
                      id="new-lead"
                      checked={preferences.newLeadNotification}
                      onCheckedChange={(checked) =>
                        updatePreference("newLeadNotification", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="project-update">
                      Atualizações de Projetos
                    </Label>
                    <Switch
                      id="project-update"
                      checked={preferences.projectUpdateNotification}
                      onCheckedChange={(checked) =>
                        updatePreference("projectUpdateNotification", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="payment">Pagamentos e Faturas</Label>
                    <Switch
                      id="payment"
                      checked={preferences.paymentNotification}
                      onCheckedChange={(checked) =>
                        updatePreference("paymentNotification", checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aparência */}
        <TabsContent value="aparencia" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Personalização da Interface
              </CardTitle>
              <CardDescription>
                Customize a aparência da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>Tema</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      <span className="text-sm">Claro</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      <span className="text-sm">Escuro</span>
                    </div>
                    {/*
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      <span className="text-sm">Sistema</span>
                    </div>
                    */}
                    <ThemeToggle />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Tamanho da Fonte</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[preferences.fontSize]}
                      onValueChange={(value) =>
                        updatePreference("fontSize", value[0])
                      }
                      max={18}
                      min={12}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-slate-500">
                      <span>Pequeno (12px)</span>
                      <span>Atual: {preferences.fontSize}px</span>
                      <span>Grande (18px)</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="compact-mode">Modo Compacto</Label>
                      <p className="text-sm text-slate-500">
                        Reduz o espaçamento entre elementos
                      </p>
                    </div>
                    <Switch
                      id="compact-mode"
                      checked={preferences.compactMode}
                      onCheckedChange={(checked) =>
                        updatePreference("compactMode", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="animations">Animações</Label>
                      <p className="text-sm text-slate-500">
                        Ativa animações na interface
                      </p>
                    </div>
                    <Switch
                      id="animations"
                      checked={preferences.animationsEnabled}
                      onCheckedChange={(checked) =>
                        updatePreference("animationsEnabled", checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Idioma e Região */}
        <TabsContent value="idioma" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Idioma e Configurações Regionais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select
                    value={preferences.language}
                    onValueChange={(value) =>
                      updatePreference("language", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select
                    value={preferences.timezone}
                    onValueChange={(value) =>
                      updatePreference("timezone", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">
                        São Paulo (UTC-3)
                      </SelectItem>
                      <SelectItem value="America/New_York">
                        New York (UTC-5)
                      </SelectItem>
                      <SelectItem value="Europe/London">
                        London (UTC+0)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-format">Formato de Data</Label>
                  <Select
                    value={preferences.dateFormat}
                    onValueChange={(value) =>
                      updatePreference("dateFormat", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Moeda</Label>
                  <Select
                    value={preferences.currency}
                    onValueChange={(value) =>
                      updatePreference("currency", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">Real (R$)</SelectItem>
                      <SelectItem value="USD">Dólar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Configurações de Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-save">Salvamento Automático</Label>
                    <p className="text-sm text-slate-500">
                      Salva automaticamente suas alterações
                    </p>
                  </div>
                  <Switch
                    id="auto-save"
                    checked={preferences.autoSave}
                    onCheckedChange={(checked) =>
                      updatePreference("autoSave", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="background-sync">
                      Sincronização em Segundo Plano
                    </Label>
                    <p className="text-sm text-slate-500">
                      Mantém dados atualizados automaticamente
                    </p>
                  </div>
                  <Switch
                    id="background-sync"
                    checked={preferences.backgroundSync}
                    onCheckedChange={(checked) =>
                      updatePreference("backgroundSync", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacidade */}
        <TabsContent value="privacidade" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configurações de Privacidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-visibility">
                    Visibilidade do Perfil
                  </Label>
                  <Select
                    value={preferences.profileVisibility}
                    onValueChange={(value) =>
                      updatePreference("profileVisibility", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Público</SelectItem>
                      <SelectItem value="team">Apenas Equipe</SelectItem>
                      <SelectItem value="private">Privado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="activity-tracking">
                      Rastreamento de Atividade
                    </Label>
                    <p className="text-sm text-slate-500">
                      Permite tracking para melhorar a experiência
                    </p>
                  </div>
                  <Switch
                    id="activity-tracking"
                    checked={preferences.activityTracking}
                    onCheckedChange={(checked) =>
                      updatePreference("activityTracking", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="analytics-consent">
                      Consentimento para Analytics
                    </Label>
                    <p className="text-sm text-slate-500">
                      Permite coleta de dados anônimos
                    </p>
                  </div>
                  <Switch
                    id="analytics-consent"
                    checked={preferences.analyticsConsent}
                    onCheckedChange={(checked) =>
                      updatePreference("analyticsConsent", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
