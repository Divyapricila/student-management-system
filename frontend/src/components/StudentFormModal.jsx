import React, { useState, useEffect } from 'react';
import { X, UserPlus, Edit3, AlertCircle } from 'lucide-react';
import studentService from '../services/studentService';

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Biotechnology',
];

const INITIAL_FORM_STATE = {
  studentId: '',
  name: '',
  department: '',
  year: '1',
  marks: '',
  contact: '',
  email: '',
};

export default function StudentFormModal({ isOpen, mode = 'add', initialData = null, onClose, onSuccess, onError }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customDept, setCustomDept] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData({
          studentId: initialData.studentId || '',
          name: initialData.name || '',
          department: initialData.department || '',
          year: String(initialData.year || '1'),
          marks: String(initialData.marks !== undefined ? initialData.marks : ''),
          contact: initialData.contact || '',
          email: initialData.email || '',
        });
        if (initialData.department && !DEPARTMENTS.includes(initialData.department)) {
          setCustomDept(true);
        } else {
          setCustomDept(false);
        }
      } else {
        setFormData(INITIAL_FORM_STATE);
        setCustomDept(false);
      }
      setErrors({});
    }
  }, [isOpen, mode, initialData]);

  if (!isOpen) return null;

  const validateField = (name, value) => {
    let err = '';
    const trimmed = typeof value === 'string' ? value.trim() : value;

    switch (name) {
      case 'studentId':
        if (!trimmed) err = 'Student ID is required.';
        else if (trimmed.length < 2) err = 'Student ID must be at least 2 characters.';
        else if (trimmed.length > 50) err = 'Student ID cannot exceed 50 characters.';
        break;
      case 'name':
        if (!trimmed) err = 'Student Name is required.';
        else if (trimmed.length < 2) err = 'Name must be at least 2 characters.';
        break;
      case 'department':
        if (!trimmed) err = 'Department is required.';
        break;
      case 'year':
        const y = Number(trimmed);
        if (!trimmed || isNaN(y) || y < 1 || y > 5) err = 'Academic Year must be between 1 and 5.';
        break;
      case 'marks':
        const m = Number(trimmed);
        if (trimmed === '' || isNaN(m)) err = 'Marks are required.';
        else if (m < 0 || m > 100) err = 'Marks must be within 0 and 100.';
        break;
      case 'contact':
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!trimmed) err = 'Contact number is required.';
        else if (!phoneRegex.test(trimmed)) err = 'Contact number must be 10 to 15 digits.';
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!trimmed) err = 'Email address is required.';
        else if (!emailRegex.test(trimmed)) err = 'Please enter a valid email address.';
        break;
      default:
        break;
    }
    return err;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation feedback for this field
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleDeptSelect = (e) => {
    const val = e.target.value;
    if (val === '__custom__') {
      setCustomDept(true);
      setFormData((prev) => ({ ...prev, department: '' }));
    } else {
      setCustomDept(false);
      setFormData((prev) => ({ ...prev, department: val }));
      setErrors((prev) => ({ ...prev, department: '' }));
    }
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        studentId: formData.studentId.trim(),
        name: formData.name.trim(),
        department: formData.department.trim(),
        year: parseInt(formData.year, 10),
        marks: parseFloat(formData.marks),
        contact: formData.contact.trim(),
        email: formData.email.trim(),
      };

      if (mode === 'add') {
        const created = await studentService.createStudent(payload);
        onSuccess(created, 'Student added successfully.');
      } else {
        const updated = await studentService.updateStudent(initialData.id, payload);
        onSuccess(updated, 'Student information updated successfully.');
      }
      onClose();
    } catch (err) {
      onError(err.message || 'Operation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEdit = mode === 'edit';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            {isEdit ? (
              <>
                <Edit3 size={20} style={{ color: 'var(--primary)' }} />
                <span>Edit Student Record</span>
              </>
            ) : (
              <>
                <UserPlus size={20} style={{ color: 'var(--primary)' }} />
                <span>Add New Student</span>
              </>
            )}
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              {/* Student ID */}
              <div className="form-group">
                <label className="form-label" htmlFor="studentId">
                  Student ID <span className="required-star">*</span>
                </label>
                <input
                  id="studentId"
                  name="studentId"
                  type="text"
                  placeholder="e.g. STU009"
                  className={`form-control ${errors.studentId ? 'is-invalid' : ''}`}
                  value={formData.studentId}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.studentId && (
                  <span className="error-text">
                    <AlertCircle size={13} /> {errors.studentId}
                  </span>
                )}
              </div>

              {/* Student Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Full Name <span className="required-star">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g. John Doe"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <span className="error-text">
                    <AlertCircle size={13} /> {errors.name}
                  </span>
                )}
              </div>

              {/* Department */}
              <div className="form-group full-width">
                <label className="form-label" htmlFor="department">
                  Department <span className="required-star">*</span>
                </label>
                {!customDept ? (
                  <select
                    id="departmentSelect"
                    className={`form-control ${errors.department ? 'is-invalid' : ''}`}
                    value={formData.department}
                    onChange={handleDeptSelect}
                    disabled={isSubmitting}
                  >
                    <option value="">-- Select Department --</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                    <option value="__custom__">+ Other / Enter Custom Department</option>
                  </select>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      id="department"
                      name="department"
                      type="text"
                      placeholder="Enter department name"
                      className={`form-control ${errors.department ? 'is-invalid' : ''}`}
                      value={formData.department}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setCustomDept(false);
                        setFormData((prev) => ({ ...prev, department: '' }));
                      }}
                    >
                      Presets
                    </button>
                  </div>
                )}
                {errors.department && (
                  <span className="error-text">
                    <AlertCircle size={13} /> {errors.department}
                  </span>
                )}
              </div>

              {/* Academic Year */}
              <div className="form-group">
                <label className="form-label" htmlFor="year">
                  Academic Year <span className="required-star">*</span>
                </label>
                <select
                  id="year"
                  name="year"
                  className={`form-control ${errors.year ? 'is-invalid' : ''}`}
                  value={formData.year}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="1">1st Year (Freshman)</option>
                  <option value="2">2nd Year (Sophomore)</option>
                  <option value="3">3rd Year (Junior)</option>
                  <option value="4">4th Year (Senior)</option>
                  <option value="5">5th Year (Dual Degree / Grad)</option>
                </select>
                {errors.year && (
                  <span className="error-text">
                    <AlertCircle size={13} /> {errors.year}
                  </span>
                )}
              </div>

              {/* Marks */}
              <div className="form-group">
                <label className="form-label" htmlFor="marks">
                  Marks (0 - 100) <span className="required-star">*</span>
                </label>
                <input
                  id="marks"
                  name="marks"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="e.g. 85.5"
                  className={`form-control ${errors.marks ? 'is-invalid' : ''}`}
                  value={formData.marks}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.marks && (
                  <span className="error-text">
                    <AlertCircle size={13} /> {errors.marks}
                  </span>
                )}
              </div>

              {/* Contact Number */}
              <div className="form-group">
                <label className="form-label" htmlFor="contact">
                  Contact Number <span className="required-star">*</span>
                </label>
                <input
                  id="contact"
                  name="contact"
                  type="tel"
                  placeholder="10-15 digits, e.g. 9876543210"
                  className={`form-control ${errors.contact ? 'is-invalid' : ''}`}
                  value={formData.contact}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.contact && (
                  <span className="error-text">
                    <AlertCircle size={13} /> {errors.contact}
                  </span>
                )}
              </div>

              {/* Email Address */}
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email Address <span className="required-star">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="e.g. student@college.edu"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <span className="error-text">
                    <AlertCircle size={13} /> {errors.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : isEdit ? (
                <>
                  <Edit3 size={15} />
                  <span>Update Student</span>
                </>
              ) : (
                <>
                  <UserPlus size={15} />
                  <span>Save Student</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
