package com.studentmanagement.dto;

public class SubjectMarksDTO {

    private String subjectCode;
    private String subjectName;
    private Double internalMarks;
    private Double externalMarks;
    private Double totalMarks;
    private String grade;
    private Integer credits;

    public SubjectMarksDTO() {
    }

    public SubjectMarksDTO(String subjectCode, String subjectName, Double internalMarks, Double externalMarks, Double totalMarks, String grade, Integer credits) {
        this.subjectCode = subjectCode;
        this.subjectName = subjectName;
        this.internalMarks = internalMarks;
        this.externalMarks = externalMarks;
        this.totalMarks = totalMarks;
        this.grade = grade;
        this.credits = credits;
    }

    public String getSubjectCode() {
        return subjectCode;
    }

    public void setSubjectCode(String subjectCode) {
        this.subjectCode = subjectCode;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
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

    public Double getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(Double totalMarks) {
        this.totalMarks = totalMarks;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public Integer getCredits() {
        return credits;
    }

    public void setCredits(Integer credits) {
        this.credits = credits;
    }
}
