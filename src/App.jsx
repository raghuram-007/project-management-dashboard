import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Sidebar from './components/common/Sidebar';
import ToastContainer from './components/common/ToastContainer';
import DashboardBoard from './components/dashboard/DashboardBoard';
import ProjectsPage from './components/projects/ProjectsPage';
import ProjectDetail from './components/projects/ProjectDetail';
import TasksPage from './components/tasks/TasksPage';
import EmployeesPage from './components/employees/EmployeesPage';
import './index.css';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar open={sidebarOpen} />

      <div className="main-content">
        {/* Mobile header */}
        <div style={{
          display: 'none',
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
          alignItems: 'center',
          gap: '12px',
          background: 'var(--bg-2)',
        }} className="mobile-header">
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => setSidebarOpen(true)}
          >☰</button>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px' }}>ProFlow</span>
        </div>

        <Routes>
          <Route path="/" element={<DashboardBoard />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
        </Routes>
      </div>

      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </Provider>
  );
}
