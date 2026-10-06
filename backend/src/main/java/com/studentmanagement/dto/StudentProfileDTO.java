package com.studentmanagement.dto;

public class StudentProfileDTO {

    private Long id;
    private String studentId;
    private String name;
    private String department;
    private Integer year;
    private Integer semester;
    private String email;
    private String contact;
    private Double marks;
    private String academicStatus;
    private Double feeDues;
    private Double attendancePercentage;

    public StudentProfileDTO() {
    }

    public StudentProfileDTO(Long id, String studentId, String name, String department, Integer year, Integer semester, String email, String contact, Double marks, String academicStatus, Double feeDues, Double attendancePercentage) {
        this.id = id;
        this.studentId = studentId;
        this.name = name;
        this.department = department;
        this.year = year;
        this.semester = semester;
        this.email = email;
        this.contact = contact;
        this.marks = marks;
        this.academicStatus = academicStatus;
        this.feeDues = feeDues;
        this.attendancePercentage = attendancePercentage;
    }

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

    public Integer getSemester() {
        return semester;
    }

    public void setSemester(Integer semester) {
        this.semester = semester;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public Double getMarks() {
        return marks;
    }

    public void setMarks(Double marks) {
        this.marks = marks;
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
}
