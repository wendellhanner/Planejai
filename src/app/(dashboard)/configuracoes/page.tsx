"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import Link from "next/link";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  MailCheck,
  Database,
  Lock,
  Paintbrush,
  Users,
  Building,
  BarChart4,
  Wrench,
  FileEdit,
  Smartphone,
  BadgePercent,
  Workflow,
  FileText,
  ChevronRight,
  HelpCircle,
  MessageSquare,
  BellRing,
  GitBranch,
  DollarSign,
  Clock,
  Plug,
  Share2,
  Accessibility,
} from "lucide-react";
import { AccessibilityMenu } from "@/components/ui/accessibility-menu";

// Componente de cartão de configuração
function ConfigCard({
  title,
  description,
  icon,
  href,
  onClick,
  category = "default",
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  onClick?: () => void;
  category?: string;
}) {
  const categoryColors = {
    sistema:
      "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800",
    usuarios:
      "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800",
    integracao:
      "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800",
    empresa:
      "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800",
    default:
      "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-700",
  };

  const content = (
    <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer h-full border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-lg ${categoryColors[category]} border`}>
            {icon}
          </div>
          <ChevronRight className="h-5 w-5 text-slate-400" />
        </div>
        <CardTitle className="text-base mt-3">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );

  if (onClick) {
    return (
      <div onClick={onClick} className="block">
        {content}
      </div>
    );
  }

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
}

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState("geral");
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);

  const configCategories = {
    sistema: [
      {
        title: "Configurações Gerais",
        description:
          "Ajustes básicos do sistema, unidades, formatos e outros parâmetros.",
        icon: <SettingsIcon className="h-5 w-5" />,
        href: "/configuracoes/geral",
        category: "sistema",
      },
      {
        title: "Aparência e Tema",
        description: "Personalize as cores, logotipo e aparência do sistema.",
        icon: <Paintbrush className="h-5 w-5" />,
        href: "/configuracoes/aparencia",
        category: "sistema",
      },
      {
        title: "Acessibilidade",
        description:
          "Ajuste as configurações de acessibilidade para melhorar sua experiência.",
        icon: <Accessibility className="h-5 w-5" />,
        href: "#",
        onClick: () => setIsAccessibilityOpen(true),
        category: "sistema",
      },
      {
        title: "Segurança",
        description: "Configurações de segurança, senhas e autenticação.",
        icon: <Lock className="h-5 w-5" />,
        href: "/configuracoes/seguranca",
        category: "sistema",
      },
      {
        title: "Banco de Dados",
        description: "Gerenciamento de backups e restauração de dados.",
        icon: <Database className="h-5 w-5" />,
        href: "/configuracoes/database",
        category: "sistema",
      },
    ],
    usuarios: [
      {
        title: "Gestão de Usuários",
        description: "Adicione, edite e gerencie as permissões dos usuários.",
        icon: <Users className="h-5 w-5" />,
        href: "/configuracoes/usuarios",
        category: "usuarios",
      },
      {
        title: "Perfis e Permissões",
        description: "Configure grupos de permissões e níveis de acesso.",
        icon: <Lock className="h-5 w-5" />,
        href: "/configuracoes/permissoes",
        category: "usuarios",
      },
      {
        title: "Equipes",
        description: "Organize usuários em equipes e defina líderes.",
        icon: <Users className="h-5 w-5" />,
        href: "/configuracoes/equipes",
        category: "usuarios",
      },
      {
        title: "Auditoria",
        description:
          "Registros de atividades e alterações realizadas pelos usuários.",
        icon: <FileEdit className="h-5 w-5" />,
        href: "/configuracoes/auditoria",
        category: "usuarios",
      },
    ],
    notificacoes: [
      {
        title: "Email",
        description: "Configure servidores de e-mail e modelos de mensagens.",
        icon: <MailCheck className="h-5 w-5" />,
        href: "/configuracoes/email",
        category: "integracao",
      },
      {
        title: "Notificações",
        description: "Ajuste as notificações do sistema e alertas.",
        icon: <Bell className="h-5 w-5" />,
        href: "/configuracoes/notificacoes",
        category: "integracao",
      },
      {
        title: "WhatsApp",
        description: "Configure a integração com WhatsApp Business API.",
        icon: <MessageSquare className="h-5 w-5" />,
        href: "/configuracoes/whatsapp",
        category: "integracao",
      },
      {
        title: "SMS",
        description: "Configure a integração para envio de mensagens SMS.",
        icon: <Smartphone className="h-5 w-5" />,
        href: "/configuracoes/sms",
        category: "integracao",
      },
    ],
    empresa: [
      {
        title: "Dados da Empresa",
        description: "Informações legais, logo, endereço e contatos.",
        icon: <Building className="h-5 w-5" />,
        href: "/configuracoes/empresa",
        category: "empresa",
      },
      {
        title: "Financeiro",
        description: "Configure parâmetros fiscais e de cobrança.",
        icon: <DollarSign className="h-5 w-5" />,
        href: "/configuracoes/financeiro",
        category: "empresa",
      },
      {
        title: "Preferências Comerciais",
        description: "Políticas de vendas, descontos e condições de pagamento.",
        icon: <BadgePercent className="h-5 w-5" />,
        href: "/configuracoes/comercial",
        category: "empresa",
      },
      {
        title: "Documentos e Contratos",
        description: "Modelos de contratos, propostas e documentos.",
        icon: <FileText className="h-5 w-5" />,
        href: "/configuracoes/documentos",
        category: "empresa",
      },
    ],
    avancado: [
      {
        title: "Integrações",
        description: "Configure integrações com sistemas externos.",
        icon: <Plug className="h-5 w-5" />,
        href: "/configuracoes/integracoes",
        category: "integracao",
      },
      {
        title: "API e Webhooks",
        description: "Gerenciamento de APIs, webhooks e endpoints.",
        icon: <GitBranch className="h-5 w-5" />,
        href: "/configuracoes/api",
        category: "sistema",
      },
      {
        title: "Exportação de Dados",
        description: "Exporte dados para Excel, CSV ou outros formatos.",
        icon: <Share2 className="h-5 w-5" />,
        href: "/configuracoes/exportacao",
        category: "sistema",
      },
      {
        title: "Tarefas Agendadas",
        description: "Configure rotinas automáticas e tarefas periódicas.",
        icon: <Clock className="h-5 w-5" />,
        href: "/configuracoes/tarefas",
        category: "sistema",
      },
    ],
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">
            Configurações
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Gerencie as configurações do sistema
          </p>
        </div>
      </div>

      <Tabs
        defaultValue="geral"
        className="mb-6"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          <TabsTrigger value="empresa">Empresa</TabsTrigger>
          <TabsTrigger value="avancado">Avançado</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {configCategories.sistema.map((config, index) => (
              <ConfigCard
                key={index}
                title={config.title}
                description={config.description}
                icon={config.icon}
                href={config.href}
                onClick={config.onClick}
                category={config.category}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="usuarios" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {configCategories.usuarios.map((config, index) => (
              <ConfigCard
                key={index}
                title={config.title}
                description={config.description}
                icon={config.icon}
                href={config.href}
                category={config.category}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notificacoes" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {configCategories.notificacoes.map((config, index) => (
              <ConfigCard
                key={index}
                title={config.title}
                description={config.description}
                icon={config.icon}
                href={config.href}
                category={config.category}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="empresa" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {configCategories.empresa.map((config, index) => (
              <ConfigCard
                key={index}
                title={config.title}
                description={config.description}
                icon={config.icon}
                href={config.href}
                category={config.category}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="avancado" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {configCategories.avancado.map((config, index) => (
              <ConfigCard
                key={index}
                title={config.title}
                description={config.description}
                icon={config.icon}
                href={config.href}
                category={config.category}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Acessibilidade Dialog */}
      {isAccessibilityOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setIsAccessibilityOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div onClick={(e) => e.stopPropagation()} className="z-10">
            <AccessibilityMenu
              openFromSettings
              setIsOpen={setIsAccessibilityOpen}
            />
          </div>
        </div>
      )}
    </div>
  );
}
