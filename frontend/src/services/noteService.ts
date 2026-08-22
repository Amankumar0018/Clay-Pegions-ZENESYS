/**
 * Miley Knowledge Base & Notes Service
 * 
 * Provides decoupled CRUD persistence for user notes, supplier audit logs,
 * tag taxonomies, and strategic knowledge documents.
 */

import { API_CONFIG, API_ENDPOINTS } from '../config/api';
import { apiClient } from './apiClient';
import { NoteItem } from '../types';
import { INITIAL_NOTES } from '../data/mockData';

export interface CreateNotePayload {
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPinned?: boolean;
}

export interface NoteFilterOptions {
  category?: string;
  tag?: string;
  search?: string;
}

class NoteService {
  private memoryNotes: NoteItem[] = [...INITIAL_NOTES];

  public async getNotes(filter?: NoteFilterOptions): Promise<NoteItem[]> {
    try {
      const response = await apiClient.get<NoteItem[]>(API_ENDPOINTS.notes.list, filter);
      if (response.data) {
        this.memoryNotes = response.data;
        return response.data;
      }
    } catch (error) {
      if (!API_CONFIG.useMockFallback) throw error;
    }

    let result = [...this.memoryNotes];
    if (filter?.tag && filter.tag !== 'All') {
      result = result.filter((n) => n.tags.includes(filter.tag!));
    }
    if (filter?.category && filter.category !== 'All') {
      result = result.filter((n) => n.category === filter.category);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }

  public async getNote(id: string): Promise<NoteItem | null> {
    try {
      const response = await apiClient.get<NoteItem>(API_ENDPOINTS.notes.detail(id));
      if (response.data) return response.data;
    } catch (error) {
      if (!API_CONFIG.useMockFallback) throw error;
    }
    return this.memoryNotes.find((n) => n.id === id) || null;
  }

  public async createNote(payload: CreateNotePayload): Promise<NoteItem> {
    try {
      const response = await apiClient.post<NoteItem>(API_ENDPOINTS.notes.create, payload);
      if (response.data) {
        this.memoryNotes.unshift(response.data);
        return response.data;
      }
    } catch (error) {
      if (!API_CONFIG.useMockFallback) throw error;
    }

    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: payload.title,
      content: payload.content,
      category: payload.category || 'Operations',
      tags: payload.tags.length > 0 ? payload.tags : ['General'],
      excerpt: payload.content.slice(0, 110) + (payload.content.length > 110 ? '...' : ''),
      updatedAt: 'Just now',
      isPinned: payload.isPinned ?? false,
    };

    this.memoryNotes.unshift(newNote);
    return newNote;
  }

  public async updateNote(id: string, updates: Partial<NoteItem>): Promise<NoteItem> {
    try {
      const response = await apiClient.patch<NoteItem>(API_ENDPOINTS.notes.update(id), updates);
      if (response.data) {
        this.memoryNotes = this.memoryNotes.map((n) => (n.id === id ? response.data : n));
        return response.data;
      }
    } catch (error) {
      if (!API_CONFIG.useMockFallback) throw error;
    }

    let updatedNote: NoteItem | null = null;
    this.memoryNotes = this.memoryNotes.map((n) => {
      if (n.id === id) {
        const excerpt = updates.content
          ? updates.content.slice(0, 110) + '...'
          : n.excerpt;
        updatedNote = { ...n, ...updates, excerpt, updatedAt: 'Just now' };
        return updatedNote;
      }
      return n;
    });

    if (!updatedNote) throw new Error(`Note with id ${id} not found.`);
    return updatedNote;
  }

  public async deleteNote(id: string): Promise<boolean> {
    try {
      await apiClient.delete(API_ENDPOINTS.notes.delete(id));
    } catch (error) {
      if (!API_CONFIG.useMockFallback) throw error;
    }

    this.memoryNotes = this.memoryNotes.filter((n) => n.id !== id);
    return true;
  }
}

export const noteService = new NoteService();
