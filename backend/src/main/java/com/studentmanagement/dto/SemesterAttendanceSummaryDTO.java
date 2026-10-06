package com.studentmanagement.dto;

import java.util.List;

public class SemesterAttendanceSummaryDTO {

    private Integer semester;
    private Double overallPercentage;
    private Integer totalPresent;
    private Integer totalClasses;
    private List<SubjectAttendanceDTO> subjects;

    public SemesterAttendanceSummaryDTO() {
    }

    public SemesterAttendanceSummaryDTO(Integer semester, Double overallPercentage, Integer totalPresent, Integer totalClasses, List<SubjectAttendanceDTO> subjects) {
        this.semester = semester;
        this.overallPercentage = overallPercentage;
        this.totalPresent = totalPresent;
        this.totalClasses = totalClasses;
        this.subjects = subjects;
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

    public Integer getTotalPresent() {
        return totalPresent;
    }

    public void setTotalPresent(Integer totalPresent) {
        this.totalPresent = totalPresent;
    }

    public Integer getTotalClasses() {
        return totalClasses;
    }

    public void setTotalClasses(Integer totalClasses) {
        this.totalClasses = totalClasses;
    }

    public List<SubjectAttendanceDTO> getSubjects() {
        return subjects;
    }

    public void setSubjects(List<SubjectAttendanceDTO> subjects) {
        this.subjects = subjects;
    }
}
