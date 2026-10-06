package com.studentmanagement.repository;

import com.studentmanagement.entity.FeePayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeePaymentRepository extends JpaRepository<FeePayment, Long> {
    List<FeePayment> findByStudentIdOrderByPaymentDateDesc(Long studentId);
}
