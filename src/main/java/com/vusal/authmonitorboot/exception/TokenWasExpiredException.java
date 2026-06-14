package com.vusal.authmonitorboot.exception;

public class TokenWasExpiredException extends RuntimeException {
    public TokenWasExpiredException(String message) {
        super(message);

    }
}
