package com.studentmanagement.service;

import com.studentmanagement.dto.*;
import com.studentmanagement.entity.*;
import com.studentmanagement.exception.ResourceNotFoundException;
import com.studentmanagement.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AcademicManagementService {

    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final StudentMarksRepository marksRepository;
    private final StudentAttendanceRepository attendanceRepository;
    private final CalendarEventRepository calendarRepository;
    private final FeedbackRepository feedbackRepository;

    public AcademicManagementService(StudentRepository studentRepository,
                                     SubjectRepository subjectRepository,
                                     StudentMarksRepository marksRepository,
                                     StudentAttendanceRepository attendanceRepository,
                                     CalendarEventRepository calendarRepository,
                                     FeedbackRepository feedbackRepository) {
        this.studentRepository = studentRepository;
        this.subjectRepository = subjectRepository;
        this.marksRepository = marksRepository;
        this.attendanceRepository = attendanceRepository;
        this.calendarRepository = calendarRepository;
        this.feedbackRepository = feedbackRepository;
    }

    public List<Integer> getAllSemesters() {
        return List.of(1, 2, 3, 4, 5, 6, 7, 8);
    }

    @Transactional(readOnly = true)
    public List<Subject> getSubjects(Integer semester, String department) {
        if (department != null && !department.isBlank() && !"ALL".equalsIgnoreCase(department)) {
            return subjectRepository.findByDepartmentAndSemesterOrderByCodeAsc(department, semester);
        }
        return subjectRepository.findBySemesterOrderByCodeAsc(semester);
    }

    @Transactional(readOnly = true)
    public SemesterMarksSummaryDTO getMarksForStudent(String studentId, Integer requestedSemester) {
        Student student = studentRepository.findByStudentId(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));

        int semester = (requestedSemester != null && requestedSemester > 0) ? requestedSemester : student.getCurrentSemester();

        List<StudentMarks> marksEntities = marksRepository.findByStudentAndSemesterOrderBySubjectCodeAsc(student, semester);

        List<SubjectMarksDTO> marksList = marksEntities.stream()
                .map(m -> new SubjectMarksDTO(
                        m.getSubject().getCode(),
                        m.getSubject().getName(),
                        m.getInternalMarks(),
                        m.getExternalMarks(),
                        m.getTotalMarks(),
                        m.getGrade(),
                        m.getSubject().getCredits()
                ))
                .collect(Collectors.toList());

        double totalMarksScored = marksList.stream().mapToDouble(m -> m.getTotalMarks() != null ? m.getTotalMarks() : 0.0).sum();
        int count = marksList.size();
        double overallPercentage = count > 0 ? (totalMarksScored / count) : 0.0;
        overallPercentage = BigDecimal.valueOf(overallPercentage).setScale(2, RoundingMode.HALF_UP).doubleValue();

        String overallGrade = "A";
        if (overallPercentage >= 90.0) overallGrade = "O";
        else if (overallPercentage >= 80.0) overallGrade = "A+";
        else if (overallPercentage >= 70.0) overallGrade = "A";
        else if (overallPercentage >= 60.0) overallGrade = "B+";
        else if (overallPercentage >= 50.0) overallGrade = "B";
        else if (overallPercentage >= 40.0) overallGrade = "C";
        else overallGrade = "F";

        return new SemesterMarksSummaryDTO(
                semester,
                overallPercentage,
                overallGrade,
                marksList.stream().mapToDouble(m -> m.getInternalMarks() != null ? m.getInternalMarks() : 0.0).sum(),
                marksList.stream().mapToDouble(m -> m.getExternalMarks() != null ? m.getExternalMarks() : 0.0).sum(),
                totalMarksScored,
                count * 100,
                marksList
        );
    }

    public StudentMarks updateMarks(AcademicUpdateDTO dto) {
        Student student = studentRepository.findByStudentId(dto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + dto.getStudentId()));

        Subject subject = subjectRepository.findByCode(dto.getSubjectCode())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with code: " + dto.getSubjectCode()));

        StudentMarks mark = marksRepository.findByStudentAndSubjectAndSemester(student, subject, dto.getSemester())
                .orElseGet(() -> new StudentMarks(null, student, subject, dto.getSemester(), 0.0, 0.0));

        if (dto.getInternalMarks() != null) {
            mark.setInternalMarks(dto.getInternalMarks());
        }
        if (dto.getExternalMarks() != null) {
            mark.setExternalMarks(dto.getExternalMarks());
        }
        mark.calculateTotalAndGrade();

        StudentMarks saved = marksRepository.save(mark);

        // Recalculate student overall marks average
        List<StudentMarks> allMarks = marksRepository.findByStudent(student);
        if (!allMarks.isEmpty()) {
            double avg = allMarks.stream().mapToDouble(m -> m.getTotalMarks() != null ? m.getTotalMarks() : 0.0).average().orElse(0.0);
            student.setMarks(BigDecimal.valueOf(avg).setScale(1, RoundingMode.HALF_UP).doubleValue());
            studentRepository.save(student);
        }

        return saved;
    }

    @Transactional(readOnly = true)
    public SemesterAttendanceSummaryDTO getAttendanceForStudent(String studentId, Integer requestedSemester) {
        Student student = studentRepository.findByStudentId(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));

        int semester = (requestedSemester != null && requestedSemester > 0) ? requestedSemester : student.getCurrentSemester();

        List<StudentAttendance> attEntities = attendanceRepository.findByStudentAndSemesterOrderBySubjectCodeAsc(student, semester);

        List<SubjectAttendanceDTO> attList = attEntities.stream()
                .map(a -> new SubjectAttendanceDTO(
                        a.getSubject().getCode(),
                        a.getSubject().getName(),
                        a.getPresentClasses(),
                        a.getTotalClasses(),
                        a.getPercentage()
                ))
                .collect(Collectors.toList());

        int totalPresent = attList.stream().mapToInt(a -> a.getPresentClasses() != null ? a.getPresentClasses() : 0).sum();
        int totalClasses = attList.stream().mapToInt(a -> a.getTotalClasses() != null ? a.getTotalClasses() : 0).sum();

        double overall = totalClasses > 0 ? ((double) totalPresent / totalClasses * 100.0) : 84.82;
        overall = BigDecimal.valueOf(overall).setScale(2, RoundingMode.HALF_UP).doubleValue();

        return new SemesterAttendanceSummaryDTO(
                semester,
                overall,
                totalPresent,
                totalClasses,
                attList
        );
    }

    public StudentAttendance updateAttendance(AcademicUpdateDTO dto) {
        Student student = studentRepository.findByStudentId(dto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + dto.getStudentId()));

        Subject subject = subjectRepository.findByCode(dto.getSubjectCode())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with code: " + dto.getSubjectCode()));

        StudentAttendance attendance = attendanceRepository.findByStudentAndSubjectAndSemester(student, subject, dto.getSemester())
                .orElseGet(() -> new StudentAttendance(null, student, subject, dto.getSemester(), 0, 0));

        if (dto.getPresentClasses() != null) {
            attendance.setPresentClasses(dto.getPresentClasses());
        }
        if (dto.getTotalClasses() != null) {
            attendance.setTotalClasses(dto.getTotalClasses());
        }
        attendance.calculatePercentage();

        StudentAttendance saved = attendanceRepository.save(attendance);

        // Recalculate student overall attendance
        List<StudentAttendance> allAtt = attendanceRepository.findByStudent(student);
        int totalPres = allAtt.stream().mapToInt(a -> a.getPresentClasses() != null ? a.getPresentClasses() : 0).sum();
        int totalCls = allAtt.stream().mapToInt(a -> a.getTotalClasses() != null ? a.getTotalClasses() : 0).sum();
        if (totalCls > 0) {
            double overall = ((double) totalPres / totalCls) * 100.0;
            student.setAttendancePercentage(BigDecimal.valueOf(overall).setScale(2, RoundingMode.HALF_UP).doubleValue());
            studentRepository.save(student);
        }

        return saved;
    }

    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getAllCalendarEvents() {
        return calendarRepository.findAllByOrderByEventDateAsc().stream()
                .map(e -> new CalendarEventDTO(
                        e.getId(),
                        e.getTitle(),
                        e.getEventType(),
                        e.getEventDate(),
                        e.getDepartment(),
                        e.getSemester(),
                        e.getDescription()
                ))
                .collect(Collectors.toList());
    }

    public CalendarEventDTO createCalendarEvent(CalendarEventDTO dto) {
        CalendarEvent event = new CalendarEvent(
                null,
                dto.getTitle().trim(),
                dto.getEventType(),
                dto.getEventDate(),
                dto.getDepartment(),
                dto.getSemester(),
                dto.getDescription()
        );
        CalendarEvent saved = calendarRepository.save(event);
        return new CalendarEventDTO(
                saved.getId(),
                saved.getTitle(),
                saved.getEventType(),
                saved.getEventDate(),
                saved.getDepartment(),
                saved.getSemester(),
                saved.getDescription()
        );
    }

    public void deleteCalendarEvent(Long id) {
        calendarRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<FeedbackDTO> getAllFeedbacks() {
        return feedbackRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(f -> new FeedbackDTO(
                        f.getId(),
                        f.getStudentRefId(),
                        f.getStudentName(),
                        f.getRating(),
                        f.getMessage(),
                        f.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }
}
