package com.vusal.authmonitorboot.service;

import com.vusal.authmonitorboot.entity.PasswordResetToken;
import com.vusal.authmonitorboot.entity.User;
import com.vusal.authmonitorboot.exception.UserNotFoundException;
import com.vusal.authmonitorboot.repository.PasswordResetTokenRepository;
import com.vusal.authmonitorboot.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ForgotPasswordService {
    private  final EmailService emailService;
    private final PasswordResetTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private  final PasswordEncoder passwordEncoder;

    @Transactional
    public void sendResetLink(String email){
        User user=userRepository.findByEmail(email)
                .orElseThrow(()->new UserNotFoundException("User not found with this email!"));

        tokenRepository.deleteByUser(user);

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusMinutes(15))
                .build();
        tokenRepository.save(resetToken);


        String resetLink = "http://localhost:5173/reset-password?token=" + token;

        // Real mail göndərilməsini tetikləyirik
        emailService.sendResetPasswordEmail(user.getEmail(), resetLink);
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or non-existent token!"));

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new RuntimeException("This reset link has expired! Please request a new one.");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Təhlükəsizlik üçün tokeni birdəfəlik silirik
        tokenRepository.delete(resetToken);
    }
}
