import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const NAV = [
  { to: '/', icon: '◈', label: 'Dashboard' },
  { to: '/projects', icon: '⬡', label: 'Projects' },
  { to: '/tasks', icon: '⊞', label: 'Tasks' },
  { to: '/employees', icon: '◉', label: 'Employees' },
];

export default function Sidebar({ open }) {
  const projects = useSelector(s => s.projects.list);
  const tasks = useSelector(s => s.tasks.list);
  const employees = useSelector(s => s.employees.list);

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">⚡</div>
        <span className="sidebar-logo-text">ProFlow</span>
      </div>
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Navigation</div>
        {NAV.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="link-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
        <div className="sidebar-section-label" style={{ marginTop: '12px' }}>Overview</div>
        <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { label: 'Projects', value: projects.length, color: 'var(--accent-2)' },
            { label: 'Tasks', value: tasks.length, color: 'var(--blue)' },
            { label: 'Employees', value: employees.length, color: 'var(--green)' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-3)' }}>{item.label}</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: item.color, fontFamily: 'var(--font-display)' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </nav>
      <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-3)', textAlign: 'center' }}>ProFlow v1.0.0</div>
      </div>
    </aside>
  );
}
