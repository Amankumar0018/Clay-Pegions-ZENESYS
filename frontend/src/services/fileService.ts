/**
 * Miley Document & File Intelligence Service
 * 
 * Manages file uploads, cloud storage ingestion, metadata extraction,
 * and contextual AI grounding endpoints.
 */

import { API_CONFIG, API_ENDPOINTS } from '../config/api';
import { apiClient } from './apiClient';
import { FileDocument } from '../types';
import { INITIAL_FILES } from '../data/mockData';

export type FileUploadState = 'idle' | 'uploading' | 'processing' | 'ready' | 'error';

export interface FileAnalysisResponse {
  fileId: string;
  summary: string;
  keyInsights: string[];
  extractedMetrics: Record<string, string>;
  status: 'Analyzed' | 'Ready' | 'Error';
}

class FileService {
  private memoryFiles: FileDocument[] = [...INITIAL_FILES];

  public async getFiles(): Promise<FileDocument[]> {
    try {
      const response = await apiClient.get<FileDocument[]>(API_ENDPOINTS.files.list);
      if (response.data) {
        this.memoryFiles = response.data;
        return response.data;
      }
    } catch (error) {
      if (!API_CONFIG.useMockFallback) throw error;
    }
    return this.memoryFiles;
  }

  public async getFile(id: string): Promise<FileDocument | null> {
    try {
      const response = await apiClient.get<FileDocument>(API_ENDPOINTS.files.detail(id));
      if (response.data) return response.data;
    } catch (error) {
      if (!API_CONFIG.useMockFallback) throw error;
    }
    return this.memoryFiles.find((f) => f.id === id) || null;
  }

  public async uploadFile(
    file: File | { name: string; size?: string; type?: string },
    onProgress?: (progress: number) => void
  ): Promise<FileDocument> {
    try {
      if (file instanceof File) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await apiClient.upload<FileDocument>(API_ENDPOINTS.files.upload, formData);
        if (response.data) {
          this.memoryFiles.unshift(response.data);
          return response.data;
        }
      }
    } catch (error) {
      if (!API_CONFIG.useMockFallback) throw error;
    }

    // Mock Upload Progress Simulation
    if (onProgress) {
      onProgress(30);
      await new Promise((r) => setTimeout(r, 200));
      onProgress(70);
      await new Promise((r) => setTimeout(r, 200));
      onProgress(100);
    }

    const fileName = file.name;
    const docType = fileName.endsWith('.pdf')
      ? 'PDF Document'
      : fileName.endsWith('.xlsx')
      ? 'Spreadsheet'
      : fileName.endsWith('.csv')
      ? 'CSV Data'
      : 'Document';

    const newDoc: FileDocument = {
      id: `file-${Date.now()}`,
      name: fileName,
      size: typeof file.size === 'number' ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : file.size || '1.2 MB',
      type: docType,
      uploadedAt: 'Just now',
      status: 'Analyzed',
      summary: `Document automatically parsed and indexed into Miley Knowledge Graph. Telemetry metrics, regional variations, and supplier lead time risks are immediately available for queries.`,
      keyInsights: [
        'All line items mapped to corresponding SKUs in the inventory database.',
        'Lead time variance flagged for Western corridor transits.',
        'Ready for conversational Q&A in AI Assistant.',
      ],
      extractedMetrics: {
        'Processing Status': 'Complete',
        'Indexed Records': '248 Lines',
        'Confidence': '94.2%',
      },
    };

    this.memoryFiles.unshift(newDoc);
    return newDoc;
  }

  public async deleteFile(id: string): Promise<boolean> {
    try {
      await apiClient.delete(API_ENDPOINTS.files.delete(id));
    } catch (error) {
      if (!API_CONFIG.useMockFallback) throw error;
    }

    this.memoryFiles = this.memoryFiles.filter((f) => f.id !== id);
    return true;
  }

  public async analyzeDocument(fileId: string): Promise<FileAnalysisResponse> {
    try {
      const response = await apiClient.post<FileAnalysisResponse>(API_ENDPOINTS.files.analyze(fileId));
      if (response.data) return response.data;
    } catch (error) {
      if (!API_CONFIG.useMockFallback) throw error;
    }

    const doc = this.memoryFiles.find((f) => f.id === fileId);
    return {
      fileId,
      summary: doc?.summary || 'Document analyzed.',
      keyInsights: doc?.keyInsights || [],
      extractedMetrics: doc?.extractedMetrics || {},
      status: 'Analyzed',
    };
  }
}

export const fileService = new FileService();
