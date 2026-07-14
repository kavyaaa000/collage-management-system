package com.college.erp.connect.repository;

import com.college.erp.connect.entity.ContestApproval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContestApprovalRepository extends JpaRepository<ContestApproval, Long> {

    Optional<ContestApproval> findByContestId(Long contestId);

    List<ContestApproval> findByApprovedByIdOrderByTimestampDesc(Long userId);
}