/**
 * API-Ready Data Transfer Objects (DTOs) & Contracts for Miley
 * Standardized for seamless mapping to REST / GraphQL / gRPC backends.
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
    requestId?: string;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    status: number;
    details?: any;
    retryable?: boolean;
  };
  timestamp: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  organization: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken?: string | null;
  expiresAt?: number;
  isAuthenticated: boolean;
}

export interface ConversationThread {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastMessageExcerpt?: string;
  messageCount: number;
}

export interface BackendTask {
  id: string;
  userId?: string;
  title: string;
  description?: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  category: string;
  dueDate: string;
  completed: boolean;
  assignee?: string;
  suggestedByMiley?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BackendNote {
  id: string;
  userId?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BackendFile {
  id: string;
  userId?: string;
  name: string;
  size: string;
  bytes?: number;
  type: string;
  url?: string;
  status: 'Ready' | 'Processing' | 'Analyzed' | 'Error';
  summary: string;
  keyInsights: string[];
  extractedMetrics?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface BackendCalendarEvent {
  id: string;
  userId?: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  category: string;
  attendees: string[];
  location?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BackendNotification {
  id: string;
  userId?: string;
  time: string;
  timestamp: string;
  category: 'Inventory' | 'Demand' | 'Supplier' | 'Fulfillment' | 'System';
  severity: 'Critical' | 'Warning' | 'Info';
  title: string;
  productOrEntity: string;
  description: string;
  isRead: boolean;
  actionLabel?: string;
  targetPage?: string;
  createdAt: string;
}
