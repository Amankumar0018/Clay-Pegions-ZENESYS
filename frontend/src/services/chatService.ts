/**
 * Miley Conversational AI & Chat Service
 * 
 * Manages conversational threads, message sending, streaming responses,
 * and retrieval of conversation histories. Decoupled from visual UI.
 */

import { API_CONFIG, API_ENDPOINTS } from '../config/api';
import { apiClient } from './apiClient';
import { ChatMessage, AssistantPersona } from '../types';
import { ConversationThread } from '../types/api';
import { INITIAL_CHAT_MESSAGES, CHAT_KNOWLEDGE_BASE } from '../data/mockData';

export interface SendMessagePayload {
  conversationId?: string;
  content: string;
  attachments?: string[];
  persona?: AssistantPersona;
  contextData?: Record<string, any>;
}

export interface ChatResponse {
  message: ChatMessage;
  conversationId: string;
  thread?: ConversationThread;
}

class ChatService {
  private memoryMessages: Record<string, ChatMessage[]> = {
    'conv-default': [...INITIAL_CHAT_MESSAGES],
  };

  private memoryConversations: ConversationThread[] = [
    {
      id: 'conv-default',
      userId: 'usr-882109',
      title: 'Supply Chain & Weekly Priorities',
      createdAt: '2026-08-21T07:30:00Z',
      updatedAt: '2026-08-21T08:42:00Z',
      lastMessageExcerpt: 'Wireless Earbuds days of cover has dropped to 6.2 days...',
      messageCount: INITIAL_CHAT_MESSAGES.length,
    },
  ];

  public async getConversations(): Promise<ConversationThread[]> {
    try {
      const response = await apiClient.get<ConversationThread[]>(API_ENDPOINTS.chat.conversations);
      if (response.data) return response.data;
    } catch (error) {
      if (!API_CONFIG.useMockFallback) throw error;
    }
    return this.memoryConversations;
  }

  public async getConversationMessages(conversationId: string = 'conv-default'): Promise<ChatMessage[]> {
    try {
      const response = await apiClient.get<ChatMessage[]>(API_ENDPOINTS.chat.messages(conversationId));
      if (response.data) return response.data;
    } catch (error) {
      if (!API_CONFIG.useMockFallback) throw error;
    }
    return this.memoryMessages[conversationId] || this.memoryMessages['conv-default'] || [];
  }

  public async createConversation(title: string = 'New Conversation'): Promise<ConversationThread> {
    try {
      const response = await apiClient.post<ConversationThread>(API_ENDPOINTS.chat.conversations, { title });
      if (response.data) {
        this.memoryConversations.unshift(response.data);
        return response.data;
      }
    } catch (error) {
      if (!API_CONFIG.useMockFallback) throw error;
    }

    const newThread: ConversationThread = {
      id: `conv-${Date.now()}`,
      userId: 'usr-882109',
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: 0,
    };
    this.memoryConversations.unshift(newThread);
    this.memoryMessages[newThread.id] = [];
    return newThread;
  }

  public async deleteConversation(conversationId: string): Promise<boolean> {
    try {
      await apiClient.delete(API_ENDPOINTS.chat.conversation(conversationId));
    } catch (error) {
      if (!API_CONFIG.useMockFallback) throw error;
    }

    this.memoryConversations = this.memoryConversations.filter((c) => c.id !== conversationId);
    delete this.memoryMessages[conversationId];
    return true;
  }

  public async sendMessage(payload: SendMessagePayload): Promise<ChatResponse> {
    const convId = payload.conversationId || 'conv-default';

    try {
      const response = await apiClient.post<ChatResponse>(API_ENDPOINTS.chat.send, payload);
      if (response.data) {
        if (!this.memoryMessages[convId]) this.memoryMessages[convId] = [];
        this.memoryMessages[convId].push(response.data.message);
        return response.data;
      }
    } catch (error) {
      if (!API_CONFIG.useMockFallback) throw error;
    }

    // Mock AI Reasoning Fallback
    const userMsg = payload.content.toLowerCase();
    let bestMatch = CHAT_KNOWLEDGE_BASE[0];

    for (const kb of CHAT_KNOWLEDGE_BASE) {
      if (kb.matchKeywords.some((kw) => userMsg.includes(kw.toLowerCase()))) {
        bestMatch = kb;
        break;
      }
    }

    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp: 'Just now',
      content: bestMatch.response,
      dataSources: bestMatch.dataSources,
      suggestedActions: bestMatch.suggestedActions as any,
    };

    if (!this.memoryMessages[convId]) this.memoryMessages[convId] = [];
    this.memoryMessages[convId].push(assistantMsg);

    return {
      message: assistantMsg,
      conversationId: convId,
    };
  }

  public async streamMessage(
    payload: SendMessagePayload,
    onChunk: (chunk: string) => void,
    onComplete: (fullMessage: ChatMessage) => void,
    onError: (error: any) => void
  ): Promise<void> {
    try {
      // Simulate or execute real streaming
      const result = await this.sendMessage(payload);
      const text = result.message.content;
      const words = text.split(' ');
      let current = '';

      for (let i = 0; i < words.length; i++) {
        current += (i === 0 ? '' : ' ') + words[i];
        onChunk(current);
        await new Promise((r) => setTimeout(r, 25));
      }

      onComplete(result.message);
    } catch (err) {
      onError(err);
    }
  }
}

export const chatService = new ChatService();
