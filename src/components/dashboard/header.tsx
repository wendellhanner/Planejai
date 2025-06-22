"use client";

import Link from "next/link";
import { Bell, UserCircle, Settings, CreditCard, LogOut, UserCog, LifeBuoy } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NotificationCenter } from "@/components/ui/notification-center";

// Componente para o perfil do usuário
interface UserProfileDropdownProps {
  userName: string;
  userEmail: string;
  userRole: string;
  userInitial: string;
  userRoleColor: string;
  onLogout: () => void;
}

function UserProfileDropdown({ userName, userEmail, userRole, userInitial, userRoleColor, onLogout }: UserProfileDropdownProps) {
  return (
    <div className="flex items-center gap-1">
      {/* Botão de logout para mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden h-7 w-7 p-0 text-red-500"
        onClick={onLogout}
        title="Sair"
      >
        <LogOut className="h-4 w-4" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 gap-2 pl-1.5 pr-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Avatar className="h-7 w-7 border-2 border-white dark:border-slate-800 shadow-sm">
              <AvatarFallback className={userRoleColor}>{userInitial}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start hidden md:flex">
              <span className="font-medium text-sm leading-none text-slate-800 dark:text-white">{userName.split(' ')[0]}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{userRole}</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hidden md:block text-slate-400">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-64 p-0 overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg rounded-xl"
        >
          <div className="flex flex-col gap-1 p-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 shadow-md">
                <AvatarFallback className={`text-base ${userRoleColor}`}>{userInitial}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium text-slate-900 dark:text-white">{userName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{userEmail}</p>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
              <Badge
                variant="outline"
                className="text-xs py-0 h-5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                {userRole}
              </Badge>
              <Badge
                variant="outline"
                className="text-xs py-0 h-5 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
              >
                PRO
              </Badge>
            </div>
          </div>

          <div className="py-1.5">
            <div className="grid grid-cols-3 gap-1 px-1.5 mb-1.5">
              <Link href="/perfil">
                <Button variant="ghost" size="sm" className="w-full h-auto py-3 px-2 flex flex-col items-center justify-center gap-1 rounded-lg">
                  <UserCircle className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  <span className="text-xs">Perfil</span>
                </Button>
              </Link>
              <Link href="/configuracoes">
                <Button variant="ghost" size="sm" className="w-full h-auto py-3 px-2 flex flex-col items-center justify-center gap-1 rounded-lg">
                  <Settings className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  <span className="text-xs">Config.</span>
                </Button>
              </Link>
              <Link href="/faturamento">
                <Button variant="ghost" size="sm" className="w-full h-auto py-3 px-2 flex flex-col items-center justify-center gap-1 rounded-lg">
                  <CreditCard className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  <span className="text-xs">Fatura</span>
                </Button>
              </Link>
            </div>

            <DropdownMenuSeparator className="my-1" />

            <div className="px-1.5 py-1">
              <DropdownMenuGroup>
                <Link href="/perfil">
                  <DropdownMenuItem className="py-1.5 rounded-lg">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Meu Perfil</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/perfil/preferencias">
                  <DropdownMenuItem className="py-1.5 rounded-lg">
                    <UserCog className="mr-2 h-4 w-4" />
                    <span>Personalização</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/projetos/meus">
                  <DropdownMenuItem className="py-1.5 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M2 9V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1"/>
                      <path d="M2 13h10"/>
                      <path d="m5 10-3 3 3 3"/>
                    </svg>
                    <span>Meus Projetos</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
            </div>

            <DropdownMenuSeparator className="my-1" />

            <div className="px-1.5 py-1">
              <DropdownMenuGroup>
                <Link href="/ajuda">
                  <DropdownMenuItem className="py-1.5 rounded-lg">
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    <span>Central de Ajuda</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/feedback">
                  <DropdownMenuItem className="py-1.5 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    <span>Enviar Feedback</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
            </div>

            <DropdownMenuSeparator className="my-1" />

            <div className="px-1.5 py-1">
              <DropdownMenuItem
                className="text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/20 py-1.5 rounded-lg"
                onClick={onLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair da conta</span>
              </DropdownMenuItem>
            </div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end">
            <ThemeToggle className="h-7 w-7" />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Usar o logout do Supabase
      await logout();
      
      // Redirecionar para a página de login
      router.push('/login');
    } catch (error) {
      console.error("Erro no logout:", error);
      // Fallback - redirecionar manualmente se o logout falhar
      window.location.href = "/login";
    }
  };

  // Dados do usuário do sistema Supabase
  const userData = {
    userName: user?.email?.split('@')[0] || "Administrador",
    userEmail: user?.email || "admin@example.com",
    userRole: "Administrador",
    userInitial: user?.email?.charAt(0).toUpperCase() || "A",
    userRoleColor: "bg-blue-500 text-white",
  };

  // Dados de clientes removidos conforme solicitação

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6">
      {/* Left side - Logo ou navegação */}
      <div className="flex items-center gap-4">
        {/* Seção de clientes sem resposta removida conforme solicitação */}
      </div>

      {/* Right side - User profile and Notification Center */}
      <div className="flex items-center gap-2">
        {/* Notification Center */}
        <NotificationCenter />
        {/* User Profile Dropdown */}
        <UserProfileDropdown
          userName={userData.userName}
          userEmail={userData.userEmail}
          userRole={userData.userRole}
          userInitial={userData.userInitial}
          userRoleColor={userData.userRoleColor}
          onLogout={handleLogout}
        />
      </div>
    </header>
  );
}
