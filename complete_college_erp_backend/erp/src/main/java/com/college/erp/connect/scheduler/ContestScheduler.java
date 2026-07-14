package com.college.erp.connect.scheduler;

import com.college.erp.connect.entity.Contest;
import com.college.erp.connect.entity.ContestStatus;
import com.college.erp.connect.repository.ContestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ContestScheduler {

    private final ContestRepository contestRepository;

    // REPLACE updateContestStatuses with this:

    @Scheduled(fixedRate = 10000) // ✅ Every 10 seconds instead of 60
    @Transactional
    public void updateContestStatuses() {
        LocalDateTime now = LocalDateTime.now();

        try {
            // Expire active contests
            List<Contest> activeContests = contestRepository.findByStatusAndEndTimeBefore(
                    ContestStatus.ACTIVE, now
            );

            for (Contest contest : activeContests) {
                contest.setStatus(ContestStatus.EXPIRED);
                contestRepository.save(contest);
                log.info("Contest {} expired at {}", contest.getId(), now);
            }

            // Remove expired contests
            List<Contest> expiredContests = contestRepository.findByStatusAndRemoveTimeBefore(
                    ContestStatus.EXPIRED, now
            );

            for (Contest contest : expiredContests) {
                contest.setStatus(ContestStatus.REMOVED);
                contestRepository.save(contest);
                log.info("Contest {} removed from visibility at {}", contest.getId(), now);
            }

        } catch (Exception e) {
            log.error("Error updating contest statuses: {}", e.getMessage());
            // Don't throw - let scheduler continue
        }
    }
}