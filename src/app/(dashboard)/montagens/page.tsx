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
import { PlusCircle, Filter, Calendar, Camera } from "lucide-react";
import { NPSScoreCard } from "@/components/ui/nps-score-card";

export default function MontagensPage() {
  // Estes seriam dados vindos do banco de dados em uma aplicação real
  const installations = [
    {
      id: "1",
      client: "João Silva",
      address: "Rua A, 123 - São Paulo, SP",
      description: "Cozinha Completa - Modelo Milano",
      status: "AGENDADA",
      scheduledDate: "27/05/2023",
      team: "Equipe A",
    },
    {
      id: "2",
      client: "Maria Oliveira",
      address: "Av. B, 456 - São Paulo, SP",
      description: "Quarto Casal - Pacote Premium",
      status: "EM_ANDAMENTO",
      scheduledDate: "23/05/2023",
      team: "Equipe B",
    },
    {
      id: "3",
      client: "Carlos Santos",
      address: "Rua C, 789 - São Paulo, SP",
      description: "Home Office - Linha Executivo",
      status: "CONCLUIDA",
      scheduledDate: "18/05/2023",
      team: "Equipe A",
    },
    {
      id: "4",
      client: "Ana Beatriz",
      address: "Av. D, 1011 - São Paulo, SP",
      description: "Sala de Estar - Modelo Contemporâneo",
      status: "PENDENCIA",
      scheduledDate: "15/05/2023",
      team: "Equipe C",
    },
    {
      id: "5",
      client: "Fernando Pereira",
      address: "Rua E, 1213 - São Paulo, SP",
      description: "Closet Completo - Linha Luxo",
      status: "CANCELADA",
      scheduledDate: "10/05/2023",
      team: "Equipe B",
    },
  ];

  // Dados de exemplo para a pesquisa NPS
  const npsData = {
    score: 77,
    totalResponses: 142,
    detractors: 12,
    passives: 28,
    promoters: 102,
    recentFeedback: [
      {
        name: "Roberto Almeida",
        comment: "Montagem impecável! Os instaladores foram profissionais, pontuais e deixaram tudo limpo ao final.",
        rating: 10,
        date: "22/05/2025"
      },
      {
        name: "Carla Rodrigues",
        comment: "Quase perfeito, a equipe foi ótima. Só demorou um pouco mais do que o previsto.",
        rating: 8,
        date: "20/05/2025"
      },
      {
        name: "Lucas Martins",
        comment: "Trabalho excelente, montagem muito bem executada. Os montadores foram atenciosos e explicaram todos os detalhes.",
        rating: 10,
        date: "18/05/2025"
      },
      {
        name: "Juliana Costa",
        comment: "Adorei o resultado final, os móveis ficaram exatamente como planejado no projeto.",
        rating: 9,
        date: "15/05/2025"
      }
    ]
  };

  // Mapeamento de status para exibição e classes CSS
  const statusMap: Record<string, { label: string; className: string }> = {
    AGENDADA: {
      label: "Agendada",
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
    PENDENCIA: {
      label: "Pendência",
      className: "bg-orange-100 text-orange-800"
    },
    CANCELADA: {
      label: "Cancelada",
      className: "bg-red-100 text-red-800"
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Montagens</h1>
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
            Agendar Montagem
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Lista de Montagens</CardTitle>
              <CardDescription>
                Gerencie todas as montagens e instalações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Endereço</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data Agendada</TableHead>
                    <TableHead>Equipe</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {installations.map((installation) => (
                    <TableRow key={installation.id}>
                      <TableCell className="font-medium">{installation.client}</TableCell>
                      <TableCell>{installation.description}</TableCell>
                      <TableCell>{installation.address}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${statusMap[installation.status].className}`}
                        >
                          {statusMap[installation.status].label}
                        </span>
                      </TableCell>
                      <TableCell>{installation.scheduledDate}</TableCell>
                      <TableCell>{installation.team}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link href={`/montagens/${installation.id}`}>
                            <Button variant="ghost" size="sm">
                              Detalhes
                            </Button>
                          </Link>
                          {installation.status === "AGENDADA" && (
                            <Button variant="outline" size="sm">
                              Iniciar
                            </Button>
                          )}
                          {installation.status === "EM_ANDAMENTO" && (
                            <Button variant="outline" size="sm">
                              <Camera className="mr-2 h-4 w-4" />
                              Registrar
                            </Button>
                          )}
                          {installation.status === "PENDENCIA" && (
                            <Button variant="outline" size="sm">
                              Resolver
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

        <div>
          <NPSScoreCard
            score={npsData.score}
            totalResponses={npsData.totalResponses}
            detractors={npsData.detractors}
            passives={npsData.passives}
            promoters={npsData.promoters}
            recentFeedback={npsData.recentFeedback}
          />
        </div>
      </div>
    </div>
  );
}
