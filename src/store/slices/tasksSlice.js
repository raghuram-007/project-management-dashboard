import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export const COLUMNS = [
  { id: 'todo', label: 'Need to Do', color: 'var(--text-2)' },
  { id: 'inprogress', label: 'In Progress', color: 'var(--blue)' },
  { id: 'needtest', label: 'Need for Test', color: 'var(--yellow)' },
  { id: 'completed', label: 'Completed', color: 'var(--green)' },
  { id: 'reopen', label: 'Re-open', color: 'var(--red)' },
];

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: { list: [] },
  reducers: {
    addTask: (state, { payload }) => {
      state.list.push({ ...payload, id: uuidv4(), status: payload.status || 'todo', createdAt: new Date().toISOString() });
    },
    updateTask: (state, { payload }) => {
      const idx = state.list.findIndex(t => t.id === payload.id);
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...payload };
    },
    deleteTask: (state, { payload }) => {
      state.list = state.list.filter(t => t.id !== payload);
    },
    moveTask: (state, { payload }) => {
      const { taskId, newStatus } = payload;
      const idx = state.list.findIndex(t => t.id === taskId);
      if (idx !== -1) state.list[idx].status = newStatus;
    },
    deleteTasksByProject: (state, { payload }) => {
      state.list = state.list.filter(t => t.projectId !== payload);
    },
  },
});

export const { addTask, updateTask, deleteTask, moveTask, deleteTasksByProject } = tasksSlice.actions;
export default tasksSlice.reducer;
