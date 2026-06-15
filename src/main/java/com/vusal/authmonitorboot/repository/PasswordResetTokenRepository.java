package com.vusal.authmonitorboot.repository;

import com.vusal.authmonitorboot.entity.PasswordResetToken;
import com.vusal.authmonitorboot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken,Long> {
    Optional<PasswordResetToken> findByToken(String token);
    void deleteByUser(User user);
}
