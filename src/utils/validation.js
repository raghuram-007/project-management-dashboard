import * as yup from 'yup';

export const employeeSchema = (existingEmails = [], editId = null) => yup.object({
  name: yup.string().trim().required('Name is required'),
  position: yup.string().trim().required('Position is required'),
  email: yup
    .string()
    .email('Must be a valid email')
    .required('Email is required')
    .test('unique-email', 'Email already in use', function(value) {
      return !existingEmails.find(e => e.email === value && e.id !== editId);
    }),
  image: yup.string().required('Profile image is required'),
});

export const projectSchema = yup.object({
  title: yup.string().trim().required('Project title is required'),
  description: yup.string().trim().required('Description is required'),
  startDate: yup.string().required('Start date is required'),
  endDate: yup
    .string()
    .required('End date is required')
    .test('end-after-start', 'End date must be after start date', function(value) {
      const { startDate } = this.parent;
      if (!startDate || !value) return true;
      return new Date(value) > new Date(startDate);
    }),
  assignedEmployees: yup.array().min(1, 'Assign at least one employee'),
});

export const taskSchema = yup.object({
  title: yup.string().trim().required('Task title is required'),
  description: yup.string().trim().required('Description is required'),
  projectId: yup.string().required('Project is required'),
  assignedEmployee: yup.string().required('Assign an employee'),
  eta: yup.string().required('ETA is required'),
});
