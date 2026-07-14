package com.college.erp.connect.dto;

import com.college.erp.connect.entity.ContestScope;
import com.college.erp.connect.entity.ContestStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContestResponse {

    private Long id;
    private String title;
    private String description;
    private ContestScope scope;
    private String departmentCode;
    private String departmentName;
    private Long createdById;
    private String createdByName;
    private ContestStatus status;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime removeTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer mcqCount;
    private Integer codeCount;
    private List<String> allowedLanguages;
    private Boolean canEdit;
    private Boolean canApprove;
    private Boolean isApproved;
    private String approvalReason;
}