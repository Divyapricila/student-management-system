package com.studentmanagement.dto;

public class DashboardSummaryDTO {
    private String studentId;
    private String studentName;
    private String department;
    private Integer year;
    private Integer semester;

    private Double attendancePercentage;
    private String attendanceStatus;

    private Double currentSgpa;
    private Double cgpa;

    private Double feeTotal;
    private Double feePaid;
    private Double feeDue;

    private Long pendingAssignmentsCount;
    private Long upcomingExamsCount;
    private String nextExamTitle;
    private Long nextExamDays;

    private Long unreadNotificationsCount;

    public DashboardSummaryDTO() {}

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }

    public Double getAttendancePercentage() { return attendancePercentage; }
    public void setAttendancePercentage(Double attendancePercentage) { this.attendancePercentage = attendancePercentage; }

    public String getAttendanceStatus() { return attendanceStatus; }
    public void setAttendanceStatus(String attendanceStatus) { this.attendanceStatus = attendanceStatus; }

    public Double getCurrentSgpa() { return currentSgpa; }
    public void setCurrentSgpa(Double currentSgpa) { this.currentSgpa = currentSgpa; }

    public Double getCgpa() { return cgpa; }
    public void setCgpa(Double cgpa) { this.cgpa = cgpa; }

    public Double getFeeTotal() { return feeTotal; }
    public void setFeeTotal(Double feeTotal) { this.feeTotal = feeTotal; }

    public Double getFeePaid() { return feePaid; }
    public void setFeePaid(Double feePaid) { this.feePaid = feePaid; }

    public Double getFeeDue() { return feeDue; }
    public void setFeeDue(Double feeDue) { this.feeDue = feeDue; }

    public Long getPendingAssignmentsCount() { return pendingAssignmentsCount; }
    public void setPendingAssignmentsCount(Long pendingAssignmentsCount) { this.pendingAssignmentsCount = pendingAssignmentsCount; }

    public Long getUpcomingExamsCount() { return upcomingExamsCount; }
    public void setUpcomingExamsCount(Long upcomingExamsCount) { this.upcomingExamsCount = upcomingExamsCount; }

    public String getNextExamTitle() { return nextExamTitle; }
    public void setNextExamTitle(String nextExamTitle) { this.nextExamTitle = nextExamTitle; }

    public Long getNextExamDays() { return nextExamDays; }
    public void setNextExamDays(Long nextExamDays) { this.nextExamDays = nextExamDays; }

    public Long getUnreadNotificationsCount() { return unreadNotificationsCount; }
    public void setUnreadNotificationsCount(Long unreadNotificationsCount) { this.unreadNotificationsCount = unreadNotificationsCount; }
}
