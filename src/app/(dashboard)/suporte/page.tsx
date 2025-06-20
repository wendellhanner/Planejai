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
import { PlusCircle, Filter, MessagesSquare } from "lucide-react";

export default function SuportePage() {
  // Estes seriam dados vindos do banco de dados em uma aplicação real
  const tickets = [
    {
      id: "1",
      title: "Porta do armário com problema de fechamento",
      client: "João Silva",
      status: "ABERTO",
      priority: "MEDIA",
      openedAt: "22/05/2023",
      assignedTo: "Paulo Técnico",
    },
    {
      id: "2",
      title: "Gaveta com trilho desalinhado",
      client: "Maria Oliveira",
      status: "EM_ATENDIMENTO",
      priority: "ALTA",
      openedAt: "20/05/2023",
      assignedTo: "Carlos Técnico",
    },
    {
      id: "3",
      title: "Acabamento da mesa com imperfeição",
      client: "Carlos Santos",
      status: "RESOLVIDO",
      priority: "BAIXA",
      openedAt: "15/05/2023",
      assignedTo: "Paulo Técnico",
    },
    {
      id: "4",
      title: "Prateleira quebrada durante o uso",
      client: "Ana Beatriz",
      status: "FECHADO",
      priority: "MEDIA",
      openedAt: "10/05/2023",
      assignedTo: "Carlos Técnico",
    },
    {
      id: "5",
      title: "Dobradiça da porta do guarda-roupa solta",
      client: "Fernando Pereira",
      status: "REABERTO",
      priority: "URGENTE",
      openedAt: "05/05/2023",
      assignedTo: "Não atribuído",
    },
  ];

  // Mapeamento de status para exibição e classes CSS
  const statusMap: Record<string, { label: string; className: string }> = {
    ABERTO: {
      label: "Aberto",
      className: "bg-yellow-100 text-yellow-800"
    },
    EM_ATENDIMENTO: {
      label: "Em Atendimento",
      className: "bg-blue-100 text-blue-800"
    },
    RESOLVIDO: {
      label: "Resolvido",
      className: "bg-green-100 text-green-800"
    },
    FECHADO: {
      label: "Fechado",
      className: "bg-gray-100 text-gray-800"
    },
    REABERTO: {
      label: "Reaberto",
      className: "bg-red-100 text-red-800"
    },
  };

  // Mapeamento de prioridade para exibição e classes CSS
  const priorityMap: Record<string, { label: string; className: string }> = {
    BAIXA: {
      label: "Baixa",
      className: "bg-green-100 text-green-800"
    },
    MEDIA: {
      label: "Média",
      className: "bg-yellow-100 text-yellow-800"
    },
    ALTA: {
      label: "Alta",
      className: "bg-orange-100 text-orange-800"
    },
    URGENTE: {
      label: "Urgente",
      className: "bg-red-100 text-red-800"
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Suporte ao Cliente</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Chamado
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Chamados de Suporte</CardTitle>
          <CardDescription>
            Gerencie todos os chamados de suporte e pós-venda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Aberto em</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.title}</TableCell>
                  <TableCell>{ticket.client}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${statusMap[ticket.status].className}`}
                    >
                      {statusMap[ticket.status].label}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${priorityMap[ticket.priority].className}`}
                    >
                      {priorityMap[ticket.priority].label}
                    </span>
                  </TableCell>
                  <TableCell>{ticket.openedAt}</TableCell>
                  <TableCell>{ticket.assignedTo}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/suporte/${ticket.id}`}>
                        <Button variant="ghost" size="sm">
                          Detalhes
                        </Button>
                      </Link>
                      {(ticket.status === "ABERTO" || ticket.status === "REABERTO") && (
                        <Button variant="outline" size="sm">
                          Atender
                        </Button>
                      )}
                      {ticket.status === "EM_ATENDIMENTO" && (
                        <Button variant="outline" size="sm">
                          <MessagesSquare className="mr-2 h-4 w-4" />
                          Responder
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
