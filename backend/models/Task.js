const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    priority: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: 'Priority must be Low, Medium, or High',
      },
      required: [true, 'Priority is required'],
      default: 'Medium',
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual: numeric priority weight for sorting (High=3, Medium=2, Low=1)
taskSchema.virtual('priorityWeight').get(function () {
  const weights = { High: 3, Medium: 2, Low: 1 };
  return weights[this.priority] || 0;
});

// Index for efficient sorting
taskSchema.index({ priority: 1, dueDate: 1 });

module.exports = mongoose.model('Task', taskSchema);
