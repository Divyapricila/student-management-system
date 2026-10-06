import React, { useState } from 'react';
import {
  Eye,
  Edit3,
  Trash2,
  Mail,
  Phone,
  ArrowUpDown,
  UserX,
  UserPlus
} from 'lucide-react';

export default function StudentTable({
  students = [],
  onView,
  onEdit,
  onDelete,
  onOpenAddModal,
}) {
  const [sortField, setSortField] = useState('studentId');
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedStudents = [...students].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal ? bVal.toLowerCase() : '';
      return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }

    if (typeof aVal === 'number') {
      return sortAsc ? aVal - bVal : bVal - aVal;
    }

    return 0;
  });

  const totalPages = Math.ceil(sortedStudents.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedStudents = sortedStudents.slice(startIndex, startIndex + pageSize);

  const getMarksBadgeClass = (marks) => {
    const m = Number(marks) || 0;
    if (m >= 80) return 'marks-high';
    if (m >= 60) return 'marks-med';
    if (m >= 40) return 'marks-avg';
    return 'marks-low';
  };

  if (students.length === 0) {
    return (
      <div className="table-card">
        <div className="empty-state">
          <div className="empty-state-icon">
            <UserX size={32} />
          </div>
          <h3 className="empty-state-title">No Students Found</h3>
          <p className="empty-state-desc">
            No matching student records found. Try adjusting your search query, clearing filters, or add a new student.
          </p>
          <button className="btn btn-primary btn-sm" onClick={onOpenAddModal}>
            <UserPlus size={16} />
            <span>Add Student Now</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="student-table">
          <thead>
            <tr>
              <th
                onClick={() => handleSort('studentId')}
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>Student ID</span>
                  <ArrowUpDown size={13} />
                </div>
              </th>
              <th
                onClick={() => handleSort('name')}
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>Name</span>
                  <ArrowUpDown size={13} />
                </div>
              </th>
              <th
                onClick={() => handleSort('department')}
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>Department</span>
                  <ArrowUpDown size={13} />
                </div>
              </th>
              <th
                onClick={() => handleSort('year')}
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>Year</span>
                  <ArrowUpDown size={13} />
                </div>
              </th>
              <th
                onClick={() => handleSort('marks')}
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>Marks</span>
                  <ArrowUpDown size={13} />
                </div>
              </th>
              <th>Contact</th>
              <th>Email</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.map((student) => (
              <tr key={student.id}>
                <td>
                  <span className="student-id-badge">{student.studentId}</span>
                </td>
                <td className="student-name-cell">{student.name}</td>
                <td>{student.department}</td>
                <td>Year {student.year}</td>
                <td>
                  <span className={`marks-badge ${getMarksBadgeClass(student.marks)}`}>
                    {student.marks}%
                  </span>
                </td>
                <td>
                  <a
                    href={`tel:${student.contact}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      color: 'var(--text-muted)',
                      fontSize: '0.84rem',
                    }}
                  >
                    <Phone size={13} />
                    <span>{student.contact}</span>
                  </a>
                </td>
                <td>
                  <a
                    href={`mailto:${student.email}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      color: 'var(--primary)',
                      fontSize: '0.84rem',
                    }}
                  >
                    <Mail size={13} />
                    <span>{student.email}</span>
                  </a>
                </td>
                <td>
                  <div className="action-btn-group" style={{ justifyContent: 'center' }}>
                    <button
                      className="action-btn view"
                      onClick={() => onView(student)}
                      title="View Student Details"
                      aria-label="View Student Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="action-btn edit"
                      onClick={() => onEdit(student)}
                      title="Edit Student Information"
                      aria-label="Edit Student Information"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => onDelete(student)}
                      title="Delete Student Record"
                      aria-label="Delete Student Record"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        style={{
          padding: '0.75rem 1.25rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <span>
          Showing {sortedStudents.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + pageSize, sortedStudents.length)} of {sortedStudents.length} students
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="form-control"
            style={{ fontSize: '0.78rem', padding: '0.2rem 0.5rem', height: '28px' }}
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
          </select>

          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button
              className="btn btn-secondary btn-sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
            >
              Prev
            </button>
            <span style={{ display: 'flex', alignItems: 'center', padding: '0 0.4rem', fontSize: '0.78rem', fontWeight: 600 }}>
              {currentPage} / {totalPages}
            </span>
            <button
              className="btn btn-secondary btn-sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
