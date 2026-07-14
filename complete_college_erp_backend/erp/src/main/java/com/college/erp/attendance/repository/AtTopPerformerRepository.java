package com.college.erp.attendance.repository;

import com.college.erp.attendance.entity.TopPerformer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AtTopPerformerRepository extends JpaRepository<TopPerformer, Long> {

    List<TopPerformer> findByClassIdAndSemesterIdAndAcademicSessionIdAndIsVisibleToStudentsTrueOrderByRankPositionAsc(
            Integer classId, Integer semesterId, Integer academicSessionId);

    List<TopPerformer> findByClassIdAndCategoryAndIsVisibleToStudentsTrueOrderByRankPositionAsc(
            Integer classId, TopPerformer.Category category);

    List<TopPerformer> findByStudentIdAndIsVisibleToStudentsTrue(Integer studentId);
}