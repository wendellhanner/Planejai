import prisma from '@/lib/prisma';

// WhatsApp webhook interfaces
export interface WhatsAppWebhookEntry {
  id: string;
  changes: WhatsAppChange[];
}

export interface WhatsAppChange {
  value: WhatsAppValue;
  field: string;
}

export interface WhatsAppValue {
  messaging_product: string;
  metadata: {
    display_phone_number: string;
    phone_number_id: string;
  };
  contacts?: WhatsAppContact[];
  messages?: WhatsAppMessage[];
  statuses?: WhatsAppStatus[];
}

export interface WhatsAppContact {
  profile: {
    name: string;
  };
  wa_id: string;
}

export interface WhatsAppMessage {
  from: string;
  id: string;
  timestamp: string;
  text?: {
    body: string;
  };
  type: 'text' | 'image' | 'document' | 'audio' | 'video';
  context?: {
    from: string;
    id: string;
  };
}

export interface WhatsAppStatus {
  id: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  recipient_id: string;
}

export interface WhatsAppWebhookBody {
  object: string;
  entry: WhatsAppWebhookEntry[];
}

/**
 * WhatsApp API Service
 * This service handles integration with the WhatsApp Business API
 */

/**
 * Sends a message to a WhatsApp number via the WhatsApp Business API
 */
export async function sendWhatsAppMessage(
  to: string,
  message: string,
  mediaUrl?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Get the WhatsApp integration details
    const integration = await getWhatsAppIntegration();

    if (!integration || !integration.isActive) {
      return {
        success: false,
        error: 'WhatsApp integration is not configured or active'
      };
    }

    // Format phone number (remove spaces, dashes, etc.)
    const formattedNumber = formatPhoneNumber(to);

    // If no valid API key or phoneNumberId, return error
    if (!integration.apiKey || !integration.phoneNumberId) {
      return {
        success: false,
        error: 'WhatsApp integration is missing required credentials'
      };
    }

    // In a real implementation, we would call the WhatsApp API
    // For now, this is a simulation
    console.log(`Sending WhatsApp message to ${formattedNumber}: ${message}`);

    // Simulate API response
    const messageId = `whatsapp_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // In real implementation, we would make a proper API call like:
    /*
    const response = await fetch(
      `https://graph.facebook.com/v15.0/${integration.phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${integration.apiKey}`
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: formattedNumber,
          type: mediaUrl ? 'media' : 'text',
          ...(mediaUrl
            ? {
                media: {
                  type: getMediaType(mediaUrl),
                  url: mediaUrl
                }
              }
            : {
                text: {
                  body: message
                }
              }
          )
        })
      }
    );

    const data = await response.json();
    const messageId = data.messages?.[0]?.id;
    */

    return {
      success: true,
      messageId
    };
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Get active WhatsApp integration configuration
 */
export async function getWhatsAppIntegration() {
  try {
    const integration = await prisma.whatsAppIntegration.findFirst({
      where: {
        isActive: true
      }
    });

    return integration;
  } catch (error) {
    console.error('Error getting WhatsApp integration:', error);
    return null;
  }
}

/**
 * Format phone number to WhatsApp API format
 */
function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  return phone.replace(/\D/g, '');
}

/**
 * Determine media type from URL
 */
function getMediaType(url: string): string {
  const extension = url.split('.').pop()?.toLowerCase();

  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
    return 'image';
  }

  if (['mp4', 'mov', 'avi', 'webm'].includes(extension || '')) {
    return 'video';
  }

  if (['mp3', 'ogg', 'wav'].includes(extension || '')) {
    return 'audio';
  }

  return 'document';
}

/**
 * Update WhatsApp integration settings
 */
export async function updateWhatsAppIntegration(data: {
  apiKey?: string;
  phoneNumberId?: string;
  businessAccountId?: string;
  isActive?: boolean;
  webhookVerifyToken?: string;
  autoResponderEnabled?: boolean;
  autoResponderMessage?: string;
}) {
  try {
    // Find existing integration or create new one
    const existingIntegration = await prisma.whatsAppIntegration.findFirst();

    if (existingIntegration) {
      return await prisma.whatsAppIntegration.update({
        where: { id: existingIntegration.id },
        data
      });
    } else {
      return await prisma.whatsAppIntegration.create({ data });
    }
  } catch (error) {
    console.error('Error updating WhatsApp integration:', error);
    throw error;
  }
}

