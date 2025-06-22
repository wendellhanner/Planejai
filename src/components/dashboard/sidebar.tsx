"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Logo } from "@/components/ui/logo";
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  Ruler,
  Factory,
  Truck,
  Hammer,
  HeadphonesIcon,
  BellRing,
  BrainCircuit,
  User,
  KanbanSquare,
  MessageSquare,
  MessageSquareText,
  Loader2,
  ClipboardCheck,
  CalendarClock,
  Clock,
  BarChart3,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    alert: false,
    count: 0,
    badge: false
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    alert: false,
    count: 0,
    badge: false
  },
  {
    name: "Cronograma",
    href: "/cronograma",
    icon: CalendarClock,
    alert: true,
    count: 7,
    badge: false
  },
  {
    name: "Kanban",
    href: "/kanban",
    icon: KanbanSquare,
    alert: true,
    count: 3,
    badge: false
  },
  {
    name: "Leads",
    href: "/leads",
    icon: Users,
    alert: true,
    count: 14,
    badge: false
  },
  {
    name: "Propostas",
    href: "/propostas",
    icon: FileText,
    alert: true,
    count: 5,
    badge: false
  },
  {
    name: "Agendamentos",
    href: "/agendamentos",
    icon: Calendar,
    alert: true,
    count: 3,
    badge: false
  },
  {
    name: "Medições",
    href: "/medicoes",
    icon: Ruler,
    alert: false,
    count: 0,
    badge: false
  },
  {
    name: "Vendas Fechadas",
    href: "/vendas-fechadas",
    icon: FileText,
    alert: false,
    count: 0,
    badge: false
  },
  {
    name: "Projeto Executivo",
    href: "/projeto-executivo",
    icon: FileText,
    alert: false,
    count: 0,
    badge: false
  },
  {
    name: "Produção",
    href: "/producao",
    icon: Factory,
    alert: false,
    count: 0,
    badge: false
  },
  {
    name: "Entregas",
    href: "/entregas",
    icon: Truck,
    alert: true,
    count: 2,
    badge: false
  },
  {
    name: "Montagens",
    href: "/montagens",
    icon: Hammer,
    alert: false,
    count: 0,
    badge: false
  },
  {
    name: "Chat WhatsApp",
    href: "/chat/whatsapp",
    icon: MessageSquare,
    alert: true,
    count: 8,
    badge: false
  },
  {
    name: "WhatsApp Config",
    href: "/whatsapp-config",
    icon: Settings,
    alert: false,
    count: 0,
    badge: false
  },
  {
    name: "Chat Interno",
    href: "/chat/interno",
    icon: MessageSquareText,
    alert: true,
    count: 5,
    badge: false
  },
  {
    name: "Suporte",
    href: "/suporte",
    icon: HeadphonesIcon,
    alert: true,
    count: 1,
    badge: false
  },
  {
    name: "IA Assistente",
    href: "/assistente",
    icon: BrainCircuit,
    alert: true,
    count: 3,
    badge: true
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Detectar tamanho da tela para responsividade
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Função para alternar o menu mobile
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Função de logout que redireciona para a página de login
  const handleLogout = () => {
    router.push('/login');
    toast.success("Logout realizado com sucesso");
  };

  // Verificar se o usuário está autenticado
  if (status === "loading") {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Carregando...</p>
      </div>
    );
  }

  // Seções para o menu
  const menuSections = [
    {
      title: "Métricas",
      items: navigation.filter(item =>
        ["Dashboard", "Analytics", "Cronograma" ].includes(item.name)
      )
    },
    {
      title: "Comercial",
      items: navigation.filter(item =>
        ["Leads", "Propostas", "Vendas Fechadas", "Agendamentos"].includes(item.name)
      )
    },
    {
      title: "Produção e Entrega",
      items: navigation.filter(item =>
        ["Projeto Executivo","Medições", "Produção", "Entregas", "Montagens"].includes(item.name)
      )
    },
    {
      title: "Comunicação",
      items: navigation.filter(item =>
        [
          "Chat WhatsApp",
          "Kanban",
          "WhatsApp Config",
          "Chat Interno",
          
          "IA Assistente"
        ].includes(item.name)
      )
    },
    {
      title: "Suporte",
      items: navigation.filter(item =>
        ["Suporte"].includes(item.name)
      )
    }
  ];

  const [activeSection, setActiveSection] = useState<string>("Principal");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "Principal": false,
    "Métricas": true,
    "Comercial": true,
    "Produção e Entrega": false,
    "Comunicação": false
  });

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  // Determinar se estamos em modo mobile/tablet
  const isMobile = windowWidth < 1024;

  // Botão do menu hambúrguer para dispositivos móveis
  const MobileMenuButton = () => (
    <button
      onClick={toggleMobileMenu}
      className={`lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-500 text-white shadow-md ${isMobileMenuOpen ? 'hidden' : 'block'}`}
      aria-label="Menu"
    >
      <Menu size={20} />
    </button>
  );

  return (
    <>
      {/* Botão do menu hambúrguer para dispositivos móveis */}
      <MobileMenuButton />
      
      {/* Overlay para fechar o menu ao clicar fora (apenas em mobile) */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed top-0 left-0 z-40 flex h-full flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300",
          isMobile 
            ? isMobileMenuOpen 
              ? "translate-x-0 w-[280px]" 
              : "-translate-x-full w-[280px]" 
            : "translate-x-0 w-64"
        )}
        data-sidebar
      >
        <div className="flex h-16 items-center justify-between border-b px-4 bg-white dark:bg-slate-900 dark:border-slate-800">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold"
          >
            <Logo size="sm" showText={true} />
          </Link>
          {isMobile && (
            <button onClick={toggleMobileMenu} className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
              <X size={20} className="text-slate-600 dark:text-slate-400" />
            </button>
          )}
        </div>

        {/* Menu principal - com overflow auto para permitir rolagem */}
        <div className="relative flex-1 py-3 overflow-y-auto custom-scrollbar">
        {menuSections.map((section, index) => (
          <div
            key={index}
            className="mb-3"
          >
            <h3
              onClick={() => {
                setActiveSection(section.title);
                toggleSection(section.title);
              }}
              className={cn(
                "mb-2 px-4 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-between",
                activeSection === section.title
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-300"
              )}
            >
              <span>{section.title}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className={`transition-transform duration-200 ${expandedSections[section.title] ? 'transform rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </h3>
            <nav className={`space-y-1 px-2 overflow-hidden transition-all duration-300 ${expandedSections[section.title] ? 'max-h-96' : 'max-h-0'}`}>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      `group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all`,
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/10 dark:shadow-blue-800/10"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "relative flex items-center justify-center rounded-md",
                        isActive ? "text-white" : "text-slate-500 dark:text-slate-400"
                      )}>
                        <Icon className={cn(
                          "h-5 w-5",
                          isActive
                            ? "text-white"
                            : "group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                        )} />

                        {item.badge && (
                          <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-xs px-1 py-0.5 rounded-full text-[9px] font-bold">
                            New
                          </span>
                        )}
                      </div>

                      <span>{item.name}</span>
                    </div>

                    {item.alert && (
                      <span className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold",
                        isActive
                          ? "bg-white text-blue-600 dark:bg-blue-100"
                          : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      )}>
                        {item.count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
