// =====================================================
// DTO Classes
// =====================================================

package com.college.erp.erp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimetableSlotDTO {
    private Integer slotId;
    private String classId;
    private Integer dayNumber;
    private Integer periodNumber;
    private Integer subjectId;
    private Integer staffId;
    private Integer roomId;
    private Boolean isLab;
    private String labBatch;

    // Enriched fields
    private String subjectCode;
    private String subjectName;
    private String staffName;
    private String roomCode;
}

