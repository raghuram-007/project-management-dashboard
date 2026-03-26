import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { toasts: [], sidebarOpen: false },
  reducers: {
    showToast: (state, { payload }) => {
      state.toasts.push({ id: Date.now(), ...payload });
    },
    removeToast: (state, { payload }) => {
      state.toasts = state.toasts.filter(t => t.id !== payload);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

export const { showToast, removeToast, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;
