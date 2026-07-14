package com.college.erp.connect.repository;

import com.college.erp.connect.entity.Contest;
import com.college.erp.connect.entity.ContestScope;
import com.college.erp.connect.entity.ContestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ContestRepository extends JpaRepository<Contest, Long> {

    List<Contest> findByStatusIn(List<ContestStatus> statuses);

    List<Contest> findByStatusAndEndTimeBefore(ContestStatus status, LocalDateTime time);

    List<Contest> findByStatusAndRemoveTimeBefore(ContestStatus status, LocalDateTime time);

    @Query("SELECT c FROM Contest c WHERE c.status IN :statuses " +
            "AND c.removeTime > :now " +
            "AND (c.scope = 'COLLEGE' OR " +
            "(c.department IS NOT NULL AND c.department.id = :deptId)) " +
            "ORDER BY c.createdAt DESC")
    List<Contest> findVisibleContests(
            @Param("statuses") List<ContestStatus> statuses,
            @Param("deptId") Long deptId,
            @Param("now") LocalDateTime now
    );

    @Query("SELECT c FROM Contest c WHERE c.status = 'PENDING_APPROVAL' " +
            "AND (c.scope = 'COLLEGE' OR c.department.id = :deptId) " +
            "ORDER BY c.createdAt ASC")
    List<Contest> findPendingApprovals(@Param("deptId") Long deptId);


    @Query("SELECT c FROM Contest c WHERE c.status IN :statuses " +
            "AND c.scope = :scope " +
            "AND c.removeTime > CURRENT_TIMESTAMP " +
            "ORDER BY c.createdAt DESC")
    List<Contest> findByStatusInAndScope(
            @Param("statuses") List<ContestStatus> statuses,
            @Param("scope") ContestScope scope
    );
}