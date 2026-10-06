package com.studentmanagement.dto;

import java.util.List;

public class AttendanceAnalysisDTO {
    private Integer semester;
    private Double overallPercentage;
    private Integer totalClasses;
    private Integer presentClasses;
    private Integer absentClasses;
    private String status; // GOOD, WARNING, SHORTAGE
    private String message;
    private Integer classesNeededFor75;
    private Integer classesCanMissAbove75;
    private List<SubjectAttendanceDetailDTO> subjects;

    public AttendanceAnalysisDTO() {}

    public static class SubjectAttendanceDetailDTO {
        private String subjectCode;
        private String subjectName;
        private Integer presentClasses;
        private Integer totalClasses;
        private Integer absentClasses;
        private Double percentage;
        private String status; // GOOD, WARNING, LOW
        private Integer classesNeededFor75;
        private Integer classesCanMissAbove75;
        private String recommendation;

        public SubjectAttendanceDetailDTO() {}

        public String getSubjectCode() { return subjectCode; }
        public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }

        public String getSubjectName() { return subjectName; }
        public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

        public Integer getPresentClasses() { return presentClasses; }
        public void setPresentClasses(Integer presentClasses) { this.presentClasses = presentClasses; }

        public Integer getTotalClasses() { return totalClasses; }
        public void setTotalClasses(Integer totalClasses) { this.totalClasses = totalClasses; }

        public Integer getAbsentClasses() { return absentClasses; }
        public void setAbsentClasses(Integer absentClasses) { this.absentClasses = absentClasses; }

        public Double getPercentage() { return percentage; }
        public void setPercentage(Double percentage) { this.percentage = percentage; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public Integer getClassesNeededFor75() { return classesNeededFor75; }
        public void setClassesNeededFor75(Integer classesNeededFor75) { this.classesNeededFor75 = classesNeededFor75; }

        public Integer getClassesCanMissAbove75() { return classesCanMissAbove75; }
        public void setClassesCanMissAbove75(Integer classesCanMissAbove75) { this.classesCanMissAbove75 = classesCanMissAbove75; }

        public String getRecommendation() { return recommendation; }
        public void setRecommendation(String recommendation) { this.recommendation = recommendation; }
    }

    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }

    public Double getOverallPercentage() { return overallPercentage; }
    public void setOverallPercentage(Double overallPercentage) { this.overallPercentage = overallPercentage; }

    public Integer getTotalClasses() { return totalClasses; }
    public void setTotalClasses(Integer totalClasses) { this.totalClasses = totalClasses; }

    public Integer getPresentClasses() { return presentClasses; }
    public void setPresentClasses(Integer presentClasses) { this.presentClasses = presentClasses; }

    public Integer getAbsentClasses() { return absentClasses; }
    public void setAbsentClasses(Integer absentClasses) { this.absentClasses = absentClasses; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Integer getClassesNeededFor75() { return classesNeededFor75; }
    public void setClassesNeededFor75(Integer classesNeededFor75) { this.classesNeededFor75 = classesNeededFor75; }

    public Integer getClassesCanMissAbove75() { return classesCanMissAbove75; }
    public void setClassesCanMissAbove75(Integer classesCanMissAbove75) { this.classesCanMissAbove75 = classesCanMissAbove75; }

    public List<SubjectAttendanceDetailDTO> getSubjects() { return subjects; }
    public void setSubjects(List<SubjectAttendanceDetailDTO> subjects) { this.subjects = subjects; }
}
