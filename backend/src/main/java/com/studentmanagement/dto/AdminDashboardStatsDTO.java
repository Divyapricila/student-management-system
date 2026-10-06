package com.studentmanagement.dto;

import java.util.List;
import java.util.Map;

public class AdminDashboardStatsDTO {
    private Long totalStudents;
    private Long activeStudents;
    private Long departmentsCount;
    private Double averageCgpa;
    private Double averageAttendance;
    private Long studentsAtRiskCount;
    private Double totalPendingFees;
    private Double totalCollectedFees;

    private Map<String, Long> studentsByDepartment;
    private Map<String, Long> attendanceDistribution;
    private Map<String, Long> cgpaDistribution;
    private List<StudentDTO> recentStudents;

    public AdminDashboardStatsDTO() {}

    public Long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(Long totalStudents) { this.totalStudents = totalStudents; }

    public Long getActiveStudents() { return activeStudents; }
    public void setActiveStudents(Long activeStudents) { this.activeStudents = activeStudents; }

    public Long getDepartmentsCount() { return departmentsCount; }
    public void setDepartmentsCount(Long departmentsCount) { this.departmentsCount = departmentsCount; }

    public Double getAverageCgpa() { return averageCgpa; }
    public void setAverageCgpa(Double averageCgpa) { this.averageCgpa = averageCgpa; }

    public Double getAverageAttendance() { return averageAttendance; }
    public void setAverageAttendance(Double averageAttendance) { this.averageAttendance = averageAttendance; }

    public Long getStudentsAtRiskCount() { return studentsAtRiskCount; }
    public void setStudentsAtRiskCount(Long studentsAtRiskCount) { this.studentsAtRiskCount = studentsAtRiskCount; }

    public Double getTotalPendingFees() { return totalPendingFees; }
    public void setTotalPendingFees(Double totalPendingFees) { this.totalPendingFees = totalPendingFees; }

    public Double getTotalCollectedFees() { return totalCollectedFees; }
    public void setTotalCollectedFees(Double totalCollectedFees) { this.totalCollectedFees = totalCollectedFees; }

    public Map<String, Long> getStudentsByDepartment() { return studentsByDepartment; }
    public void setStudentsByDepartment(Map<String, Long> studentsByDepartment) { this.studentsByDepartment = studentsByDepartment; }

    public Map<String, Long> getAttendanceDistribution() { return attendanceDistribution; }
    public void setAttendanceDistribution(Map<String, Long> attendanceDistribution) { this.attendanceDistribution = attendanceDistribution; }

    public Map<String, Long> getCgpaDistribution() { return cgpaDistribution; }
    public void setCgpaDistribution(Map<String, Long> cgpaDistribution) { this.cgpaDistribution = cgpaDistribution; }

    public List<StudentDTO> getRecentStudents() { return recentStudents; }
    public void setRecentStudents(List<StudentDTO> recentStudents) { this.recentStudents = recentStudents; }
}
