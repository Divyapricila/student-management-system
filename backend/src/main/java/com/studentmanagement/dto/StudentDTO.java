package com.studentmanagement.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

/**
 * Data Transfer Object for Student creation and updates.
 */
public class StudentDTO {

    private Long id;

    @NotBlank(message = "Student ID is required.")
    @Size(min = 2, max = 50, message = "Student ID must be between 2 and 50 characters.")
    private String studentId;

    @NotBlank(message = "Student Name is required.")
    @Size(min = 2, max = 100, message = "Student Name must be between 2 and 100 characters.")
    private String name;

    @NotBlank(message = "Department is required.")
    @Size(max = 100, message = "Department must not exceed 100 characters.")
    private String department;

    @NotNull(message = "Academic Year is required.")
    @Min(value = 1, message = "Academic Year must be at least 1.")
    @Max(value = 5, message = "Academic Year must not exceed 5.")
    private Integer year;

    @NotNull(message = "Marks are required.")
    @DecimalMin(value = "0.0", inclusive = true, message = "Marks cannot be less than 0.")
    @DecimalMax(value = "100.0", inclusive = true, message = "Marks cannot be greater than 100.")
    private Double marks;

    @NotBlank(message = "Contact number is required.")
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Contact number must be between 10 and 15 digits.")
    private String contact;

    @NotBlank(message = "Email address is required.")
    @Email(message = "Email address must be a valid email format.")
    private String email;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public StudentDTO() {
    }

    public StudentDTO(Long id, String studentId, String name, String department, Integer year, Double marks, String contact, String email, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.studentId = studentId;
        this.name = name;
        this.department = department;
        this.year = year;
        this.marks = marks;
        this.contact = contact;
        this.email = email;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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
        this.studentId = studentId != null ? studentId.trim() : null;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name != null ? name.trim() : null;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department != null ? department.trim() : null;
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
        this.contact = contact != null ? contact.trim() : null;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email != null ? email.trim() : null;
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
}
