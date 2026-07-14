package com.college.erp.admissions.repository;

import com.college.erp.admissions.entity.OfferResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfferResponseRepository extends JpaRepository<OfferResponse, Long> {

    List<OfferResponse> findByAdmissionResultId(Long admissionResultId);
}