"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, BarChart, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface NPSScoreCardProps {
  className?: string;
  score: number;
  totalResponses: number;
  detractors: number;
  passives: number;
  promoters: number;
  recentFeedback?: {
    name: string;
    comment: string;
    rating: number;
    date: string;
  }[];
}

export function NPSScoreCard({
  className = "",
  score,
  totalResponses,
  detractors,
  passives,
  promoters,
  recentFeedback = []
}: NPSScoreCardProps) {
  const [expanded, setExpanded] = useState(false);

  // Calculate percentages
  const detractorsPercentage = (detractors / totalResponses) * 100;
  const passivesPercentage = (passives / totalResponses) * 100;
  const promotersPercentage = (promoters / totalResponses) * 100;

  // Determine NPS category
  const getNPSCategory = (score: number) => {
    if (score >= 70) return { label: "Excelente", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 hover:bg-emerald-200" };
    if (score >= 50) return { label: "Muito Bom", className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-200" };
    if (score >= 30) return { label: "Bom", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200" };
    if (score >= 0) return { label: "Razoável", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 hover:bg-yellow-200" };
    return { label: "Precisa Melhorar", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-200" };
  };

  const category = getNPSCategory(score);

  return (
    <Card className={`border-slate-200 dark:border-slate-800 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <ThumbsUp className="h-5 w-5 text-emerald-500" />
          <span>Pesquisa NPS - Satisfação do Cliente</span>
        </CardTitle>
        <Badge className={category.className}>
          {category.label}
        </Badge>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-6">
          {/* NPS Score Display */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-md">
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {score}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                <div>Net Promoter Score</div>
                <div className="text-xs">Baseado em {totalResponses} respostas</div>
              </div>
            </div>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(score / 20)
                      ? "text-amber-400"
                      : "text-slate-300 dark:text-slate-600"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>

          {/* NPS Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium flex items-center gap-1.5">
                <BarChart className="h-4 w-4 text-slate-400" />
                <span>Distribuição das Avaliações</span>
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-xs">
                NPS = % Promotores - % Detratores
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-red-600 dark:text-red-400">Detratores (0-6)</span>
                <span>{detractorsPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={detractorsPercentage} className="h-2 bg-slate-200 dark:bg-slate-700" indicatorClassName="bg-red-500" />

              <div className="flex items-center justify-between text-sm">
                <span className="text-yellow-600 dark:text-yellow-400">Neutros (7-8)</span>
                <span>{passivesPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={passivesPercentage} className="h-2 bg-slate-200 dark:bg-slate-700" indicatorClassName="bg-yellow-500" />

              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-600 dark:text-emerald-400">Promotores (9-10)</span>
                <span>{promotersPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={promotersPercentage} className="h-2 bg-slate-200 dark:bg-slate-700" indicatorClassName="bg-emerald-500" />
            </div>
          </div>

          {/* Recent Feedback */}
          {recentFeedback && recentFeedback.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span>Comentários Recentes</span>
                </h3>
                <button
                  className="text-xs text-blue-600 dark:text-blue-400"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? "Mostrar menos" : "Ver todos"}
                </button>
              </div>

              <div className="space-y-3">
                {recentFeedback.slice(0, expanded ? undefined : 2).map((feedback, index) => (
                  <div key={index} className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-md">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-sm">{feedback.name}</div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.round(feedback.rating / 2)
                                  ? "text-amber-400"
                                  : "text-slate-300 dark:text-slate-600"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {feedback.date}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      "{feedback.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
