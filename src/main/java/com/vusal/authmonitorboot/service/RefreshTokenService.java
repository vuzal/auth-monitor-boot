package com.vusal.authmonitorboot.service;

import com.vusal.authmonitorboot.entity.RefreshToken;
import com.vusal.authmonitorboot.entity.User;
import com.vusal.authmonitorboot.exception.TokenWasExpiredException;
import com.vusal.authmonitorboot.exception.TokenWasRevokedException;
import com.vusal.authmonitorboot.repository.RefreshTokenRepository;
import com.vusal.authmonitorboot.repository.UserRepository;
import com.vusal.authmonitorboot.security.JwtService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    @Value("${spring.application.security.jwt.refresh-expiration}")
    private long refreshExpiration;

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Transactional
    public RefreshToken createRefreshToken(String username){
        User user=userRepository.findByUsername(username)
                .orElseThrow(()->new UsernameNotFoundException("User not found: "+username));

        refreshTokenRepository.deleteByUser_Id(user.getId());

        RefreshToken refreshToken=RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString()) // Refresh token unikal UUID olur
                .expiryDate(Instant.now().plusMillis(refreshExpiration))
                .build();
        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken verifyExpiration(RefreshToken token){
        if (token.isRevoked()){
            throw  new TokenWasRevokedException("Refresh token was revoked!");
        }
        if (token.getExpiryDate().compareTo(Instant.now())<0){
            refreshTokenRepository.delete(token);
            throw new TokenWasExpiredException("Refresh token was expired. Please make a new sign request");
        }
        return token;
    }

}
