package com.vusal.authmonitorboot.controller;

import com.vusal.authmonitorboot.service.ForgotPasswordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ForgotPasswordController {

    private  final ForgotPasswordService forgotPasswordService;

    // Şifrə sıfırlama linki istəyi
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        forgotPasswordService.sendResetLink(email);

        return ResponseEntity.ok(Map.of("message", "Password reset link has been successfully sent to your email!"));
    }

    // Yeni şifrəni və tokeni qəbul edib təsdiqləyən endpoint
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @RequestParam("token") String token,
            @RequestBody Map<String, String> request) {

        String newPassword = request.get("password");
        forgotPasswordService.resetPassword(token, newPassword);

        return ResponseEntity.ok(Map.of("message", "Success! Your password has been successfully updated."));
    }
}
