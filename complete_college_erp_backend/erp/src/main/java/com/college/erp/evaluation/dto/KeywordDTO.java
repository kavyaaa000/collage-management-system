package com.college.erp.evaluation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KeywordDTO {

    @JsonProperty("keyword_id")
    private Integer keywordId;

    @NotBlank(message = "Keyword cannot be blank")
    @Size(max = 255, message = "Keyword cannot exceed 255 characters")
    @JsonProperty("keyword")
    private String keyword;

    @NotNull(message = "Keyword type is required")
    @Pattern(regexp = "CORE|SUPPORTING", message = "Keyword type must be CORE or SUPPORTING")
    @JsonProperty("keyword_type")
    private String keywordType;

    @NotNull(message = "Weight is required")
    @DecimalMin(value = "0.01", message = "Weight must be at least 0.01")
    @DecimalMax(value = "10.00", message = "Weight cannot exceed 10.00")
    @JsonProperty("weight")
    private BigDecimal weight;

    @JsonProperty("synonyms")
    private String synonyms;

    @NotNull(message = "Is mandatory field is required")
    @JsonProperty("is_mandatory")
    private Boolean isMandatory;
}