'use client';

import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar } from "lucide-react";

export function UserProfile() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Perfil do Usuário</CardTitle>
          <CardDescription>Carregando informações...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!user) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Perfil do Usuário</CardTitle>
          <CardDescription>Não autenticado</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Você não está autenticado. Por favor, faça login para ver suas informações.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Extrair iniciais do email para o avatar
  const initials = user.email ? user.email.substring(0, 2).toUpperCase() : 'U';
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Perfil do Usuário</CardTitle>
        <CardDescription>Suas informações de conta</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarImage src={user.user_metadata?.avatar_url || ''} alt={user.email || 'Usuário'} />
            <AvatarFallback className="text-lg bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-medium">
                {user.user_metadata?.nome || 'Usuário'}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {user.user_metadata?.cargo && (
                <Badge variant="outline" className="bg-primary/10">
                  {user.user_metadata.cargo}
                </Badge>
              )}
              <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">
                Verificado
              </Badge>
            </div>
            
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>
                Membro desde: {new Date(user.created_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
