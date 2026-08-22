/**
 * Miley Authentication Service
 * 
 * Handles user login, signup, session verification, token renewal,
 * and user profile queries. Decoupled from visual UI components.
 */

import { API_CONFIG, API_ENDPOINTS } from '../config/api';
import { apiClient } from './apiClient';
import { UserProfile, AuthSession } from '../types/api';

export interface LoginCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password?: string;
  organization?: string;
}

// Initial mock user session for prototype development
const DEFAULT_USER: UserProfile = {
  id: 'usr-882109',
  name: 'Laxmi Patil',
  email: 'laxmi.patil@miley.ai',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'Operations Director',
  organization: 'Miley Enterprise',
  createdAt: '2026-01-15T08:00:00Z',
  updatedAt: '2026-08-21T08:30:00Z',
};

class AuthService {
  private currentSession: AuthSession = {
    user: DEFAULT_USER,
    accessToken: 'mock_jwt_token_miley_2026',
    isAuthenticated: true,
  };

  constructor() {
    this.initFromStorage();
  }

  private initFromStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const savedToken = localStorage.getItem(API_CONFIG.storageKeys.authToken);
        const savedProfile = localStorage.getItem(API_CONFIG.storageKeys.userProfile);

        if (savedToken && savedProfile) {
          this.currentSession = {
            user: JSON.parse(savedProfile),
            accessToken: savedToken,
            isAuthenticated: true,
          };
          apiClient.setToken(savedToken);
        } else {
          // Initialize default session for immediate usability
          this.saveSession(this.currentSession);
        }
      } catch {
        // Local storage unavailable
      }
    }
  }

  private saveSession(session: AuthSession): void {
    this.currentSession = session;
    if (typeof window !== 'undefined') {
      try {
        if (session.accessToken) {
          apiClient.setToken(session.accessToken);
          localStorage.setItem(API_CONFIG.storageKeys.authToken, session.accessToken);
        } else {
          apiClient.setToken(null);
          localStorage.removeItem(API_CONFIG.storageKeys.authToken);
        }

        if (session.user) {
          localStorage.setItem(API_CONFIG.storageKeys.userProfile, JSON.stringify(session.user));
        } else {
          localStorage.removeItem(API_CONFIG.storageKeys.userProfile);
        }
      } catch {
        // Storage fail
      }
    }
  }

  public getSession(): AuthSession {
    return this.currentSession;
  }

  public getCurrentUser(): UserProfile | null {
    return this.currentSession.user;
  }

  public isAuthenticated(): boolean {
    return this.currentSession.isAuthenticated && !!this.currentSession.accessToken;
  }

  public async login(credentials: LoginCredentials): Promise<AuthSession> {
    try {
      const response = await apiClient.post<AuthSession>(API_ENDPOINTS.auth.login, credentials, { skipAuth: true });
      if (response.data) {
        this.saveSession(response.data);
        return response.data;
      }
    } catch (error) {
      if (!API_CONFIG.useMockFallback) throw error;
      
      // Fallback prototype response
      const mockSession: AuthSession = {
        user: {
          ...DEFAULT_USER,
          email: credentials.email,
          name: credentials.email.split('@')[0].replace('.', ' '),
        },
        accessToken: `jwt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        isAuthenticated: true,
      };
      this.saveSession(mockSession);
      return mockSession;
    }

    return this.currentSession;
  }

  public async signup(credentials: SignupCredentials): Promise<AuthSession> {
    try {
      const response = await apiClient.post<AuthSession>(API_ENDPOINTS.auth.signup, credentials, { skipAuth: true });
      if (response.data) {
        this.saveSession(response.data);
        return response.data;
      }
    } catch (error) {
      if (!API_CONFIG.useMockFallback) throw error;

      const mockSession: AuthSession = {
        user: {
          id: `usr-${Date.now()}`,
          name: credentials.name,
          email: credentials.email,
          organization: credentials.organization || 'Miley Workspace',
          role: 'Workspace Member',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        accessToken: `jwt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        isAuthenticated: true,
      };
      this.saveSession(mockSession);
      return mockSession;
    }

    return this.currentSession;
  }

  public async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.auth.logout);
    } catch {
      // Continue cleanup regardless of server response
    } finally {
      this.saveSession({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      });
    }
  }

  public async getProfile(): Promise<UserProfile> {
    try {
      const response = await apiClient.get<UserProfile>(API_ENDPOINTS.auth.me);
      if (response.data) {
        this.currentSession.user = response.data;
        this.saveSession(this.currentSession);
        return response.data;
      }
    } catch (error) {
      if (!API_CONFIG.useMockFallback) throw error;
    }

    return this.currentSession.user || DEFAULT_USER;
  }
}

export const authService = new AuthService();
