package com.college.erp.admissions.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfileDTO {
    private Long id;
    private Long userId;
    private String applicationNumber;
    private String email;
    private String fullName;
    private String phone;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;

    private String gender;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String stream;
    private BigDecimal cutoffScore;
    private String verificationStatus;
    private String verificationRemarks;
    private String registrationStatus;
    private Integer studentGroupNumber;
    private Long assignedMentorId;
    private String assignedMentorName;
    private LocalDateTime createdAt;
}