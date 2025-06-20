import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Filter, Download, Eye, FileEdit, Trash2 } from "lucide-react";

export default function MedicoesPage() {
  // Estes seriam dados vindos do banco de dados em uma aplicação real
  const medicoes = [
    {
      id: "1",
      title: "Medição Apartamento 302",
      client: "João Silva",
      date: "22/05/2023",
      status: "CONCLUIDA",
      rooms: 3,
      hasPhotos: true,
      hasFiles: true,
    },
    {
      id: "2",
      title: "Medição Casa Condomínio Verde",
      client: "Maria Oliveira",
      date: "20/05/2023",
      status: "CONCLUIDA",
      rooms: 5,
      hasPhotos: true,
      hasFiles: true,
    },
    {
      id: "3",
      title: "Medição Escritório Centro",
      client: "Carlos Santos",
      date: "18/05/2023",
      status: "PENDENTE",
      rooms: 2,
      hasPhotos: false,
      hasFiles: true,
    },
    {
      id: "4",
      title: "Medição Loja Shopping Plaza",
      client: "Ana Beatriz",
      date: "15/05/2023",
      status: "CANCELADA",
      rooms: 1,
      hasPhotos: false,
      hasFiles: false,
    },
    {
      id: "5",
      title: "Medição Apartamento Novo",
      client: "Fernando Pereira",
      date: "30/04/2023",
      status: "EM_ANDAMENTO",
      rooms: 4,
      hasPhotos: true,
      hasFiles: false,
    },
  ];

  // Mapeamento de status para exibição e classes CSS
  const statusMap: Record<string, { label: string; className: string }> = {
    PENDENTE: {
      label: "Pendente",
      className: "bg-yellow-100 text-yellow-800"
    },
    EM_ANDAMENTO: {
      label: "Em Andamento",
      className: "bg-blue-100 text-blue-800"
    },
    CONCLUIDA: {
      label: "Concluída",
      className: "bg-green-100 text-green-800"
    },
    CANCELADA: {
      label: "Cancelada",
      className: "bg-red-100 text-red-800"
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Medições</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Link href="/medicoes/cadastrar">
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Medição
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Lista de Medições</CardTitle>
          <CardDescription>
            Gerencie as medições realizadas para os projetos de móveis planejados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ambientes</TableHead>
                <TableHead>Anexos</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicoes.map((medicao) => (
                <TableRow key={medicao.id}>
                  <TableCell className="font-medium">{medicao.title}</TableCell>
                  <TableCell>{medicao.client}</TableCell>
                  <TableCell>{medicao.date}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${statusMap[medicao.status].className}`}
                    >
                      {statusMap[medicao.status].label}
                    </span>
                  </TableCell>
                  <TableCell>{medicao.rooms}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {medicao.hasPhotos && (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                          Fotos
                        </span>
                      )}
                      {medicao.hasFiles && (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                          Arquivos
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Visualizar">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Editar">
                        <FileEdit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" title="Excluir">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
