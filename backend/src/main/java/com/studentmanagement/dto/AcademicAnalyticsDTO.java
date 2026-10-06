package com.studentmanagement.dto;

import java.util.List;

public class AcademicAnalyticsDTO {
    private Double overallCgpa;
    private Double totalCreditsEarned;
    private List<SemesterSgpaDTO> sgpaTrends;
    private List<SubjectScoreDTO> currentSemesterSubjects;
    private List<SemesterAttendanceTrendDTO> attendanceTrends;
    private List<SemesterPercentageTrendDTO> percentageTrends;

    public AcademicAnalyticsDTO() {}

    public static class SemesterSgpaDTO {
        private Integer semester;
        private Double sgpa;
        private Integer credits;
        private Double percentage;

        public SemesterSgpaDTO() {}
        public SemesterSgpaDTO(Integer semester, Double sgpa, Integer credits, Double percentage) {
            this.semester = semester;
            this.sgpa = sgpa;
            this.credits = credits;
            this.percentage = percentage;
        }
        public Integer getSemester() { return semester; }
        public void setSemester(Integer semester) { this.semester = semester; }
        public Double getSgpa() { return sgpa; }
        public void setSgpa(Double sgpa) { this.sgpa = sgpa; }
        public Integer getCredits() { return credits; }
        public void setCredits(Integer credits) { this.credits = credits; }
        public Double getPercentage() { return percentage; }
        public void setPercentage(Double percentage) { this.percentage = percentage; }
    }

    public static class SubjectScoreDTO {
        private String subjectCode;
        private String subjectName;
        private Double internalMarks;
        private Double externalMarks;
        private Double totalMarks;
        private String grade;
        private Double gradePoint;

        public SubjectScoreDTO() {}
        public SubjectScoreDTO(String subjectCode, String subjectName, Double internalMarks, Double externalMarks, Double totalMarks, String grade, Double gradePoint) {
            this.subjectCode = subjectCode;
            this.subjectName = subjectName;
            this.internalMarks = internalMarks;
            this.externalMarks = externalMarks;
            this.totalMarks = totalMarks;
            this.grade = grade;
            this.gradePoint = gradePoint;
        }
        public String getSubjectCode() { return subjectCode; }
        public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
        public String getSubjectName() { return subjectName; }
        public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
        public Double getInternalMarks() { return internalMarks; }
        public void setInternalMarks(Double internalMarks) { this.internalMarks = internalMarks; }
        public Double getExternalMarks() { return externalMarks; }
        public void setExternalMarks(Double externalMarks) { this.externalMarks = externalMarks; }
        public Double getTotalMarks() { return totalMarks; }
        public void setTotalMarks(Double totalMarks) { this.totalMarks = totalMarks; }
        public String getGrade() { return grade; }
        public void setGrade(String grade) { this.grade = grade; }
        public Double getGradePoint() { return gradePoint; }
        public void setGradePoint(Double gradePoint) { this.gradePoint = gradePoint; }
    }

    public static class SemesterAttendanceTrendDTO {
        private Integer semester;
        private Double percentage;

        public SemesterAttendanceTrendDTO() {}
        public SemesterAttendanceTrendDTO(Integer semester, Double percentage) {
            this.semester = semester;
            this.percentage = percentage;
        }
        public Integer getSemester() { return semester; }
        public void setSemester(Integer semester) { this.semester = semester; }
        public Double getPercentage() { return percentage; }
        public void setPercentage(Double percentage) { this.percentage = percentage; }
    }

    public static class SemesterPercentageTrendDTO {
        private Integer semester;
        private Double percentage;

        public SemesterPercentageTrendDTO() {}
        public SemesterPercentageTrendDTO(Integer semester, Double percentage) {
            this.semester = semester;
            this.percentage = percentage;
        }
        public Integer getSemester() { return semester; }
        public void setSemester(Integer semester) { this.semester = semester; }
        public Double getPercentage() { return percentage; }
        public void setPercentage(Double percentage) { this.percentage = percentage; }
    }

    public Double getOverallCgpa() { return overallCgpa; }
    public void setOverallCgpa(Double overallCgpa) { this.overallCgpa = overallCgpa; }

    public Double getTotalCreditsEarned() { return totalCreditsEarned; }
    public void setTotalCreditsEarned(Double totalCreditsEarned) { this.totalCreditsEarned = totalCreditsEarned; }

    public List<SemesterSgpaDTO> getSgpaTrends() { return sgpaTrends; }
    public void setSgpaTrends(List<SemesterSgpaDTO> sgpaTrends) { this.sgpaTrends = sgpaTrends; }

    public List<SubjectScoreDTO> getCurrentSemesterSubjects() { return currentSemesterSubjects; }
    public void setCurrentSemesterSubjects(List<SubjectScoreDTO> currentSemesterSubjects) { this.currentSemesterSubjects = currentSemesterSubjects; }

    public List<SemesterAttendanceTrendDTO> getAttendanceTrends() { return attendanceTrends; }
    public void setAttendanceTrends(List<SemesterAttendanceTrendDTO> attendanceTrends) { this.attendanceTrends = attendanceTrends; }

    public List<SemesterPercentageTrendDTO> getPercentageTrends() { return percentageTrends; }
    public void setPercentageTrends(List<SemesterPercentageTrendDTO> percentageTrends) { this.percentageTrends = percentageTrends; }
}
