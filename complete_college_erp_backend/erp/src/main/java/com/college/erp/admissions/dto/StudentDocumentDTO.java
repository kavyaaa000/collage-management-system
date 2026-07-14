package com.college.erp.admissions.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentDocumentDTO {
    private Long id;
    private Long studentProfileId;
    private String documentType;
    private String originalFilename;
    private String storedFilename;
    private Long fileSize;
    private String mimeType;
    private LocalDateTime uploadedAt;
    private String viewUrl;
}