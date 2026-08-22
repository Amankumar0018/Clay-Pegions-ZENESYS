/**
 * Miley Calendar & Schedule Management Service
 * 
 * Provides clean CRUD endpoints for operational reviews, executive meetings,
 * supplier deadlines, and milestone scheduling.
 */

import { API_CONFIG, API_ENDPOINTS } from '../config/api';
import { apiClient } from './apiClient';
import { CalendarEvent } from '../types';
import { INITIAL_CALENDAR_EVENTS } from '../data/mockData';

export interface CreateEventPayload {
  title: string;
  date: string;
  time: string;
  duration: string;
  category: CalendarEvent['category'];
  attendees: string[];
  location?: string;
  description?: string;
}

class CalendarService {
  private memoryEvents: CalendarEvent[] = [...INITIAL_CALENDAR_EVENTS];

  public async getEvents(startDate?: string, endDate?: string): Promise<CalendarEvent[]> {
    try {
      const response = await apiClient.get<CalendarEvent[]>(API_ENDPOINTS.calendar.events, {
        startDate,
        endDate,
      });
      if (response.data) {
        this.memoryEvents = response.data;
        return response.data;
      }
    } catch (error) {
      if (!API_CONFIG.useMockFallback) throw error;
    }
    return this.memoryEvents;
  }

  public async getEvent(id: string): Promise<CalendarEvent | null> {
    try {
      const response = await apiClient.get<CalendarEvent>(API_ENDPOINTS.calendar.detail(id));
      if (response.data) return response.data;
    } catch (error) {
      if (!API_CONFIG.useMockFallback) throw error;
    }
    return this.memoryEvents.find((e) => e.id === id) || null;
  }

  public async createEvent(payload: CreateEventPayload): Promise<CalendarEvent> {
    try {
      const response = await apiClient.post<CalendarEvent>(API_ENDPOINTS.calendar.create, payload);
      if (response.data) {
        this.memoryEvents.push(response.data);
        return response.data;
      }
    } catch (error) {
      if (!API_CONFIG.useMockFallback) throw error;
    }

    const newEvent: CalendarEvent = {
      id: `evt-${Date.now()}`,
      title: payload.title,
      date: payload.date,
      time: payload.time,
      duration: payload.duration,
      category: payload.category,
      attendees: payload.attendees.length > 0 ? payload.attendees : ['Laxmi Patil'],
      location: payload.location || 'Meeting Room 4B / Google Meet',
      description: payload.description,
    };

    this.memoryEvents.push(newEvent);
    return newEvent;
  }

  public async updateEvent(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> {
    try {
      const response = await apiClient.patch<CalendarEvent>(API_ENDPOINTS.calendar.update(id), updates);
      if (response.data) {
        this.memoryEvents = this.memoryEvents.map((e) => (e.id === id ? response.data : e));
        return response.data;
      }
    } catch (error) {
      if (!API_CONFIG.useMockFallback) throw error;
    }

    let updatedEvent: CalendarEvent | null = null;
    this.memoryEvents = this.memoryEvents.map((e) => {
      if (e.id === id) {
        updatedEvent = { ...e, ...updates };
        return updatedEvent;
      }
      return e;
    });

    if (!updatedEvent) throw new Error(`Event with id ${id} not found.`);
    return updatedEvent;
  }

  public async deleteEvent(id: string): Promise<boolean> {
    try {
      await apiClient.delete(API_ENDPOINTS.calendar.delete(id));
    } catch (error) {
      if (!API_CONFIG.useMockFallback) throw error;
    }

    this.memoryEvents = this.memoryEvents.filter((e) => e.id !== id);
    return true;
  }
}

export const calendarService = new CalendarService();
