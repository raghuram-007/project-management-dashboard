import { configureStore } from '@reduxjs/toolkit';
import employeesReducer from './slices/employeesSlice';
import projectsReducer from './slices/projectsSlice';
import tasksReducer from './slices/tasksSlice';
import uiReducer from './slices/uiSlice';

const loadState = () => {
  try {
    const s = localStorage.getItem('pmDashboardState');
    return s ? JSON.parse(s) : undefined;
  } catch { return undefined; }
};
const saveState = (state) => {
  try {
    localStorage.setItem('pmDashboardState', JSON.stringify({
      employees: state.employees,
      projects: state.projects,
      tasks: state.tasks,
    }));
  } catch {}
};

const store = configureStore({
  reducer: {
    employees: employeesReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
    ui: uiReducer,
  },
  preloadedState: loadState(),
});

store.subscribe(() => saveState(store.getState()));
export default store;
