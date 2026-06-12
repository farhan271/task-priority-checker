const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { taskValidationRules, validate } = require('../middleware/validateTask');

// Priority sort order: High=3, Medium=2, Low=1
const PRIORITY_ORDER = { High: 3, Medium: 2, Low: 1 };

/**
 * GET /tasks
 * Fetch all tasks sorted by: High priority first → Earlier due date first
 */
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().lean();

    // Sort: descending priority weight, then ascending due date
    tasks.sort((a, b) => {
      const priorityDiff =
        (PRIORITY_ORDER[b.priority] || 0) - (PRIORITY_ORDER[a.priority] || 0);
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

/**
 * POST /tasks
 * Create a new task
 */
router.post('/', taskValidationRules(), validate, async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;

    const task = await Task.create({ title, description, dueDate, priority });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => ({
        field: e.path,
        message: e.message,
      }));
      return res.status(422).json({ success: false, errors: messages });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

/**
 * PUT /tasks/:id
 * Update a task (any field including completed)
 */
router.put('/:id', taskValidationRules(), validate, async (req, res) => {
  try {
    const { title, description, dueDate, priority, completed } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, dueDate, priority, completed },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, data: task });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ success: false, message: 'Invalid task ID' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => ({
        field: e.path,
        message: e.message,
      }));
      return res.status(422).json({ success: false, errors: messages });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

/**
 * PATCH /tasks/:id/toggle
 * Quick toggle completed status
 */
router.patch('/:id/toggle', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    task.completed = !task.completed;
    await task.save();
    res.json({ success: true, data: task });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ success: false, message: 'Invalid task ID' });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

/**
 * DELETE /tasks/:id
 * Delete a task
 */
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ success: false, message: 'Invalid task ID' });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
