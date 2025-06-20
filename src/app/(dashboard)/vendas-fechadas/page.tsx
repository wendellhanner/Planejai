"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Download,
  Search,
  ChevronDown,
  ChevronRight,
  Printer,
  Calendar,
  DollarSign,
  BadgeCheck,
  Filter,
  Clock,
  ArrowUpRight,
  BarChart4,
  Calculator,
} from "lucide-react";
import { KPIsVendas } from "./components/kpis-vendas";
import { InsightsIA } from "./components/insights-ia";
import { DesempenhoVendedores } from "./components/desempenho-vendedores";
import { Badge } from "@/components/ui/badge";
import { AnalisePerformance } from "./components/analise-performance";

// Dados simulados para vendas fechadas
const vendasFechadas = [
  {
    id: "VF-2025-001",
    cliente: "João Silva",
    projeto: "Cozinha + Sala",
    valor: 42850.0,
    dataFechamento: "15/05/2025",
    vendedor: "Carlos Mendes",
    prazoEntrega: "30/06/2025",
    status: "Em produção",
    formaPagamento: "50% entrada + 5x",
  },
  {
    id: "VF-2025-002",
    cliente: "Maria Oliveira",
    projeto: "Closet Master",
    valor: 28750.0,
    dataFechamento: "10/05/2025",
    vendedor: "Ana Costa",
    prazoEntrega: "22/06/2025",
    status: "Aguardando material",
    formaPagamento: "40% entrada + 6x",
  },
  {
    id: "VF-2025-003",
    cliente: "Pedro Santos",
    projeto: "Home Office Completo",
    valor: 18500.0,
    dataFechamento: "05/05/2025",
    vendedor: "Carlos Mendes",
    prazoEntrega: "15/06/2025",
    status: "Em produção",
    formaPagamento: "À vista",
  },
  {
    id: "VF-2025-004",
    cliente: "Fernanda Lima",
    projeto: "Cozinha Planejada",
    valor: 54200.0,
    dataFechamento: "02/05/2025",
    vendedor: "Ana Costa",
    prazoEntrega: "10/06/2025",
    status: "Em produção",
    formaPagamento: "30% entrada + 10x",
  },
  {
    id: "VF-2025-005",
    cliente: "Lucas Mendes",
    projeto: "Quarto Casal Completo",
    valor: 32400.0,
    dataFechamento: "28/04/2025",
    vendedor: "Roberto Alves",
    prazoEntrega: "05/06/2025",
    status: "Pronto para entrega",
    formaPagamento: "50% entrada + 4x",
  },
  {
    id: "VF-2025-006",
    cliente: "Camila Ferreira",
    projeto: "Móveis para Escritório",
    valor: 62700.0,
    dataFechamento: "25/04/2025",
    vendedor: "Carlos Mendes",
    prazoEntrega: "01/06/2025",
    status: "Pronto para entrega",
    formaPagamento: "40% entrada + 12x",
  },
  {
    id: "VF-2025-007",
    cliente: "Thiago Costa",
    projeto: "Móveis para Apartamento",
    valor: 87500.0,
    dataFechamento: "20/04/2025",
    vendedor: "Ana Costa",
    prazoEntrega: "28/05/2025",
    status: "Entregue",
    formaPagamento: "30% entrada + 15x",
  },
  {
    id: "VF-2025-008",
    cliente: "Juliana Almeida",
    projeto: "Sala de Estar e Jantar",
    valor: 45800.0,
    dataFechamento: "15/04/2025",
    vendedor: "Roberto Alves",
    prazoEntrega: "25/05/2025",
    status: "Entregue",
    formaPagamento: "À vista",
  },
];

// Função para formatar valores monetários
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export default function VendasFechadasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVendas, setFilteredVendas] = useState(vendasFechadas);
  const [showInsights, setShowInsights] = useState(true);

  // Função para filtrar vendas
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredVendas(vendasFechadas);
    } else {
      setFilteredVendas(
        vendasFechadas.filter(
          (venda) =>
            venda.cliente.toLowerCase().includes(term) ||
            venda.id.toLowerCase().includes(term) ||
            venda.projeto.toLowerCase().includes(term) ||
            venda.vendedor.toLowerCase().includes(term)
        )
      );
    }
  };

  // Cálculo de estatísticas
  const totalVendas = vendasFechadas.length;
  const valorTotal = vendasFechadas.reduce((acc, venda) => acc + venda.valor, 0);
  const mediaVendas = valorTotal / totalVendas;
  const vendasEmProducao = vendasFechadas.filter(
    (venda) => venda.status === "Em produção"
  ).length;
  const vendaEntregue = vendasFechadas.filter(
    (venda) => venda.status === "Entregue"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">
            Vendas Fechadas
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie e acompanhe todas as vendas finalizadas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1"
            onClick={() => setShowInsights(!showInsights)}
          >
            <BarChart4 className="h-3.5 w-3.5" />
            <span>{showInsights ? "Ocultar insights" : "Mostrar insights"}</span>
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-3.5 w-3.5" />
            <span>Filtros</span>
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Download className="h-3.5 w-3.5" />
            <span>Exportar</span>
          </Button>
          <Button size="sm" className="h-8 gap-1">
            <BarChart4 className="h-3.5 w-3.5" />
            <span>Relatório</span>
          </Button>
        </div>
      </div>

      {/* KPIs de Vendas */}
      <KPIsVendas />

      {/* Seção de insights - condicionalmente renderizada */}
      {showInsights && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <InsightsIA vendas={vendasFechadas} />
            <DesempenhoVendedores />
          </div>
          <AnalisePerformance />
        </div>
      )}

      {/* Pesquisa e Tabela */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Lista de Vendas Fechadas</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar vendas..."
                className="w-full pl-8 h-9"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
          <CardDescription>
            Visualize todos os projetos vendidos e seu status atual.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Projeto</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Vendedor</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendas.map((venda) => (
                  <TableRow key={venda.id}>
                    <TableCell className="font-medium">{venda.id}</TableCell>
                    <TableCell>{venda.cliente}</TableCell>
                    <TableCell>{venda.projeto}</TableCell>
                    <TableCell>{formatCurrency(venda.valor)}</TableCell>
                    <TableCell>{venda.dataFechamento}</TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                          venda.status === "Em produção"
                            ? "border-blue-200 bg-blue-100 text-blue-800"
                            : venda.status === "Pronto para entrega"
                            ? "border-amber-200 bg-amber-100 text-amber-800"
                            : venda.status === "Entregue"
                            ? "border-green-200 bg-green-100 text-green-800"
                            : "border-slate-200 bg-slate-100 text-slate-800"
                        }`}
                      >
                        {venda.status}
                      </div>
                    </TableCell>
                    <TableCell>{venda.vendedor}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Printer className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <FileText className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
