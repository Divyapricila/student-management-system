package com.studentmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity representing a Student record in the database.
 */
@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false, unique = true, length = 50)
    private String studentId;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "department", nullable = false, length = 100)
    private String department;

    @Column(name = "\"year\"", nullable = false)
    private Integer year;

    @Column(name = "marks", nullable = false)
    private Double marks;

    @Column(name = "contact", nullable = false, length = 20)
    private String contact;

    @Column(name = "email", nullable = false, length = 100)
    private String email;

    @Column(name = "current_semester")
    private Integer currentSemester = 1;

    @Column(name = "academic_status", length = 50)
    private String academicStatus = "Active / Regular";

    @Column(name = "fee_dues")
    private Double feeDues = 135000.0;

    @Column(name = "attendance_percentage")
    private Double attendancePercentage = 84.82;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Student() {
    }

    public Student(Long id, String studentId, String name, String department, Integer year, Double marks, String contact, String email) {
        this.id = id;
        this.studentId = studentId;
        this.name = name;
        this.department = department;
        this.year = year;
        this.marks = marks;
        this.contact = contact;
        this.email = email;
        this.currentSemester = (year != null && year > 0) ? Math.min(8, (year * 2) - 1) : 1;
        this.academicStatus = "Active / Regular";
        this.feeDues = 135000.0;
        this.attendancePercentage = 84.82;
    }

    public Student(Long id, String studentId, String name, String department, Integer year, Double marks, String contact, String email, Integer currentSemester, String academicStatus, Double feeDues, Double attendancePercentage) {
        this.id = id;
        this.studentId = studentId;
        this.name = name;
        this.department = department;
        this.year = year;
        this.marks = marks;
        this.contact = contact;
        this.email = email;
        this.currentSemester = currentSemester != null ? currentSemester : 1;
        this.academicStatus = academicStatus != null ? academicStatus : "Active / Regular";
        this.feeDues = feeDues != null ? feeDues : 135000.0;
        this.attendancePercentage = attendancePercentage != null ? attendancePercentage : 84.82;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Double getMarks() {
        return marks;
    }

    public void setMarks(Double marks) {
        this.marks = marks;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Integer getCurrentSemester() {
        return currentSemester;
    }

    public void setCurrentSemester(Integer currentSemester) {
        this.currentSemester = currentSemester;
    }

    public String getAcademicStatus() {
        return academicStatus;
    }

    public void setAcademicStatus(String academicStatus) {
        this.academicStatus = academicStatus;
    }

    public Double getFeeDues() {
        return feeDues;
    }

    public void setFeeDues(Double feeDues) {
        this.feeDues = feeDues;
    }

    public Double getAttendancePercentage() {
        return attendancePercentage;
    }

    public void setAttendancePercentage(Double attendancePercentage) {
        this.attendancePercentage = attendancePercentage;
    }

    @Override
    public String toString() {
        return "Student{" +
                "id=" + id +
                ", studentId='" + studentId + '\'' +
                ", name='" + name + '\'' +
                ", department='" + department + '\'' +
                ", year=" + year +
                ", marks=" + marks +
                ", contact='" + contact + '\'' +
                ", email='" + email + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
