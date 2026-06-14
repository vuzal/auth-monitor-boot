package com.vusal.authmonitorboot.controller;

import com.vusal.authmonitorboot.dto.JwtResponseDto;
import com.vusal.authmonitorboot.dto.LoginRequestDto;
import com.vusal.authmonitorboot.dto.TokenRefreshRequestDto;
import com.vusal.authmonitorboot.entity.RefreshToken;
import com.vusal.authmonitorboot.repository.RefreshTokenRepository;
import com.vusal.authmonitorboot.security.CustomUserDetailService;
import com.vusal.authmonitorboot.security.JwtService;
import com.vusal.authmonitorboot.service.LoginAttemptService;
import com.vusal.authmonitorboot.service.RefreshTokenService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private  final AuthenticationManager authenticationManager;
    private  final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final RefreshTokenRepository refreshTokenRepository;
    private  final CustomUserDetailService userDetailService;
    private final LoginAttemptService loginAttemptService;

    @PostMapping("/login")
    public ResponseEntity<JwtResponseDto> authenticate(@RequestBody LoginRequestDto requestDto, HttpServletRequest request) {
        String ipAddress=request.getRemoteAddr(); // Sorğunun gəldiyi IP-ni tuturuq

        try {
            // 1. Spring Security vasitəsilə username və password yoxlanılır
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(requestDto.getUserName(),requestDto.getPassword())
            );
            UserDetails userDetails=userDetailService.loadUserByUsername(requestDto.getUserName());
            String accessToken=jwtService.generateAccessToken(userDetails);
            RefreshToken refreshToken=refreshTokenService.createRefreshToken(userDetails.getUsername());

            loginAttemptService.logAttempt(requestDto.getUserName(),ipAddress,true,null);
            return ResponseEntity.ok(JwtResponseDto.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken.getToken())
                    .username(userDetails.getUsername())
                    .build()
            );
        }catch (AuthenticationException e) {
            loginAttemptService.logAttempt(requestDto.getUserName(), ipAddress, false,e.getMessage());
            throw e;
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<JwtResponseDto> refreshToken(@RequestBody TokenRefreshRequestDto requestDto){
        return refreshTokenRepository.findByToken(requestDto.getRefreshToken())
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    UserDetails userDetails=userDetailService.loadUserByUsername(user.getUsername());
                    String accessToken=jwtService.generateAccessToken(userDetails);

                    return ResponseEntity.ok(JwtResponseDto.builder()
                            .accessToken(accessToken)
                            .refreshToken(requestDto.getRefreshToken())
                            .username(userDetails.getUsername())
                            .build());
                })
                .orElseThrow(()->new RuntimeException("Refresh token is not in database!"));
    }
}
