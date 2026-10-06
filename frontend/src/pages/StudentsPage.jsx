import React from 'react';
import SearchBar from '../components/SearchBar';
import StudentTable from '../components/StudentTable';
import LoadingSpinner from '../components/LoadingSpinner';

export default function StudentsPage({
  students = [],
  isLoading,
  searchKeyword,
  onSearchChange,
  departmentFilter,
  onDepartmentChange,
  yearFilter,
  onYearChange,
  departments = [],
  onResetFilters,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
  onOpenAddModal,
}) {
  // Filter students by Year on client side (if selected) while search/dept filters interact with backend
  const filteredStudents = students.filter((stu) => {
    if (!yearFilter) return true;
    return String(stu.year) === String(yearFilter);
  });

  return (
    <div>
      <SearchBar
        searchKeyword={searchKeyword}
        onSearchChange={onSearchChange}
        departmentFilter={departmentFilter}
        onDepartmentChange={onDepartmentChange}
        yearFilter={yearFilter}
        onYearChange={onYearChange}
        departments={departments}
        onResetFilters={onResetFilters}
      />

      {isLoading ? (
        <LoadingSpinner message="Fetching student records..." />
      ) : (
        <StudentTable
          students={filteredStudents}
          onView={onViewStudent}
          onEdit={onEditStudent}
          onDelete={onDeleteStudent}
          onOpenAddModal={onOpenAddModal}
        />
      )}
    </div>
  );
}
