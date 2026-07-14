package com.college.erp.admissions.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentDashboardDTO {
    private StudentProfileDTO profile;
    private StudentMarksDTO marks;
    private List<StudentPreferenceDTO> preferences;
    private List<StudentDocumentDTO> documents;
    private AdmissionResultDTO admissionResult;
    private String registrationWindowStatus;
}