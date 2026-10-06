package com.studentmanagement.dto;

import java.time.LocalDate;

public class ExamScheduleDTO {
    private Long id;
    private String subjectCode;
    private String subjectName;
    private String examType;
    private LocalDate examDate;
    private String examTime;
    private String room;
    private String seatNumber;
    private Integer semester;
    private String department;
    private Long daysRemaining;

    public ExamScheduleDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public String getExamType() { return examType; }
    public void setExamType(String examType) { this.examType = examType; }

    public LocalDate getExamDate() { return examDate; }
    public void setExamDate(LocalDate examDate) { this.examDate = examDate; }

    public String getExamTime() { return examTime; }
    public void setExamTime(String examTime) { this.examTime = examTime; }

    public String getRoom() { return room; }
    public void setRoom(String room) { this.room = room; }

    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }

    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Long getDaysRemaining() { return daysRemaining; }
    public void setDaysRemaining(Long daysRemaining) { this.daysRemaining = daysRemaining; }
}
