package com.studentmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "study_materials")
public class StudyMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "subject_code", nullable = false, length = 50)
    private String subjectCode;

    @Column(name = "subject_name", nullable = false, length = 150)
    private String subjectName;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", length = 2000)
    private String description;

    @Column(name = "file_type", length = 20)
    private String fileType = "PDF";

    @Column(name = "file_name", length = 255)
    private String fileName;

    @Column(name = "file_url", length = 500)
    private String fileUrl;

    @Column(name = "file_size", length = 50)
    private String fileSize = "1.5 MB";

    @Column(name = "uploaded_date", nullable = false)
    private LocalDate uploadedDate = LocalDate.now();

    @Column(name = "semester", nullable = false)
    private Integer semester;

    @Column(name = "department", length = 50)
    private String department;

    public StudyMaterial() {}

    public StudyMaterial(Long id, String subjectCode, String subjectName, String title, String description, String fileType, String fileName, String fileUrl, String fileSize, LocalDate uploadedDate, Integer semester, String department) {
        this.id = id;
        this.subjectCode = subjectCode;
        this.subjectName = subjectName;
        this.title = title;
        this.description = description;
        this.fileType = fileType;
        this.fileName = fileName;
        this.fileUrl = fileUrl;
        this.fileSize = fileSize;
        this.uploadedDate = uploadedDate;
        this.semester = semester;
        this.department = department;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public String getFileSize() { return fileSize; }
    public void setFileSize(String fileSize) { this.fileSize = fileSize; }

    public LocalDate getUploadedDate() { return uploadedDate; }
    public void setUploadedDate(LocalDate uploadedDate) { this.uploadedDate = uploadedDate; }

    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
}
