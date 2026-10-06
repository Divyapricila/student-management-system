package com.studentmanagement.entity;

import jakarta.persistence.*;

/**
 * Entity representing an academic Subject/Course.
 */
@Entity
@Table(name = "subjects")
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code", nullable = false, length = 50)
    private String code; // e.g. "ECS01", "ECS02"

    @Column(name = "name", nullable = false, length = 150)
    private String name; // e.g. "Communication Systems"

    @Column(name = "department", nullable = false, length = 100)
    private String department; // e.g. "ECE", "CSE", "COMMON"

    @Column(name = "semester", nullable = false)
    private Integer semester; // 1 to 8

    @Column(name = "credits", nullable = false)
    private Integer credits = 3;

    public Subject() {
    }

    public Subject(Long id, String code, String name, String department, Integer semester, Integer credits) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.department = department;
        this.semester = semester;
        this.credits = credits;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Integer getSemester() {
        return semester;
    }

    public void setSemester(Integer semester) {
        this.semester = semester;
    }

    public Integer getCredits() {
        return credits;
    }

    public void setCredits(Integer credits) {
        this.credits = credits;
    }
}
