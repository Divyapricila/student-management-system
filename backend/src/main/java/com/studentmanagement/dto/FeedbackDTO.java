package com.studentmanagement.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class FeedbackDTO {

    private Long id;
    private String studentRefId;
    private String studentName;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot exceed 5")
    private Integer rating;

    @NotBlank(message = "Feedback message cannot be empty")
    private String message;

    private LocalDateTime createdAt;

    public FeedbackDTO() {
    }

    public FeedbackDTO(Long id, String studentRefId, String studentName, Integer rating, String message, LocalDateTime createdAt) {
        this.id = id;
        this.studentRefId = studentRefId;
        this.studentName = studentName;
        this.rating = rating;
        this.message = message;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentRefId() {
        return studentRefId;
    }

    public void setStudentRefId(String studentRefId) {
        this.studentRefId = studentRefId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
