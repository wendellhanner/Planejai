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

export default function LeadsPage() {
  // Estes seriam dados vindos do banco de dados em uma aplicação real
  const leads = [
    {
      id: "1",
      name: "João Silva",
      email: "joao.silva@exemplo.com",
      phone: "(11) 98765-4321",
      status: "NOVO",
      source: "Site",
      createdAt: "2023-05-15",
    },
    {
      id: "2",
      name: "Maria Oliveira",
      email: "maria.oliveira@exemplo.com",
      phone: "(11) 91234-5678",
      status: "CONTATADO",
      source: "Indicação",
      createdAt: "2023-05-14",
    },
    {
      id: "3",
      name: "Carlos Santos",
      email: "carlos.santos@exemplo.com",
      phone: "(11) 98888-7777",
      status: "EM_NEGOCIACAO",
      source: "Feira",
      createdAt: "2023-05-13",
    },
    {
      id: "4",
      name: "Ana Beatriz",
      email: "ana.beatriz@exemplo.com",
      phone: "(11) 97777-8888",
      status: "CONVERTIDO",
      source: "Instagram",
      createdAt: "2023-05-10",
    },
    {
      id: "5",
      name: "Fernando Pereira",
      email: "fernando.pereira@exemplo.com",
      phone: "(11) 96666-5555",
      status: "NOVO",
      source: "Facebook",
      createdAt: "2023-05-09",
    },
  ];

  // Mapeamento de status para exibição e classes CSS
  const statusMap: Record<string, { label: string; className: string }> = {
    NOVO: {
      label: "Novo",
      className: "bg-blue-100 text-blue-800"
    },
    CONTATADO: {
      label: "Contatado",
      className: "bg-purple-100 text-purple-800"
    },
    EM_NEGOCIACAO: {
      label: "Em Negociação",
      className: "bg-yellow-100 text-yellow-800"
    },
    CONVERTIDO: {
      label: "Convertido",
      className: "bg-green-100 text-green-800"
    },
    PERDIDO: {
      label: "Perdido",
      className: "bg-red-100 text-red-800"
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Leads</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Link href="/leads/cadastrar">
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Lead
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Lista de Leads</CardTitle>
          <CardDescription>
            Gerencia todos os seus leads em um só lugar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${statusMap[lead.status].className}`}
                    >
                      {statusMap[lead.status].label}
                    </span>
                  </TableCell>
                  <TableCell>{lead.source}</TableCell>
                  <TableCell>{lead.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/leads/${lead.id}`}>
                        <Button variant="ghost" size="sm">
                          Detalhes
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        Editar
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
