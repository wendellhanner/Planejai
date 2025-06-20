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
import { Filter, Download } from "lucide-react";

export default function ProducaoPage() {
  // Estes seriam dados vindos do banco de dados em uma aplicação real
  const productionOrders = [
    {
      id: "1",
      orderNumber: "OP-2023-001",
      client: "João Silva",
      description: "Cozinha Completa - Modelo Milano",
      status: "AGUARDANDO",
      startDate: "-",
      endDate: "-",
      createdAt: "2023-05-15",
    },
    {
      id: "2",
      orderNumber: "OP-2023-002",
      client: "Maria Oliveira",
      description: "Quarto Casal - Pacote Premium",
      status: "EM_PRODUCAO",
      startDate: "2023-05-16",
      endDate: "2023-05-25",
      createdAt: "2023-05-14",
    },
    {
      id: "3",
      orderNumber: "OP-2023-003",
      client: "Carlos Santos",
      description: "Home Office - Linha Executivo",
      status: "PRODUZIDO",
      startDate: "2023-05-10",
      endDate: "2023-05-18",
      createdAt: "2023-05-08",
    },
    {
      id: "4",
      orderNumber: "OP-2023-004",
      client: "Ana Beatriz",
      description: "Sala de Estar - Modelo Contemporâneo",
      status: "FINALIZADO",
      startDate: "2023-05-02",
      endDate: "2023-05-12",
      createdAt: "2023-05-01",
    },
    {
      id: "5",
      orderNumber: "OP-2023-005",
      client: "Fernando Pereira",
      description: "Closet Completo - Linha Luxo",
      status: "CANCELADO",
      startDate: "2023-04-25",
      endDate: "-",
      createdAt: "2023-04-22",
    },
  ];

  // Mapeamento de status para exibição e classes CSS
  const statusMap: Record<string, { label: string; className: string }> = {
    AGUARDANDO: {
      label: "Aguardando",
      className: "bg-yellow-100 text-yellow-800"
    },
    EM_PRODUCAO: {
      label: "Em Produção",
      className: "bg-blue-100 text-blue-800"
    },
    PRODUZIDO: {
      label: "Produzido",
      className: "bg-green-100 text-green-800"
    },
    FINALIZADO: {
      label: "Finalizado",
      className: "bg-purple-100 text-purple-800"
    },
    CANCELADO: {
      label: "Cancelado",
      className: "bg-red-100 text-red-800"
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Produção</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Ordens de Produção</CardTitle>
          <CardDescription>
            Acompanhe o status de todas as ordens de produção
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Término</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productionOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{order.client}</TableCell>
                  <TableCell>{order.description}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${statusMap[order.status].className}`}
                    >
                      {statusMap[order.status].label}
                    </span>
                  </TableCell>
                  <TableCell>{order.startDate}</TableCell>
                  <TableCell>{order.endDate}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/producao/${order.id}`}>
                        <Button variant="ghost" size="sm">
                          Detalhes
                        </Button>
                      </Link>
                      {order.status === "PRODUZIDO" && (
                        <Button variant="outline" size="sm">
                          Finalizar
                        </Button>
                      )}
                      {order.status === "AGUARDANDO" && (
                        <Button variant="outline" size="sm">
                          Iniciar
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
