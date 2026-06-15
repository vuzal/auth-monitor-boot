package com.vusal.authmonitorboot.service;

import com.vusal.authmonitorboot.repository.LoginAttemptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BruteForceProtectionService {
    private final LoginAttemptRepository loginAttemptRepository;
    private  static final int MAX_ATTEMPTS=5;
    private static final int BLOCK_DURATION_MINUTES=5;

    public  boolean isIpBlocked(String ipAddress){

        LocalDateTime startTime=LocalDateTime.now().minusMinutes(BLOCK_DURATION_MINUTES);

        // Bazadan həmin IP-yə aid son 5 dəqiqədəki uğursuz cəhdləri sayırıq
        long failedCount=loginAttemptRepository.countByIpAddressAndIsSuccessfulFalseAndAttemptTimeAfter(ipAddress,startTime);
        return failedCount>=MAX_ATTEMPTS;
    }
}
