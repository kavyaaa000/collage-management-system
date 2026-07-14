package com.college.erp.connect.service;

import com.college.erp.connect.dto.ApprovalRequest;
import com.college.erp.connect.dto.ContestRequest;
import com.college.erp.connect.dto.ContestResponse;
import com.college.erp.connect.entity.*;
import com.college.erp.connect.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContestService {

    private final ContestRepository contestRepository;
    private final ContestApprovalRepository approvalRepository;
    private final CoUserRepository coUserRepository;
    private final CoDepartmentRepository coDepartmentRepository;

    @Transactional
    public ContestResponse createContest(ContestRequest request, String userEmail) {
        User creator = coUserRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Department department = null;
        if (request.getScope() == ContestScope.DEPT) {
            String deptCode = request.getDepartmentCode() != null ?
                    request.getDepartmentCode() :
                    creator.getDepartment().getCode();
            department = coDepartmentRepository.findByCode(deptCode)
                    .orElseThrow(() -> new RuntimeException("Department not found"));
        }

        Contest contest = Contest.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .scope(request.getScope())
                .department(department)
                .createdBy(creator)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .removeTime(request.getRemoveTime())
                .mcqCount(request.getMcqCount())
                .codeCount(request.getCodeCount())
                .allowedLanguages(request.getAllowedLanguages() != null ?
                        String.join(",", request.getAllowedLanguages()) : "")
                .build();

        // Auto-approve DEPT scope contests, COLLEGE scope needs approval
        if (contest.getScope() == ContestScope.DEPT) {
            contest.setStatus(ContestStatus.ACTIVE);
        } else {
            contest.setStatus(ContestStatus.PENDING_APPROVAL);
        }

        contest = contestRepository.save(contest);
        return mapToResponse(contest, creator);
    }

    // REPLACE the getVisibleContests method with this:

    public List<ContestResponse> getVisibleContests(String userEmail) {
        User user = coUserRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<ContestStatus> visibleStatuses = Arrays.asList(
                ContestStatus.ACTIVE,
                ContestStatus.EXPIRED
        );

        // FIX: Handle null department properly
        Long deptId = user.getDepartment() != null ?
                user.getDepartment().getId() : -1L;

        List<Contest> contests;

        if (deptId == -1L) {
            // User has no department - show only COLLEGE contests
            contests = contestRepository.findByStatusInAndScope(
                    visibleStatuses, ContestScope.COLLEGE
            );
        } else {
            contests = contestRepository.findVisibleContests(
                    visibleStatuses, deptId, LocalDateTime.now()
            );
        }

        return contests.stream()
                .map(c -> mapToResponse(c, user))
                .collect(Collectors.toList());
    }

    public List<ContestResponse> getPendingApprovals(String userEmail) {
        User user = coUserRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isHodOrAdmin = user.getRoles().stream()
                .anyMatch(r -> r.getName() == RoleName.HOD || r.getName() == RoleName.ADMIN);

        if (!isHodOrAdmin) {
            throw new RuntimeException("Access denied");
        }

        Long deptId = user.getDepartment() != null ? user.getDepartment().getId() : 0L;
        List<Contest> pending = contestRepository.findPendingApprovals(deptId);

        return pending.stream()
                .map(c -> mapToResponse(c, user))
                .collect(Collectors.toList());
    }

    public ContestResponse getContestById(Long id, String userEmail) {
        User user = coUserRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Contest contest = contestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contest not found"));

        return mapToResponse(contest, user);
    }

    @Transactional
    public ContestResponse approveContest(Long contestId, ApprovalRequest request, String userEmail) {
        User approver = coUserRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean canApprove = approver.getRoles().stream()
                .anyMatch(r -> r.getName() == RoleName.HOD || r.getName() == RoleName.ADMIN);

        if (!canApprove) {
            throw new RuntimeException("Access denied");
        }

        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new RuntimeException("Contest not found"));

        if (contest.getStatus() != ContestStatus.PENDING_APPROVAL) {
            throw new RuntimeException("Contest is not pending approval");
        }

        ContestApproval approval = ContestApproval.builder()
                .contest(contest)
                .approvedBy(approver)
                .approved(request.getApproved())
                .reason(request.getReason())
                .build();

        approvalRepository.save(approval);

        if (request.getApproved()) {
            contest.setStatus(ContestStatus.ACTIVE);
        } else {
            contest.setStatus(ContestStatus.DRAFT);
        }

        contest = contestRepository.save(contest);
        return mapToResponse(contest, approver);
    }

    private ContestResponse mapToResponse(Contest contest, User currentUser) {
        ContestApproval approval = approvalRepository.findByContestId(contest.getId()).orElse(null);

        boolean canEdit = contest.getCreatedBy().getId().equals(currentUser.getId());
        boolean canApprove = currentUser.getRoles().stream()
                .anyMatch(r -> r.getName() == RoleName.HOD || r.getName() == RoleName.ADMIN);

        List<String> languages = contest.getAllowedLanguages() != null && !contest.getAllowedLanguages().isEmpty() ?
                Arrays.asList(contest.getAllowedLanguages().split(",")) : List.of();

        return ContestResponse.builder()
                .id(contest.getId())
                .title(contest.getTitle())
                .description(contest.getDescription())
                .scope(contest.getScope())
                .departmentCode(contest.getDepartment() != null ? contest.getDepartment().getCode() : null)
                .departmentName(contest.getDepartment() != null ? contest.getDepartment().getName() : null)
                .createdById(contest.getCreatedBy().getId())
                .createdByName(contest.getCreatedBy().getName())
                .status(contest.getStatus())
                .startTime(contest.getStartTime())
                .endTime(contest.getEndTime())
                .removeTime(contest.getRemoveTime())
                .createdAt(contest.getCreatedAt())
                .updatedAt(contest.getUpdatedAt())
                .mcqCount(contest.getMcqCount())
                .codeCount(contest.getCodeCount())
                .allowedLanguages(languages)
                .canEdit(canEdit)
                .canApprove(canApprove)
                .isApproved(approval != null ? approval.getApproved() : null)
                .approvalReason(approval != null ? approval.getReason() : null)
                .build();
    }
}