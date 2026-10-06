package com.studentmanagement.dto;

import java.util.Map;
import java.util.List;

/**
 * Data Transfer Object for Dashboard statistics and analytics.
 */
public class DashboardStatsDTO {

    private long totalStudents;
    private long totalDepartments;
    private double averageMarks;
    private double highestMarks;
    private Map<String, Long> studentsByDepartment;
    private List<String> departments;

    public DashboardStatsDTO() {
    }

    public DashboardStatsDTO(long totalStudents, long totalDepartments, double averageMarks, double highestMarks, Map<String, Long> studentsByDepartment, List<String> departments) {
        this.totalStudents = totalStudents;
        this.totalDepartments = totalDepartments;
        this.averageMarks = averageMarks;
        this.highestMarks = highestMarks;
        this.studentsByDepartment = studentsByDepartment;
        this.departments = departments;
    }

    // Getters and Setters
    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalDepartments() {
        return totalDepartments;
    }

    public void setTotalDepartments(long totalDepartments) {
        this.totalDepartments = totalDepartments;
    }

    public double getAverageMarks() {
        return averageMarks;
    }

    public void setAverageMarks(double averageMarks) {
        this.averageMarks = averageMarks;
    }

    public double getHighestMarks() {
        return highestMarks;
    }

    public void setHighestMarks(double highestMarks) {
        this.highestMarks = highestMarks;
    }

    public Map<String, Long> getStudentsByDepartment() {
        return studentsByDepartment;
    }

    public void setStudentsByDepartment(Map<String, Long> studentsByDepartment) {
        this.studentsByDepartment = studentsByDepartment;
    }

    public List<String> getDepartments() {
        return departments;
    }

    public void setDepartments(List<String> departments) {
        this.departments = departments;
    }
}
