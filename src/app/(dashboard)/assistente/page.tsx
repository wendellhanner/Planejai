"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  BrainCircuit, Send, MessageCircle, FileText, Database, Calendar,
  Bot, Sparkles, ClipboardCheck, Clock, AlertTriangle
} from "lucide-react";

// Mensagens pré-configuradas para sugestões
const suggestedPrompts = [
  "Gerar uma proposta para cozinha planejada",
  "Calcular melhor layout para closet 3x2m",
  "Comparar materiais para móveis de banheiro",
  "Criar cronograma de produção para o mês",
  "Analisar vendas por região",
  "Sugerir estratégias para novos leads",
];

// Exemplos de histórico de chat para demonstração
const chatHistory = [
  { id: 1, date: "Hoje", title: "Análise de dados de vendas Q1", prompt: "Analisar vendas do último trimestre e identificar tendências" },
  { id: 2, date: "Ontem", title: "Proposta comercial para cliente VIP", prompt: "Gerar proposta para reforma completa de apartamento" },
  { id: 3, date: "21/05", title: "Otimização de layout de closet", prompt: "Sugerir o melhor layout para closet 2.5x3m" },
  { id: 4, date: "18/05", title: "Comparação de materiais", prompt: "Comparar custo-benefício entre MDF e MDP para móveis de cozinha" },
];

// Exemplos de modelos para demonstração
const aiModels = [
  { id: "assistant-default", name: "Assistente Padrão", description: "Recomendado para a maioria das tarefas" },
  { id: "assistant-pro", name: "PlanejadoAI Pro", description: "Otimizado para design e cálculos avançados" },
  { id: "assistant-creative", name: "Assistente Criativo", description: "Ideal para ideias inovadoras e estilos únicos" },
];

// Componente de mensagem do assistente
function AIMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 mb-4">
      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
        <Bot className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1 bg-slate-100 p-3 rounded-lg rounded-tl-none">
        <div className="prose prose-slate prose-sm max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
}

// Componente de mensagem do usuário
function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 mb-4 justify-end">
      <div className="flex-1 bg-blue-500 text-white p-3 rounded-lg rounded-tr-none max-w-[80%]">
        <p className="m-0">{children}</p>
      </div>
    </div>
  );
}

