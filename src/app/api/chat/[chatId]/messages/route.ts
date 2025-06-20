import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/chat/[chatId]/messages - Get all messages for a chat
export async function GET(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const chatId = params.chatId;

    // Check if user has access to this chat
    const userChat = await prisma.chat.findFirst({
      where: {
        id: chatId,
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

    const limit = Number.parseInt(req.nextUrl.searchParams.get('limit') || '100');
    const before = req.nextUrl.searchParams.get('before');
    const after = req.nextUrl.searchParams.get('after');

    const whereClause: any = { chatId };

    if (before) {
      whereClause.sentAt = { lt: new Date(before) };
    }

    if (after) {
      whereClause.sentAt = { ...(whereClause.sentAt || {}), gt: new Date(after) };
    }

    const messages = await prisma.message.findMany({
      where: whereClause,
      orderBy: {
        sentAt: 'asc',
      },
      take: limit,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        attachments: true,
        aiSuggestions: {
          where: {
            isUsed: false,
          },
        },
      },
    });

    // Mark messages as read
    const unreadMessagesIds = messages
      .filter(message => !message.readAt && message.sender.id !== session.user.id)
      .map(message => message.id);

    if (unreadMessagesIds.length > 0) {
      await prisma.message.updateMany({
        where: {
          id: {
            in: unreadMessagesIds,
          },
        },
        data: {
          readAt: new Date(),
        },
      });
    }

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar mensagens' },
      { status: 500 }
    );
  }
}

// POST /api/chat/[chatId]/messages - Create a new message
export async function POST(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const chatId = params.chatId;

    // Check if user has access to this chat
    const userChat = await prisma.chat.findFirst({
      where: {
        id: chatId,
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

    const body = await req.json();
    const { content, type = 'TEXT', source = 'USER', isAIGenerated = false, attachments = [], aiSuggestions = [] } = body;

    if (!content && (!attachments || attachments.length === 0)) {
      return NextResponse.json(
        { error: 'Conteúdo da mensagem é obrigatório' },
        { status: 400 }
      );
    }

    // Create message with attachments and AI suggestions
    const message = await prisma.message.create({
      data: {
        content,
        type,
        source,
        isAIGenerated,
        chat: {
          connect: { id: chatId },
        },
        sender: {
          connect: { id: session.user.id },
        },
        attachments: {
          create: attachments.map((attachment: any) => ({
            name: attachment.name,
            fileUrl: attachment.fileUrl,
            fileType: attachment.fileType,
            fileSize: attachment.fileSize,
          })),
        },
        aiSuggestions: {
          create: aiSuggestions.map((suggestion: string) => ({
            content: suggestion,
          })),
        },
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        attachments: true,
        aiSuggestions: true,
      },
    });

    // Update the chat's updatedAt timestamp
    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    // If it's a WhatsApp integrated chat, we would send the message via WhatsApp API here
    // This is placeholder for future WhatsApp integration
    if (userChat.isWhatsAppIntegrated && userChat.whatsAppNumber) {
      // Call WhatsApp API service
      console.log(`Would send message to WhatsApp number: ${userChat.whatsAppNumber}`);
      // sendWhatsAppMessage(userChat.whatsAppNumber, content);
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Erro ao enviar mensagem' },
      { status: 500 }
    );
  }
}

// PATCH /api/chat/[chatId]/messages/[messageId] - Update read status or mark as used
export async function PATCH(
  req: NextRequest,
  { params }: { params: { chatId: string; messageId: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const chatId = params.chatId;
    const messageId = req.nextUrl.pathname.split('/').pop() || '';

    // Check if user has access to this chat
    const userChat = await prisma.chat.findFirst({
      where: {
        id: chatId,
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

    const body = await req.json();
    const { read, suggestionId } = body;

    if (read) {
      // Mark message as read
      const updatedMessage = await prisma.message.update({
        where: { id: messageId },
        data: {
          readAt: new Date(),
        },
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
      });
      return NextResponse.json(updatedMessage);
    }

    if (suggestionId) {
      // Mark suggestion as used
      const updatedSuggestion = await prisma.aIMessageSuggestion.update({
        where: { id: suggestionId },
        data: {
          isUsed: true,
        },
      });
      return NextResponse.json(updatedSuggestion);
    }

    return NextResponse.json(
      { error: 'Nenhuma ação especificada' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar mensagem' },
      { status: 500 }
    );
  }
}
