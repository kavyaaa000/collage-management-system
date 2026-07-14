package com.college.erp.erp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvailableRoomDTO {
    private Integer roomId;
    private String roomCode;
    private String roomType;
    private Integer capacity;
    private String blockName;
    private Boolean isAvailable;
}
