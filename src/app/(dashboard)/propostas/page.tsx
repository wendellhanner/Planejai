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
import { PlusCircle, Filter, Download } from "lucide-react";

export default function PropostasPage() {
  // Estes seriam dados vindos do banco de dados em uma aplicação real
  const proposals = [
    {
      id: "1",
      title: "Cozinha Completa - Modelo Milano",
      client: "João Silva",
      value: "R$ 23.500,00",
      status: "PENDENTE",
      createdAt: "2023-05-15",
      validUntil: "2023-06-15",
    },
    {
      id: "2",
      title: "Quarto Casal - Pacote Premium",
      client: "Maria Oliveira",
      value: "R$ 18.750,00",
      status: "ENVIADA",
      createdAt: "2023-05-14",
      validUntil: "2023-06-14",
    },
    {
      id: "3",
      title: "Home Office - Linha Executivo",
      client: "Carlos Santos",
      value: "R$ 12.320,00",
      status: "ACEITA",
      createdAt: "2023-05-13",
      validUntil: "2023-06-13",
    },
    {
      id: "4",
      title: "Sala de Estar - Modelo Contemporâneo",
      client: "Ana Beatriz",
      value: "R$ 34.680,00",
      status: "RECUSADA",
      createdAt: "2023-05-10",
      validUntil: "2023-06-10",
    },
    {
      id: "5",
      title: "Closet Completo - Linha Luxo",
      client: "Fernando Pereira",
      value: "R$ 28.900,00",
      status: "EXPIRADA",
      createdAt: "2023-04-01",
      validUntil: "2023-05-01",
    },
  ];

  // Mapeamento de status para exibição e classes CSS
  const statusMap: Record<string, { label: string; className: string }> = {
    PENDENTE: {
      label: "Pendente",
      className: "bg-yellow-100 text-yellow-800"
    },
    ENVIADA: {
      label: "Enviada",
      className: "bg-blue-100 text-blue-800"
    },
    ACEITA: {
      label: "Aceita",
      className: "bg-green-100 text-green-800"
    },
    RECUSADA: {
      label: "Recusada",
      className: "bg-red-100 text-red-800"
    },
    EXPIRADA: {
      label: "Expirada",
      className: "bg-gray-100 text-gray-800"
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Propostas Comerciais</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Proposta
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Lista de Propostas</CardTitle>
          <CardDescription>
            Gerencie todas as suas propostas comerciais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criada em</TableHead>
                <TableHead>Válida até</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposals.map((proposal) => (
                <TableRow key={proposal.id}>
                  <TableCell className="font-medium">{proposal.title}</TableCell>
                  <TableCell>{proposal.client}</TableCell>
                  <TableCell>{proposal.value}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${statusMap[proposal.status].className}`}
                    >
                      {statusMap[proposal.status].label}
                    </span>
                  </TableCell>
                  <TableCell>{proposal.createdAt}</TableCell>
                  <TableCell>{proposal.validUntil}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/propostas/${proposal.id}`}>
                        <Button variant="ghost" size="sm">
                          Detalhes
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        Imprimir
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
