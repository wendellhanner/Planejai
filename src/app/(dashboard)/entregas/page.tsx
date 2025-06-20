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
import { PlusCircle, Filter, Download, Calendar } from "lucide-react";

export default function EntregasPage() {
  // Estes seriam dados vindos do banco de dados em uma aplicação real
  const deliveries = [
    {
      id: "1",
      orderNumber: "OP-2023-001",
      client: "João Silva",
      address: "Rua A, 123 - São Paulo, SP",
      status: "AGENDADA",
      scheduledDate: "25/05/2023",
      createdAt: "2023-05-15",
    },
    {
      id: "2",
      orderNumber: "OP-2023-002",
      client: "Maria Oliveira",
      address: "Av. B, 456 - São Paulo, SP",
      status: "EM_TRANSITO",
      scheduledDate: "23/05/2023",
      createdAt: "2023-05-14",
    },
    {
      id: "3",
      orderNumber: "OP-2023-003",
      client: "Carlos Santos",
      address: "Rua C, 789 - São Paulo, SP",
      status: "ENTREGUE",
      scheduledDate: "18/05/2023",
      createdAt: "2023-05-08",
    },
    {
      id: "4",
      orderNumber: "OP-2023-004",
      client: "Ana Beatriz",
      address: "Av. D, 1011 - São Paulo, SP",
      status: "ENTREGUE",
      scheduledDate: "12/05/2023",
      createdAt: "2023-05-01",
    },
    {
      id: "5",
      orderNumber: "OP-2023-005",
      client: "Fernando Pereira",
      address: "Rua E, 1213 - São Paulo, SP",
      status: "CANCELADA",
      scheduledDate: "05/05/2023",
      createdAt: "2023-04-22",
    },
  ];

  // Mapeamento de status para exibição e classes CSS
  const statusMap: Record<string, { label: string; className: string }> = {
    AGENDADA: {
      label: "Agendada",
      className: "bg-yellow-100 text-yellow-800"
    },
    EM_TRANSITO: {
      label: "Em Trânsito",
      className: "bg-blue-100 text-blue-800"
    },
    ENTREGUE: {
      label: "Entregue",
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
        <h1 className="text-3xl font-bold">Entregas</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Calendário
          </Button>
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Agendar Entrega
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Lista de Entregas</CardTitle>
          <CardDescription>
            Gerencie todas as entregas de produtos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ordem</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Agendada</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell className="font-medium">{delivery.orderNumber}</TableCell>
                  <TableCell>{delivery.client}</TableCell>
                  <TableCell>{delivery.address}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${statusMap[delivery.status].className}`}
                    >
                      {statusMap[delivery.status].label}
                    </span>
                  </TableCell>
                  <TableCell>{delivery.scheduledDate}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/entregas/${delivery.id}`}>
                        <Button variant="ghost" size="sm">
                          Detalhes
                        </Button>
                      </Link>
                      {delivery.status === "AGENDADA" && (
                        <Button variant="outline" size="sm">
                          Iniciar
                        </Button>
                      )}
                      {delivery.status === "EM_TRANSITO" && (
                        <Button variant="outline" size="sm">
                          Finalizar
                        </Button>
                      )}
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
