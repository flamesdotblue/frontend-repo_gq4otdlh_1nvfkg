import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import TaskForm from './components/TaskForm.jsx';
import TaskControls from './components/TaskControls.jsx';
import TaskList from './components/TaskList.jsx';

function uuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all'); // all | pending | completed
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('created_desc'); // created_desc | created_asc | due_asc | priority_desc | status

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('tasks_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setTasks(parsed);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('tasks_v1', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = ({ title, description, dueDate, priority }) => {
    const now = new Date().toISOString();
    const newTask = {
      id: uuid(),
      title,
      description: description || '',
      dueDate: dueDate || null,
      priority: priority || 'Medium',
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (id, updates) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)));
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() } : t)));
  };

  const visibleTasks = useMemo(() => {
    let list = [...tasks];

    // Filter by status
    if (filter === 'pending') list = list.filter((t) => !t.completed);
    if (filter === 'completed') list = list.filter((t) => t.completed);

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) =>
        (t.title && t.title.toLowerCase().includes(q)) ||
        (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Sort
    const priorityWeight = { High: 3, Medium: 2, Low: 1 };
    list.sort((a, b) => {
      switch (sort) {
        case 'created_asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'due_asc':
          return (a.dueDate ? new Date(a.dueDate).getTime() : Infinity) - (b.dueDate ? new Date(b.dueDate).getTime() : Infinity);
        case 'priority_desc':
          return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
        case 'status':
          return Number(a.completed) - Number(b.completed);
        case 'created_desc':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return list;
  }, [tasks, filter, search, sort]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-gray-950 dark:text-gray-100">
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:pt-10">
        <Header />

        <div className="mt-6 space-y-4">
          <TaskForm onAdd={addTask} />
          <TaskControls
            filter={filter}
            onFilterChange={setFilter}
            search={search}
            onSearchChange={setSearch}
            sort={sort}
            onSortChange={setSort}
          />
          <TaskList
            tasks={visibleTasks}
            onToggleComplete={toggleComplete}
            onDelete={deleteTask}
            onUpdate={updateTask}
          />
        </div>
      </div>
    </div>
  );
}
