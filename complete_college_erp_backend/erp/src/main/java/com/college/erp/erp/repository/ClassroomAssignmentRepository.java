package com.college.erp.erp.repository;

import com.college.erp.erp.entity.ClassroomAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClassroomAssignmentRepository extends JpaRepository<ClassroomAssignment, Integer> {

    List<ClassroomAssignment> findBySessionIdAndDeptIdAndIsActiveTrue(
            Integer sessionId, Integer deptId);

    Optional<ClassroomAssignment> findBySessionIdAndSemesterIdAndSectionIdAndIsActiveTrue(
            Integer sessionId, Integer semesterId, Integer sectionId);

    List<ClassroomAssignment> findByRoomIdAndIsActiveTrue(Integer roomId);
}
