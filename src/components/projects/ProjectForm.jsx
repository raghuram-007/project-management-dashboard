import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { addProject, updateProject } from '../../store/slices/projectsSlice';
import { showToast } from '../../store/slices/uiSlice';
import { projectSchema } from '../../utils/validation';
import Modal from '../common/Modal';
import ImageUpload from '../common/ImageUpload';
import Avatar from '../common/Avatar';

export default function ProjectForm({ isOpen, onClose, editProject }) {
  const dispatch = useDispatch();
  const employees = useSelector(s => s.employees.list);
  const [selectedEmps, setSelectedEmps] = useState([]);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: yupResolver(projectSchema),
    defaultValues: { title: '', description: '', logo: '', startDate: '', endDate: '', assignedEmployees: [] },
  });

  const logoVal = watch('logo');

  useEffect(() => {
    if (isOpen) {
      const defaults = editProject
        ? { title: editProject.title, description: editProject.description, logo: editProject.logo || '', startDate: editProject.startDate, endDate: editProject.endDate, assignedEmployees: editProject.assignedEmployees || [] }
        : { title: '', description: '', logo: '', startDate: '', endDate: '', assignedEmployees: [] };
      reset(defaults);
      setSelectedEmps(editProject?.assignedEmployees || []);
    }
  }, [isOpen, editProject, reset]);

  const toggleEmployee = (id) => {
    const updated = selectedEmps.includes(id)
      ? selectedEmps.filter(e => e !== id)
      : [...selectedEmps, id];
    setSelectedEmps(updated);
    setValue('assignedEmployees', updated, { shouldValidate: true });
  };

  const onSubmit = (data) => {
    if (editProject) {
      dispatch(updateProject({ ...data, id: editProject.id }));
      dispatch(showToast({ message: 'Project updated!', type: 'success' }));
    } else {
      dispatch(addProject(data));
      dispatch(showToast({ message: 'Project created!', type: 'success' }));
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editProject ? 'Edit Project' : 'New Project'}
      size="lg"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} type="button">Cancel</button>
          <button className="btn btn-primary" form="project-form" type="submit">
            {editProject ? 'Save Changes' : 'Create Project'}
          </button>
        </>
      }
    >
      <form id="project-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-row">
          <div>
            <div className="form-group">
              <label className="form-label">Project Title <span className="req">*</span></label>
              <input {...register('title')} className={`form-input ${errors.title ? 'input-error' : ''}`} placeholder="e.g. Website Redesign" />
              {errors.title && <div className="form-error">⚠ {errors.title.message}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Description <span className="req">*</span></label>
              <textarea {...register('description')} className={`form-textarea ${errors.description ? 'input-error' : ''}`} placeholder="What is this project about?" />
              {errors.description && <div className="form-error">⚠ {errors.description.message}</div>}
            </div>
          </div>
          <div>
            <div className="form-group">
              <label className="form-label">Project Logo</label>
              <ImageUpload
                value={logoVal}
                onChange={v => setValue('logo', v)}
                label="Upload logo"
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Start Date &amp; Time <span className="req">*</span></label>
            <input {...register('startDate')} type="datetime-local" className={`form-input ${errors.startDate ? 'input-error' : ''}`} />
            {errors.startDate && <div className="form-error">⚠ {errors.startDate.message}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">End Date &amp; Time <span className="req">*</span></label>
            <input {...register('endDate')} type="datetime-local" className={`form-input ${errors.endDate ? 'input-error' : ''}`} />
            {errors.endDate && <div className="form-error">⚠ {errors.endDate.message}</div>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Assign Employees <span className="req">*</span></label>
          {employees.length === 0 ? (
            <div className="alert alert-warning">⚠ No employees yet. Add employees first.</div>
          ) : (
            <div className="checkbox-list">
              {employees.map(emp => (
                <div
                  key={emp.id}
                  className={`checkbox-item ${selectedEmps.includes(emp.id) ? 'selected' : ''}`}
                  onClick={() => toggleEmployee(emp.id)}
                >
                  <input type="checkbox" checked={selectedEmps.includes(emp.id)} onChange={() => {}} />
                  <Avatar name={emp.name} image={emp.image} size="sm" />
                  <label style={{ pointerEvents: 'none' }}>
                    <span style={{ fontWeight: 500 }}>{emp.name}</span>
                    <span style={{ color: 'var(--text-3)', marginLeft: '6px', fontSize: '12px' }}>{emp.position}</span>
                  </label>
                </div>
              ))}
            </div>
          )}
          {errors.assignedEmployees && (
            <div className="form-error">⚠ {errors.assignedEmployees.message}</div>
          )}
        </div>
      </form>
    </Modal>
  );
}
