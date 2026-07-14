package com.college.erp.connect.service;

import com.college.erp.connect.entity.*;
import com.college.erp.connect.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PowerUpService {

    private final ActivePowerUpRepository powerUpRepository;
    private final CodeSubmissionRepository submissionRepository;
    private final CoinService coinService;

    public List<ActivePowerUp> getActivePowerUps(User user) {
        return powerUpRepository.findByUserIdAndIsActiveTrueAndExpiresAtAfter(
                user.getId(), LocalDateTime.now());
    }

    public boolean hasActivePowerUp(User user, String powerUpType) {
        return getActivePowerUps(user).stream()
                .anyMatch(p -> p.getPowerUpType().equals(powerUpType));
    }

    @Transactional
    public int applyPowerUpBonus(User user, int baseCoins, String context) {
        List<ActivePowerUp> powerUps = getActivePowerUps(user);
        int finalCoins = baseCoins;

        for (ActivePowerUp powerUp : powerUps) {
            switch (powerUp.getPowerUpType()) {
                case "DOUBLE_XP":
                    finalCoins *= 2;
                    log.info("Double XP applied for user {}: {} -> {}",
                            user.getEmail(), baseCoins, finalCoins);
                    break;

                case "BONUS_COINS":
                    finalCoins += 50;
                    break;

                case "TRIPLE_THREAT":
                    finalCoins *= 3;
                    break;
            }
        }

        return finalCoins;
    }

    @Scheduled(fixedRate = 300000) // Every 5 minutes
    @Transactional
    public void deactivateExpiredPowerUps() {
        List<ActivePowerUp> expired = powerUpRepository
                .findExpiredPowerUps(LocalDateTime.now());

        for (ActivePowerUp powerUp : expired) {
            powerUp.setIsActive(false);
            powerUpRepository.save(powerUp);
            log.info("Deactivated expired power-up for user {}",
                    powerUp.getUser().getEmail());
        }
    }
}