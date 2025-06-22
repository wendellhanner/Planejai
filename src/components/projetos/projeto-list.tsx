'use client';

import { useState, useEffect } from 'react';
import { useSupabaseContext } from '@/contexts/supabase-provider';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, FolderPlus, Calendar, User, DollarSign, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/data';

type Projeto = {
  id: string;
  titulo: string;
  cliente_id: string;
  cliente_nome: string;
  valor: number;
  status: string;
  data_inicio: string;
  data_entrega: string;
  created_at: string;
};

export function ProjetoList() {
  const { fetchData, isLoading: supabaseLoading } = useSupabaseContext();
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const loadProjetos = async () => {
      setIsLoading(true);
      try {
        // Buscar projetos com join para obter o nome do cliente
        const { data, error } = await fetchData<Projeto>(
          'projetos', 
          {
            joins: [
              {
                table: 'clientes',
                on: 'projetos.cliente_id = clientes.id',
                select: 'clientes.nome as cliente_nome'
              }
            ]
          }
        );
        
        if (error) {
          toast.error('Erro ao carregar projetos');
          console.error('Erro ao carregar projetos:', error);
          return;
        }
        
        if (data) {
          setProjetos(data);
        }
      } catch (error) {
        console.error('Erro ao buscar projetos:', error);
        toast.error('Falha ao carregar dados de projetos');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProjetos();
  }, [fetchData]);
  
  const filteredProjetos = projetos.filter(projeto => 
    projeto.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    projeto.cliente_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    projeto.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'em_andamento':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Em Andamento</Badge>;
      case 'concluido':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Concluído</Badge>;
      case 'atrasado':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Atrasado</Badge>;
      case 'cancelado':
        return <Badge variant="outline" className="text-slate-500">Cancelado</Badge>;
      case 'orcamento':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">Orçamento</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };
  
  if (isLoading || supabaseLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Projetos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <CardTitle>Projetos</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar projeto..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button size="sm" className="gap-1">
            <FolderPlus className="h-4 w-4" />
            <span>Novo Projeto</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {filteredProjetos.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              {searchTerm ? 'Nenhum projeto encontrado com esses termos.' : 'Nenhum projeto cadastrado.'}
            </p>
            {!searchTerm && (
              <Button variant="outline" className="mt-4 gap-1">
                <Plus className="h-4 w-4" />
                <span>Adicionar Projeto</span>
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Datas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjetos.map((projeto) => (
                  <TableRow key={projeto.id}>
                    <TableCell className="font-medium">{projeto.titulo}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span>{projeto.cliente_nome || 'Cliente não especificado'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        <span>{formatCurrency(projeto.valor)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>Início: {formatDate(projeto.data_inicio)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>Entrega: {formatDate(projeto.data_entrega)}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(projeto.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
