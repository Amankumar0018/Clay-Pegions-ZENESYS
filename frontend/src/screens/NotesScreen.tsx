import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Pin,
  Trash2,
  Edit3,
  Tag,
  Sparkles,
  ArrowRight,
  BookOpen,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NoteItem } from '../types';

export const NotesScreen: React.FC = () => {
  const { notes, addNote, editNote, deleteNote, setCurrentPage } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [activeNote, setActiveNote] = useState<NoteItem | null>(notes[0] || null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Operations');
  const [tagsStr, setTagsStr] = useState('SLA, Logistics');

  // Collect all unique tags
  const allTags = ['All', ...Array.from(new Set(notes.flatMap((n) => n.tags)))];

  const filteredNotes = notes.filter((note) => {
    if (selectedTag !== 'All' && !note.tags.includes(selectedTag)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        note.title.toLowerCase().includes(q) ||
        note.content.toLowerCase().includes(q) ||
        note.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsStr.split(',').map((t) => t.trim()).filter(Boolean);
    addNote(title.trim(), content.trim(), category, tags);

    setTitle('');
    setContent('');
    setIsCreating(false);
  };

  const handleSaveEdit = () => {
    if (!activeNote) return;
    editNote(activeNote.id, {
      title: activeNote.title,
      content: activeNote.content,
      category: activeNote.category,
    });
    setIsEditing(false);
  };

  return (
    <div id="notes-screen-container" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#232220]">Knowledge Base & Notes</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#F0EAE1] text-[#7A5043]">
              {notes.length} entries
            </span>
          </div>
          <p className="text-xs text-[#7A756D] mt-0.5">
            Institutional knowledge, supplier audit logs, and strategic forecast hypotheses.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="create-note-open-btn"
            onClick={() => setIsCreating(!isCreating)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C86D51] hover:bg-[#B75F44] text-white text-xs font-semibold shadow-2xs transition-all hover:shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* Search & Tag Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#FAF8F5] rounded-xl border border-[#EBE6DC]">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A756D]" />
          <input
            id="notes-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, tags, or topics..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-lg bg-[#EFEBE3] border border-[#DFD8CC] text-[#232220] focus:outline-hidden focus:border-[#C86D51]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {allTags.map((tag) => (
            <button
              key={tag}
              id={`tag-filter-${tag}`}
              onClick={() => setSelectedTag(tag)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedTag === tag
                  ? 'bg-[#C86D51] text-white font-semibold shadow-2xs'
                  : 'bg-[#EFEBE3] text-[#5A554D] hover:bg-[#E7E1D6]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Create New Note Modal/Form */}
      {isCreating && (
        <form
          id="new-note-form"
          onSubmit={handleCreateSubmit}
          className="bg-white p-5 rounded-2xl border border-[#DFD7CB] shadow-xs space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-[#EFEBE3] pb-3">
            <h3 className="text-sm font-bold text-[#232220]">Create New Knowledge Document</h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs text-[#7A756D] hover:text-[#232220]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-[#4A463F]">Title *</label>
              <input
                id="note-title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Supplier B Port Delays & SLA Observations..."
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E2DDD3] text-[#232220] focus:outline-hidden focus:border-[#C86D51]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#4A463F]">Category</label>
              <input
                id="note-cat-input"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Suppliers, Demand Planning, Logistics..."
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E2DDD3] text-[#232220] focus:outline-hidden focus:border-[#C86D51]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#4A463F]">Tags (comma-separated)</label>
              <input
                id="note-tags-input"
                type="text"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                placeholder="SLA, Customs, Risk, Pune"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E2DDD3] text-[#232220] focus:outline-hidden focus:border-[#C86D51]"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-[#4A463F]">Content (Markdown supported) *</label>
              <textarea
                id="note-content-input"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write observations, recommendations, and key metric links..."
                rows={6}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E2DDD3] text-[#232220] focus:outline-hidden focus:border-[#C86D51] font-mono"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3.5 py-1.5 text-xs text-[#7A756D] hover:text-[#232220]"
            >
              Cancel
            </button>
            <button
              id="submit-note-btn"
              type="submit"
              className="px-4 py-2 bg-[#C86D51] hover:bg-[#B75F44] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              Save to Knowledge Base
            </button>
          </div>
        </form>
      )}

      {/* Two-Column Master-Detail Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Note Cards (5 cols) */}
        <div className="md:col-span-5 space-y-3">
          {filteredNotes.length === 0 ? (
            <div className="p-8 text-center bg-[#FAF8F5] rounded-xl border border-[#EBE6DC]">
              <p className="text-xs text-[#7A756D]">No notes match your search criteria.</p>
            </div>
          ) : (
            filteredNotes.map((note) => {
              const isSelected = activeNote?.id === note.id;
              return (
                <div
                  key={note.id}
                  id={`note-card-${note.id}`}
                  onClick={() => {
                    setActiveNote(note);
                    setIsEditing(false);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-white border-[#C86D51] shadow-xs'
                      : 'bg-[#FAF8F5] border-[#EBE6DC] hover:bg-white hover:border-[#DFD7CB]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {note.isPinned && (
                        <Pin className="w-3 h-3 text-[#C86D51] flex-shrink-0 fill-[#C86D51]" />
                      )}
                      <h3 className="text-xs font-bold text-[#232220] leading-snug">
                        {note.title}
                      </h3>
                    </div>
                    <span className="text-[10px] text-[#8C857B] flex-shrink-0">
                      {note.updatedAt}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#6A665E] line-clamp-2 leading-relaxed">
                    {note.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center gap-1 pt-1">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#EFEBE3] text-[#5A554D]">
                      {note.category}
                    </span>
                    {note.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-[#F4EFE6] text-[#7A756D]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Note Reading & Editing View (7 cols) */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-[#E5E0D6] shadow-2xs p-6 space-y-5 min-h-[420px]">
          {activeNote ? (
            <>
              {/* Note Header */}
              <div className="flex items-start justify-between gap-4 border-b border-[#F2ECE2] pb-4">
                <div className="space-y-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={activeNote.title}
                      onChange={(e) =>
                        setActiveNote({ ...activeNote, title: e.target.value })
                      }
                      className="w-full text-base font-bold text-[#232220] border-b border-[#C86D51] pb-1 focus:outline-hidden"
                    />
                  ) : (
                    <h2 className="text-base font-bold text-[#232220]">
                      {activeNote.title}
                    </h2>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#7A756D]">
                    <span>Category: <strong>{activeNote.category}</strong></span>
                    <span>•</span>
                    <span>Updated: {activeNote.updatedAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {isEditing ? (
                    <button
                      id="save-note-edit-btn"
                      onClick={handleSaveEdit}
                      className="px-3 py-1.5 bg-[#3D7A5A] hover:bg-[#316348] text-white text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Save</span>
                    </button>
                  ) : (
                    <button
                      id="edit-note-btn"
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 text-[#7A756D] hover:text-[#232220] hover:bg-[#F2ECE2] rounded-lg transition-colors"
                      title="Edit note"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    id="delete-active-note-btn"
                    onClick={() => {
                      deleteNote(activeNote.id);
                      setActiveNote(notes.find((n) => n.id !== activeNote.id) || null);
                    }}
                    className="p-1.5 text-[#9C968B] hover:text-[#C86D51] hover:bg-[#FAECE8] rounded-lg transition-colors"
                    title="Delete note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Note Content Body */}
              <div className="space-y-4">
                {isEditing ? (
                  <textarea
                    value={activeNote.content}
                    onChange={(e) =>
                      setActiveNote({ ...activeNote, content: e.target.value })
                    }
                    rows={12}
                    className="w-full text-xs text-[#232220] bg-[#FAF8F5] p-4 rounded-xl border border-[#E2DDD3] focus:outline-hidden font-mono leading-relaxed resize-none"
                  />
                ) : (
                  <div className="text-xs text-[#33302B] leading-relaxed whitespace-pre-wrap font-sans space-y-3">
                    {activeNote.content}
                  </div>
                )}
              </div>

              {/* Tags and AI Grounding Banner */}
              <div className="pt-4 border-t border-[#F2ECE2] flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#A09A8F]" />
                  {activeNote.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-md bg-[#FAF6F0] border border-[#EBE3D8] text-[#7A5043] font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <button
                  id="ask-miley-about-note-btn"
                  onClick={() => setCurrentPage('ai-assistant')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F6EDE9] hover:bg-[#F1DFD8] text-[#C86D51] text-xs font-semibold rounded-lg transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask Miley about this note</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-2">
              <BookOpen className="w-8 h-8 text-[#A09A8F]" />
              <p className="text-sm font-bold text-[#232220]">Select a note to view</p>
              <p className="text-xs text-[#7A756D]">Choose an entry from the list or create a new note.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
