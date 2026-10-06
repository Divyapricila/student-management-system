package com.studentmanagement.repository;

import com.studentmanagement.entity.CampusEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampusEventRepository extends JpaRepository<CampusEvent, Long> {
    List<CampusEvent> findAllByOrderByEventDateAsc();
}
