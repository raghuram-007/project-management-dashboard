import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const employeesSlice = createSlice({
  name: 'employees',
  initialState: { list: [] },
  reducers: {
    addEmployee: (state, { payload }) => {
      state.list.push({ ...payload, id: uuidv4(), createdAt: new Date().toISOString() });
    },
    updateEmployee: (state, { payload }) => {
      const idx = state.list.findIndex(e => e.id === payload.id);
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...payload };
    },
    deleteEmployee: (state, { payload }) => {
      state.list = state.list.filter(e => e.id !== payload);
    },
  },
});

export const { addEmployee, updateEmployee, deleteEmployee } = employeesSlice.actions;
export default employeesSlice.reducer;
