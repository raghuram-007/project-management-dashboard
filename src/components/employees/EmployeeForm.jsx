import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { addEmployee, updateEmployee } from '../../store/slices/employeesSlice';
import { showToast } from '../../store/slices/uiSlice';
import { employeeSchema } from '../../utils/validation';
import Modal from '../common/Modal';
import ImageUpload from '../common/ImageUpload';
import { useEffect } from 'react';

export default function EmployeeForm({ isOpen, onClose, editEmployee }) {
  const dispatch = useDispatch();
  const allEmployees = useSelector(s => s.employees.list);

  const schema = employeeSchema(allEmployees, editEmployee?.id);
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: editEmployee || { name: '', position: '', email: '', image: '' },
  });

  const imageVal = watch('image');

  useEffect(() => {
    if (isOpen) {
      reset(editEmployee || { name: '', position: '', email: '', image: '' });
    }
  }, [isOpen, editEmployee, reset]);

  const onSubmit = (data) => {
    if (editEmployee) {
      dispatch(updateEmployee({ ...data, id: editEmployee.id }));
      dispatch(showToast({ message: 'Employee updated!', type: 'success' }));
    } else {
      dispatch(addEmployee(data));
      dispatch(showToast({ message: 'Employee added!', type: 'success' }));
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editEmployee ? 'Edit Employee' : 'Add Employee'}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} type="button">Cancel</button>
          <button className="btn btn-primary" form="employee-form" type="submit">
            {editEmployee ? 'Save Changes' : 'Add Employee'}
          </button>
        </>
      }
    >
      <form id="employee-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label className="form-label">Profile Photo <span className="req">*</span></label>
          <ImageUpload
            value={imageVal}
            onChange={v => setValue('image', v, { shouldValidate: true })}
            error={errors.image?.message}
            label="Upload profile photo"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Full Name <span className="req">*</span></label>
          <input {...register('name')} className={`form-input ${errors.name ? 'input-error' : ''}`} placeholder="John Doe" />
          {errors.name && <div className="form-error">⚠ {errors.name.message}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Position <span className="req">*</span></label>
          <input {...register('position')} className={`form-input ${errors.position ? 'input-error' : ''}`} placeholder="Software Engineer" />
          {errors.position && <div className="form-error">⚠ {errors.position.message}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Official Email <span className="req">*</span></label>
          <input {...register('email')} type="email" className={`form-input ${errors.email ? 'input-error' : ''}`} placeholder="john@company.com" />
          {errors.email && <div className="form-error">⚠ {errors.email.message}</div>}
        </div>
      </form>
    </Modal>
  );
}
