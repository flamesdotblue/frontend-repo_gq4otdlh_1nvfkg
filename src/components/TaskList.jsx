import { useState } from 'react';
import { CheckCircle2, Circle, Edit, Trash2 } from 'lucide-react';

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d)) return null;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function PriorityBadge({ level }) {
  const color = level === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
    : level === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>{level}</span>;
}

export default function TaskList({ tasks, onToggleComplete, onDelete, onUpdate }) {
  if (!tasks.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
        No tasks match your filters. Add a new task to get started.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          onToggle={() => onToggleComplete(task.id)}
          onDelete={() => onDelete(task.id)}
          onSave={(updates) => onUpdate(task.id, updates)}
        />
      ))}
    </ul>
  );
}

function TaskRow({ task, onToggle, onDelete, onSave }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [dueDate, setDueDate] = useState(task.dueDate || '');
  const [priority, setPriority] = useState(task.priority || 'Medium');

  const save = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim(), description: description.trim(), dueDate: dueDate || null, priority });
    setEditing(false);
  };

  const cancel = () => {
    setTitle(task.title);
    setDescription(task.description || '');
    setDueDate(task.dueDate || '');
    setPriority(task.priority || 'Medium');
    setEditing(false);
  };

  return (
    <li className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start gap-3">
        <button
          aria-label={task.completed ? 'Mark as pending' : 'Mark as completed'}
          onClick={onToggle}
          className="mt-1 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
        >
          {task.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
        </button>

        <div className="flex-1">
          {editing ? (
            <div className="space-y-2">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
              />
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Due date</label>
                  <input
                    type="date"
                    value={dueDate || ''}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className={`text-base font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-gray-100'}`}>{task.title}</h3>
                <PriorityBadge level={task.priority || 'Medium'} />
                {task.dueDate && (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    Due {formatDate(task.dueDate)}
                  </span>
                )}
              </div>
              {task.description && (
                <p className={`text-sm ${task.completed ? 'text-gray-400 line-through' : 'text-gray-600 dark:text-gray-300'}`}>{task.description}</p>
              )}
            </div>
          )}

          <div className="mt-3 flex items-center gap-2">
            {editing ? (
              <>
                <button onClick={save} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500">Save</button>
                <button onClick={cancel} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">Cancel</button>
              </>
            ) : (
              <>
                <button onClick={() => setEditing(true)} className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
                  <Edit size={16} /> Edit
                </button>
                <button onClick={onDelete} className="inline-flex items-center gap-1 rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20">
                  <Trash2 size={16} /> Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
