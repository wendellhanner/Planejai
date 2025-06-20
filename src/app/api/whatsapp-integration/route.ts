import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { generateWebhookToken, updateWhatsAppIntegration } from '@/lib/whatsapp';

// GET /api/whatsapp-integration - Get WhatsApp integration settings
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Only admin can view integration settings
    if (session.user.role !== 'ADMIN' && session.user.role !== 'GERENTE') {
      return NextResponse.json(
        { error: 'Permissão negada' },
        { status: 403 }
      );
    }

    const integration = await prisma.whatsAppIntegration.findFirst();

    if (!integration) {
      return NextResponse.json(
        { message: 'Integração não configurada' },
        { status: 404 }
      );
    }

    // Mask sensitive information
    const maskedIntegration = {
      ...integration,
      apiKey: integration.apiKey ? '••••••••' + integration.apiKey.slice(-4) : null,
    };

    return NextResponse.json(maskedIntegration);
  } catch (error) {
    console.error('Error fetching WhatsApp integration:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar configurações de integração' },
      { status: 500 }
    );
  }
}

// POST /api/whatsapp-integration - Create or update WhatsApp integration settings
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Only admin can update integration settings
    if (session.user.role !== 'ADMIN' && session.user.role !== 'GERENTE') {
      return NextResponse.json(
        { error: 'Permissão negada' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      apiKey,
      phoneNumberId,
      businessAccountId,
      isActive,
      webhookVerifyToken,
      autoResponderEnabled,
      autoResponderMessage,
      generateNewToken,
    } = body;

    let finalWebhookToken = webhookVerifyToken;

    // Generate a new webhook verify token if requested
    if (generateNewToken) {
      finalWebhookToken = generateWebhookToken();
    }

    // Update or create integration settings
    const integration = await updateWhatsAppIntegration({
      apiKey,
      phoneNumberId,
      businessAccountId,
      isActive,
      webhookVerifyToken: finalWebhookToken,
      autoResponderEnabled,
      autoResponderMessage,
    });

    // Mask sensitive information in response
    const maskedIntegration = {
      ...integration,
      apiKey: integration.apiKey ? '••••••••' + integration.apiKey.slice(-4) : null,
    };

    return NextResponse.json(maskedIntegration);
  } catch (error) {
    console.error('Error updating WhatsApp integration:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar configurações de integração' },
      { status: 500 }
    );
  }
}

// DELETE /api/whatsapp-integration - Disable WhatsApp integration
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Only admin can disable integration
    if (session.user.role !== 'ADMIN' && session.user.role !== 'GERENTE') {
      return NextResponse.json(
        { error: 'Permissão negada' },
        { status: 403 }
      );
    }

    const integration = await prisma.whatsAppIntegration.findFirst();

    if (!integration) {
      return NextResponse.json(
        { message: 'Integração não configurada' },
        { status: 404 }
      );
    }

    // Update integration to set isActive to false
    await prisma.whatsAppIntegration.update({
      where: { id: integration.id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, message: 'Integração desativada com sucesso' });
  } catch (error) {
    console.error('Error disabling WhatsApp integration:', error);
    return NextResponse.json(
      { error: 'Erro ao desativar integração' },
      { status: 500 }
    );
  }
}
