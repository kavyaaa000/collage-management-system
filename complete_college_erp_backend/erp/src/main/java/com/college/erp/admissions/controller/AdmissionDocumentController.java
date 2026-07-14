package com.college.erp.admissions.controller;

import com.college.erp.admissions.entity.StudentDocument;
import com.college.erp.admissions.service.AdmiDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ad/documents")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AdmissionDocumentController {

    private final AdmiDocumentService admiDocumentService;

    /**
     * View document inline (for PDF/Image viewing in browser)
     * This endpoint is accessible to authenticated users and for offer response tokens
     */
    @GetMapping("/{documentId}/view")
    public ResponseEntity<Resource> viewDocument(@PathVariable Long documentId) {
        try {
            StudentDocument document = admiDocumentService.getDocument(documentId);
            Resource resource = admiDocumentService.loadDocumentAsResource(documentId);

            // Set Content-Disposition to inline for browser viewing
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(document.getMimeType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + document.getOriginalFilename() + "\"")
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Download document
     */
    @GetMapping("/{documentId}/download")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long documentId) {
        try {
            StudentDocument document = admiDocumentService.getDocument(documentId);
            Resource resource = admiDocumentService.loadDocumentAsResource(documentId);

            // Set Content-Disposition to attachment for download
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(document.getMimeType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + document.getOriginalFilename() + "\"")
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
