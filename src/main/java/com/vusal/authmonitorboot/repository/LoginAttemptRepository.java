package com.vusal.authmonitorboot.repository;

import com.vusal.authmonitorboot.entity.LoginAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface LoginAttemptRepository extends JpaRepository<LoginAttempt, Long> {
    // Müəyyən bir istifadəçi üçün son giriş cəhdlərini tapmaq (Dashboard üçün)
    List<LoginAttempt> findByUsernameOrderByAttemptTimeDesc(String username);

    // Brute-force hücumlarını anlıq bloklamaq üçün:
    // Müəyyən bir IP-dən, müəyyən bir vaxtdan sonra gələn uğursuz cəhdlərin sayını tapır
    long countByIpAddressAndIsSuccessfulFalseAndAttemptTimeAfter(String ipAddress, LocalDateTime time);

    // Son gələn loqları tarixinə görə sıralayıb dashboard-a ötürmək üçün
    List<LoginAttempt> findTop100ByOrderByAttemptTimeDesc();
}
