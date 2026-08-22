/**
 * Miley Task & Action Management Service
 * 
 * Exposes clean CRUD operations for user tasks, status toggling,
 * and AI-driven prioritization routines.
 */

import { API_CONFIG, API_ENDPOINTS } from '../config/api';
import { apiClient } from './apiClient';
import { TaskItem } from '../types';
import { INITIAL_TASKS } from '../data/mockData';

export interface CreateTaskPayload {
  title: string;
  priority: TaskItem['priority'];
  category: TaskItem['category'];
  dueDate: string;
  description?: string;
  assignee?: string;
  suggestedByMiley?: boolean;
}

export interface TaskFilterOptions {
  category?: string;
  priority?: string;
  completed?: boolean;
  search?: string;
}

class TaskService {
  private memoryTasks: TaskItem[] = [...INITIAL_TASKS];

  public async getTasks(filter?: TaskFilterOptions): Promise<TaskItem[]> {
    try {
      const response = await apiClient.get<TaskItem[]>(API_ENDPOINTS.tasks.list, filter);
      if (response.data) {
        this.memoryTasks = response.data;
        return response.data;
      }
    } catch (error) {
      if (!API_CONFIG.useMockFallback) throw error;
    }

    let result = [...this.memoryTasks];
    if (filter?.category && filter.category !== 'All') {
      result = result.filter((t) => t.category === filter.category);
    }
    if (filter?.completed !== undefined) {
      result = result.filter((t) => t.completed === filter.completed);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }
    return result;
  }

  public async getTask(id: string): Promise<TaskItem | null> {
    try {
      const response = await apiClient.get<TaskItem>(API_ENDPOINTS.tasks.detail(id));
      if (response.data) return response.data;
    } catch (error) {
      if (!API_CONFIG.useMockFallback) throw error;
    }
    return this.memoryTasks.find((t) => t.id === id) || null;
  }

  public async createTask(payload: CreateTaskPayload): Promise<TaskItem> {
    try {
      const response = await apiClient.post<TaskItem>(API_ENDPOINTS.tasks.create, payload);
      if (response.data) {
        this.memoryTasks.unshift(response.data);
        return response.data;
      }
    } catch (error) {
      if (!API_CONFIG.useMockFallback) throw error;
    }

    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: payload.title,
      description: payload.description,
      priority: payload.priority,
      category: payload.category,
      dueDate: payload.dueDate,
      completed: false,
      assignee: payload.assignee || 'Laxmi Patil',
      suggestedByMiley: payload.suggestedByMiley ?? false,
    };

    this.memoryTasks.unshift(newTask);
    return newTask;
  }

  public async updateTask(id: string, updates: Partial<TaskItem>): Promise<TaskItem> {
    try {
      const response = await apiClient.patch<TaskItem>(API_ENDPOINTS.tasks.update(id), updates);
      if (response.data) {
        this.memoryTasks = this.memoryTasks.map((t) => (t.id === id ? response.data : t));
        return response.data;
      }
    } catch (error) {
      if (!API_CONFIG.useMockFallback) throw error;
    }

    let updatedItem: TaskItem | null = null;
    this.memoryTasks = this.memoryTasks.map((t) => {
      if (t.id === id) {
        updatedItem = { ...t, ...updates };
        return updatedItem;
      }
      return t;
    });

    if (!updatedItem) throw new Error(`Task with id ${id} not found.`);
    return updatedItem;
  }

  public async toggleTask(id: string): Promise<TaskItem> {
    const task = this.memoryTasks.find((t) => t.id === id);
    if (!task) throw new Error(`Task with id ${id} not found.`);
    return this.updateTask(id, { completed: !task.completed });
  }

  public async deleteTask(id: string): Promise<boolean> {
    try {
      await apiClient.delete(API_ENDPOINTS.tasks.delete(id));
    } catch (error) {
      if (!API_CONFIG.useMockFallback) throw error;
    }

    this.memoryTasks = this.memoryTasks.filter((t) => t.id !== id);
    return true;
  }

  public async organizeTasksWithAI(): Promise<TaskItem[]> {
    try {
      const response = await apiClient.post<TaskItem[]>(API_ENDPOINTS.tasks.organize);
      if (response.data) {
        this.memoryTasks = response.data;
        return response.data;
      }
    } catch (error) {
      if (!API_CONFIG.useMockFallback) throw error;
    }

    // Sort by priority weighting: Urgent (0) > High (1) > Medium (2) > Low (3)
    const priorityWeight: Record<string, number> = {
      Urgent: 0,
      High: 1,
      Medium: 2,
      Low: 3,
    };

    this.memoryTasks = [...this.memoryTasks].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return (priorityWeight[a.priority] ?? 2) - (priorityWeight[b.priority] ?? 2);
    });

    return this.memoryTasks;
  }
}

export const taskService = new TaskService();
