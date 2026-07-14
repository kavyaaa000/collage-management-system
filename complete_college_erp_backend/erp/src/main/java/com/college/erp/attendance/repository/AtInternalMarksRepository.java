package com.college.erp.attendance.repository;

import com.college.erp.attendance.entity.StudentInternalMarks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface AtInternalMarksRepository extends JpaRepository<StudentInternalMarks, Integer> {

    List<StudentInternalMarks> findByStudentIdAndSessionId(Integer studentId, Integer sessionId);

    List<StudentInternalMarks> findByStudentIdAndSubjectIdAndSessionId(
            Integer studentId, Integer subjectId, Integer sessionId);

    @Query("SELECT AVG(m.marksObtained) FROM StudentInternalMarks m " +
            "WHERE m.studentId = :studentId AND m.sessionId = :sessionId")
    BigDecimal findAverageMarksByStudent(Integer studentId, Integer sessionId);

    @Query("SELECT AVG(m.marksObtained) FROM StudentInternalMarks m " +
            "WHERE m.subjectId = :subjectId AND m.sessionId = :sessionId")
    BigDecimal findAverageMarksBySubject(Integer subjectId, Integer sessionId);
}