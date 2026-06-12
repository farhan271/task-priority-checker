import { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import TaskCard from './TaskCard';

const FILTERS = ['All', 'High', 'Medium', 'Low', 'Completed'];

export default function TaskList() {
  const { tasks, loading, error } = useTasks();
  const [filter, setFilter] = useState('All');

  const filtered = tasks.filter((t) => {
    if (filter === 'All') return true;
    if (filter === 'Completed') return t.completed;
    return t.priority === filter && !t.completed;
  });

  const counts = {
    All: tasks.length,
    High: tasks.filter((t) => t.priority === 'High' && !t.completed).length,
    Medium: tasks.filter((t) => t.priority === 'Medium' && !t.completed).length,
    Low: tasks.filter((t) => t.priority === 'Low' && !t.completed).length,
    Completed: tasks.filter((t) => t.completed).length,
  };

  if (error) {
    return (
      <div className="state-box error-state">
        <span className="state-icon">⚠️</span>
        <p>Failed to load tasks: {error}</p>
      </div>
    );
  }

  return (
    <div className="task-list-section">
      <div className="list-header">
        <h2 className="list-title">Tasks</h2>
        <span className="task-count">{tasks.length} total</span>
      </div>

      {/* Filter tabs */}
      <div className="filter-tabs" role="tablist">
        {FILTERS.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
            {counts[f] > 0 && <span className="tab-count">{counts[f]}</span>}
          </button>
        ))}
      </div>

      {/* Loading skeleton */}
      {loading && tasks.length === 0 && (
        <div className="skeleton-list">
          {[1, 2, 3].map((n) => (
            <div key={n} className="skeleton-card" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="state-box empty-state">
          <span className="state-icon">{filter === 'All' ? '📋' : '🔍'}</span>
          <p>
            {filter === 'All'
              ? 'No tasks yet. Add your first task!'
              : `No ${filter.toLowerCase()} tasks.`}
          </p>
        </div>
      )}

      {/* Task cards */}
      <div className="cards-grid">
        {filtered.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
}
