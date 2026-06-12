import { createContext, useContext, useReducer, useCallback } from 'react';
import { taskService } from '../services/taskService';
import toast from 'react-hot-toast';

const TaskContext = createContext(null);

const initialState = {
  tasks: [],
  loading: false,
  error: null,
  editingTask: null,
};

function taskReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload, loading: false, error: null };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload], loading: false };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t._id === action.payload._id ? action.payload : t)),
        loading: false,
        editingTask: null,
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((t) => t._id !== action.payload),
        loading: false,
      };
    case 'SET_EDITING':
      return { ...state, editingTask: action.payload };
    default:
      return state;
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const fetchTasks = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await taskService.getAll();
      dispatch({ type: 'SET_TASKS', payload: res.data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      toast.error(err.message);
    }
  }, []);

  const createTask = useCallback(async (data) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await taskService.create(data);
      // Re-fetch to get properly sorted list
      await fetchTasks();
      toast.success('Task added!');
      return res;
    } catch (err) {
      dispatch({ type: 'SET_LOADING', payload: false });
      toast.error(err.message);
      throw err;
    }
  }, [fetchTasks]);

  const updateTask = useCallback(async (id, data) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await taskService.update(id, data);
      await fetchTasks();
      toast.success('Task updated!');
    } catch (err) {
      dispatch({ type: 'SET_LOADING', payload: false });
      toast.error(err.message);
      throw err;
    }
  }, [fetchTasks]);

  const toggleTask = useCallback(async (id) => {
    try {
      const res = await taskService.toggle(id);
      dispatch({ type: 'UPDATE_TASK', payload: res.data });
    } catch (err) {
      toast.error(err.message);
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    try {
      await taskService.delete(id);
      dispatch({ type: 'DELETE_TASK', payload: id });
      toast.success('Task deleted');
    } catch (err) {
      toast.error(err.message);
    }
  }, []);

  const setEditing = useCallback((task) => {
    dispatch({ type: 'SET_EDITING', payload: task });
  }, []);

  return (
    <TaskContext.Provider
      value={{
        ...state,
        fetchTasks,
        createTask,
        updateTask,
        toggleTask,
        deleteTask,
        setEditing,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used inside TaskProvider');
  return ctx;
};