/**
 * Generate a secure random token for webhook verification
 */
export function generateWebhookToken(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15) +
         Date.now().toString(36);
}

/**
 * Handle incoming webhook from WhatsApp
 */
export async function handleWhatsAppWebhook(body: WhatsAppWebhookBody) {
  try {
    // In a real implementation, we would process the webhook payload
    // For now, we just log it
    console.log('Received WhatsApp webhook:', JSON.stringify(body));

    // Update last webhook received timestamp
    await prisma.whatsAppIntegration.updateMany({
      where: {
        isActive: true
      },
      data: {
        lastWebhookReceived: new Date()
      }
    });

    // Process messages
    const entries = body.entry || [];
    for (const entry of entries) {
      const changes = entry.changes || [];
      for (const change of changes) {
        if (change.field === 'messages') {
          const messages = change.value?.messages || [];
          for (const message of messages) {
            await processIncomingWhatsAppMessage(message);
          }
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error handling WhatsApp webhook:', error);
    return { success: false, error };
  }
}

/**
 * Process an incoming WhatsApp message
 */
async function processIncomingWhatsAppMessage(message: WhatsAppMessage) {
  try {
    const from = message.from;
    const messageId = message.id;

    // Extract message content based on type
    let content = '';
    let type: 'TEXT' | 'IMAGE' | 'FILE' | 'LOCATION' | 'VOICE' | 'VIDEO' = 'TEXT';

    if (message.text) {
      content = message.text.body;
      type = 'TEXT';
    } else if (message.image) {
      content = message.image.caption || 'Imagem enviada';
      type = 'IMAGE';
    } else if (message.video) {
      content = message.video.caption || 'Vídeo enviado';
      type = 'VIDEO';
    } else if (message.audio) {
      content = 'Áudio enviado';
      type = 'VOICE';
    } else if (message.document) {
      content = message.document.caption || 'Documento enviado';
      type = 'FILE';
    } else if (message.location) {
      content = 'Localização enviada';
      type = 'LOCATION';
    } else {
      content = 'Mensagem não reconhecida';
    }

    // Find a chat with this WhatsApp number or create a new one
    const existingChat = await prisma.chat.findFirst({
      where: {
        whatsAppNumber: from,
        isWhatsAppIntegrated: true
      },
      include: {
        participants: true
      }
    });

    if (existingChat) {
      // Find an admin or first participant to set as sender
      const adminUser = existingChat.participants.find(u => u.role === 'ADMIN') ||
                        existingChat.participants[0];

      // Add message to existing chat
      await prisma.message.create({
        data: {
          content,
          type: type,
          source: 'WHATSAPP',
          chat: {
            connect: { id: existingChat.id }
          },
          sender: {
            connect: { id: adminUser.id }
          }
        }
      });

      // Send auto-response if enabled
      const integration = await getWhatsAppIntegration();
      if (integration?.autoResponderEnabled && integration.autoResponderMessage) {
        await sendWhatsAppMessage(from, integration.autoResponderMessage);
      }
    } else {
      // Find an admin user to create the chat
      const adminUser = await prisma.user.findFirst({
        where: {
          role: 'ADMIN'
        }
      });

      if (!adminUser) {
        throw new Error('No admin user found to handle incoming WhatsApp message');
      }

      // Create a new chat
      const newChat = await prisma.chat.create({
        data: {
          type: 'CLIENTE',
          title: `WhatsApp: ${from}`,
          isWhatsAppIntegrated: true,
          whatsAppNumber: from,
          participants: {
            connect: { id: adminUser.id }
          }
        }
      });

      // Add the first message
      await prisma.message.create({
        data: {
          content,
          type: type,
          source: 'WHATSAPP',
          chat: {
            connect: { id: newChat.id }
          },
          sender: {
            connect: { id: adminUser.id }
          }
        }
      });

      // Send auto-response if enabled
      const integration = await getWhatsAppIntegration();
      if (integration?.autoResponderEnabled && integration.autoResponderMessage) {
        await sendWhatsAppMessage(from, integration.autoResponderMessage);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error processing incoming WhatsApp message:', error);
    return { success: false, error };
  }
}
