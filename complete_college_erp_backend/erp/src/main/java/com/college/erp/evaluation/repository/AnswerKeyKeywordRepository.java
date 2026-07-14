package com.college.erp.evaluation.repository;

import com.college.erp.evaluation.entity.AnswerKeyKeyword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerKeyKeywordRepository extends JpaRepository<AnswerKeyKeyword, Integer> {

    List<AnswerKeyKeyword> findByAnswerKey_KeyId(Integer keyId);

    @Query("SELECT akk FROM AnswerKeyKeyword akk WHERE akk.answerKey.keyId = :keyId " +
            "ORDER BY akk.keywordType, akk.weight DESC")
    List<AnswerKeyKeyword> findByAnswerKeyIdOrderedByTypeAndWeight(@Param("keyId") Integer keyId);

    void deleteByAnswerKey_KeyId(Integer keyId);
}