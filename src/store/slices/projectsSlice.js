import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const projectsSlice = createSlice({
  name: 'projects',
  initialState: { list: [] },
  reducers: {
    addProject: (state, { payload }) => {
      state.list.push({ ...payload, id: uuidv4(), createdAt: new Date().toISOString() });
    },
    updateProject: (state, { payload }) => {
      const idx = state.list.findIndex(p => p.id === payload.id);
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...payload };
    },
    deleteProject: (state, { payload }) => {
      state.list = state.list.filter(p => p.id !== payload);
    },
  },
});

export const { addProject, updateProject, deleteProject } = projectsSlice.actions;
export default projectsSlice.reducer;
