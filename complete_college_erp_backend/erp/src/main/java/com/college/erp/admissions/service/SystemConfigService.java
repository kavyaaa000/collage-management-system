package com.college.erp.admissions.service;

import com.college.erp.admissions.dto.*;
import com.college.erp.admissions.entity.SystemConfig;
import com.college.erp.admissions.repository.SystemConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SystemConfigService {

    private final SystemConfigRepository configRepository;

    public String getRegistrationWindowStatus() {
        return configRepository.findByConfigKey("REGISTRATION_WINDOW_STATUS")
                .map(SystemConfig::getConfigValue)
                .orElse("CLOSED");
    }

    @Transactional
    public ApiResponse<String> toggleRegistrationWindow() {
        try {
            SystemConfig config = configRepository.findByConfigKey("REGISTRATION_WINDOW_STATUS")
                    .orElseThrow(() -> new RuntimeException("Config not found"));

            String newStatus = config.getConfigValue().equals("OPEN") ? "CLOSED" : "OPEN";
            config.setConfigValue(newStatus);
            configRepository.save(config);

            return ApiResponse.success("Registration window " + newStatus, newStatus);
        } catch (Exception e) {
            return ApiResponse.error("Failed to toggle registration window: " + e.getMessage());
        }
    }

    @Transactional
    public ApiResponse<String> updateConfig(String key, String value) {
        try {
            SystemConfig config = configRepository.findByConfigKey(key)
                    .orElse(SystemConfig.builder().configKey(key).build());

            config.setConfigValue(value);
            configRepository.save(config);

            return ApiResponse.success("Configuration updated", value);
        } catch (Exception e) {
            return ApiResponse.error("Failed to update configuration: " + e.getMessage());
        }
    }
}