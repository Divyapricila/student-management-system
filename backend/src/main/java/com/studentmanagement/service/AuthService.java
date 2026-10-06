package com.studentmanagement.service;

import com.studentmanagement.dto.AuthRequest;
import com.studentmanagement.dto.AuthResponse;
import com.studentmanagement.dto.ChangePasswordRequest;
import com.studentmanagement.entity.Student;
import com.studentmanagement.entity.User;
import com.studentmanagement.exception.ResourceNotFoundException;
import com.studentmanagement.repository.StudentRepository;
import com.studentmanagement.repository.UserRepository;
import com.studentmanagement.security.JwtTokenProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       StudentRepository studentRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse login(AuthRequest request) {
        String usernameOrId = request.getUsername().trim();

        // Check if user exists by username or studentId
        User user = userRepository.findByUsername(usernameOrId)
                .or(() -> userRepository.findByStudentId(usernameOrId))
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid username or password.");
        }

        if (!user.isActive()) {
            throw new BadCredentialsException("Account is currently disabled. Please contact system administrator.");
        }

        // Determine student details if role is student
        String studentName = "System Administrator";
        String department = "Administration";
        Integer currentSemester = 1;

        if ("ROLE_STUDENT".equalsIgnoreCase(user.getRole()) && user.getStudentId() != null) {
            Student student = studentRepository.findByStudentId(user.getStudentId()).orElse(null);
            if (student != null) {
                studentName = student.getName();
                department = student.getDepartment();
                currentSemester = student.getCurrentSemester();
            }
        }

        String token = tokenProvider.generateToken(user.getUsername(), user.getRole(), user.getStudentId(), studentName);

        return new AuthResponse(
                token,
                user.getUsername(),
                user.getRole(),
                user.getStudentId(),
                studentName,
                department,
                currentSemester
        );
    }

    public void changePassword(String username, ChangePasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new IllegalArgumentException("New password and confirmation password do not match.");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User account not found: " + username));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadCredentialsException("Current password entered is incorrect.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        String studentName = "System Administrator";
        String department = "Administration";
        Integer currentSemester = 1;

        if ("ROLE_STUDENT".equalsIgnoreCase(user.getRole()) && user.getStudentId() != null) {
            Student student = studentRepository.findByStudentId(user.getStudentId()).orElse(null);
            if (student != null) {
                studentName = student.getName();
                department = student.getDepartment();
                currentSemester = student.getCurrentSemester();
            }
        }

        return new AuthResponse(
                null,
                user.getUsername(),
                user.getRole(),
                user.getStudentId(),
                studentName,
                department,
                currentSemester
        );
    }
}
