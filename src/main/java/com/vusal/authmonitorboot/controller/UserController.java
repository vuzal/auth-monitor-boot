package com.vusal.authmonitorboot.controller;

import com.vusal.authmonitorboot.dto.UserRegisterDto;
import com.vusal.authmonitorboot.dto.UserResponseDto;
import com.vusal.authmonitorboot.entity.User;
import com.vusal.authmonitorboot.mapper.UserMapper;
import com.vusal.authmonitorboot.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final UserMapper userMapper;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDto>registerUser(@RequestBody UserRegisterDto registerDto){
        User userEntity=userMapper.toUserEntity(registerDto);
        User savedUser=userService.registerUser(userEntity);
        UserResponseDto responseDto=userMapper.toUserResponseDto(savedUser);
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

}
