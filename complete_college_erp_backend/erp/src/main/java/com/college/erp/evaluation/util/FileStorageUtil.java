package com.college.erp.evaluation.util;

import com.college.erp.exception.ValidationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Component
@Slf4j
public class FileStorageUtil {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Value("${file.allowed-extensions}")
    private String allowedExtensions;

    public String storeFile(MultipartFile file, Integer examId, Integer studentId, Integer subjectId) {
        // Validate file
        validateFile(file);

        // Create directory structure
        Path uploadPath = Paths.get(uploadDir, "exam_" + examId, "subject_" + subjectId);
        try {
            Files.createDirectories(uploadPath);
        } catch (IOException e) {
            throw new ValidationException("Could not create upload directory");
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String filename = "student_" + studentId + "_" + UUID.randomUUID().toString() + extension;

        // Save file
        Path filePath = uploadPath.resolve(filename);
        try {
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            log.info("File stored successfully: {}", filePath.toString());
            return filePath.toString();
        } catch (IOException e) {
            throw new ValidationException("Failed to store file: " + e.getMessage());
        }
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new ValidationException("File is empty");
        }

        String filename = file.getOriginalFilename();
        if (filename == null || !filename.toLowerCase().endsWith(".pdf")) {
            throw new ValidationException("Only PDF files are allowed");
        }

        // Check file size (50MB max)
        if (file.getSize() > 50 * 1024 * 1024) {
            throw new ValidationException("File size exceeds 50MB limit");
        }
    }
}