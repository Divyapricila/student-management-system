package com.studentmanagement.repository;

import com.studentmanagement.entity.ClubMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClubMemberRepository extends JpaRepository<ClubMember, Long> {
    List<ClubMember> findByStudentId(Long studentId);
    Optional<ClubMember> findByClubIdAndStudentId(Long clubId, Long studentId);
    List<ClubMember> findByClubId(Long clubId);
    boolean existsByClubIdAndStudentId(Long clubId, Long studentId);
    long countByClubId(Long clubId);
}
