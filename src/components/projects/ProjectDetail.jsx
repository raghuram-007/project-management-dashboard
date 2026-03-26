import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProject } from '../../store/slices/projectsSlice';
import { deleteTasksByProject } from '../../store/slices/tasksSlice';
import { showToast } from '../../store/slices/uiSlice';
import ProjectForm from './ProjectForm';
import ConfirmDialog from '../common/ConfirmDialog';
import Avatar from '../common/Avatar';
import { formatDateTime } from '../../utils/helpers';
import { COLUMNS } from '../../store/slices/tasksSlice';
import TaskForm from '../tasks/TaskForm';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const project = useSelector(s => s.projects.list.find(p => p.id === id));
  const employees = useSelector(s => s.employees.list);
  const tasks = useSelector(s => s.tasks.list.filter(t => t.projectId === id));
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [taskFormOpen, setTaskFormOpen] = useState(false);

  if (!project) return (
    <div className="page-body" style={{ paddingTop: '32px' }}>
      <div className="empty-state">
        <div className="empty-icon">❓</div>
        <div className="empty-title">Project not found</div>
        <Link to="/projects" className="btn btn-primary">← Back to Projects</Link>
      </div>
    </div>
  );

  const assigned = (project.assignedEmployees || []).map(id => employees.find(e => e.id === id)).filter(Boolean);

  const tasksByStatus = COLUMNS.reduce((acc, col) => {
    acc[col.id] = tasks.filter(t => t.status === col.id);
    return acc;
  }, {});

  const handleDelete = () => {
    dispatch(deleteProject(id));
    dispatch(deleteTasksByProject(id));
    dispatch(showToast({ message: 'Project deleted', type: 'success' }));
    navigate('/projects');
  };

  return (
    <div>
      <div className="page-header">
        <div className="breadcrumb">
          <Link to="/projects">Projects</Link>
          <span className="breadcrumb-sep">›</span>
          <span style={{ color: 'var(--text-2)' }}>{project.title}</span>
        </div>
        <div className="page-header-row" style={{ marginTop: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {project.logo
              ? <img src={project.logo} alt={project.title} style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover' }} />
              : <div className="project-logo-placeholder" style={{ width: 48, height: 48 }}>⬡</div>
            }
            <div>
              <h1 className="page-title">{project.title}</h1>
              <p className="page-subtitle">{formatDateTime(project.startDate)} → {formatDateTime(project.endDate)}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" onClick={() => setTaskFormOpen(true)}>+ Add Task</button>
            <button className="btn btn-secondary" onClick={() => setEditOpen(true)}>✏️ Edit</button>
            <button className="btn btn-danger" onClick={() => setDeleteOpen(true)}>🗑️ Delete</button>
          </div>
        </div>
      </div>

      <div className="page-body">
        {/* Description */}
        <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Description</div>
          <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.7 }}>{project.description}</p>
        </div>

        {/* Team */}
        <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>
            Team ({assigned.length})
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {assigned.map(emp => (
              <div key={emp.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-3)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <Avatar name={emp.name} image={emp.image} size="sm" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{emp.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{emp.position}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
          {COLUMNS.map(col => (
            <div key={col.id} className="card" style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-display)', color: col.color }}>
                {tasksByStatus[col.id]?.length || 0}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '4px' }}>{col.label}</div>
            </div>
          ))}
        </div>
      </div>

      <ProjectForm isOpen={editOpen} onClose={() => setEditOpen(false)} editProject={project} />
      <TaskForm isOpen={taskFormOpen} onClose={() => setTaskFormOpen(false)} defaultProjectId={id} />
      <ConfirmDialog isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete}
        message="This will permanently delete the project and all its tasks." />
    </div>
  );
}
