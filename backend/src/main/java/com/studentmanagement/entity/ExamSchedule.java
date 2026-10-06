package com.studentmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "exam_schedules")
public class ExamSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "subject_code", nullable = false, length = 50)
    private String subjectCode;

    @Column(name = "subject_name", nullable = false, length = 150)
    private String subjectName;

    @Column(name = "exam_type", nullable = false, length = 50)
    private String examType; // "Internal Exam", "Semester End Exam", "Practical Lab"

    @Column(name = "exam_date", nullable = false)
    private LocalDate examDate;

    @Column(name = "exam_time", nullable = false, length = 50)
    private String examTime; // "10:00 AM - 01:00 PM"

    @Column(name = "room", length = 50)
    private String room; // "Room E-204"

    @Column(name = "seat_number", length = 50)
    private String seatNumber; // "E-204-12"

    @Column(name = "semester", nullable = false)
    private Integer semester;

    @Column(name = "department", length = 50)
    private String department;

    public ExamSchedule() {}

    public ExamSchedule(Long id, String subjectCode, String subjectName, String examType, LocalDate examDate, String examTime, String room, String seatNumber, Integer semester, String department) {
        this.id = id;
        this.subjectCode = subjectCode;
        this.subjectName = subjectName;
        this.examType = examType;
        this.examDate = examDate;
        this.examTime = examTime;
        this.room = room;
        this.seatNumber = seatNumber;
        this.semester = semester;
        this.department = department;
    }

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
}
