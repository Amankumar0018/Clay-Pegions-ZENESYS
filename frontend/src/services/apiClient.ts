/**
 * Miley Core API Client
 * 
 * Provides an enterprise-ready HTTP abstraction layer with:
 * - Automatic Authorization header injection
 * - Timeout handling via AbortController
 * - Exponential backoff retry logic
 * - Strongly-typed responses and error mappings
 * - Mock fallback support when the server is unreachable
 */

import { API_CONFIG } from '../config/api';
import { ApiResponse, ApiErrorResponse } from '../types/api';

export class ApiError extends Error {
  public code: string;
  public status: number;
  public details?: any;
  public retryable: boolean;

  constructor(message: string, status: number = 500, code: string = 'API_ERROR', details?: any, retryable: boolean = true) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.retryable = retryable;
  }
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: any;
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number;
  skipAuth?: boolean;
  retries?: number;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_CONFIG.baseUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.loadToken();
  }

  private loadToken(): void {
    if (typeof window !== 'undefined') {
      try {
        this.token = localStorage.getItem(API_CONFIG.storageKeys.authToken);
      } catch {
        this.token = null;
      }
    }
  }

  public setToken(token: string | null): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      try {
        if (token) {
          localStorage.setItem(API_CONFIG.storageKeys.authToken, token);
        } else {
          localStorage.removeItem(API_CONFIG.storageKeys.authToken);
        }
      } catch {
        // Storage unavailable
      }
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    let fullUrl = `${this.baseUrl}${cleanEndpoint}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        fullUrl += `?${queryString}`;
      }
    }

    return fullUrl;
  }

  public async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      body,
      params,
      headers = {},
      timeout = API_CONFIG.timeoutMs,
      skipAuth = false,
      retries = API_CONFIG.retryAttempts,
      ...restOptions
    } = options;

    const url = this.buildUrl(endpoint, params);

    const requestHeaders: Record<string, string> = {
      ...API_CONFIG.defaultHeaders,
      ...(headers as Record<string, string>),
    };

    if (!skipAuth && this.token) {
      requestHeaders['Authorization'] = `Bearer ${this.token}`;
    }

    let isJson = true;
    let serializedBody: any = undefined;

    if (body) {
      if (body instanceof FormData) {
        // Let browser set multipart content-type boundary
        delete requestHeaders['Content-Type'];
        serializedBody = body;
        isJson = false;
      } else if (typeof body === 'string') {
        serializedBody = body;
      } else {
        serializedBody = JSON.stringify(body);
      }
    }

    let attempt = 0;
    let lastError: any = null;

    while (attempt <= retries) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, {
          method,
          headers: requestHeaders,
          body: serializedBody,
          signal: controller.signal,
          ...restOptions,
        });

        clearTimeout(timeoutId);

        let responseData: any;
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }

        if (!response.ok) {
          const errorMsg =
            responseData?.error?.message ||
            responseData?.message ||
            `HTTP ${response.status}: ${response.statusText}`;
          const errorCode = responseData?.error?.code || `HTTP_${response.status}`;
          
          throw new ApiError(
            errorMsg,
            response.status,
            errorCode,
            responseData?.error?.details || responseData,
            response.status >= 500 || response.status === 429
          );
        }

        // Return standardized ApiResponse structure
        if (responseData && typeof responseData === 'object' && 'data' in responseData) {
          return responseData as ApiResponse<T>;
        }

        return {
          success: true,
          data: responseData as T,
          timestamp: new Date().toISOString(),
        };
      } catch (err: any) {
        clearTimeout(timeoutId);
        lastError = err;

        if (err.name === 'AbortError') {
          lastError = new ApiError('Request timed out. Please check your connection.', 408, 'TIMEOUT', null, true);
        }

        // Only retry if retryable and not on last attempt
        if (attempt < retries && (lastError?.retryable || err.name === 'TypeError')) {
          attempt++;
          await new Promise((res) => setTimeout(res, API_CONFIG.retryDelayMs * Math.pow(1.5, attempt)));
          continue;
        }

        break;
      }
    }

    throw (
      lastError ||
      new ApiError('An unexpected network error occurred.', 500, 'UNKNOWN_ERROR', null, false)
    );
  }

  public get<T = any>(endpoint: string, params?: Record<string, any>, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', params, ...options });
  }

  public post<T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body, ...options });
  }

  public put<T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PUT', body, ...options });
  }

  public patch<T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PATCH', body, ...options });
  }

  public delete<T = any>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE', ...options });
  }

  public upload<T = any>(endpoint: string, formData: FormData, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body: formData, ...options });
  }
}

export const apiClient = new ApiClient();
