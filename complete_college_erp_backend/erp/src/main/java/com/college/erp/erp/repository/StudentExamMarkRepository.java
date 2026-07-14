//package com.college.erp.repository;
//
//import com.college.erp.entity.StudentExamMark;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//import org.springframework.stereotype.Repository;
//import java.util.List;
//import java.util.Optional;
//
//@Repository
//public interface StudentExamMarkRepository extends JpaRepository<StudentExamMark, Integer> {
//
//    // Using plain fields
//    List<StudentExamMark> findByStudentId(Integer studentId);
//
//    List<StudentExamMark> findByExamId(Integer examId);
//
//    Optional<StudentExamMark> findByStudentIdAndExamId(Integer studentId, Integer examId);
//
//    // Custom query to eagerly load exam data
//    @Query("SELECT sem FROM StudentExamMark sem JOIN FETCH sem.exam e WHERE sem.studentId = :studentId")
//    List<StudentExamMark> findByStudentIdWithExam(@Param("studentId") Integer studentId);
//
//    @Query("SELECT sem FROM StudentExamMark sem WHERE sem.studentId = :studentId AND sem.examId IN :examIds")
//    List<StudentExamMark> findByStudentIdAndExamIdIn(@Param("studentId") Integer studentId, @Param("examIds") List<Integer> examIds);
//}


package com.college.erp.erp.repository;

import com.college.erp.erp.entity.StudentExamMark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentExamMarkRepository extends JpaRepository<StudentExamMark, Integer> {

    // Basic finders
    List<StudentExamMark> findByStudentId(Integer studentId);

    List<StudentExamMark> findByExamId(Integer examId);

    Optional<StudentExamMark> findByStudentIdAndExamId(Integer studentId, Integer examId);

    // CRITICAL: Eagerly load ALL relationships for "View All Semesters"
    @Query("SELECT DISTINCT sem FROM StudentExamMark sem " +
            "JOIN FETCH sem.exam e " +
            "LEFT JOIN FETCH e.subject s " +
            "LEFT JOIN FETCH e.examType et " +
            "WHERE sem.studentId = :studentId " +
            "ORDER BY e.semesterId, e.sessionId, e.examTypeId")
    List<StudentExamMark> findByStudentIdWithFullDetails(@Param("studentId") Integer studentId);

    @Query("SELECT sem FROM StudentExamMark sem WHERE sem.studentId = :studentId AND sem.examId IN :examIds")
    List<StudentExamMark> findByStudentIdAndExamIdIn(@Param("studentId") Integer studentId, @Param("examIds") List<Integer> examIds);
}