"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  HelpCircle,
  Search,
  Book,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Video,
  Users,
  Lightbulb,
  ChevronRight,
  Send
} from "lucide-react";
import { useState } from "react";

export default function AjudaPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const categorias = [
    {
      title: "Primeiros Passos",
      icon: Lightbulb,
      color: "text-blue-600",
      artigos: [
        { titulo: "Como começar a usar o sistema", tempo: "5 min", popular: true },
        { titulo: "Configuração inicial da conta", tempo: "3 min", popular: false },
        { titulo: "Navegando pela interface", tempo: "7 min", popular: true },
        { titulo: "Criando seu primeiro projeto", tempo: "10 min", popular: false }
      ]
    },
    {
      title: "Gestão de Projetos",
      icon: FileText,
      color: "text-green-600",
      artigos: [
        { titulo: "Como criar e gerenciar projetos", tempo: "8 min", popular: true },
        { titulo: "Kanban: organizando fluxo de trabalho", tempo: "12 min", popular: true },
        { titulo: "Definindo prazos e entregas", tempo: "6 min", popular: false },
        { titulo: "Acompanhamento de progresso", tempo: "4 min", popular: false }
      ]
    }
  ];

  const faqItems = [
    {
      pergunta: "Como resetar minha senha?",
      resposta: "Vá para a página de login e clique em 'Esqueci minha senha'. Você receberá um email com instruções."
    },
    {
      pergunta: "Posso integrar com outros sistemas?",
      resposta: "Sim, oferecemos APIs REST para integração com ERPs, sistemas de pagamento e outras ferramentas."
    },
    {
      pergunta: "Existe limite de usuários?",
      resposta: "O limite varia conforme seu plano. Consulte a página de faturamento para mais detalhes."
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Central de Ajuda</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Encontre respostas, tutoriais e entre em contato com nosso suporte
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
            <Input
              placeholder="Busque por artigos, tutoriais ou dúvidas..."
              className="pl-10 h-12 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="artigos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="artigos">Base de Conhecimento</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contato">Contato</TabsTrigger>
        </TabsList>

        <TabsContent value="artigos" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {categorias.map((categoria, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-800 ${categoria.color}`}>
                      <categoria.icon className="h-5 w-5" />
                    </div>
                    {categoria.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {categoria.artigos.map((artigo, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Book className="h-4 w-4 text-slate-500" />
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {artigo.titulo}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-500">{artigo.tempo} de leitura</span>
                            {artigo.popular && (
                              <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                                Popular
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Perguntas Frequentes</CardTitle>
              <CardDescription>
                Respostas para as dúvidas mais comuns dos nossos usuários
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-blue-600" />
                    {item.pergunta}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 pl-6">
                    {item.resposta}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contato" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-blue-500 text-white">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Chat ao Vivo
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Fale conosco em tempo real
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Seg-Sex, 8h-18h
                  </p>
                  <Button className="w-full">
                    Iniciar Chat
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-green-500 text-white">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Email Suporte
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Envie sua dúvida por email
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Resposta em até 24h
                  </p>
                  <Button className="w-full">
                    Enviar Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Envie uma Mensagem</CardTitle>
              <CardDescription>
                Descreva seu problema e entraremos em contato
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Seu nome" />
                <Input placeholder="Seu email" />
              </div>
              <Input placeholder="Assunto" />
              <Textarea
                placeholder="Descreva sua dúvida ou problema..."
                rows={4}
              />
              <Button className="w-full gap-2">
                <Send className="h-4 w-4" />
                Enviar Mensagem
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
