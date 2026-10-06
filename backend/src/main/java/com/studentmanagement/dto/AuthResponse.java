package com.studentmanagement.dto;

public class AuthResponse {

    private String token;
    private String type = "Bearer";
    private String username;
    private String role; // "ROLE_ADMIN" or "ROLE_STUDENT"
    private String studentId;
    private String studentName;
    private String department;
    private Integer currentSemester;

    public AuthResponse() {
    }

    public AuthResponse(String token, String username, String role, String studentId, String studentName, String department, Integer currentSemester) {
        this.token = token;
        this.type = "Bearer";
        this.username = username;
        this.role = role;
        this.studentId = studentId;
        this.studentName = studentName;
        this.department = department;
        this.currentSemester = currentSemester;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Integer getCurrentSemester() {
        return currentSemester;
    }

    public void setCurrentSemester(Integer currentSemester) {
        this.currentSemester = currentSemester;
    }
}
