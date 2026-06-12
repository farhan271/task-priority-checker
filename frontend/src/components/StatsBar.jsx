import { useTasks } from '../context/TaskContext';

export default function StatsBar() {
  const { tasks } = useTasks();

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const high = tasks.filter((t) => t.priority === 'High' && !t.completed).length;
  const overdue = tasks.filter((t) => {
    if (t.completed) return false;
    return new Date(t.dueDate) < new Date(new Date().toDateString());
  }).length;

  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="stats-bar">
      <div className="stat-item">
        <span className="stat-num">{total}</span>
        <span className="stat-label">Total</span>
      </div>
      <div className="stat-item">
        <span className="stat-num text-green">{completed}</span>
        <span className="stat-label">Done</span>
      </div>
      <div className="stat-item">
        <span className="stat-num text-red">{high}</span>
        <span className="stat-label">High Priority</span>
      </div>
      <div className="stat-item">
        <span className="stat-num text-orange">{overdue}</span>
        <span className="stat-label">Overdue</span>
      </div>
      <div className="stat-item progress-item">
        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="stat-label">{pct}% complete</span>
      </div>
    </div>
  );
}
