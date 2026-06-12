import { useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import StatsBar from '../components/StatsBar';

export default function HomePage() {
  const { fetchTasks } = useTasks();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="page">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
       
            <span className="logo-text">Task Priority Checker App</span>
          </div>
          <p className="header-tagline">Priority-sorted tasks, always.</p>
        </div>
      </header>

      <main className="app-main">
        <StatsBar />

        <div className="layout-grid">
          <aside className="sidebar">
            <TaskForm />
          </aside>
          <section className="content">
            <TaskList />
          </section>
        </div>
      </main>

      <footer className="app-footer">
        <p>Task Priority Checker App · MERN Stack Assessment · Sorted by priority & due date</p>
      </footer>
    </div>
  );
}
