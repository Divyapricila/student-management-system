package com.studentmanagement.dto;

public class AtRiskStudentDTO {
    private Long id;
    private String studentId;
    private String name;
    private String department;
    private Integer year;
    private Integer semester;
    private Double attendancePercentage;
    private Double cgpa;
    private Long failedSubjectsCount;
    private String riskReason;
    private String riskLevel; // LOW, MEDIUM, HIGH

    public AtRiskStudentDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }

    public Double getAttendancePercentage() { return attendancePercentage; }
    public void setAttendancePercentage(Double attendancePercentage) { this.attendancePercentage = attendancePercentage; }

    public Double getCgpa() { return cgpa; }
    public void setCgpa(Double cgpa) { this.cgpa = cgpa; }

    public Long getFailedSubjectsCount() { return failedSubjectsCount; }
    public void setFailedSubjectsCount(Long failedSubjectsCount) { this.failedSubjectsCount = failedSubjectsCount; }

    public String getRiskReason() { return riskReason; }
    public void setRiskReason(String riskReason) { this.riskReason = riskReason; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
}
