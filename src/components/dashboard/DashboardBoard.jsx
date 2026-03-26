import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { moveTask, deleteTask, COLUMNS } from '../../store/slices/tasksSlice';
import { showToast } from '../../store/slices/uiSlice';
import Avatar from '../common/Avatar';
import TaskForm from '../tasks/TaskForm';
import ConfirmDialog from '../common/ConfirmDialog';
import { formatDate, isEtaOverdue } from '../../utils/helpers';

const COL_COLORS = {
  todo: 'var(--text-3)',
  inprogress: 'var(--blue)',
  needtest: 'var(--yellow)',
  completed: 'var(--green)',
  reopen: 'var(--red)',
};

function TaskCard({ task, employees, onEdit, onDelete, isDragging }) {
  const emp = employees.find(e => e.id === task.assignedEmployee);
  const overdue = isEtaOverdue(task.eta) && task.status !== 'completed';
  return (
    <div className={`task-card ${isDragging ? 'dragging' : ''}`}>
      {task.refImages?.[0] && (
        <img src={task.refImages[0]} alt="" className="task-card-img" />
      )}
      <div className="task-card-title">{task.title}</div>
      {emp && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <Avatar name={emp.name} image={emp.image} size="sm" />
          <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>{emp.name}</span>
        </div>
      )}
      <div className="task-card-footer">
        <div className="task-card-eta" style={{ color: overdue ? 'var(--red)' : 'var(--text-3)' }}>
          {overdue ? '⚠' : '📅'} {formatDate(task.eta)}
        </div>
        <div className="task-card-actions">
          <button title="Edit" onClick={e => { e.stopPropagation(); onEdit(task); }}>✏️</button>
          <button title="Delete" onClick={e => { e.stopPropagation(); onDelete(task.id); }}>🗑️</button>
        </div>
      </div>
    </div>
  );
}

function SortableTaskCard({ task, employees, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} employees={employees} onEdit={onEdit} onDelete={onDelete} isDragging={isDragging} />
    </div>
  );
}

function DroppableColumn({ column, tasks, employees, onEdit, onDelete }) {
  return (
    <div className="board-col">
      <div className="board-col-header">
        <span className="col-title" style={{ color: COL_COLORS[column.id] }}>{column.label}</span>
        <span className="col-count">{tasks.length}</span>
      </div>
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="board-col-body" id={`col-${column.id}`}>
          {tasks.map(task => (
            <SortableTaskCard key={task.id} task={task} employees={employees} onEdit={onEdit} onDelete={onDelete} />
          ))}
          {tasks.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px 10px', color: 'var(--text-3)', fontSize: '12px' }}>
              Drop tasks here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export default function DashboardBoard() {
  const dispatch = useDispatch();
  const tasks = useSelector(s => s.tasks.list);
  const projects = useSelector(s => s.projects.list);
  const employees = useSelector(s => s.employees.list);

  const [filterProject, setFilterProject] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const filteredTasks = filterProject
    ? tasks.filter(t => t.projectId === filterProject)
    : tasks;

  const getTasksByColumn = (colId) => filteredTasks.filter(t => t.status === colId);

  const handleDragStart = (event) => {
    const task = tasks.find(t => t.id === event.active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const taskId = active.id;
    const overId = over.id;

    // Check if dropped over a column body directly or over another task
    // Find what column the over item belongs to
    let newStatus = null;

    // Check if overId is a column body id like "col-xxx"
    for (const col of COLUMNS) {
      if (overId === `col-${col.id}`) {
        newStatus = col.id;
        break;
      }
    }

    // If not a column, overId is a task id - find its column
    if (!newStatus) {
      const overTask = tasks.find(t => t.id === overId);
      if (overTask) newStatus = overTask.status;
    }

    if (newStatus) {
      const task = tasks.find(t => t.id === taskId);
      if (task && task.status !== newStatus) {
        dispatch(moveTask({ taskId, newStatus }));
        dispatch(showToast({ message: `Moved to "${COLUMNS.find(c => c.id === newStatus)?.label}"`, type: 'success' }));
      }
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteTask(id));
    dispatch(showToast({ message: 'Task deleted', type: 'success' }));
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Drag tasks across columns to update status</p>
          </div>
          <button className="btn btn-primary" onClick={() => { setEditTask(null); setFormOpen(true); }}>
            + New Task
          </button>
        </div>
      </div>

      <div className="page-body">
        {/* Stats row */}
        <div className="stats-grid">
          {COLUMNS.map(col => (
            <div key={col.id} className="stat-card">
              <div className="stat-label">{col.label}</div>
              <div className="stat-value" style={{ color: COL_COLORS[col.id] }}>
                {tasks.filter(t => t.status === col.id).length}
              </div>
              <div className="stat-sub">{filterProject ? 'in project' : 'total tasks'}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="board-filters">
          <span style={{ fontSize: '13px', color: 'var(--text-3)', fontWeight: 600 }}>Filter by:</span>
          <div className="select-wrapper">
            <select
              className="form-select"
              style={{ width: '220px' }}
              value={filterProject}
              onChange={e => setFilterProject(e.target.value)}
            >
              <option value="">All Projects</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
          {filterProject && (
            <button className="btn btn-ghost btn-sm" onClick={() => setFilterProject('')}>✕ Clear</button>
          )}
          <span style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--text-3)' }}>
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Kanban Board */}
        {filteredTasks.length === 0 && !filterProject ? (
          <div className="empty-state">
            <div className="empty-icon">◈</div>
            <div className="empty-title">No tasks yet</div>
            <div className="empty-sub">Create your first task to get started</div>
            <button className="btn btn-primary" onClick={() => setFormOpen(true)}>+ New Task</button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="board-columns">
              {COLUMNS.map(col => (
                <DroppableColumn
                  key={col.id}
                  column={col}
                  tasks={getTasksByColumn(col.id)}
                  employees={employees}
                  onEdit={(task) => { setEditTask(task); setFormOpen(true); }}
                  onDelete={(id) => setDeleteId(id)}
                />
              ))}
            </div>

            <DragOverlay>
              {activeTask && (
                <div style={{ transform: 'rotate(3deg)', opacity: 0.9 }}>
                  <TaskCard task={activeTask} employees={employees} onEdit={() => {}} onDelete={() => {}} isDragging={false} />
                </div>
              )}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      <TaskForm isOpen={formOpen} onClose={() => setFormOpen(false)} editTask={editTask} />
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => handleDelete(deleteId)} message="Delete this task permanently?" />
    </div>
  );
}
