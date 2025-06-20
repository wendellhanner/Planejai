"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MessageSquare,
  Send,
  Star,
  Lightbulb,
  Bug,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Zap,
  Target,
  Users,
  TrendingUp
} from "lucide-react";
import { useState } from "react";

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState({
    tipo: "",
    categoria: "",
    titulo: "",
    descricao: "",
    rating: 0
  });

  const [feedbackEnviado, setFeedbackEnviado] = useState(false);

  const tiposFeedback = [
    {
      id: "sugestao",
      titulo: "Sugestão de Melhoria",
      descricao: "Compartilhe ideias para melhorar o sistema",
      icon: Lightbulb,
      color: "bg-blue-500"
    },
    {
      id: "bug",
      titulo: "Reportar Problema",
      descricao: "Informe sobre bugs ou problemas técnicos",
      icon: Bug,
      color: "bg-red-500"
    },
    {
      id: "elogio",
      titulo: "Elogio",
      descricao: "Compartilhe o que você gosta no sistema",
      icon: Heart,
      color: "bg-green-500"
    },
    {
      id: "recurso",
      titulo: "Nova Funcionalidade",
      descricao: "Sugira novos recursos e funcionalidades",
      icon: Zap,
      color: "bg-purple-500"
    }
  ];

  const feedbacksRecentes = [
    {
      id: 1,
      usuario: "Ana Silva",
      tipo: "sugestao",
      titulo: "Melhorar filtros do Kanban",
      data: "2 dias atrás",
      status: "em_analise",
      votos: 12
    },
    {
      id: 2,
      usuario: "Carlos Santos",
      tipo: "recurso",
      titulo: "Integração com Google Calendar",
      data: "5 dias atrás",
      status: "planejado",
      votos: 8
    },
    {
      id: 3,
      usuario: "Maria Costa",
      tipo: "elogio",
      titulo: "Interface muito intuitiva!",
      data: "1 semana atrás",
      status: "concluido",
      votos: 15
    }
  ];

  const estatisticas = [
    { label: "Feedbacks Enviados", valor: "347", icone: MessageSquare, cor: "text-blue-600" },
    { label: "Sugestões Implementadas", valor: "89", icone: Target, cor: "text-green-600" },
    { label: "Usuários Ativos", valor: "156", icone: Users, cor: "text-purple-600" },
    { label: "Satisfação Média", valor: "4.8", icone: Star, cor: "text-yellow-600" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular envio do feedback
    setFeedbackEnviado(true);
    setTimeout(() => {
      setFeedbackEnviado(false);
      setFeedback({
        tipo: "",
        categoria: "",
        titulo: "",
        descricao: "",
        rating: 0
      });
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      em_analise: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
      planejado: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
      concluido: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
    };
    return colors[status] || colors.em_analise;
  };

  const getStatusText = (status: string) => {
    const texts: { [key: string]: string } = {
      em_analise: "Em Análise",
      planejado: "Planejado",
      concluido: "Implementado"
    };
    return texts[status] || status;
  };

  if (feedbackEnviado) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <div className="mb-4">
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <ThumbsUp className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Feedback Enviado!
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Obrigado pela sua contribuição! Sua opinião é muito importante para nós.
              </p>
              <div className="space-y-2 text-sm text-slate-500">
                <p>✓ Feedback registrado com sucesso</p>
                <p>✓ Nossa equipe irá analisar sua sugestão</p>
                <p>✓ Você será notificado sobre atualizações</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Enviar Feedback</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Sua opinião nos ajuda a melhorar constantemente o sistema
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {estatisticas.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-800 ${stat.cor}`}>
                  <stat.icone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stat.valor}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de feedback */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Compartilhe seu Feedback</CardTitle>
              <CardDescription>
                Escolha o tipo de feedback e nos conte mais detalhes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tipos de feedback */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Tipo de Feedback</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tiposFeedback.map((tipo) => (
                      <div
                        key={tipo.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          feedback.tipo === tipo.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                        onClick={() => setFeedback(prev => ({ ...prev, tipo: tipo.id }))}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${tipo.color} text-white`}>
                            <tipo.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white">
                              {tipo.titulo}
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              {tipo.descricao}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Avaliação */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Como você avalia nossa plataforma?</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`p-1 ${
                          star <= feedback.rating
                            ? 'text-yellow-500'
                            : 'text-slate-300 hover:text-yellow-400'
                        }`}
                        onClick={() => setFeedback(prev => ({ ...prev, rating: star }))}
                      >
                        <Star className="h-6 w-6 fill-current" />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                      {feedback.rating > 0 && `${feedback.rating}/5`}
                    </span>
                  </div>
                </div>

                {/* Título */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Título</label>
                  <Input
                    placeholder="Resumo do seu feedback"
                    value={feedback.titulo}
                    onChange={(e) => setFeedback(prev => ({ ...prev, titulo: e.target.value }))}
                    required
                  />
                </div>

                {/* Descrição */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Descrição Detalhada</label>
                  <Textarea
                    placeholder="Descreva detalhadamente seu feedback, sugestão ou problema..."
                    rows={6}
                    value={feedback.descricao}
                    onChange={(e) => setFeedback(prev => ({ ...prev, descricao: e.target.value }))}
                    required
                  />
                </div>

                <Button type="submit" className="w-full gap-2" disabled={!feedback.tipo || !feedback.titulo}>
                  <Send className="h-4 w-4" />
                  Enviar Feedback
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Feedbacks recentes */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Feedbacks Recentes
              </CardTitle>
              <CardDescription>
                Veja o que outros usuários estão sugerindo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {feedbacksRecentes.map((item) => (
                <div key={item.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm text-slate-900 dark:text-white">
                      {item.titulo}
                    </h4>
                    <Badge className={`${getStatusColor(item.status)} text-xs`}>
                      {getStatusText(item.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>por {item.usuario}</span>
                    <span>{item.data}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <ThumbsUp className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-slate-600">{item.votos} votos</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Dicas */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Dicas para um bom feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p>Seja específico e detalhado na descrição</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <p>Inclua passos para reproduzir problemas</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <p>Sugira soluções quando possível</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <p>Seja construtivo e respeitoso</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
