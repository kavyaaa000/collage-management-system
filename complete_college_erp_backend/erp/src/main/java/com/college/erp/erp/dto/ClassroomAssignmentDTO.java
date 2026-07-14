package com.college.erp.erp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassroomAssignmentDTO {
    private Integer assignmentId;
    private Integer sessionId;
    private Integer semesterId;
    private Integer sectionId;
    private Integer roomId;
    private Integer deptId;
    private Integer assignedBy;
    private String assignmentType;
    private Boolean isActive;

    // Enriched fields
    private String roomCode;
    private String roomName;
    private Integer capacity;
}
