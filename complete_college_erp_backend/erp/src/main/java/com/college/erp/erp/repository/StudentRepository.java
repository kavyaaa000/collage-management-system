package com.college.erp.erp.repository;

import com.college.erp.erp.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {
    List<Student> findByDeptId(Integer deptId);
    List<Student> findByAdmissionYear(Integer year);
    List<Student> findByStatus(String status);
    boolean existsByRegisterNumber(String registerNumber);
    boolean existsByBatchNumber(String batchNumber);

    @Query("SELECT COUNT(s) FROM Student s WHERE s.deptId = :deptId")
    long countByDeptId(Integer deptId);
}