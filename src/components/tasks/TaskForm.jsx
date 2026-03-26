import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { addTask, updateTask } from '../../store/slices/tasksSlice';
import { showToast } from '../../store/slices/uiSlice';
import { taskSchema } from '../../utils/validation';
import Modal from '../common/Modal';
import Avatar from '../common/Avatar';
import { toBase64 } from '../../utils/helpers';

export default function TaskForm({ isOpen, onClose, editTask, defaultProjectId }) {
  const dispatch = useDispatch();
  const projects = useSelector(s => s.projects.list);
  const employees = useSelector(s => s.employees.list);
  const [refImages, setRefImages] = useState([]);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    resolver: yupResolver(taskSchema),
    defaultValues: { title: '', description: '', projectId: defaultProjectId || '', assignedEmployee: '', eta: '', status: 'todo' },
  });

  const selectedProjectId = watch('projectId');
  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const availableEmployees = selectedProject
    ? employees.filter(e => selectedProject.assignedEmployees?.includes(e.id))
    : [];

  useEffect(() => {
    if (isOpen) {
      if (editTask) {
        reset({
          title: editTask.title,
          description: editTask.description,
          projectId: editTask.projectId,
          assignedEmployee: editTask.assignedEmployee,
          eta: editTask.eta,
          status: editTask.status || 'todo',
        });
        setRefImages(editTask.refImages || []);
      } else {
        reset({ title: '', description: '', projectId: defaultProjectId || '', assignedEmployee: '', eta: '', status: 'todo' });
        setRefImages([]);
      }
    }
  }, [isOpen, editTask, defaultProjectId, reset]);

  // Reset employee when project changes
  useEffect(() => {
    if (!editTask) setValue('assignedEmployee', '');
  }, [selectedProjectId, setValue, editTask]);

  const handleImageAdd = async (e) => {
    const files = Array.from(e.target.files);
    const b64s = await Promise.all(files.map(toBase64));
    setRefImages(prev => [...prev, ...b64s]);
  };

  const removeImage = (idx) => setRefImages(prev => prev.filter((_, i) => i !== idx));

  const onSubmit = (data) => {
    const payload = { ...data, refImages };
    if (editTask) {
      dispatch(updateTask({ ...payload, id: editTask.id }));
      dispatch(showToast({ message: 'Task updated!', type: 'success' }));
    } else {
      dispatch(addTask(payload));
      dispatch(showToast({ message: 'Task created!', type: 'success' }));
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editTask ? 'Edit Task' : 'New Task'}
      size="lg"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} type="button">Cancel</button>
          <button className="btn btn-primary" form="task-form" type="submit">
            {editTask ? 'Save Changes' : 'Create Task'}
          </button>
        </>
      }
    >
      <form id="task-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label className="form-label">Task Title <span className="req">*</span></label>
          <input {...register('title')} className={`form-input ${errors.title ? 'input-error' : ''}`} placeholder="e.g. Design homepage mockup" />
          {errors.title && <div className="form-error">⚠ {errors.title.message}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Description <span className="req">*</span></label>
          <textarea {...register('description')} className={`form-textarea ${errors.description ? 'input-error' : ''}`} placeholder="Describe the task in detail..." />
          {errors.description && <div className="form-error">⚠ {errors.description.message}</div>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Project <span className="req">*</span></label>
            <div className="select-wrapper">
              <select {...register('projectId')} className={`form-select ${errors.projectId ? 'input-error' : ''}`}>
                <option value="">Select project...</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
            {errors.projectId && <div className="form-error">⚠ {errors.projectId.message}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Assign Employee <span className="req">*</span></label>
            <div className="select-wrapper">
              <select {...register('assignedEmployee')} className={`form-select ${errors.assignedEmployee ? 'input-error' : ''}`}
                disabled={!selectedProjectId || availableEmployees.length === 0}>
                <option value="">
                  {!selectedProjectId ? 'Select project first' : availableEmployees.length === 0 ? 'No employees assigned to project' : 'Select employee...'}
                </option>
                {availableEmployees.map(emp => <option key={emp.id} value={emp.id}>{emp.name} — {emp.position}</option>)}
              </select>
            </div>
            {errors.assignedEmployee && <div className="form-error">⚠ {errors.assignedEmployee.message}</div>}
            {selectedProjectId && availableEmployees.length === 0 && (
              <div className="form-error" style={{ color: 'var(--yellow)' }}>⚠ No employees assigned to this project. Edit the project first.</div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">ETA <span className="req">*</span></label>
            <input {...register('eta')} type="datetime-local" className={`form-input ${errors.eta ? 'input-error' : ''}`} />
            {errors.eta && <div className="form-error">⚠ {errors.eta.message}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <div className="select-wrapper">
              <select {...register('status')} className="form-select">
                <option value="todo">Need to Do</option>
                <option value="inprogress">In Progress</option>
                <option value="needtest">Need for Test</option>
                <option value="completed">Completed</option>
                <option value="reopen">Re-open</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reference Images */}
        <div className="form-group">
          <label className="form-label">Reference Images</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
            {refImages.map((img, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <img src={img} alt="" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} />
                <button type="button" onClick={() => removeImage(i)} style={{
                  position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%',
                  background: 'var(--red)', border: 'none', color: '#fff', fontSize: 10, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>✕</button>
              </div>
            ))}
            <label style={{
              width: 64, height: 64, border: '2px dashed var(--border)', borderRadius: 8, display: 'flex',
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 22, color: 'var(--text-3)',
              transition: 'all var(--transition)',
            }}
              onMouseOver={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              +
              <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleImageAdd} />
            </label>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Add reference images for context</div>
        </div>
      </form>
    </Modal>
  );
}
