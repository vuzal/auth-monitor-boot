package com.vusal.authmonitorboot.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendResetPasswordEmail(String toEmail, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("no-reply@authmonitor.com");
        message.setTo(toEmail);
        message.setSubject("AuthMonitor - Password Reset Request");

        message.setText("Hello,\n\nYou have requested to reset your password. Please click the link below to set a new password:\n"
                + resetLink + "\n\nThis link will expire in 15 minutes.\nIf you did not make this request, you can safely ignore this email.");

        mailSender.send(message);
    }

}
