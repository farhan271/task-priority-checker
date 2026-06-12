import { useTasks } from '../context/TaskContext';

const PRIORITY_META = {
  High: { emoji: '🔴', class: 'priority-high', label: 'High' },
  Medium: { emoji: '🟡', class: 'priority-medium', label: 'Medium' },
  Low: { emoji: '🟢', class: 'priority-low', label: 'Low' },
};

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function isOverdue(dueDate, completed) {
  if (completed) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

export default function TaskCard({ task }) {
  const { toggleTask, deleteTask, setEditing } = useTasks();
  const meta = PRIORITY_META[task.priority] || PRIORITY_META.Medium;
  const overdue = isOverdue(task.dueDate, task.completed);

  return (
    <div className={`task-card ${task.completed ? 'task-completed' : ''} ${overdue ? 'task-overdue' : ''}`}>
      {/* Header row */}
      <div className="task-header">
        <div className="task-title-row">
          <button
            className={`check-btn ${task.completed ? 'checked' : ''}`}
            onClick={() => toggleTask(task._id)}
            title={task.completed ? 'Mark incomplete' : 'Mark complete'}
          >
            {task.completed ? '✓' : ''}
          </button>
          <h3 className={`task-title ${task.completed ? 'struck' : ''}`}>{task.title}</h3>
        </div>

        <span className={`priority-badge ${meta.class}`}>
          {meta.emoji} {meta.label}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      {/* Footer */}
      <div className="task-footer">
        <span className={`due-date ${overdue ? 'overdue-text' : ''}`}>
          {overdue ? '⚠️ Overdue · ' : '📅 '}
          {formatDate(task.dueDate)}
        </span>

        <div className="task-actions">
          <button
            className="btn-edit"
            onClick={() => setEditing(task)}
            title="Edit task"
          >
            Edit
          </button>
          <button
            className="btn-delete"
            onClick={() => {
              if (window.confirm(`Delete "${task.title}"?`)) deleteTask(task._id);
            }}
            title="Delete task"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