export default function AssistentePage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [selectedModel, setSelectedModel] = useState("assistant-pro");
  const [messages, setMessages] = useState<{
    id: string;
    content: string;
    role: "user" | "assistant";
    timestamp: Date;
  }[]>([
    {
      id: "welcome-message",
      content: "Olá! Sou o assistente IA PlanejMóveis. Como posso ajudar você hoje? Posso auxiliar com design de móveis, orçamentos, cálculos de materiais, sugestões de acabamentos e muito mais.",
      role: "assistant",
      timestamp: new Date()
    }
  ]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const chatContainerRef = React.useRef<HTMLDivElement>(null);

  // Funções para gerar IDs únicos
  const generateId = () => `id-${Math.random().toString(36).substr(2, 9)}`;

  // Efeito para rolagem automática das mensagens
  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) return;

    // Adicionar mensagem do usuário
    const userMessageId = generateId();
    const userMessage = {
      id: userMessageId,
      content: prompt,
      role: "user" as const,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setPrompt("");
    setIsGenerating(true);

    // Simular resposta da IA após um tempo
    setTimeout(() => {
      // Gerar resposta com base na pergunta
      let aiResponse = "";

      if (prompt.toLowerCase().includes("cozinha")) {
        aiResponse = "Para um projeto de cozinha planejada, recomendo considerar os seguintes aspectos:\n\n1. **Layout funcional**: O triângulo de trabalho (fogão, pia e geladeira) deve ser eficiente, com distâncias entre 1,2m e 2,7m entre cada ponto.\n\n2. **Materiais**: Para regiões úmidas, o MDF com revestimento melamínico é mais indicado pela resistência à umidade.\n\n3. **Altura das bancadas**: O ideal é entre 85cm e 95cm, dependendo da altura do usuário principal.\n\n4. **Espaço de circulação**: Mantenha no mínimo 1,2m entre bancadas opostas.\n\nPosso criar um orçamento detalhado se você fornecer as medidas do ambiente.";
      } else if (prompt.toLowerCase().includes("closet") || prompt.toLowerCase().includes("guarda-roupa")) {
        aiResponse = "Para um closet ou guarda-roupa otimizado, considere:\n\n1. **Divisão eficiente**: Reserve aproximadamente 70% para cabides (1m de altura para camisas, 1,2m para casacos) e 30% para gavetas e prateleiras.\n\n2. **Profundidade ideal**: 60cm para cabides, 45cm para prateleiras de roupas dobradas.\n\n3. **Iluminação**: Instale LEDs em perfis de alumínio nas prateleiras superiores e sensores de presença para acionamento automático.\n\n4. **Organização interna**: Utilize divisores de gavetas, cabideiros extensíveis e sapateiras deslizantes.\n\nPosso desenvolver um projeto personalizado com base nas dimensões do seu espaço.";
      } else if (prompt.toLowerCase().includes("material") || prompt.toLowerCase().includes("mdf")) {
        aiResponse = "**Comparativo de materiais para móveis planejados:**\n\n**MDF (Medium Density Fiberboard)**\n✓ Excelente acabamento\n✓ Boa estabilidade dimensional\n✓ Resistência moderada à umidade (na versão verde/hidrófugo)\n✓ Ideal para: Portas, gavetas e peças com usinagens\n× Custo: Médio-alto\n\n**MDP (Medium Density Particleboard)**\n✓ Bom custo-benefício\n✓ Alta resistência ao peso\n✓ Superfície uniforme\n✓ Ideal para: Prateleiras, laterais e fundos\n× Menor resistência à umidade\n\n**Compensado Naval**\n✓ Alta resistência à umidade\n✓ Durabilidade superior\n✓ Excelente sustentação de peso\n✓ Ideal para: Áreas externas ou muito úmidas\n× Custo: Alto\n\nPara seu projeto específico, posso recomendar a combinação ideal destes materiais.";
      } else if (prompt.toLowerCase().includes("cronograma") || prompt.toLowerCase().includes("prazo")) {
        aiResponse = "**Cronograma típico para projeto de móveis planejados:**\n\n1. **Medição inicial**: 1 dia útil após aprovação\n2. **Projeto e design**: 3-5 dias úteis\n3. **Revisões e ajustes**: 2-3 dias úteis\n4. **Aprovação final**: Depende do cliente\n5. **Produção**: 15-20 dias úteis\n6. **Entrega**: 1-2 dias úteis\n7. **Instalação**: 1-3 dias úteis (dependendo da complexidade)\n\nPrazo total médio: 25-35 dias úteis desde a aprovação até a instalação completa.\n\nDeseja que eu prepare um cronograma personalizado para seu projeto específico?";
      } else if (prompt.toLowerCase().includes("venda") || prompt.toLowerCase().includes("estratégia")) {
        aiResponse = "**Estratégias para aumento de vendas de móveis planejados:**\n\n1. **Marketing digital focalizado**:\n   - Anúncios segmentados por estilo de vida e momento de vida (recém-casados, mudança de casa)\n   - Remarketing para visitantes do site que não converteram\n\n2. **Parcerias estratégicas**:\n   - Arquitetos e designers de interiores (comissão de 8-10%)\n   - Construtoras e imobiliárias para apartamentos novos\n\n3. **Show-rooms interativos**:\n   - Ambientes completos com realidade aumentada\n   - Demonstrações de funcionamento de ferragens e acessórios\n\n4. **Programas de indicação**:\n   - Desconto de 5% para clientes que indicarem novos clientes\n   - Benefícios exclusivos para clientes recorrentes\n\nPosso desenvolver um plano detalhado específico para seu negócio.";
      } else {
        aiResponse = "Entendi sua solicitação. Para ajudar de forma mais eficiente, preciso de algumas informações adicionais:\n\n1. Quais são as dimensões do espaço onde você deseja instalar os móveis?\n2. Qual é o estilo de design de sua preferência (moderno, clássico, contemporâneo, industrial)?\n3. Existe alguma restrição de orçamento que devemos considerar?\n4. Há alguma necessidade específica de armazenamento ou funcionalidade?\n\nCom estas informações, posso fornecer recomendações personalizadas e um orçamento estimado para seu projeto. Também posso gerar visualizações 3D preliminares para ajudar na sua decisão.";
      }

      const aiMessageId = generateId();
      const aiMessage = {
        id: aiMessageId,
        content: aiResponse,
        role: "assistant" as const,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsGenerating(false);
    }, 2500);
  };

  const handleSuggestedPrompt = (suggestion: string) => {
    setPrompt(suggestion);
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2 mb-0.5">
            <BrainCircuit className="h-6 w-6 text-blue-500" />
            Assistente IA
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            O assistente inteligente que ajuda a criar propostas, designs e análises para seus projetos de móveis planejados
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 text-amber-700 dark:text-amber-300 px-3 py-1.5 rounded-full border border-amber-200 dark:border-amber-800/40">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium whitespace-nowrap">25 créditos</span>
              <span className="text-xs text-amber-600 dark:text-amber-400 opacity-70">/ 30</span>
            </div>
          </div>
          <Button size="sm" variant="outline" className="h-9 gap-1.5 hidden md:flex">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
              <circle cx="11.5" cy="14.5" r="2.5"/>
              <path d="M13.77 17.27A5.5 5.5 0 1 0 7.73 11.23"/>
            </svg>
            Nova conversa
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <TabsList className="h-9 p-1">
            <TabsTrigger value="chat" className="rounded-md h-7 px-3 text-xs">
              <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="templates" className="rounded-md h-7 px-3 text-xs">
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-md h-7 px-3 text-xs">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              Histórico
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              className="h-9 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500/30 px-3 py-1 focus:outline-none min-w-[200px]"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="assistant-default">Assistente Padrão</option>
              <option value="assistant-pro">PlanejadoAI Pro</option>
              <option value="assistant-creative">Assistente Criativo</option>
            </select>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </Button>
          </div>
        </div>

        <TabsContent value="chat" className="space-y-6 mt-2">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card className="border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <BrainCircuit className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-slate-900 dark:text-white">Conversa com PlanejadoAI Pro</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Modelo otimizado para móveis planejados</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 12h16"/>
                        <path d="M4 18h16"/>
                        <path d="M4 6h16"/>
                      </svg>
                    </Button>
                  </div>
                </div>
                <div className="flex-1 flex flex-col h-[600px]">
                  <div
                    className="flex-1 overflow-auto p-6 space-y-6"
                    ref={chatContainerRef}
                  >
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : ''} group`}
                      >
                        {message.role === 'assistant' && (
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                            <BrainCircuit className="h-4 w-4 text-white" />
                          </div>
                        )}

                        <div className={`
                          relative max-w-[80%] px-4 py-3 rounded-xl shadow-sm group
                          ${message.role === 'user'
                            ? 'bg-blue-600 text-white rounded-tr-none ml-12'
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-tl-none text-slate-700 dark:text-slate-200'}
                        `}>
                          <div className="whitespace-pre-line prose prose-sm max-w-none dark:prose-invert">
                            {message.content.split('\n').map((paragraph, i) => {
                              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                                // Título em negrito
                                return <h4 key={i} className="font-bold mt-2 mb-1">{paragraph.replace(/\*\*/g, '')}</h4>;
                              } else if (paragraph.startsWith('- ') || paragraph.startsWith('• ')) {
                                // Item de lista
                                return <li key={i} className="ml-5">{paragraph.substring(2)}</li>;
                              } else if (paragraph.match(/^\d+\.\s/)) {
                                // Item numerado
                                return <div key={i} className="ml-5">{paragraph}</div>;
                              } else if (paragraph.startsWith('✓ ') || paragraph.startsWith('× ')) {
                                // Prós e contras
                                return <div key={i} className={`ml-5 ${paragraph.startsWith('✓') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{paragraph}</div>;
                              } else {
                                return paragraph ? <p key={i} className="my-1">{paragraph}</p> : <br key={i} />;
                              }
                            })}
                          </div>

                          <div className="absolute bottom-1 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                            {formatMessageTime(message.timestamp)}
                            {message.role === 'user' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-0.5">
                                <path d="M20 6L9 17l-5-5"/>
                              </svg>
                            ) : (
                              <Button variant="ghost" size="sm" className="h-5 w-5 p-0 rounded-full ml-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
                                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                                </svg>
                              </Button>
                            )}
                          </div>
                        </div>

                        {message.role === 'user' && (
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 dark:text-slate-300">
                              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                              <circle cx="12" cy="7" r="4"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}

                    {isGenerating && (
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                          <BrainCircuit className="h-4 w-4 text-white" />
                        </div>
                        <div className="max-w-[80%] px-4 py-3 rounded-xl rounded-tl-none shadow-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          <div className="flex space-x-2 items-center h-5">
                            <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <form onSubmit={handlePromptSubmit} className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          placeholder="Digite sua pergunta ou solicitação..."
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          disabled={isGenerating}
                          className="pr-10 h-10 border-slate-300 dark:border-slate-600 text-base"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <Button type="button" variant="ghost" size="icon" className="h-6 w-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                              <path d="m21 15-9-9-9 9"/>
                              <path d="M3 15v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/>
                              <path d="M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6"/>
                            </svg>
                          </Button>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="h-10 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-4"
                        disabled={isGenerating || !prompt.trim()}
                      >
                        {isGenerating ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Gerando</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            <span>Enviar</span>
                          </>
                        )}
                      </Button>
                    </form>

                    <div className="mt-3 text-xs text-center text-slate-400 dark:text-slate-500">
                      As repostas do PlanejadoAI Pro são baseadas em conhecimento do setor de móveis planejados.
                      Verifique sempre as informações antes de tomar decisões de negócio.
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Ferramentas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="h-auto py-2 justify-start text-left" size="sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 mr-2">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                        <path d="M9 9h6v6H9z"/>
                      </svg>
                      Gerar imagem
                    </Button>
                    <Button variant="outline" className="h-auto py-2 justify-start text-left" size="sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 mr-2">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                      Criar PDF
                    </Button>
                    <Button variant="outline" className="h-auto py-2 justify-start text-left" size="sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 mr-2">
                        <rect x="3" y="3" width="7" height="7"/>
                        <rect x="14" y="3" width="7" height="7"/>
                        <rect x="14" y="14" width="7" height="7"/>
                        <rect x="3" y="14" width="7" height="7"/>
                      </svg>
                      Criar planilha
                    </Button>
                    <Button variant="outline" className="h-auto py-2 justify-start text-left" size="sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 mr-2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      Anexar arquivo
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="16" x2="12" y2="12"/>
                      <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                    Sugestões
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {suggestedPrompts.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start text-left h-auto py-2 px-3 border-slate-200 dark:border-slate-700 text-sm hover:border-blue-300 hover:bg-blue-50/50 dark:hover:border-blue-800 dark:hover:bg-blue-900/20"
                        onClick={() => handleSuggestedPrompt(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    Tutoriais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="rounded-md border border-slate-200 dark:border-slate-700 p-3 hover:border-blue-300 dark:hover:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 cursor-pointer transition-colors">
                      <h4 className="font-medium text-sm mb-1">Como usar o assistente para projetos</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Aprenda como aproveitar todo o potencial da IA para seus desenhos técnicos</p>
                    </div>
                    <div className="rounded-md border border-slate-200 dark:border-slate-700 p-3 hover:border-blue-300 dark:hover:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 cursor-pointer transition-colors">
                      <h4 className="font-medium text-sm mb-1">Gerando orçamentos precisos</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Dicas para criar orçamentos detalhados com cálculos automáticos de materiais</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4 mt-2">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
              <div className="md:flex-1">
                <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-1">Templates para Automação</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl">
                  Utilize templates pré-configurados para automatizar tarefas comuns. Cada template pode ser personalizado para suas necessidades específicas.
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="flex gap-2">
                  <select className="h-9 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500/30">
                    <option value="all">Todas categorias</option>
                    <option value="design">Design</option>
                    <option value="orcamento">Orçamentos</option>
                    <option value="producao">Produção</option>
                    <option value="vendas">Vendas</option>
                  </select>
                  <Button variant="outline" size="sm" className="h-9">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <path d="M12 18v-6"/>
                      <path d="M8 18v-1"/>
                      <path d="M16 18v-3"/>
                    </svg>
                    Criar template
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Database,
                title: "Análise de Vendas",
                description: "Analise dados de vendas por período, região ou categoria",
                category: "vendas",
                tags: ["Análise", "Dashboards", "Relatórios"],
                rating: 4.8,
                uses: 1254
              },
              {
                icon: FileText,
                title: "Proposta Comercial",
                description: "Gere propostas comerciais detalhadas com base em parâmetros",
                category: "vendas",
                tags: ["Documentos", "Clientes"],
                rating: 4.9,
                uses: 2871
              },
              {
                icon: Calendar,
                title: "Cronograma de Produção",
                description: "Crie cronogramas otimizados para sua linha de produção",
                category: "producao",
                tags: ["Planejamento", "Gerenciamento"],
                rating: 4.7,
                uses: 942
              },
              {
                icon: BrainCircuit,
                title: "Design de Ambiente",
                description: "Obtenha sugestões de design para diferentes espaços",
                category: "design",
                tags: ["Criativo", "3D", "Visualização"],
                rating: 4.6,
                uses: 1587
              },
              {
                icon: Database,
                title: "Cálculo de Materiais",
                description: "Calcule materiais necessários para projetos específicos",
                category: "orcamento",
                tags: ["Custos", "Inventário"],
                rating: 4.9,
                uses: 2140
              },
              {
                icon: MessageCircle,
                title: "E-mail para Cliente",
                description: "Gere textos profissionais para comunicação com clientes",
                category: "vendas",
                tags: ["Comunicação", "Marketing"],
                rating: 4.8,
                uses: 1892
              },
            ].map((template, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-md hover:border-blue-300 dark:hover:border-blue-800 transition-all duration-200"
              >
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <template.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-slate-900 dark:text-white">{template.title}</h3>
                        <Badge className="ml-1 bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-900/60">
                          {template.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{template.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 my-3">
                    {template.tags.map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{template.rating}</span>
                      <span className="mx-1">•</span>
                      <span>{template.uses} usos</span>
                    </div>
                    <Button
                      size="sm"
                      className="h-8 text-xs px-3 group-hover:bg-blue-600 group-hover:text-white transition-colors"
                      variant="outline"
                    >
                      Usar template
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-6">
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-1">Histórico de Conversas</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Acesse suas conversas anteriores com o assistente IA. Você pode continuar de onde parou.
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.3-4.3"/>
                </svg>
                <Input
                  placeholder="Buscar conversas..."
                  className="pl-9 h-9 w-full md:w-64"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            {[...chatHistory].reverse().map((chat) => (
              <div
                key={chat.id}
                className={`group p-4 flex items-start hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${
                  selectedConversation === chat.id.toString() ? 'bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/10' : ''
                }`}
                onClick={() => setSelectedConversation(chat.id.toString())}
              >
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-4">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-slate-900 dark:text-white truncate pr-2">{chat.title}</h3>
                    <div className="flex items-center gap-1">
                      <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded">{chat.date}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 truncate">{chat.prompt}</p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
                        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
                      </svg>
                      3 mensagens
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"/>
                        <circle cx="17" cy="7" r="5"/>
                      </svg>
                      {chat.id % 2 === 0 ? "PlanejadoAI Pro" : "Assistente Padrão"}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="outline" className="h-7 px-2 text-xs rounded">Continuar</Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5"/>
                      </svg>
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500 dark:text-red-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <div className="p-3 text-center">
              <Button variant="outline" size="sm" className="text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="12" y1="8" x2="12" y2="16"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
                Carregar mais conversas
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <Card className="border-slate-200 dark:border-slate-800">
              <CardContent className="p-5 h-32 flex flex-col items-center justify-center text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 mb-2">
                  <circle cx="18" cy="18" r="3"/>
                  <circle cx="6" cy="6" r="3"/>
                  <path d="M6 21V9a9 9 0 0 0 9 9"/>
                </svg>
                <h3 className="font-medium text-slate-900 dark:text-white text-sm">Compartilhar conversas</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Colabore compartilhando ideias
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800">
              <CardContent className="p-5 h-32 flex flex-col items-center justify-center text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 mb-2">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <path d="M12 18v-6"/>
                  <path d="M8 18v-1"/>
                  <path d="M16 18v-3"/>
                </svg>
                <h3 className="font-medium text-slate-900 dark:text-white text-sm">Exportar para PDF</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Salve conversas para referência
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800">
              <CardContent className="p-5 h-32 flex flex-col items-center justify-center text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 mb-2">
                  <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/>
                  <path d="M10 2c1 .5 2 2 2 5"/>
                </svg>
                <h3 className="font-medium text-slate-900 dark:text-white text-sm">Personalizar Assistente</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Adapte às suas necessidades
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
