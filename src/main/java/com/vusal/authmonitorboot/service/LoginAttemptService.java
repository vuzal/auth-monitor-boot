package com.vusal.authmonitorboot.service;

import com.vusal.authmonitorboot.entity.LoginAttempt;
import com.vusal.authmonitorboot.repository.LoginAttemptRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoginAttemptService {
    private final LoginAttemptRepository loginAttemptRepository;

    /**
     * Hər bir giriş cəhdini (Uğurlu/Uğursuz) asinxron və ya birbaşa qeyd etmək üçün
     */
    @Transactional
    public void logAttempt(String username, String ipAddress, boolean isSuccessful, String failReason) {

        LoginAttempt loginAttempt = LoginAttempt.builder()
                .username(username)
                .ipAddress(ipAddress)
                .attemptTime(LocalDateTime.now())
                .isSuccessful(isSuccessful)
                .failReason(failReason)
                .build();

        loginAttemptRepository.save(loginAttempt);
    }

    /**
     * Son 100 loqu idarəetmə paneli üçün gətirir
     */
    public List<LoginAttempt> getRecentLogs() {
        return loginAttemptRepository.findTop100ByOrderByAttemptTimeDesc();
    }

}
