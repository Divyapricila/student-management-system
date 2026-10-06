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
public class StudentPortalService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final StudentMarksRepository marksRepository;
    private final StudentAttendanceRepository attendanceRepository;
    private final CalendarEventRepository calendarRepository;
    private final FeedbackRepository feedbackRepository;

    public StudentPortalService(UserRepository userRepository,
                                StudentRepository studentRepository,
                                StudentMarksRepository marksRepository,
                                StudentAttendanceRepository attendanceRepository,
                                CalendarEventRepository calendarRepository,
                                FeedbackRepository feedbackRepository) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.marksRepository = marksRepository;
        this.attendanceRepository = attendanceRepository;
        this.calendarRepository = calendarRepository;
        this.feedbackRepository = feedbackRepository;
    }

    private Student getStudentByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        if (user.getStudentId() == null) {
            throw new ResourceNotFoundException("No Student profile linked with user account: " + username);
        }

        return studentRepository.findByStudentId(user.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student record not found for ID: " + user.getStudentId()));
    }

    @Transactional(readOnly = true)
    public StudentProfileDTO getProfile(String username) {
        Student student = getStudentByUsername(username);

        return new StudentProfileDTO(
                student.getId(),
                student.getStudentId(),
                student.getName(),
                student.getDepartment(),
                student.getYear(),
                student.getCurrentSemester(),
                student.getEmail(),
                student.getContact(),
                student.getMarks(),
                student.getAcademicStatus(),
                student.getFeeDues(),
                student.getAttendancePercentage()
        );
    }

    @Transactional(readOnly = true)
    public SemesterMarksSummaryDTO getMarks(String username, Integer requestedSemester) {
        Student student = getStudentByUsername(username);
        int semester = (requestedSemester != null && requestedSemester > 0) ? requestedSemester : student.getCurrentSemester();

        List<StudentMarks> marksEntities = marksRepository.findByStudentAndSemesterOrderBySubjectCodeAsc(student, semester);

        List<SubjectMarksDTO> subjectMarksList = marksEntities.stream()
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

        double totalInternal = 0.0;
        double totalExternal = 0.0;
        double totalMarksScored = 0.0;
        int count = subjectMarksList.size();

        for (SubjectMarksDTO sm : subjectMarksList) {
            totalInternal += (sm.getInternalMarks() != null) ? sm.getInternalMarks() : 0.0;
            totalExternal += (sm.getExternalMarks() != null) ? sm.getExternalMarks() : 0.0;
            totalMarksScored += (sm.getTotalMarks() != null) ? sm.getTotalMarks() : 0.0;
        }

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
                BigDecimal.valueOf(totalInternal).setScale(1, RoundingMode.HALF_UP).doubleValue(),
                BigDecimal.valueOf(totalExternal).setScale(1, RoundingMode.HALF_UP).doubleValue(),
                BigDecimal.valueOf(totalMarksScored).setScale(1, RoundingMode.HALF_UP).doubleValue(),
                count * 100,
                subjectMarksList
        );
    }

    @Transactional(readOnly = true)
    public SemesterAttendanceSummaryDTO getAttendance(String username, Integer requestedSemester) {
        Student student = getStudentByUsername(username);
        int semester = (requestedSemester != null && requestedSemester > 0) ? requestedSemester : student.getCurrentSemester();

        List<StudentAttendance> attendanceEntities = attendanceRepository.findByStudentAndSemesterOrderBySubjectCodeAsc(student, semester);

        List<SubjectAttendanceDTO> attendanceList = attendanceEntities.stream()
                .map(a -> new SubjectAttendanceDTO(
                        a.getSubject().getCode(),
                        a.getSubject().getName(),
                        a.getPresentClasses(),
                        a.getTotalClasses(),
                        a.getPercentage()
                ))
                .collect(Collectors.toList());

        int totalPresent = 0;
        int totalClasses = 0;

        for (SubjectAttendanceDTO sa : attendanceList) {
            totalPresent += (sa.getPresentClasses() != null) ? sa.getPresentClasses() : 0;
            totalClasses += (sa.getTotalClasses() != null) ? sa.getTotalClasses() : 0;
        }

        double overallPercentage = totalClasses > 0
                ? ((double) totalPresent / totalClasses * 100.0)
                : (student.getAttendancePercentage() != null ? student.getAttendancePercentage() : 84.82);

        overallPercentage = BigDecimal.valueOf(overallPercentage).setScale(2, RoundingMode.HALF_UP).doubleValue();

        return new SemesterAttendanceSummaryDTO(
                semester,
                overallPercentage,
                totalPresent,
                totalClasses,
                attendanceList
        );
    }

    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getCalendar(String username, Integer requestedSemester) {
        Student student = getStudentByUsername(username);
        int semester = (requestedSemester != null && requestedSemester > 0) ? requestedSemester : student.getCurrentSemester();

        List<CalendarEvent> events = calendarRepository.findBySemesterOrAllSemestersOrderByEventDateAsc(semester);

        return events.stream()
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

    public FeedbackDTO submitFeedback(String username, FeedbackDTO dto) {
        Student student = getStudentByUsername(username);

        Feedback feedback = new Feedback(
                null,
                student,
                student.getStudentId(),
                student.getName(),
                dto.getRating(),
                dto.getMessage().trim()
        );

        Feedback saved = feedbackRepository.save(feedback);

        return new FeedbackDTO(
                saved.getId(),
                saved.getStudentRefId(),
                saved.getStudentName(),
                saved.getRating(),
                saved.getMessage(),
                saved.getCreatedAt()
        );
    }
}
