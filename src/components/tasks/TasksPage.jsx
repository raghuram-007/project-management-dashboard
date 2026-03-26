import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTask } from '../../store/slices/tasksSlice';
import { showToast } from '../../store/slices/uiSlice';
import TaskForm from './TaskForm';
import ConfirmDialog from '../common/ConfirmDialog';
import Avatar from '../common/Avatar';
import { formatDate, isEtaOverdue } from '../../utils/helpers';
import { COLUMNS } from '../../store/slices/tasksSlice';

const STATUS_BADGE = {
  todo: 'badge-todo', inprogress: 'badge-inprogress',
  needtest: 'badge-needtest', completed: 'badge-completed', reopen: 'badge-reopen',
};

export default function TasksPage() {
  const dispatch = useDispatch();
  const tasks = useSelector(s => s.tasks.list);
  const projects = useSelector(s => s.projects.list);
  const employees = useSelector(s => s.employees.list);
  const [formOpen, setFormOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [filterProject, setFilterProject] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const [viewTask, setViewTask] = useState(null);

  const filtered = tasks.filter(t => {
    if (filterProject && t.projectId !== filterProject) return false;
    if (filterStatus && t.status !== filterStatus) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getProject = (pid) => projects.find(p => p.id === pid);
  const getEmployee = (eid) => employees.find(e => e.id === eid);

  const handleDelete = (id) => {
    dispatch(deleteTask(id));
    dispatch(showToast({ message: 'Task deleted', type: 'success' }));
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Tasks</h1>
            <p className="page-subtitle">{tasks.length} total tasks</p>
          </div>
          <button className="btn btn-primary" onClick={() => { setEditTask(null); setFormOpen(true); }}>
            + New Task
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
          <div className="search-box" style={{ flex: '1 1 200px', maxWidth: '280px' }}>
            <span className="search-icon">🔍</span>
            <input className="form-input" placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '36px' }} />
          </div>
          <div className="select-wrapper" style={{ flex: '0 0 180px' }}>
            <select className="form-select" value={filterProject} onChange={e => setFilterProject(e.target.value)}>
              <option value="">All Projects</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
          <div className="select-wrapper" style={{ flex: '0 0 160px' }}>
            <select className="form-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">All Statuses</option>
              {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          {(filterProject || filterStatus || search) && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setFilterProject(''); setFilterStatus(''); setSearch(''); }}>
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      <div className="page-body">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⊞</div>
            <div className="empty-title">{search || filterProject || filterStatus ? 'No tasks match filters' : 'No tasks yet'}</div>
            <div className="empty-sub">{search || filterProject || filterStatus ? 'Try adjusting your filters' : 'Create your first task to get started'}</div>
            {!search && !filterProject && !filterStatus && <button className="btn btn-primary" onClick={() => setFormOpen(true)}>+ New Task</button>}
          </div>
        ) : (
          <div className="card" style={{ overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Project</th>
                  <th>Assigned To</th>
                  <th>ETA</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(task => {
                  const proj = getProject(task.projectId);
                  const emp = getEmployee(task.assignedEmployee);
                  const overdue = isEtaOverdue(task.eta) && task.status !== 'completed';
                  const col = COLUMNS.find(c => c.id === task.status);
                  return (
                    <tr key={task.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {task.refImages?.[0] && (
                            <img src={task.refImages[0]} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover', border: '1px solid var(--border)', flexShrink: 0 }} />
                          )}
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '14px' }}>{task.title}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-3)', maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {task.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>{proj?.title || '—'}</span>
                      </td>
                      <td>
                        {emp ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Avatar name={emp.name} image={emp.image} size="sm" />
                            <span style={{ fontSize: '13px' }}>{emp.name}</span>
                          </div>
                        ) : '—'}
                      </td>
                      <td>
                        <span style={{ fontSize: '13px', color: overdue ? 'var(--red)' : 'var(--text-2)', fontWeight: overdue ? 600 : 400 }}>
                          {overdue && '⚠ '}{formatDate(task.eta)}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${STATUS_BADGE[task.status] || 'badge-todo'}`}>
                          {col?.label || task.status}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="btn btn-ghost btn-icon btn-sm" title="View"
                            onClick={() => setViewTask(task)}>👁️</button>
                          <button className="btn btn-ghost btn-icon btn-sm" title="Edit"
                            onClick={() => { setEditTask(task); setFormOpen(true); }}>✏️</button>
                          <button className="btn btn-danger btn-icon btn-sm" title="Delete"
                            onClick={() => setDeleteId(task.id)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TaskForm isOpen={formOpen} onClose={() => setFormOpen(false)} editTask={editTask} />
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => handleDelete(deleteId)} message="Delete this task permanently?" />

      {/* View Task Modal */}
      {viewTask && (
        <div className="modal-overlay" onClick={() => setViewTask(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{viewTask.title}</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setViewTask(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Description</div>
                  <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.7 }}>{viewTask.description}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Project</div>
                    <span style={{ fontSize: '14px' }}>{getProject(viewTask.projectId)?.title || '—'}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Assigned To</div>
                    {getEmployee(viewTask.assignedEmployee) ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Avatar name={getEmployee(viewTask.assignedEmployee).name} image={getEmployee(viewTask.assignedEmployee).image} size="sm" />
                        <span style={{ fontSize: '14px' }}>{getEmployee(viewTask.assignedEmployee).name}</span>
                      </div>
                    ) : '—'}
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>ETA</div>
                    <span style={{ fontSize: '14px', color: isEtaOverdue(viewTask.eta) && viewTask.status !== 'completed' ? 'var(--red)' : 'var(--text)' }}>{formatDate(viewTask.eta)}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Status</div>
                    <span className={`badge ${STATUS_BADGE[viewTask.status]}`}>{COLUMNS.find(c => c.id === viewTask.status)?.label}</span>
                  </div>
                </div>
                {viewTask.refImages?.length > 0 && (
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Reference Images</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {viewTask.refImages.map((img, i) => (
                        <img key={i} src={img} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
