package com.studentmanagement.dto;

import jakarta.validation.constraints.NotNull;

public class AcademicUpdateDTO {

    @NotNull(message = "Student ID is required")
    private String studentId;

    @NotNull(message = "Semester is required")
    private Integer semester;

    @NotNull(message = "Subject Code is required")
    private String subjectCode;

    // Optional marks update
    private Double internalMarks;
    private Double externalMarks;

    // Optional attendance update
    private Integer presentClasses;
    private Integer totalClasses;

    public AcademicUpdateDTO() {
    }

    public AcademicUpdateDTO(String studentId, Integer semester, String subjectCode, Double internalMarks, Double externalMarks, Integer presentClasses, Integer totalClasses) {
        this.studentId = studentId;
        this.semester = semester;
        this.subjectCode = subjectCode;
        this.internalMarks = internalMarks;
        this.externalMarks = externalMarks;
        this.presentClasses = presentClasses;
        this.totalClasses = totalClasses;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public Integer getSemester() {
        return semester;
    }

    public void setSemester(Integer semester) {
        this.semester = semester;
    }

    public String getSubjectCode() {
        return subjectCode;
    }

    public void setSubjectCode(String subjectCode) {
        this.subjectCode = subjectCode;
    }

    public Double getInternalMarks() {
        return internalMarks;
    }

    public void setInternalMarks(Double internalMarks) {
        this.internalMarks = internalMarks;
    }

    public Double getExternalMarks() {
        return externalMarks;
    }

    public void setExternalMarks(Double externalMarks) {
        this.externalMarks = externalMarks;
    }

    public Integer getPresentClasses() {
        return presentClasses;
    }

    public void setPresentClasses(Integer presentClasses) {
        this.presentClasses = presentClasses;
    }

    public Integer getTotalClasses() {
        return totalClasses;
    }

    public void setTotalClasses(Integer totalClasses) {
        this.totalClasses = totalClasses;
    }
}
