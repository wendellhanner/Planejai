/**
 * Chat Integration Service
 * This service handles integration and synchronization between different chat platforms
 * (WhatsApp and Internal Chat)
 */

import { sendWhatsAppMessage } from './whatsapp';
import type { Notification } from '@/components/providers/notification-provider';

// Types to represent different chat sources
export type ChatSource = 'whatsapp' | 'internal' | 'email';

export interface ChatMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: string;
  source: ChatSource;
  originalSourceId?: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  isForwarded?: boolean;
  metadata?: Record<string, unknown>;
}

export interface SyncResult {
  success: boolean;
  error?: string;
  messageId?: string;
}

export interface WhatsAppMessageData {
  content: string;
  from: string;
  timestamp: string;
  type: 'text' | 'image' | 'document' | 'audio' | 'video';
  messageId: string;
  mediaUrl?: string;
}

/**
 * Synchronize a message from internal chat to WhatsApp
 */
export async function syncInternalToWhatsApp(
  phoneNumber: string,
  message: ChatMessage
): Promise<SyncResult> {
  try {
    // Check if message is valid
    if (!message.content.trim()) {
      return { success: false, error: 'Message content cannot be empty' };
    }

    // Send message to WhatsApp
    const result = await sendWhatsAppMessage(
      phoneNumber,
      message.content,
      message.metadata?.mediaUrl
    );

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to send message to WhatsApp'
      };
    }

    return {
      success: true,
      messageId: result.messageId
    };
  } catch (error) {
    console.error('Error syncing message to WhatsApp:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Synchronize a message from WhatsApp to internal chat
 * Note: In a real implementation, this would be called by webhook handlers
 */
export async function syncWhatsAppToInternal(
  chatId: string,
  whatsAppMessageData: WhatsAppMessageData,
  addNotification?: (notification: Omit<Notification, "id" | "time" | "read">) => void
): Promise<SyncResult> {
  try {
    // In a real implementation, we would process the WhatsApp message
    // and add it to the internal chat database

    // For demonstration, we're just simulating the process
    console.log(`Message from WhatsApp would be synced to internal chat ${chatId}`);

    // If notification function is provided, create a notification
    if (addNotification) {
      const sender = whatsAppMessageData.sender || { name: "Cliente WhatsApp" };

      addNotification({
        title: `Nova mensagem de WhatsApp`,
        message: `${sender.name}: ${whatsAppMessageData.content.slice(0, 50)}${whatsAppMessageData.content.length > 50 ? '...' : ''}`,
        type: "info",
        link: "/chat/whatsapp",
        sender: {
          id: sender.id || "whatsapp",
          name: sender.name,
          avatar: sender.avatar
        }
      });
    }

    return {
      success: true,
      messageId: `internal_${Date.now()}`
    };
  } catch (error) {
    console.error('Error syncing WhatsApp message to internal chat:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Get connected chat sources for a client
 */
export function getConnectedChatSources(clientId: string): ChatSource[] {
  // In a real implementation, we would check the database for connected sources
  // For now, we're returning mock data
  const mockConnections: Record<string, ChatSource[]> = {
    "client1": ["whatsapp", "internal"],
    "client2": ["whatsapp", "internal", "email"],
    "client3": ["internal"],
    "client5": ["whatsapp", "internal"],
  };

  return mockConnections[clientId] || ["internal"];
}

/**
 * Link WhatsApp number to internal chat
 */
export async function linkWhatsAppToInternalChat(
  internalChatId: string,
  whatsAppNumber: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // In a real implementation, we would update the database to link the chat
    console.log(`Linking WhatsApp number ${whatsAppNumber} to internal chat ${internalChatId}`);

    // Simulate successful linking
    return { success: true };
  } catch (error) {
    console.error('Error linking WhatsApp to internal chat:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Get conversation history from all sources for a client
 */
export async function getUnifiedChatHistory(clientId: string): Promise<{
  messages: ChatMessage[];
  sources: ChatSource[];
}> {
  // In a real implementation, we would fetch from the database
  // For now, returning mock data

  const sources = getConnectedChatSources(clientId);

  // Mock messages from different sources
  const mockMessages: ChatMessage[] = [
    // Mock data would be here in real implementation
  ];

  return {
    messages: mockMessages,
    sources
  };
}
