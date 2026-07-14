package com.college.erp.evaluation.service;

import com.college.erp.evaluation.dto.EvaluationRequestDTO;
import com.college.erp.evaluation.dto.EvaluationResponseDTO;
import com.college.erp.exception.AIEngineException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.util.retry.Retry;

import java.io.File;
import java.time.Duration;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIEngineService {

    @Value("${ai.engine.base-url}")
    private String aiEngineBaseUrl;

    @Value("${ai.engine.timeout}")
    private Integer timeout;

    @Value("${ai.engine.enabled}")
    private Boolean aiEngineEnabled;

    private final WebClient.Builder webClientBuilder;
    private final ObjectMapper objectMapper;

    /**
     * Calls AI Engine with:
     *  - PDF file (multipart)
     *  - JSON payload (multipart)
     */
    public EvaluationResponseDTO evaluateAnswerSheet(
            EvaluationRequestDTO request,
            File pdfFile
    ) {
        if (!aiEngineEnabled) {
            throw new AIEngineException("AI Engine is disabled in configuration");
        }

        if (pdfFile == null || !pdfFile.exists()) {
            throw new AIEngineException("PDF file not found for AI evaluation");
        }

        log.info("Sending evaluation request to AI Engine for sheet_id: {}", request.getSheetId());

        try {
            // ----------------------------------------------------
            // Build multipart request
            // ----------------------------------------------------
            MultipartBodyBuilder bodyBuilder = new MultipartBodyBuilder();

            bodyBuilder.part("file", new FileSystemResource(pdfFile))
                    .contentType(MediaType.APPLICATION_PDF);

            bodyBuilder.part(
                    "payload",
                    objectMapper.writeValueAsString(request)
            ).contentType(MediaType.APPLICATION_JSON);

            WebClient webClient = webClientBuilder
                    .baseUrl(aiEngineBaseUrl)
                    .build();

            EvaluationResponseDTO response = webClient.post()
                    .uri("/api/evaluate")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData(bodyBuilder.build()))
                    .retrieve()
                    .bodyToMono(EvaluationResponseDTO.class)
                    .timeout(Duration.ofSeconds(timeout))
                    .retryWhen(
                            Retry.fixedDelay(2, Duration.ofSeconds(5))
                                    .filter(ex -> ex instanceof WebClientResponseException.ServiceUnavailable)
                    )
                    .block();

            if (response == null || !Boolean.TRUE.equals(response.getSuccess())) {
                throw new AIEngineException("AI Engine returned unsuccessful response");
            }

            log.info("AI Engine evaluation completed successfully for sheet_id: {}", request.getSheetId());
            return response;

        } catch (WebClientResponseException e) {
            log.error("AI Engine request failed with status: {}", e.getStatusCode(), e);
            throw new AIEngineException(
                    "AI Engine request failed: " + e.getResponseBodyAsString()
            );
        } catch (Exception e) {
            log.error("Unexpected error calling AI Engine", e);
            throw new AIEngineException(
                    "Error communicating with AI Engine: " + e.getMessage()
            );
        }
    }

    /**
     * Health check for AI Engine
     */
    public boolean testConnection() {
        try {
            WebClient webClient = webClientBuilder
                    .baseUrl(aiEngineBaseUrl)
                    .build();

            String response = webClient.get()
                    .uri("/health")
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();

            log.info("AI Engine health check response: {}", response);
            return response != null;

        } catch (Exception e) {
            log.error("AI Engine health check failed", e);
            return false;
        }
    }
}
