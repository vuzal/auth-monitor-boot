package com.vusal.authmonitorboot.exception;

public class UserAccountBlockedException extends RuntimeException{
    public UserAccountBlockedException(String message){
        super(message);
    }
}
