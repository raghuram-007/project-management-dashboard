import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteEmployee } from '../../store/slices/employeesSlice';
import { showToast } from '../../store/slices/uiSlice';
import EmployeeForm from './EmployeeForm';
import ConfirmDialog from '../common/ConfirmDialog';
import Avatar from '../common/Avatar';

export default function EmployeesPage() {
  const dispatch = useDispatch();
  const employees = useSelector(s => s.employees.list);
  const projects = useSelector(s => s.projects.list);
  const [formOpen, setFormOpen] = useState(false);
  const [editEmp, setEditEmp] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');
  const [viewEmp, setViewEmp] = useState(null);

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase()) ||
    e.position.toLowerCase().includes(search.toLowerCase())
  );

  const getProjectCount = (empId) =>
    projects.filter(p => p.assignedEmployees?.includes(empId)).length;

  const handleDelete = (id) => {
    dispatch(deleteEmployee(id));
    dispatch(showToast({ message: 'Employee removed', type: 'success' }));
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Employees</h1>
            <p className="page-subtitle">{employees.length} team members</p>
          </div>
          <button className="btn btn-primary" onClick={() => { setEditEmp(null); setFormOpen(true); }}>
            + Add Employee
          </button>
        </div>
        <div style={{ marginTop: '16px' }}>
          <div className="search-box" style={{ maxWidth: '340px' }}>
            <span className="search-icon">🔍</span>
            <input
              className="form-input"
              placeholder="Search employees..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
          </div>
        </div>
      </div>

      <div className="page-body">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <div className="empty-title">{search ? 'No results found' : 'No employees yet'}</div>
            <div className="empty-sub">{search ? 'Try a different search' : 'Add your first team member to get started'}</div>
            {!search && <button className="btn btn-primary" onClick={() => setFormOpen(true)}>+ Add Employee</button>}
          </div>
        ) : (
          <div className="employees-grid">
            {filtered.map(emp => (
              <div key={emp.id} className="employee-card">
                <div className="employee-card-actions">
                   <button className="btn btn-ghost btn-icon btn-sm" title="View"
    onClick={() => setViewEmp(emp)}>👁️</button> 
                  <button className="btn btn-ghost btn-icon btn-sm" title="Edit"
                    onClick={() => { setEditEmp(emp); setFormOpen(true); }}>✏️</button>
                  <button className="btn btn-danger btn-icon btn-sm" title="Delete"
                    onClick={() => setDeleteId(emp.id)}>🗑️</button>
                </div>
                <Avatar name={emp.name} image={emp.image} size="xl" />
                <div>
                  <div className="employee-name">{emp.name}</div>
                  <div className="employee-position">{emp.position}</div>
                </div>
                <div className="employee-email">{emp.email}</div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>
                    <span style={{ color: 'var(--accent-2)', fontWeight: 700 }}>{getProjectCount(emp.id)}</span> projects
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <EmployeeForm isOpen={formOpen} onClose={() => setFormOpen(false)} editEmployee={editEmp} />
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => handleDelete(deleteId)}
        message="This will permanently remove the employee. They will also be unassigned from all projects."
      />
      {/* View Employee Modal */}
{viewEmp && (
  <div className="modal-overlay" onClick={() => setViewEmp(null)}>
    <div className="modal" onClick={e => e.stopPropagation()}>
      <div className="modal-header">
        <h2 className="modal-title">Employee Details</h2>
        <button className="btn btn-ghost btn-icon" onClick={() => setViewEmp(null)}>✕</button>
      </div>
      <div className="modal-body">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <Avatar name={viewEmp.name} image={viewEmp.image} size="xl" />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: 700 }}>{viewEmp.name}</div>
            <div style={{ fontSize: '14px', color: 'var(--text-3)' }}>{viewEmp.position}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
              Official Email
            </div>
            <div style={{ fontSize: '14px' }}>{viewEmp.email}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
              Projects Assigned
            </div>
            <div style={{ fontSize: '14px', color: 'var(--accent-2)', fontWeight: 700 }}>
              {getProjectCount(viewEmp.id)} projects
            </div>
          </div>
          {/* Show which projects */}
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
              Project List
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {projects.filter(p => p.assignedEmployees?.includes(viewEmp.id)).length === 0
                ? <div style={{ fontSize: '13px', color: 'var(--text-3)' }}>Not assigned to any project</div>
                : projects
                    .filter(p => p.assignedEmployees?.includes(viewEmp.id))
                    .map(p => (
                      <div key={p.id} style={{
                        fontSize: '13px', padding: '6px 10px',
                        background: 'var(--bg-3)', borderRadius: '6px',
                        border: '1px solid var(--border)'
                      }}>
                        {p.title}
                      </div>
                    ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
