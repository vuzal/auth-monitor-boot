package com.vusal.authmonitorboot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class JwtResponseDto {
    private String accessToken;
    private String refreshToken;
    private String username;
    private String role;
}
