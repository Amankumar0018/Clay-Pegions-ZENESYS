import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Sparkles,
  Trash2,
  Calendar,
  Clock,
  AlertCircle,
  Tag,
  CheckCircle2,
  Circle,
  ArrowUpRight,
  Filter,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TaskItem } from '../types';

export const TasksScreen: React.FC = () => {
  const {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    mileyOrganizeTasks,
    setCurrentPage,
    addToast,
  } = useApp();

  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Completed'>('Active');
  const [isCreating, setIsCreating] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState<TaskItem['priority']>('High');
  const [newCategory, setNewCategory] = useState<TaskItem['category']>('Operations');
  const [newDueDate, setNewDueDate] = useState('Today, 5:00 PM');

  const categories = ['All', 'Procurement', 'Logistics', 'Operations', 'Strategy', 'Fulfillment'];

  const filteredTasks = tasks.filter((t) => {
    if (filterCategory !== 'All' && t.category !== filterCategory) return false;
    if (filterStatus === 'Active' && t.completed) return false;
    if (filterStatus === 'Completed' && !t.completed) return false;
    return true;
  });

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const urgentCount = tasks.filter((t) => !t.completed && (t.priority === 'Urgent' || t.priority === 'High')).length;
  const mileySuggestedCount = tasks.filter((t) => t.suggestedByMiley && !t.completed).length;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTask(newTitle.trim(), newPriority, newCategory, newDueDate, newDescription.trim());
    setNewTitle('');
    setNewDescription('');
    setIsCreating(false);
  };

  const getPriorityBadge = (priority: TaskItem['priority']) => {
    switch (priority) {
      case 'Urgent':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FAECE8] text-[#C86D51] border border-[#F3CEC5]">Urgent</span>;
      case 'High':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FBF2E7] text-[#C4842E] border border-[#F5DCBD]">High</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#EAF2ED] text-[#3D7A5A] border border-[#CDE3D5]">Medium</span>;
      case 'Low':
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#EFEBE3] text-[#7A756D] border border-[#E3DDD2]">Low</span>;
    }
  };

  return (
    <div id="tasks-screen-container" className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#232220]">Tasks & Action Plan</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#F0EAE1] text-[#7A5043]">
              {pendingCount} open
            </span>
          </div>
          <p className="text-xs text-[#7A756D] mt-0.5">
            Operational priorities coordinated by Miley and your team.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="miley-organize-btn"
            onClick={mileyOrganizeTasks}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF6F0] hover:bg-[#F2ECE2] text-[#7A5043] border border-[#E5DDD2] text-xs font-semibold shadow-2xs transition-all hover:shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C86D51]" />
            <span>Miley Auto-Prioritize</span>
          </button>

          <button
            id="create-task-open-btn"
            onClick={() => setIsCreating(!isCreating)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C86D51] hover:bg-[#B75F44] text-white text-xs font-semibold shadow-2xs transition-all hover:shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Summary Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EBE6DC] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#7A756D]">
              Actionable Today
            </div>
            <div className="text-2xl font-bold text-[#232220] mt-0.5">{pendingCount}</div>
            <div className="text-[11px] text-[#7A756D] mt-0.5">Items requiring resolution</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#EAE5DC] text-[#4A463F] flex items-center justify-center">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EBE6DC] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#C86D51]">
              High & Urgent Risk
            </div>
            <div className="text-2xl font-bold text-[#C86D51] mt-0.5">{urgentCount}</div>
            <div className="text-[11px] text-[#7A756D] mt-0.5">Stockout & supplier blocks</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FAECE8] text-[#C86D51] flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EBE6DC] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#7A5043]">
              Suggested by Miley
            </div>
            <div className="text-2xl font-bold text-[#7A5043] mt-0.5">{mileySuggestedCount}</div>
            <div className="text-[11px] text-[#7A756D] mt-0.5">Automated mitigation triggers</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F0EAE1] text-[#C86D51] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Inline Create Form */}
      {isCreating && (
        <form
          id="new-task-form"
          onSubmit={handleCreateSubmit}
          className="bg-white p-5 rounded-2xl border border-[#DFD7CB] shadow-xs space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-[#EFEBE3] pb-3">
            <h3 className="text-sm font-bold text-[#232220]">Create New Action Item</h3>
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
              <label className="text-xs font-semibold text-[#4A463F]">Task Title *</label>
              <input
                id="task-title-input"
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., Approve urgent PO for Wireless Earbuds..."
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E2DDD3] text-[#232220] focus:outline-hidden focus:border-[#C86D51]"
                required
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-[#4A463F]">Description / Context (Optional)</label>
              <textarea
                id="task-desc-input"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Add supplier names, expected dates, or operational notes..."
                rows={2}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E2DDD3] text-[#232220] focus:outline-hidden focus:border-[#C86D51] resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#4A463F]">Priority</label>
              <select
                id="task-priority-select"
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as TaskItem['priority'])}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E2DDD3] text-[#232220] focus:outline-hidden focus:border-[#C86D51]"
              >
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#4A463F]">Category</label>
              <select
                id="task-category-select"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as TaskItem['category'])}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E2DDD3] text-[#232220] focus:outline-hidden focus:border-[#C86D51]"
              >
                <option value="Procurement">Procurement</option>
                <option value="Logistics">Logistics</option>
                <option value="Operations">Operations</option>
                <option value="Strategy">Strategy</option>
                <option value="Fulfillment">Fulfillment</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-[#4A463F]">Due Timeline</label>
              <input
                id="task-due-input"
                type="text"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                placeholder="e.g., Today, 4:30 PM or Tomorrow"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E2DDD3] text-[#232220] focus:outline-hidden focus:border-[#C86D51]"
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
              id="submit-task-btn"
              type="submit"
              className="px-4 py-2 bg-[#C86D51] hover:bg-[#B75F44] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              Add to Priority List
            </button>
          </div>
        </form>
      )}

      {/* Filter and View Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#FAF8F5] rounded-xl border border-[#EBE6DC]">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-[#7A756D] mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              id={`filter-cat-${cat}`}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                filterCategory === cat
                  ? 'bg-[#C86D51] text-white font-semibold shadow-2xs'
                  : 'bg-[#EFEBE3] text-[#5A554D] hover:bg-[#E7E1D6]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-[#EFEBE3] p-0.5 rounded-lg border border-[#E3DDD1]">
          {(['Active', 'Completed', 'All'] as const).map((st) => (
            <button
              key={st}
              id={`filter-status-${st}`}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                filterStatus === st
                  ? 'bg-white text-[#232220] shadow-2xs font-semibold'
                  : 'text-[#7A756D] hover:text-[#232220]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center bg-[#FAF8F5] rounded-2xl border border-[#EBE6DC] space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#EFEAE2] text-[#8C857B] flex items-center justify-center">
              <CheckSquare className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#232220]">No tasks found</h3>
            <p className="text-xs text-[#7A756D] max-w-sm mx-auto">
              All tasks under this view have been resolved. Ask Miley to analyze current inventory to suggest new actions.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              id={`task-card-${task.id}`}
              className={`p-4 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                task.completed
                  ? 'bg-[#F6F4F0]/60 border-[#E9E4DC] opacity-75'
                  : 'bg-white border-[#E5E0D6] shadow-2xs hover:border-[#D6CEC1]'
              }`}
            >
              {/* Left Column: Checkbox & Info */}
              <div className="flex items-start gap-3 flex-1">
                <button
                  id={`toggle-task-${task.id}`}
                  onClick={() => toggleTask(task.id)}
                  className="mt-0.5 text-[#C86D51] hover:opacity-80 transition-opacity flex-shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-[#3D7A5A]" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#B8B1A5] hover:text-[#C86D51]" />
                  )}
                </button>

                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-sm font-semibold text-[#232220] ${
                        task.completed ? 'line-through text-[#7A756D]' : ''
                      }`}
                    >
                      {task.title}
                    </span>

                    {getPriorityBadge(task.priority)}

                    {task.suggestedByMiley && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-[#F3ECE0] text-[#7A5043]">
                        <Sparkles className="w-2.5 h-2.5 text-[#C86D51]" />
                        Miley
                      </span>
                    )}
                  </div>

                  {task.description && (
                    <p className="text-xs text-[#6A665E] leading-relaxed">
                      {task.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-[#7A756D]">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3 text-[#A09A8F]" />
                      {task.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#A09A8F]" />
                      {task.dueDate}
                    </span>
                    <span>Assignee: {task.assignee}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                {task.category === 'Procurement' && !task.completed && (
                  <button
                    id={`action-open-procurement-${task.id}`}
                    onClick={() => setCurrentPage('procurement')}
                    className="px-2.5 py-1 text-xs font-semibold bg-[#FAECE8] text-[#C86D51] hover:bg-[#F3DDD7] rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>Open PO</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                )}

                {task.category === 'Logistics' && !task.completed && (
                  <button
                    id={`action-open-fulfillment-${task.id}`}
                    onClick={() => setCurrentPage('fulfillment')}
                    className="px-2.5 py-1 text-xs font-semibold bg-[#EAF2ED] text-[#3D7A5A] hover:bg-[#D9E9DF] rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>Track Fleet</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                )}

                <button
                  id={`delete-task-${task.id}`}
                  onClick={() => deleteTask(task.id)}
                  className="p-1.5 text-[#9C968B] hover:text-[#C86D51] hover:bg-[#F6ECE8] rounded-lg transition-colors"
                  title="Delete task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
