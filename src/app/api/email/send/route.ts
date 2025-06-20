import { NextResponse } from 'next/server';

// Interface para tipos de notificações de email diferentes
type EmailType =
  | 'nova-medicao'
  | 'nova-proposta'
  | 'agendamento'
  | 'producao-iniciada'
  | 'entrega-agendada'
  | 'montagem-agendada'
  | 'montagem-concluida'
  | 'novo-chamado'
  | 'boas-vindas';

// Função que simula o envio de email (em um ambiente real, usaríamos um serviço como SendGrid, Mailchimp, etc.)
async function sendEmail(to: string, subject: string, html: string) {
  // Em um ambiente real, aqui faríamos a integração com o serviço de envio de emails
  console.log('Enviando email para:', to);
  console.log('Assunto:', subject);
  console.log('Conteúdo:', html);

  // Simulamos um atraso e retornamos sucesso
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    success: true,
    messageId: `simulated-message-id-${Date.now()}`,
  };
}

// Função para gerar o conteúdo HTML do email baseado no tipo
function generateEmailContent(type: EmailType, data: any): { subject: string, html: string } {
  switch (type) {
    case 'boas-vindas':
      return {
        subject: 'Bem-vindo(a) à Móveis PlanejApp!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee;">
              <h1 style="color: #333;">Móveis PlanejApp</h1>
            </div>
            <div style="padding: 20px 0;">
              <h2>Olá, ${data.name}!</h2>
              <p>Seja bem-vindo(a) à Móveis PlanejApp. Estamos muito felizes em tê-lo(a) como cliente!</p>
              <p>Já recebemos seu contato e em breve um de nossos consultores entrará em contato para entender melhor suas necessidades.</p>
              <p>Enquanto isso, você pode acessar nossa plataforma para acompanhar o andamento do seu projeto.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="background-color: #000; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">Acessar Minha Conta</a>
              </div>
              <p>Se tiver qualquer dúvida, não hesite em nos contatar.</p>
              <p>Atenciosamente,<br>Equipe Móveis PlanejApp</p>
            </div>
            <div style="padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777; text-align: center;">
              <p>© ${new Date().getFullYear()} Móveis PlanejApp. Todos os direitos reservados.</p>
            </div>
          </div>
        `,
      };

    case 'nova-medicao':
      return {
        subject: 'Sua medição foi agendada!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee;">
              <h1 style="color: #333;">Móveis PlanejApp</h1>
            </div>
            <div style="padding: 20px 0;">
              <h2>Olá, ${data.name}!</h2>
              <p>Sua medição foi agendada com sucesso para <strong>${data.date}</strong> às <strong>${data.time}</strong>.</p>
              <p>Nosso técnico irá até o endereço:</p>
              <p style="background-color: #f8f8f8; padding: 10px; border-left: 4px solid #000;">${data.address}</p>
              <p>Lembre-se de que é importante que alguém esteja presente no local para receber nosso profissional.</p>
              <p>Se precisar reagendar, entre em contato conosco com pelo menos 24 horas de antecedência.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="background-color: #000; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">Ver Detalhes</a>
              </div>
              <p>Atenciosamente,<br>Equipe Móveis PlanejApp</p>
            </div>
            <div style="padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777; text-align: center;">
              <p>© ${new Date().getFullYear()} Móveis PlanejApp. Todos os direitos reservados.</p>
            </div>
          </div>
        `,
      };

    case 'nova-proposta':
      return {
        subject: 'Sua proposta está disponível!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee;">
              <h1 style="color: #333;">Móveis PlanejApp</h1>
            </div>
            <div style="padding: 20px 0;">
              <h2>Olá, ${data.name}!</h2>
              <p>Temos o prazer de informar que sua proposta para o projeto <strong>${data.projectTitle}</strong> está disponível para consulta!</p>
              <p>Detalhes da proposta:</p>
              <ul style="background-color: #f8f8f8; padding: 15px 30px; border-left: 4px solid #000;">
                <li>Número da proposta: ${data.proposalNumber}</li>
                <li>Valor total: R$ ${data.totalValue}</li>
                <li>Validade: ${data.validUntil}</li>
              </ul>
              <p>Para visualizar todos os detalhes e aprovar a proposta, clique no botão abaixo:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="background-color: #000; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">Ver Proposta Completa</a>
              </div>
              <p>Se tiver dúvidas sobre os itens ou valores, entre em contato com seu consultor.</p>
              <p>Atenciosamente,<br>Equipe Móveis PlanejApp</p>
            </div>
            <div style="padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777; text-align: center;">
              <p>© ${new Date().getFullYear()} Móveis PlanejApp. Todos os direitos reservados.</p>
            </div>
          </div>
        `,
      };

    // Outros tipos de email teriam templates semelhantes
    default:
      return {
        subject: 'Notificação - Móveis PlanejApp',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee;">
              <h1 style="color: #333;">Móveis PlanejApp</h1>
            </div>
            <div style="padding: 20px 0;">
              <h2>Olá, ${data.name}!</h2>
              <p>Você recebeu uma nova notificação de nossa plataforma.</p>
              <p>Para verificar os detalhes, acesse sua conta.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="background-color: #000; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">Acessar Minha Conta</a>
              </div>
              <p>Atenciosamente,<br>Equipe Móveis PlanejApp</p>
            </div>
            <div style="padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777; text-align: center;">
              <p>© ${new Date().getFullYear()} Móveis PlanejApp. Todos os direitos reservados.</p>
            </div>
          </div>
        `,
      };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, type, data } = body;

    if (!to || !type || !data) {
      return NextResponse.json(
        { error: 'Parâmetros incompletos' },
        { status: 400 }
      );
    }

    // Validação de e-mail básica
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { error: 'Endereço de e-mail inválido' },
        { status: 400 }
      );
    }

    // Gera o conteúdo do email com base no tipo
    const { subject, html } = generateEmailContent(type as EmailType, data);

    // Envia o email
    const result = await sendEmail(to, subject, html);

    return NextResponse.json(
      { message: 'Email enviado com sucesso', ...result },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' },
      { status: 500 }
    );
  }
}
