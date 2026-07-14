package com.college.erp.attendance.dto.response;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class LoginResponse {
    private String token;
    private String userType;
    private Integer userId;
    private Integer referenceId;
    private String name;
    private String email;
    private Integer semesterId;
    private Integer sectionId;
    private Integer departmentId;
}