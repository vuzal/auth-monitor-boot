package com.vusal.authmonitorboot.exception;

public class TokenWasRevokedException extends RuntimeException{
    public TokenWasRevokedException(String message) {
        super(message);
    }
}
