import { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';

const EMPTY_FORM = {
  title: '',
  description: '',
  dueDate: '',
  priority: 'Medium',
};

export default function TaskForm() {
  const { createTask, updateTask, editingTask, setEditing, loading } = useTasks();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title || '',
        description: editingTask.description || '',
        dueDate: editingTask.dueDate
          ? new Date(editingTask.dueDate).toISOString().split('T')[0]
          : '',
        priority: editingTask.priority || 'Medium',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [editingTask]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.dueDate) e.dueDate = 'Due date is required';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    try {
      if (editingTask) {
        await updateTask(editingTask._id, form);
      } else {
        await createTask(form);
        setForm(EMPTY_FORM);
      }
    } catch {
      // errors already toasted in context
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setErrors({});
  };

  return (
    <div className="form-card">
      <h2 className="form-title">
        {editingTask ? '✏️ Edit Task' : '＋ New Task'}
      </h2>

      <form onSubmit={handleSubmit} noValidate>
        {/* Title */}
        <div className="field">
          <label htmlFor="title">Task Title <span className="required">*</span></label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Write project proposal"
            className={errors.title ? 'input-error' : ''}
            maxLength={100}
          />
          {errors.title && <span className="error-msg">{errors.title}</span>}
        </div>

        {/* Description */}
        <div className="field">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Optional details…"
            rows={3}
            maxLength={500}
          />
        </div>

        {/* Due Date + Priority row */}
        <div className="field-row">
          <div className="field">
            <label htmlFor="dueDate">Due Date <span className="required">*</span></label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
              className={errors.dueDate ? 'input-error' : ''}
            />
            {errors.dueDate && <span className="error-msg">{errors.dueDate}</span>}
          </div>

          <div className="field">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="High">🔴 High</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Low">🟢 Low</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          {editingTask && (
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Saving…' : editingTask ? 'Save Changes' : 'Add Task'}
          </button>
        </div>
      </form>
    </div>
  );
}
