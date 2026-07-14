package com.college.erp.admissions.repository;

import com.college.erp.admissions.entity.StudentMarks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentMarksRepository extends JpaRepository<StudentMarks, Long> {

    Optional<StudentMarks> findByStudentProfileId(Long studentProfileId);

    void deleteByStudentProfileId(Long studentProfileId);
}
