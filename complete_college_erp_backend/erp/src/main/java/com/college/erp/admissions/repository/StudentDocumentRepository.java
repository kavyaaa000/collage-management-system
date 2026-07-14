package com.college.erp.admissions.repository;

import com.college.erp.admissions.entity.StudentDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentDocumentRepository extends JpaRepository<StudentDocument, Long> {

    List<StudentDocument> findByStudentProfileId(Long studentProfileId);

    Optional<StudentDocument> findByStudentProfileIdAndDocumentType(
            Long studentProfileId,
            StudentDocument.DocumentType documentType
    );

    @Query("SELECT sd FROM StudentDocument sd WHERE sd.storedFilename = :filename")
    Optional<StudentDocument> findByStoredFilename(@Param("filename") String filename);

    void deleteByStudentProfileIdAndDocumentType(
            Long studentProfileId,
            StudentDocument.DocumentType documentType
    );
}
