import { Filter, Search } from 'lucide-react';

export default function TaskControls({ filter, onFilterChange, search, onSearchChange, sort, onSortChange }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-900">
        <Search size={18} className="text-gray-500" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
          {['all', 'pending', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`${filter === f ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-200'} px-3 py-1.5 text-sm first:rounded-l-lg last:rounded-r-lg hover:bg-indigo-50 dark:hover:bg-gray-800`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-900">
          <Filter size={16} className="text-gray-500" />
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none"
          >
            <option value="created_desc">Newest first</option>
            <option value="created_asc">Oldest first</option>
            <option value="due_asc">Due date</option>
            <option value="priority_desc">Priority (High → Low)</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>
    </div>
  );
}
