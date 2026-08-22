import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Plus,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Video,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CalendarEvent } from '../types';

export const CalendarScreen: React.FC = () => {
  const { calendarEvents, addCalendarEvent } = useApp();

  const [selectedDay, setSelectedDay] = useState<'Today' | 'Tomorrow' | 'Aug 25' | 'All'>('Today');
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  // New event form
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('Today');
  const [time, setTime] = useState('03:30 PM - 04:15 PM');
  const [duration, setDuration] = useState('45m');
  const [category, setCategory] = useState<CalendarEvent['category']>('Meeting');
  const [location, setLocation] = useState('Google Meet / Room 2');
  const [attendeesStr, setAttendeesStr] = useState('Laxmi Patil, Logistics Lead');
  const [description, setDescription] = useState('');

  const filteredEvents = calendarEvents.filter((ev) => {
    if (selectedDay === 'All') return true;
    return ev.date === selectedDay;
  });

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addCalendarEvent({
      title: title.trim(),
      date,
      time,
      duration,
      category,
      location,
      attendees: attendeesStr.split(',').map((s) => s.trim()).filter(Boolean),
      description,
    });

    setTitle('');
    setDescription('');
    setIsAddingEvent(false);
  };

  const getCategoryColor = (cat: CalendarEvent['category']) => {
    switch (cat) {
      case 'Review':
        return 'bg-[#EBF1F6] text-[#3B6E8C] border-[#CFDEE8]';
      case 'Meeting':
        return 'bg-[#EAF2ED] text-[#3D7A5A] border-[#CDE3D5]';
      case 'Milestone':
        return 'bg-[#FAECE8] text-[#C86D51] border-[#F3CEC5]';
      case 'Strategy':
      default:
        return 'bg-[#FBF2E7] text-[#C4842E] border-[#F5DCBD]';
    }
  };

  return (
    <div id="calendar-screen-container" className="space-y-6 pb-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#232220]">Schedule & Milestones</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#F0EAE1] text-[#7A5043]">
              August 2026
            </span>
          </div>
          <p className="text-xs text-[#7A756D] mt-0.5">
            Operational syncs, vendor SLA reviews, and fulfillment intake milestones.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="add-event-btn"
            onClick={() => setIsAddingEvent(!isAddingEvent)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C86D51] hover:bg-[#B75F44] text-white text-xs font-semibold shadow-2xs transition-all hover:shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Sync</span>
          </button>
        </div>
      </div>

      {/* Date Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#FAF8F5] rounded-xl border border-[#EBE6DC]">
        <div className="flex items-center gap-1.5">
          <CalendarIcon className="w-4 h-4 text-[#7A756D] mr-1" />
          {(['Today', 'Tomorrow', 'Aug 25', 'All'] as const).map((day) => (
            <button
              key={day}
              id={`cal-day-filter-${day}`}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedDay === day
                  ? 'bg-[#C86D51] text-white font-semibold shadow-2xs'
                  : 'bg-[#EFEBE3] text-[#5A554D] hover:bg-[#E7E1D6]'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="text-xs text-[#7A756D] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#3D7A5A]"></span>
          <span>Timezone: IST (India Standard Time)</span>
        </div>
      </div>

      {/* Add Event Drawer / Form */}
      {isAddingEvent && (
        <form
          id="new-event-form"
          onSubmit={handleAddEvent}
          className="bg-white p-5 rounded-2xl border border-[#DFD7CB] shadow-xs space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-[#EFEBE3] pb-3">
            <h3 className="text-sm font-bold text-[#232220]">Schedule New Operational Sync</h3>
            <button
              type="button"
              onClick={() => setIsAddingEvent(false)}
              className="text-xs text-[#7A756D] hover:text-[#232220]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-[#4A463F]">Event Title *</label>
              <input
                id="event-title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Weekly Supply Chain Velocity Sync..."
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E2DDD3] text-[#232220] focus:outline-hidden focus:border-[#C86D51]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#4A463F]">Date</label>
              <select
                id="event-date-select"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E2DDD3] text-[#232220] focus:outline-hidden focus:border-[#C86D51]"
              >
                <option value="Today">Today (Aug 22)</option>
                <option value="Tomorrow">Tomorrow (Aug 23)</option>
                <option value="Aug 25">Aug 25, 2026</option>
                <option value="Aug 27">Aug 27, 2026</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#4A463F]">Time Range</label>
              <input
                id="event-time-input"
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g., 10:00 AM - 10:45 AM"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E2DDD3] text-[#232220] focus:outline-hidden focus:border-[#C86D51]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#4A463F]">Category</label>
              <select
                id="event-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as CalendarEvent['category'])}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E2DDD3] text-[#232220] focus:outline-hidden focus:border-[#C86D51]"
              >
                <option value="Review">Review</option>
                <option value="Meeting">Meeting</option>
                <option value="Milestone">Milestone</option>
                <option value="Strategy">Strategy</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#4A463F]">Location / Link</label>
              <input
                id="event-loc-input"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Meeting Room 3 / Google Meet"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E2DDD3] text-[#232220] focus:outline-hidden focus:border-[#C86D51]"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-[#4A463F]">Attendees (comma-separated)</label>
              <input
                id="event-attendees-input"
                type="text"
                value={attendeesStr}
                onChange={(e) => setAttendeesStr(e.target.value)}
                placeholder="Laxmi Patil, Rajiv Sharma, Warehouse Lead"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E2DDD3] text-[#232220] focus:outline-hidden focus:border-[#C86D51]"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-[#4A463F]">Agenda & Notes</label>
              <textarea
                id="event-agenda-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Key goals, documents to review, or decisions to finalize..."
                rows={2}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E2DDD3] text-[#232220] focus:outline-hidden focus:border-[#C86D51] resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingEvent(false)}
              className="px-3.5 py-1.5 text-xs text-[#7A756D] hover:text-[#232220]"
            >
              Cancel
            </button>
            <button
              id="submit-event-btn"
              type="submit"
              className="px-4 py-2 bg-[#C86D51] hover:bg-[#B75F44] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              Save Schedule
            </button>
          </div>
        </form>
      )}

      {/* Events Timeline / Cards */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center bg-[#FAF8F5] rounded-2xl border border-[#EBE6DC] space-y-2">
            <p className="text-sm font-bold text-[#232220]">No scheduled syncs for this view</p>
            <p className="text-xs text-[#7A756D]">Your calendar is clear. Tap "Schedule Sync" to add a meeting.</p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              id={`cal-event-${event.id}`}
              className="p-5 bg-white rounded-2xl border border-[#E5E0D6] shadow-2xs hover:border-[#D6CEC1] transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#F4EFE6] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${getCategoryColor(event.category)}`}>
                    {event.category}
                  </span>
                  <h3 className="text-sm font-bold text-[#232220]">{event.title}</h3>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#7A756D]">
                  <span className="font-semibold text-[#232220] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#C86D51]" />
                    {event.time}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#EFEBE3] text-[#5A554D] text-[11px] font-medium">
                    {event.duration}
                  </span>
                </div>
              </div>

              {event.description && (
                <p className="text-xs text-[#5A554D] leading-relaxed">
                  {event.description}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-[#7A756D]">
                <div className="flex flex-wrap items-center gap-4">
                  {event.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#A09A8F]" />
                      {event.location}
                    </span>
                  )}
                  {event.attendees.length > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#A09A8F]" />
                      {event.attendees.join(', ')}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[11px] text-[#7A5043] font-medium">
                  <Sparkles className="w-3 h-3 text-[#C86D51]" />
                  <span>Miley briefing ready</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
