package com.studentmanagement.repository;

import com.studentmanagement.entity.Club;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClubRepository extends JpaRepository<Club, Long> {
    List<Club> findAllByOrderByNameAsc();
    Optional<Club> findByName(String name);
}
