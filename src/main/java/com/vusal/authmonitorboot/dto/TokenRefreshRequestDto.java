package com.vusal.authmonitorboot.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TokenRefreshRequestDto {
    private String refreshToken;

}
