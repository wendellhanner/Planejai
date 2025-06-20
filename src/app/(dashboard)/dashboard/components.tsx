import { Activity, Archive, BarChart3, BellRing, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

// Componente para Dashboard BI
export function DashboardBI() {
  // Dados simulados para os gráficos
  const salesByCategory = [
    { category: "Cozinhas", value: 45 },
    { category: "Dormitórios", value: 30 },
    { category: "Escritórios", value: 15 },
    { category: "Outros", value: 10 },
  ];

  const leadConversionBySource = [
    { source: "Site", conversion: 38 },
    { source: "Indicação", conversion: 65 },
    { source: "Facebook", conversion: 42 },
    { source: "Instagram", conversion: 51 },
    { source: "Google", conversion: 35 },
  ];

  const mostEffectiveDesigners = [
    { name: "Marina Costa", conversions: 78, projects: 12 },
    { name: "Thiago Mendonça", conversions: 65, projects: 9 },
    { name: "Carla Ferreira", conversions: 60, projects: 10 },
  ];

  return (
    <Card className="shadow-sm border-slate-200 dark:border-slate-700 h-full overflow-hidden">
      <CardHeader className="p-4 pb-0 border-b border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold dark:text-white">Dashboard Analytics</CardTitle>
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
            <Activity className="h-3.5 w-3.5 mr-1" />
            <span>Ao vivo</span>
          </Badge>
        </div>
        <CardDescription className="text-slate-500 dark:text-slate-400 pt-1">
          Análise de desempenho e métricas-chave
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-2 gap-0 border-b border-slate-200 dark:border-slate-700">
          <div className="p-4 border-r border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">Vendas por Categoria</h3>
            <div className="h-48 flex items-end justify-between gap-2 mt-2 pt-3 px-2">
              {salesByCategory.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-12 bg-blue-600 dark:bg-blue-500 rounded-t-md relative"
                    style={{ height: `${item.value * 2}px` }}
                  >
                    <div className="absolute -top-6 w-full text-center text-xs font-medium text-slate-700 dark:text-slate-300">
                      {item.value}%
                    </div>
                  </div>
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-1 w-full text-center">
                    {item.category.substring(0, 4)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">Conversão por Canal</h3>
            <div className="space-y-3 mt-2">
              {leadConversionBySource.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{item.source}</span>
                    <span className="text-slate-600 dark:text-slate-400">{item.conversion}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full"
                      style={{ width: `${item.conversion}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-3">Designers com Maior Taxa de Conversão</h3>
          <div className="space-y-2">
            {mostEffectiveDesigners.map((designer, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs font-medium">
                  {designer.name.split(' ').map(name => name[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium dark:text-white">{designer.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {designer.projects} projetos • {designer.conversions}% conversão
                  </div>
                </div>
                <Badge className="bg-emerald-500">Top {index + 1}</Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-0">
        <Link href="/relatorios" className="block w-full">
          <Button variant="ghost" className="w-full rounded-t-none border-t text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 dark:border-slate-700">
            <BarChart3 className="h-4 w-4 mr-2" />
            <span>Ver relatórios completos</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
