package com.studentmanagement.dto;

import java.util.List;

public class SemesterMarksSummaryDTO {

    private Integer semester;
    private Double overallPercentage;
    private String overallGrade;
    private Double totalInternal;
    private Double totalExternal;
    private Double totalMarks;
    private Integer totalMaxMarks;
    private List<SubjectMarksDTO> marks;

    public SemesterMarksSummaryDTO() {
    }

    public SemesterMarksSummaryDTO(Integer semester, Double overallPercentage, String overallGrade, Double totalInternal, Double totalExternal, Double totalMarks, Integer totalMaxMarks, List<SubjectMarksDTO> marks) {
        this.semester = semester;
        this.overallPercentage = overallPercentage;
        this.overallGrade = overallGrade;
        this.totalInternal = totalInternal;
        this.totalExternal = totalExternal;
        this.totalMarks = totalMarks;
        this.totalMaxMarks = totalMaxMarks;
        this.marks = marks;
    }

    public Integer getSemester() {
        return semester;
    }

    public void setSemester(Integer semester) {
        this.semester = semester;
    }

    public Double getOverallPercentage() {
        return overallPercentage;
    }

    public void setOverallPercentage(Double overallPercentage) {
        this.overallPercentage = overallPercentage;
    }

    public String getOverallGrade() {
        return overallGrade;
    }

    public void setOverallGrade(String overallGrade) {
        this.overallGrade = overallGrade;
    }

    public Double getTotalInternal() {
        return totalInternal;
    }

    public void setTotalInternal(Double totalInternal) {
        this.totalInternal = totalInternal;
    }

    public Double getTotalExternal() {
        return totalExternal;
    }

    public void setTotalExternal(Double totalExternal) {
        this.totalExternal = totalExternal;
    }

    public Double getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(Double totalMarks) {
        this.totalMarks = totalMarks;
    }

    public Integer getTotalMaxMarks() {
        return totalMaxMarks;
    }

    public void setTotalMaxMarks(Integer totalMaxMarks) {
        this.totalMaxMarks = totalMaxMarks;
    }

    public List<SubjectMarksDTO> getMarks() {
        return marks;
    }

    public void setMarks(List<SubjectMarksDTO> marks) {
        this.marks = marks;
    }
}
