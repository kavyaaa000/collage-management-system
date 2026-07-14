package com.college.erp.attendance.repository;

import com.college.erp.attendance.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AtSubjectRepository extends JpaRepository<Subject, Integer> {

    List<Subject> findBySemesterId(Integer semesterId);
}