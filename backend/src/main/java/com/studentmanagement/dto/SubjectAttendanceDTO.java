package com.studentmanagement.dto;

public class SubjectAttendanceDTO {

    private String subjectCode;
    private String subjectName;
    private Integer presentClasses;
    private Integer totalClasses;
    private Double percentage;

    public SubjectAttendanceDTO() {
    }

    public SubjectAttendanceDTO(String subjectCode, String subjectName, Integer presentClasses, Integer totalClasses, Double percentage) {
        this.subjectCode = subjectCode;
        this.subjectName = subjectName;
        this.presentClasses = presentClasses;
        this.totalClasses = totalClasses;
        this.percentage = percentage;
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

    public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }
}
