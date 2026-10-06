import React from 'react';
import { Search, X, Filter, RotateCcw } from 'lucide-react';

export default function SearchBar({
  searchKeyword,
  onSearchChange,
  departmentFilter,
  onDepartmentChange,
  yearFilter,
  onYearChange,
  departments = [],
  onResetFilters,
}) {
  return (
    <div className="toolbar-card">
      {/* Search Input Box */}
      <div className="toolbar-search">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by Student ID, Name, or Department..."
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchKeyword && (
            <button
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Filter Dropdowns */}
      <div className="toolbar-filters">
        <select
          className="select-filter"
          value={departmentFilter}
          onChange={(e) => onDepartmentChange(e.target.value)}
          aria-label="Filter by Department"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <select
          className="select-filter"
          value={yearFilter}
          onChange={(e) => onYearChange(e.target.value)}
          aria-label="Filter by Academic Year"
        >
          <option value="">All Academic Years</option>
          <option value="1">Year 1</option>
          <option value="2">Year 2</option>
          <option value="3">Year 3</option>
          <option value="4">Year 4</option>
          <option value="5">Year 5</option>
        </select>

        {(searchKeyword || departmentFilter || yearFilter) && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={onResetFilters}
            title="Reset all filters"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
