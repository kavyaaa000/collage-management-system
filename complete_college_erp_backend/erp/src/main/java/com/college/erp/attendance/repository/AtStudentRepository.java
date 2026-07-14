package com.college.erp.attendance.repository;

import com.college.erp.attendance.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AtStudentRepository extends JpaRepository<Student, Integer> {

    List<Student> findByCurrentSemesterIdAndSectionId(Integer semesterId, Integer sectionId);

    List<Student> findByCurrentSemesterId(Integer semesterId);

    @Query("SELECT s FROM Student s WHERE s.currentSemesterId = :semesterId AND s.isActive = true AND s.isDeleted = false")
    List<Student> findActiveStudentsBySemester(Integer semesterId);

    // ADD THIS METHOD
    List<Student> findByClassId(Integer classId);
}