export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  status: 'Novo' | 'Em Contato' | 'Reunião Agendada' | 'Proposta Enviada' | 'Fechado' | 'Perdido';
  valor: number;
  prazo: string;
  prioridade: 'Alta' | 'Média' | 'Baixa';
  responsavel: string;
  projeto: string;
  observacoes: string;
  dataCriacao: string;
  dataUltimaInteracao: string;
  origem: string;
  categoria: string;
  endereco?: string;
  cidade?: string;
  cep?: string;
}

export interface Atividade {
  id: string;
  clienteId: string;
  tipo: 'chat' | 'ligacao' | 'email' | 'reuniao' | 'proposta' | 'documento';
  titulo: string;
  descricao: string;
  data: string;
  hora: string;
  responsavel: string;
  status: 'pendente' | 'concluido' | 'cancelado';
}

export interface Vendedor {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  avatar: string;
  metaMensal: number;
  vendaRealizada: number;
  comissao: number;
  clientesAtivos: number;
  conversao: number;
}

export interface KPI {
  titulo: string;
  valor: number;
  variacao: number;
  periodo: string;
  meta?: number;
  formato: 'moeda' | 'numero' | 'percentual';
}

// Dados de exemplo com valores realistas
export const clientes: Cliente[] = [
  {
    id: "1",
    nome: "João Silva",
    telefone: "(11) 99999-1234",
    email: "joao.silva@email.com",
    status: "Novo",
    valor: 45000,
    prazo: "2 dias",
    prioridade: "Alta",
    responsavel: "Carlos",
    projeto: "Apartamento no Centro - Cozinha e Sala",
    observacoes: "Cliente interessado em móveis planejados modernos. Preferência por cores claras.",
    dataCriacao: "2024-05-20",
    dataUltimaInteracao: "2024-05-25",
    origem: "WhatsApp",
    categoria: "Residencial"
  },
  {
    id: "2",
    nome: "Maria Santos",
    telefone: "(11) 98888-5678",
    email: "maria.santos@email.com",
    status: "Em Contato",
    valor: 78000,
    prazo: "5 dias",
    prioridade: "Média",
    responsavel: "Ana",
    projeto: "Casa Inteira - Todos os Cômodos",
    observacoes: "Renovação completa da casa. Orçamento alto, boa oportunidade.",
    dataCriacao: "2024-05-18",
    dataUltimaInteracao: "2024-05-24",
    origem: "Site",
    categoria: "Residencial"
  },
  {
    id: "3",
    nome: "Camila Pereira",
    telefone: "(11) 97777-9876",
    email: "camila.pereira@email.com",
    status: "Reunião Agendada",
    valor: 35000,
    prazo: "3 dias",
    prioridade: "Alta",
    responsavel: "Pedro",
    projeto: "Quarto e Suíte Master",
    observacoes: "Reunião agendada para quinta-feira às 14h. Cliente muito interessado.",
    dataCriacao: "2024-05-15",
    dataUltimaInteracao: "2024-05-23",
    origem: "Indicação",
    categoria: "Residencial"
  },
  {
    id: "4",
    nome: "Eduardo Costa",
    telefone: "(11) 96666-4321",
    email: "eduardo.costa@email.com",
    status: "Proposta Enviada",
    valor: 125000,
    prazo: "7 dias",
    prioridade: "Alta",
    responsavel: "Marina",
    projeto: "Escritório Comercial Completo",
    observacoes: "Proposta enviada ontem. Cliente solicitou algumas alterações no projeto.",
    dataCriacao: "2024-05-10",
    dataUltimaInteracao: "2024-05-22",
    origem: "LinkedIn",
    categoria: "Comercial"
  },
  {
    id: "5",
    nome: "Ana Carolina",
    telefone: "(11) 95555-8765",
    email: "ana.carolina@email.com",
    status: "Fechado",
    valor: 52000,
    prazo: "Finalizado",
    prioridade: "Baixa",
    responsavel: "Carlos",
    projeto: "Cozinha Americana Moderna",
    observacoes: "Projeto finalizado com sucesso. Cliente muito satisfeito.",
    dataCriacao: "2024-04-20",
    dataUltimaInteracao: "2024-05-20",
    origem: "WhatsApp",
    categoria: "Residencial"
  }
];

