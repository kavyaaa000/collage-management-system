package com.college.erp.connect.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class Judge0Service {

    @Value("${judge0.api.url:https://judge0-ce.p.rapidapi.com}")
    private String judge0BaseUrl;

    @Value("${judge0.api.key:}")
    private String judge0ApiKey;

    @Value("${judge0.api.host:judge0-ce.p.rapidapi.com}")
    private String judge0ApiHost;

    private final RestTemplate restTemplate = new RestTemplate();

    private static final Map<String, Integer> LANGUAGE_MAP = Map.of(
            "C", 50,
            "C++", 54,
            "Java", 62,
            "Python", 71,
            "JavaScript", 63,
            "Go", 60,
            "Rust", 73
    );

    public String submitCode(String sourceCode, String language, String stdin) {
        // CRITICAL: Log what we receive
        log.info("🔍 submitCode called with:");
        log.info("  sourceCode: {}", sourceCode == null ? "NULL" : sourceCode.length() + " chars");
        log.info("  language: {}", language);
        log.info("  stdin: {}", stdin == null ? "NULL" : stdin.length() + " chars");

        // Validate inputs
        if (sourceCode == null || sourceCode.trim().isEmpty()) {
            log.error("❌ Source code is null or empty!");
            throw new RuntimeException("Source code cannot be empty");
        }

        Integer languageId = LANGUAGE_MAP.get(language);
        if (languageId == null) {
            log.error("❌ Unsupported language: {}", language);
            throw new RuntimeException("Unsupported language: " + language);
        }

        try {
            // Encode with UTF-8
            String encodedSourceCode = Base64.getEncoder()
                    .encodeToString(sourceCode.getBytes(StandardCharsets.UTF_8));

            String encodedStdin = Base64.getEncoder()
                    .encodeToString((stdin != null ? stdin : "").getBytes(StandardCharsets.UTF_8));

            log.info("✅ After encoding:");
            log.info("  encodedSourceCode: {}", encodedSourceCode.substring(0, Math.min(50, encodedSourceCode.length())) + "...");
            log.info("  languageId: {}", languageId);

            // Create request body
            Map<String, Object> body = new HashMap<>();
            body.put("source_code", encodedSourceCode);
            body.put("language_id", languageId);
            body.put("stdin", encodedStdin);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-RapidAPI-Key", judge0ApiKey);
            headers.set("X-RapidAPI-Host", judge0ApiHost);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            String url = judge0BaseUrl + "/submissions?base64_encoded=true&wait=false";
            log.info("📤 POST to: {}", url);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            if (response.getBody() == null || !response.getBody().containsKey("token")) {
                log.error("❌ Invalid response: {}", response.getBody());
                throw new RuntimeException("Invalid response from Judge0");
            }

            String token = response.getBody().get("token").toString();
            log.info("✅ Got token: {}", token);
            return token;

        } catch (Exception e) {
            log.error("❌ Judge0 error: {}", e.getMessage());
            throw new RuntimeException("Judge0 error: " + e.getMessage());
        }
    }

    public Map<String, Object> getSubmissionResult(String token) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-RapidAPI-Key", judge0ApiKey);
            headers.set("X-RapidAPI-Host", judge0ApiHost);

            HttpEntity<?> entity = new HttpEntity<>(headers);
            String url = judge0BaseUrl + "/submissions/" + token + "?base64_encoded=true";

            int maxRetries = 30;
            int retryCount = 0;

            while (retryCount < maxRetries) {
                ResponseEntity<Map> result = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
                Map<String, Object> response = result.getBody();

                if (response == null) {
                    throw new RuntimeException("Empty response from Judge0");
                }

                Map status = (Map) response.get("status");
                Integer statusId = (Integer) status.get("id");

                // 1=Queue, 2=Processing, 3+=Done
                if (statusId <= 2) {
                    retryCount++;
                    Thread.sleep(400);
                } else {
                    log.info("✅ Execution done: {}", status.get("description"));
                    return response;
                }
            }

            throw new RuntimeException("Timeout");

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Interrupted");
        } catch (Exception e) {
            log.error("❌ Get result error: {}", e.getMessage());
            throw new RuntimeException("Failed to get result: " + e.getMessage());
        }
    }

    public Integer getLanguageId(String language) {
        return LANGUAGE_MAP.getOrDefault(language, 71);
    }
}