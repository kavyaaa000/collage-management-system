
package com.college.erp.admissions.service;

import com.college.erp.admissions.dto.*;
import com.college.erp.admissions.entity.*;
import com.college.erp.admissions.repository.*;
import com.college.erp.security.UnifiedSecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdmiDocumentService {

    @Value("${file.upload.dir:./uploads/documents}")
    private String uploadDir;

    private final StudentDocumentRepository documentRepository;
    private final StudentProfileRepository profileRepository;
    private final UnifiedSecurityUtil securityUtil;

    @Transactional
    public ApiResponse<StudentDocumentDTO> uploadDocument(
            MultipartFile file,
            String documentType
    ) {
        try {
            Long userId = securityUtil.getCurrentUserId();
            StudentProfile profile = profileRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Profile not found"));

            if (profile.getVerificationStatus() == StudentProfile.VerificationStatus.VERIFIED) {
                return ApiResponse.error("Cannot upload documents after verification");
            }

            // Validate file
            if (file.isEmpty()) {
                return ApiResponse.error("File is empty");
            }

            // Validate file type
            String contentType = file.getContentType();
            if (!isValidFileType(contentType)) {
                return ApiResponse.error("Invalid file type. Only PDF and images allowed");
            }

            // Delete existing document of same type
            documentRepository.findByStudentProfileIdAndDocumentType(
                    profile.getId(),
                    StudentDocument.DocumentType.valueOf(documentType)
            ).ifPresent(documentRepository::delete);

            // Create upload directory if not exists
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String storedFilename = UUID.randomUUID().toString() + extension;

            // Save file
            Path filePath = uploadPath.resolve(storedFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Create document record
            StudentDocument document = StudentDocument.builder()
                    .studentProfile(profile)
                    .documentType(StudentDocument.DocumentType.valueOf(documentType))
                    .originalFilename(originalFilename)
                    .storedFilename(storedFilename)
                    .filePath(filePath.toString())
                    .fileSize(file.getSize())
                    .mimeType(contentType)
                    .build();

            document = documentRepository.save(document);

            // Reset verification status
            profile.setVerificationStatus(StudentProfile.VerificationStatus.PENDING);
            profileRepository.save(profile);

            return ApiResponse.success("Document uploaded successfully", toDTO(document));

        } catch (Exception e) {
            return ApiResponse.error("Failed to upload document: " + e.getMessage());
        }
    }

    public ApiResponse<List<StudentDocumentDTO>> getMyDocuments() {
        try {
            Long userId = securityUtil.getCurrentUserId();
            StudentProfile profile = profileRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Profile not found"));

            List<StudentDocumentDTO> documents = documentRepository
                    .findByStudentProfileId(profile.getId())
                    .stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList());

            return ApiResponse.success("Documents retrieved", documents);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    public Resource loadDocumentAsResource(Long documentId) {
        try {
            StudentDocument document = documentRepository.findById(documentId)
                    .orElseThrow(() -> new RuntimeException("Document not found"));

            Path filePath = Paths.get(document.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("File not found or not readable");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error loading document: " + e.getMessage());
        }
    }

    public StudentDocument getDocument(Long documentId) {
        return documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
    }

    private boolean isValidFileType(String contentType) {
        return contentType != null && (
                contentType.equals("application/pdf") ||
                        contentType.startsWith("image/")
        );
    }

    private StudentDocumentDTO toDTO(StudentDocument doc) {
        return StudentDocumentDTO.builder()
                .id(doc.getId())
                .studentProfileId(doc.getStudentProfile().getId())
                .documentType(doc.getDocumentType().name())
                .originalFilename(doc.getOriginalFilename())
                .storedFilename(doc.getStoredFilename())
                .fileSize(doc.getFileSize())
                .mimeType(doc.getMimeType())
                .uploadedAt(doc.getUploadedAt())
                .viewUrl("/api/documents/" + doc.getId() + "/view")
                .build();
    }
}
