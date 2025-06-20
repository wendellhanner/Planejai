// Interface para os tipos de notificações
export type NotificationType =
  | 'nova-medicao'
  | 'nova-proposta'
  | 'agendamento'
  | 'producao-iniciada'
  | 'entrega-agendada'
  | 'montagem-agendada'
  | 'montagem-concluida'
  | 'novo-chamado'
  | 'boas-vindas';

// Interface para os dados de contato
export interface ContactData {
  name: string;
  email: string;
  phone?: string;
}

// Interface específica para notificação de medição
export interface MedicaoNotificationData {
  name: string;
  date: string;
  time: string;
  address: string;
}

// Interface específica para notificação de proposta
export interface PropostaNotificationData {
  name: string;
  projectTitle: string;
  proposalNumber: string;
  totalValue: string;
  validUntil: string;
}

// Serviço para enviar notificações de e-mail
export async function sendEmailNotification<T>(
  to: string,
  type: NotificationType,
  data: T
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        type,
        data,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Erro ao enviar notificação');
    }

    return {
      success: true,
      message: 'Notificação enviada com sucesso',
    };
  } catch (error) {
    console.error('Erro ao enviar notificação por e-mail:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

// Função para enviar notificação de boas-vindas
export async function sendWelcomeNotification(contact: ContactData): Promise<{ success: boolean; message: string }> {
  return sendEmailNotification(contact.email, 'boas-vindas', contact);
}

// Função para enviar notificação de nova medição
export async function sendMedicaoNotification(
  contact: ContactData,
  medicaoData: Omit<MedicaoNotificationData, 'name'>
): Promise<{ success: boolean; message: string }> {
  const data: MedicaoNotificationData = {
    name: contact.name,
    ...medicaoData,
  };

  return sendEmailNotification(contact.email, 'nova-medicao', data);
}

// Função para enviar notificação de nova proposta
export async function sendPropostaNotification(
  contact: ContactData,
  propostaData: Omit<PropostaNotificationData, 'name'>
): Promise<{ success: boolean; message: string }> {
  const data: PropostaNotificationData = {
    name: contact.name,
    ...propostaData,
  };

  return sendEmailNotification(contact.email, 'nova-proposta', data);
}

// Exemplo de uso do serviço de notificações
// Exemplo de uso da notificação de boas-vindas:
/*
   sendWelcomeNotification({
     name: 'João Silva',
     email: 'joao.silva@exemplo.com'
   });
*/

// Exemplo de uso da notificação de medição:
/*
   sendMedicaoNotification(
     {
       name: 'João Silva',
       email: 'joao.silva@exemplo.com'
     },
     {
       date: '15/06/2023',
       time: '14:30',
       address: 'Rua das Flores, 123 - São Paulo, SP'
     }
   );
*/

// Exemplo de uso da notificação de proposta:
/*
   sendPropostaNotification(
     {
       name: 'João Silva',
       email: 'joao.silva@exemplo.com'
     },
     {
       projectTitle: 'Cozinha Planejada',
       proposalNumber: 'P-2023-123',
       totalValue: '15.750,00',
       validUntil: '30/06/2023'
     }
   );
*/
