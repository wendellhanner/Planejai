"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, HelpCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

// Tipo para o guia de funcionalidade
interface FeatureGuide {
  id: string;
  title: string;
  description: string;
  image?: string;
  page: string;
  position: "top" | "right" | "bottom" | "left" | "center";
  element?: string;
  order: number;
}

// Dados de exemplo para guias de funcionalidades
const FEATURE_GUIDES: FeatureGuide[] = [
  {
    id: "dashboard-overview",
    title: "Bem-vindo ao Planej.AI",
    description: "Este é o seu dashboard principal com visão geral de vendas, leads e agendamentos. Aqui você encontra estatísticas e atalhos para as principais funções.",
    page: "/dashboard",
    position: "center",
    order: 1
  },
  {
    id: "theme-toggle",
    title: "Tema Escuro",
    description: "Você pode alternar entre os temas claro e escuro clicando neste botão a qualquer momento.",
    page: "*",
    position: "top",
    element: "[data-theme-toggle]",
    order: 2
  },
  {
    id: "sidebar-collapse",
    title: "Barra Lateral Retrátil",
    description: "Clique aqui para recolher a barra lateral e ter mais espaço para visualizar seu conteúdo.",
    page: "*",
    position: "left",
    element: "[data-sidebar-toggle]",
    order: 3
  },
  {
    id: "kanban-board",
    title: "Kanban Board",
    description: "Gerencie seus leads e projetos facilmente com o quadro Kanban, arrastando e soltando os cartões entre as colunas.",
    page: "/kanban",
    position: "center",
    order: 4
  },
  {
    id: "notifications",
    title: "Notificações",
    description: "Aqui você verá as notificações do sistema, como novos leads, tarefas, mensagens e alertas.",
    page: "*",
    position: "top",
    element: "[data-notifications]",
    order: 5
  }
];

export function OnboardingGuide() {
  const pathname = usePathname();
  const [showGuide, setShowGuide] = useState(false);
  const [showHelpButton, setShowHelpButton] = useState(true);
  const [currentGuideIndex, setCurrentGuideIndex] = useState(0);
  const [guides, setGuides] = useState<FeatureGuide[]>([]);

  // Verificar se é a primeira visita do usuário para mostrar guia
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');

    if (!hasSeenOnboarding) {
      // Só mostra automaticamente na primeira visita
      setShowGuide(true);
      localStorage.setItem('hasSeenOnboarding', 'intro');
    } else if (hasSeenOnboarding === 'intro') {
      // Se já viu a introdução, mas não completou, mostrar botão de ajuda
      setShowHelpButton(true);
    }

    // Filtrar guias relevantes para a página atual
    const relevantGuides = FEATURE_GUIDES.filter((guide) =>
      guide.page === pathname || guide.page === "*"
    ).sort((a, b) => a.order - b.order);

    setGuides(relevantGuides);
  }, [pathname]);

  const handleNext = () => {
    if (currentGuideIndex < guides.length - 1) {
      setCurrentGuideIndex(currentGuideIndex + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentGuideIndex > 0) {
      setCurrentGuideIndex(currentGuideIndex - 1);
    }
  };

  const handleClose = () => {
    setShowGuide(false);
    localStorage.setItem('hasSeenOnboarding', 'completed');
  };

  if (!showGuide) {
    return showHelpButton ? (
      <Button
        variant="outline"
        size="icon"
        className="fixed right-4 bottom-4 z-50 h-10 w-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md"
        onClick={() => setShowGuide(true)}
        aria-label="Mostrar guia"
      >
        <HelpCircle className="h-5 w-5 text-blue-500" />
      </Button>
    ) : null;
  }

  const currentGuide = guides[currentGuideIndex];

  if (!currentGuide) {
    return null;
  }

  // Determinar posição do guia
  const guidePositionClass = {
    center: "fixed inset-0 flex items-center justify-center z-50",
    top: "fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md",
    right: "fixed top-1/2 right-4 -translate-y-1/2 z-50 w-[90%] max-w-md",
    bottom: "fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md",
    left: "fixed top-1/2 left-4 -translate-y-1/2 z-50 w-[90%] max-w-md"
  }[currentGuide.position];

  return (
    <div className={cn(guidePositionClass, "animate-in fade-in duration-300")}>
      <Card className="shadow-lg border-slate-200 dark:border-slate-700 max-w-lg">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold dark:text-white flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              {currentGuide.title}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Passo {currentGuideIndex + 1} de {guides.length}
          </CardDescription>
        </CardHeader>
        <CardContent className="py-4">
          <p className="text-sm dark:text-slate-300">
            {currentGuide.description}
          </p>
          {currentGuide.image && (
            <div className="mt-4 rounded-md overflow-hidden border border-slate-200 dark:border-slate-700">
              <img
                src={currentGuide.image}
                alt={currentGuide.title}
                className="w-full h-auto"
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between pt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentGuideIndex === 0}
            className="gap-1 dark:border-slate-700 dark:bg-slate-800"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Anterior</span>
          </Button>
          <Button
            variant={currentGuideIndex === guides.length - 1 ? "default" : "outline"}
            size="sm"
            onClick={handleNext}
            className="gap-1"
          >
            <span>{currentGuideIndex === guides.length - 1 ? "Concluir" : "Próximo"}</span>
            {currentGuideIndex < guides.length - 1 && <ChevronRight className="h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
