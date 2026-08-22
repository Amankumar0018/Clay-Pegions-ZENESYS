/**
 * Miley Central API & Environment Configuration
 * 
 * Provides unified endpoint URLs, timeout configurations, and environment
 * switching without requiring modifications to UI components.
 */

// Read from environment variable or fallback to standard relative proxy path
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string) ||
  (typeof window !== 'undefined' && window.location.origin
    ? `${window.location.origin}/api`
    : '/api');

export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  timeoutMs: 15000,
  retryAttempts: 2,
  retryDelayMs: 800,
  
  // Storage keys
  storageKeys: {
    authToken: 'miley_auth_token',
    refreshToken: 'miley_refresh_token',
    userProfile: 'miley_user_profile',
    activeConversationId: 'miley_active_conversation_id',
    settings: 'miley_user_settings',
  },

  // Headers
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client-Version': '3.2.0',
    'X-Client-App': 'Miley-Web',
  },

  /**
   * Mock fallback flag:
   * When true, if a backend network call fails or isn't running yet, services seamlessly
   * fall back to the built-in mock engine so the UI remains 100% interactive and functional.
   */
  useMockFallback: true,
};

/**
 * Standardized API endpoint paths
 */
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    logout: '/auth/logout',
    me: '/auth/me',
    refreshToken: '/auth/refresh',
  },
  chat: {
    conversations: '/chat/conversations',
    conversation: (id: string) => `/chat/conversations/${id}`,
    messages: (conversationId: string) => `/chat/conversations/${conversationId}/messages`,
    send: '/chat/send',
    stream: '/chat/stream',
    search: '/chat/search',
  },
  tasks: {
    list: '/tasks',
    detail: (id: string) => `/tasks/${id}`,
    create: '/tasks',
    update: (id: string) => `/tasks/${id}`,
    delete: (id: string) => `/tasks/${id}`,
    organize: '/tasks/ai-organize',
  },
  notes: {
    list: '/notes',
    detail: (id: string) => `/notes/${id}`,
    create: '/notes',
    update: (id: string) => `/notes/${id}`,
    delete: (id: string) => `/notes/${id}`,
  },
  files: {
    list: '/files',
    detail: (id: string) => `/files/${id}`,
    upload: '/files/upload',
    delete: (id: string) => `/files/${id}`,
    analyze: (id: string) => `/files/${id}/analyze`,
    chat: (id: string) => `/files/${id}/chat`,
  },
  calendar: {
    events: '/calendar/events',
    detail: (id: string) => `/calendar/events/${id}`,
    create: '/calendar/events',
    update: (id: string) => `/calendar/events/${id}`,
    delete: (id: string) => `/calendar/events/${id}`,
  },
  user: {
    profile: '/user/profile',
    settings: '/user/settings',
    persona: '/user/persona',
  },
  notifications: {
    list: '/notifications',
    markRead: (id: string) => `/notifications/${id}/read`,
    markAllRead: '/notifications/mark-all-read',
    delete: (id: string) => `/notifications/${id}`,
  },
  operations: {
    inventory: '/operations/inventory',
    suppliers: '/operations/suppliers',
    orders: '/operations/orders',
    decisions: '/operations/decisions',
    attention: '/operations/attention-items',
    alerts: '/operations/alerts',
    createPO: '/operations/purchase-orders',
    approveDecision: (id: string) => `/operations/decisions/${id}/approve`,
    snoozeDecision: (id: string) => `/operations/decisions/${id}/snooze`,
    simulate: '/operations/simulate',
  },
};
