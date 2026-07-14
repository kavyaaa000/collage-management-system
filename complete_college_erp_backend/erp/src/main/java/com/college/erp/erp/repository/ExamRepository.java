package com.college.erp.erp.repository;

import com.college.erp.erp.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Integer> {

    List<Exam> findBySemesterId(Integer semesterId);

    List<Exam> findBySemesterIdAndSessionId(Integer semesterId, Integer sessionId);

    @Query("SELECT DISTINCT e.sessionId FROM Exam e WHERE e.semesterId = :semesterId ORDER BY e.sessionId")
    List<Integer> findDistinctSessionsBySemester(Integer semesterId);
}