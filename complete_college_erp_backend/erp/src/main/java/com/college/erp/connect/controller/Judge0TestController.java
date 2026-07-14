package com.college.erp.connect.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/connect/test")
@RequiredArgsConstructor
@Slf4j
public class Judge0TestController {

    @Value("${judge0.api.url:https://judge0-ce.p.rapidapi.com}")
    private String judge0BaseUrl;

    @Value("${judge0.api.key:}")
    private String judge0ApiKey;

    @Value("${judge0.api.host:judge0-ce.p.rapidapi.com}")
    private String judge0ApiHost;

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/direct-judge0")
    public ResponseEntity<?> testDirectJudge0() {
        Map<String, Object> result = new HashMap<>();

        try {
            log.info("=== DIRECT JUDGE0 TEST ===");
            log.info("Base URL: {}", judge0BaseUrl);
            log.info("API Key (first 10 chars): {}",
                    judge0ApiKey != null && judge0ApiKey.length() > 10 ?
                            judge0ApiKey.substring(0, 10) + "..." : "[EMPTY]");
            log.info("API Host: {}", judge0ApiHost);

            // Simple Python code: print("test")
            String sourceCode = "print(\"test\")";
            int languageId = 71; // Python

            // Encode
            String encodedSource = Base64.getEncoder()
                    .encodeToString(sourceCode.getBytes(StandardCharsets.UTF_8));
            String encodedStdin = Base64.getEncoder()
                    .encodeToString("".getBytes(StandardCharsets.UTF_8));

            log.info("Original source code: {}", sourceCode);
            log.info("Encoded source code: {}", encodedSource);
            log.info("Language ID: {}", languageId);

            // Build request body
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("source_code", encodedSource);
            requestBody.put("language_id", languageId);
            requestBody.put("stdin", encodedStdin);

            log.info("Request body: {}", requestBody);

            // Build headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-RapidAPI-Key", judge0ApiKey);
            headers.set("X-RapidAPI-Host", judge0ApiHost);

            log.info("Headers: Content-Type=application/json, X-RapidAPI-Key={}, X-RapidAPI-Host={}",
                    maskKey(judge0ApiKey), judge0ApiHost);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            String url = judge0BaseUrl + "/submissions?base64_encoded=true&wait=true";
            log.info("Calling URL: {}", url);

            // Make request
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            log.info("Response status: {}", response.getStatusCode());
            log.info("Response body: {}", response.getBody());

            result.put("success", true);
            result.put("request", requestBody);
            result.put("response", response.getBody());
            result.put("config", Map.of(
                    "baseUrl", judge0BaseUrl,
                    "apiHost", judge0ApiHost,
                    "apiKeySet", judge0ApiKey != null && !judge0ApiKey.isEmpty()
            ));

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            log.error("❌ Test failed: {}", e.getMessage(), e);
            result.put("success", false);
            result.put("error", e.getMessage());
            result.put("errorType", e.getClass().getSimpleName());

            if (e.getMessage() != null && e.getMessage().contains("422")) {
                result.put("diagnosis", "Judge0 received invalid data. Check if API key is valid or if request format changed.");
            }

            return ResponseEntity.status(500).body(result);
        }
    }

    @PostMapping("/custom-judge0")
    public ResponseEntity<?> testCustomCode(@RequestBody Map<String, String> request) {
        Map<String, Object> result = new HashMap<>();

        try {
            String code = request.getOrDefault("code", "print('hello')");
            String lang = request.getOrDefault("language", "Python");

            Integer langId = getLanguageId(lang);

            log.info("Testing with code: {}", code);
            log.info("Language: {} (ID: {})", lang, langId);

            String encodedSource = Base64.getEncoder()
                    .encodeToString(code.getBytes(StandardCharsets.UTF_8));
            String encodedStdin = Base64.getEncoder()
                    .encodeToString("".getBytes(StandardCharsets.UTF_8));

            Map<String, Object> body = new HashMap<>();
            body.put("source_code", encodedSource);
            body.put("language_id", langId);
            body.put("stdin", encodedStdin);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-RapidAPI-Key", judge0ApiKey);
            headers.set("X-RapidAPI-Host", judge0ApiHost);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            String url = judge0BaseUrl + "/submissions?base64_encoded=true&wait=true";
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            result.put("success", true);
            result.put("response", response.getBody());

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            log.error("Custom test failed: {}", e.getMessage(), e);
            result.put("success", false);
            result.put("error", e.getMessage());
            return ResponseEntity.status(500).body(result);
        }
    }

    private Integer getLanguageId(String language) {
        Map<String, Integer> map = Map.of(
                "C", 50,
                "C++", 54,
                "Java", 62,
                "Python", 71,
                "JavaScript", 63,
                "Go", 60,
                "Rust", 73
        );
        return map.getOrDefault(language, 71);
    }

    private String maskKey(String key) {
        if (key == null || key.isEmpty()) return "[EMPTY]";
        if (key.length() <= 8) return "****";
        return key.substring(0, 4) + "****" + key.substring(key.length() - 4);
    }
}