export const atividades: Atividade[] = [
  {
    id: "1",
    clienteId: "1",
    tipo: "chat",
    titulo: "Primeiro contato",
    descricao: "Cliente entrou em contato solicitando orçamento para cozinha planejada no apartamento.",
    data: "2024-05-25",
    hora: "09:15",
    responsavel: "Carlos",
    status: "concluido"
  },
  {
    id: "2",
    clienteId: "1",
    tipo: "chat",
    titulo: "Envio de catálogo",
    descricao: "Enviado catálogo com modelos de cozinhas modernas conforme solicitação do cliente.",
    data: "2024-05-25",
    hora: "09:45",
    responsavel: "Carlos",
    status: "concluido"
  },
  {
    id: "3",
    clienteId: "2",
    tipo: "ligacao",
    titulo: "Ligação de follow-up",
    descricao: "Ligação para acompanhar interesse e agendar visita técnica.",
    data: "2024-05-24",
    hora: "14:30",
    responsavel: "Ana",
    status: "concluido"
  },
  {
    id: "4",
    clienteId: "3",
    tipo: "reuniao",
    titulo: "Reunião agendada",
    descricao: "Reunião presencial para apresentar projeto e tirar medidas.",
    data: "2024-05-26",
    hora: "14:00",
    responsavel: "Pedro",
    status: "pendente"
  }
];

export const vendedores: Vendedor[] = [
  {
    id: "1",
    nome: "Carlos Silva",
    email: "carlos@empresa.com",
    telefone: "(11) 99999-0001",
    cargo: "Vendedor Sênior",
    avatar: "CS",
    metaMensal: 150000,
    vendaRealizada: 125000,
    comissao: 8750,
    clientesAtivos: 15,
    conversao: 32.5
  },
  {
    id: "2",
    nome: "Ana Santos",
    email: "ana@empresa.com",
    telefone: "(11) 99999-0002",
    cargo: "Vendedora Pleno",
    avatar: "AS",
    metaMensal: 120000,
    vendaRealizada: 98000,
    comissao: 6860,
    clientesAtivos: 12,
    conversao: 28.7
  },
  {
    id: "3",
    nome: "Pedro Costa",
    email: "pedro@empresa.com",
    telefone: "(11) 99999-0003",
    cargo: "Vendedor Junior",
    avatar: "PC",
    metaMensal: 80000,
    vendaRealizada: 85000,
    comissao: 5950,
    clientesAtivos: 10,
    conversao: 35.2
  },
  {
    id: "4",
    nome: "Marina Oliveira",
    email: "marina@empresa.com",
    telefone: "(11) 99999-0004",
    cargo: "Vendedora Sênior",
    avatar: "MO",
    metaMensal: 140000,
    vendaRealizada: 156000,
    comissao: 10920,
    clientesAtivos: 18,
    conversao: 41.3
  }
];

export const kpis: KPI[] = [
  {
    titulo: "Faturamento Total",
    valor: 464000,
    variacao: 12.5,
    periodo: "Este mês",
    meta: 500000,
    formato: "moeda"
  },
  {
    titulo: "Leads Convertidos",
    valor: 47,
    variacao: 8.2,
    periodo: "Este mês",
    meta: 50,
    formato: "numero"
  },
  {
    titulo: "Taxa de Conversão",
    valor: 34.2,
    variacao: 5.1,
    periodo: "Este mês",
    meta: 35,
    formato: "percentual"
  },
  {
    titulo: "Ticket Médio",
    valor: 67500,
    variacao: -2.3,
    periodo: "Este mês",
    meta: 70000,
    formato: "moeda"
  },
  {
    titulo: "Projetos Ativos",
    valor: 89,
    variacao: 15.7,
    periodo: "Este mês",
    formato: "numero"
  },
  {
    titulo: "Clientes Satisfeitos",
    valor: 96.8,
    variacao: 2.1,
    periodo: "Este mês",
    formato: "percentual"
  }
];

// Funções utilitárias
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const getClienteById = (id: string): Cliente | undefined => {
  return clientes.find(cliente => cliente.id === id);
};

export const getAtividadesByClienteId = (clienteId: string): Atividade[] => {
  return atividades.filter(atividade => atividade.clienteId === clienteId);
};

export const getVendedorByNome = (nome: string): Vendedor | undefined => {
  return vendedores.find(vendedor => vendedor.nome === nome);
};

export const getTotalFaturamento = (): number => {
  return clientes
    .filter(cliente => cliente.status === 'Fechado')
    .reduce((total, cliente) => total + cliente.valor, 0);
};

export const getTotalLeads = (): number => {
  return clientes.length;
};

export const getLeadsConvertidos = (): number => {
  return clientes.filter(cliente => cliente.status === 'Fechado').length;
};

export const getTaxaConversao = (): number => {
  const total = getTotalLeads();
  const convertidos = getLeadsConvertidos();
  return total > 0 ? (convertidos / total) * 100 : 0;
};

export const getTicketMedio = (): number => {
  const fechados = clientes.filter(cliente => cliente.status === 'Fechado');
  if (fechados.length === 0) return 0;
  const total = fechados.reduce((sum, cliente) => sum + cliente.valor, 0);
  return total / fechados.length;
};
