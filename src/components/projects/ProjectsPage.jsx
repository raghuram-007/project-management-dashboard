import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteProject } from '../../store/slices/projectsSlice';
import { deleteTasksByProject } from '../../store/slices/tasksSlice';
import { showToast } from '../../store/slices/uiSlice';
import ProjectForm from './ProjectForm';
import ConfirmDialog from '../common/ConfirmDialog';
import Avatar from '../common/Avatar';
import { formatDate } from '../../utils/helpers';

export default function ProjectsPage() {
  const dispatch = useDispatch();
  const projects = useSelector(s => s.projects.list);
  const employees = useSelector(s => s.employees.list);
  const tasks = useSelector(s => s.tasks.list);
  const [formOpen, setFormOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  const getEmpById = (id) => employees.find(e => e.id === id);
  const getTaskCount = (pid) => tasks.filter(t => t.projectId === pid).length;

  const handleDelete = (id) => {
    dispatch(deleteProject(id));
    dispatch(deleteTasksByProject(id));
    dispatch(showToast({ message: 'Project deleted', type: 'success' }));
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Projects</h1>
            <p className="page-subtitle">{projects.length} active projects</p>
          </div>
          <button className="btn btn-primary" onClick={() => { setEditProject(null); setFormOpen(true); }}>
            + New Project
          </button>
        </div>
        <div style={{ marginTop: '16px' }}>
          <div className="search-box" style={{ maxWidth: '340px' }}>
            <span className="search-icon">🔍</span>
            <input className="form-input" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '36px' }} />
          </div>
        </div>
      </div>

      <div className="page-body">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⬡</div>
            <div className="empty-title">{search ? 'No results found' : 'No projects yet'}</div>
            <div className="empty-sub">{search ? 'Try a different search' : 'Create your first project to start organizing tasks'}</div>
            {!search && <button className="btn btn-primary" onClick={() => setFormOpen(true)}>+ New Project</button>}
          </div>
        ) : (
          <div className="projects-grid">
            {filtered.map(proj => {
              const assigned = (proj.assignedEmployees || []).map(getEmpById).filter(Boolean);
              return (
                <div key={proj.id} className="project-card" style={{ position: 'relative' }}>
                  {/* Action buttons */}
                  <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px', zIndex: 2 }}>
                    <button className="btn btn-secondary btn-icon btn-sm" title="Edit"
                      onClick={e => { e.stopPropagation(); setEditProject(proj); setFormOpen(true); }}>✏️</button>
                    <button className="btn btn-danger btn-icon btn-sm" title="Delete"
                      onClick={e => { e.stopPropagation(); setDeleteId(proj.id); }}>🗑️</button>
                  </div>

                  <Link to={`/projects/${proj.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    <div className="project-card-header">
                      {proj.logo
                        ? <img src={proj.logo} alt={proj.title} className="project-logo" />
                        : <div className="project-logo-placeholder">⬡</div>
                      }
                      <div style={{ minWidth: 0 }}>
                        <div className="project-card-title" style={{ marginRight: '80px' }}>{proj.title}</div>
                        <div className="project-card-meta">
                          {formatDate(proj.startDate)} → {formatDate(proj.endDate)}
                        </div>
                      </div>
                    </div>
                    <div className="project-card-body">
                      <p className="project-card-desc">{proj.description}</p>
                      <div className="project-card-footer">
                        <div className="project-employees">
                          {assigned.slice(0, 4).map(emp => (
                            <Avatar key={emp.id} name={emp.name} image={emp.image} size="sm" />
                          ))}
                          {assigned.length > 4 && (
                            <div className="project-employees-more">+{assigned.length - 4}</div>
                          )}
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>
                          <span style={{ color: 'var(--accent-2)', fontWeight: 700 }}>{getTaskCount(proj.id)}</span> tasks
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ProjectForm isOpen={formOpen} onClose={() => setFormOpen(false)} editProject={editProject} />
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => handleDelete(deleteId)}
        message="This will permanently delete the project and all its tasks."
      />
    </div>
  );
}
