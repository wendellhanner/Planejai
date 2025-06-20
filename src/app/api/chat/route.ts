import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/chat - Get all chats for the authenticated user
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const userId = session.user.id;
    const type = req.nextUrl.searchParams.get('type');
    const status = req.nextUrl.searchParams.get('status');
    const leadId = req.nextUrl.searchParams.get('leadId');

    const where: any = {
      participants: {
        some: {
          id: userId,
        },
      },
    };

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    if (leadId) {
      where.leadId = leadId;
    }

    const chats = await prisma.chat.findMany({
      where,
      include: {
        lead: true,
        participants: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        messages: {
          orderBy: {
            sentAt: 'desc',
          },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
      orderBy: [
        {
          status: 'asc', // ATIVO primeiro
        },
        {
          updatedAt: 'desc', // Mais recentes primeiro
        },
      ],
    });

    return NextResponse.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar conversas' },
      { status: 500 }
    );
  }
}

// POST /api/chat - Create a new chat
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { type, title, leadId, participantIds, isWhatsAppIntegrated, whatsAppNumber } = body;

    if (!type) {
      return NextResponse.json(
        { error: 'Tipo de chat é obrigatório' },
        { status: 400 }
      );
    }

    // Ensure user is included in participants
    const allParticipantIds = [...new Set([userId, ...(participantIds || [])])];

    const chat = await prisma.chat.create({
      data: {
        type,
        title,
        leadId,
        isWhatsAppIntegrated: isWhatsAppIntegrated || false,
        whatsAppNumber,
        participants: {
          connect: allParticipantIds.map(id => ({ id })),
        },
      },
      include: {
        lead: true,
        participants: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json(chat);
  } catch (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json(
      { error: 'Erro ao criar conversa' },
      { status: 500 }
    );
  }
}

// PATCH /api/chat/:id - Update a chat
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const id = req.nextUrl.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json(
        { error: 'ID da conversa é obrigatório' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { title, status, participantIds, isWhatsAppIntegrated, whatsAppNumber } = body;

    // Check if user has access to this chat
    const userChat = await prisma.chat.findFirst({
      where: {
        id,
        participants: {
          some: {
            id: session.user.id,
          },
        },
      },
    });

    if (!userChat) {
      return NextResponse.json(
        { error: 'Conversa não encontrada ou acesso negado' },
        { status: 404 }
      );
    }

    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (status !== undefined) updateData.status = status;
    if (isWhatsAppIntegrated !== undefined) updateData.isWhatsAppIntegrated = isWhatsAppIntegrated;
    if (whatsAppNumber !== undefined) updateData.whatsAppNumber = whatsAppNumber;

    // Update participants if provided
    let participants;
    if (participantIds) {
      // First disconnect all participants
      await prisma.chat.update({
        where: { id },
        data: {
          participants: {
            set: [],
          },
        },
      });

      // Then connect new participants
      participants = {
        connect: participantIds.map((id: string) => ({ id })),
      };
      updateData.participants = participants;
    }

    const updatedChat = await prisma.chat.update({
      where: { id },
      data: updateData,
      include: {
        lead: true,
        participants: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json(updatedChat);
  } catch (error) {
    console.error('Error updating chat:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar conversa' },
      { status: 500 }
    );
  }
}

// DELETE /api/chat/:id - Archive a chat
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const id = req.nextUrl.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json(
        { error: 'ID da conversa é obrigatório' },
        { status: 400 }
      );
    }

    // Check if user has access to this chat
    const userChat = await prisma.chat.findFirst({
      where: {
        id,
        participants: {
          some: {
            id: session.user.id,
          },
        },
      },
    });

    if (!userChat) {
      return NextResponse.json(
        { error: 'Conversa não encontrada ou acesso negado' },
        { status: 404 }
      );
    }

    // Instead of deleting, we archive the chat
    const archivedChat = await prisma.chat.update({
      where: { id },
      data: {
        status: 'ARQUIVADO',
      },
    });

    return NextResponse.json({ success: true, chat: archivedChat });
  } catch (error) {
    console.error('Error archiving chat:', error);
    return NextResponse.json(
      { error: 'Erro ao arquivar conversa' },
      { status: 500 }
    );
  }
}
