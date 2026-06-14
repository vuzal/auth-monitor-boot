package com.vusal.authmonitorboot.mapper;

import com.vusal.authmonitorboot.dto.UserRegisterDto;
import com.vusal.authmonitorboot.dto.UserResponseDto;
import com.vusal.authmonitorboot.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")  // Spring beani kimi qeydiyyata alınması üçün
public interface UserMapper {
    User toUserEntity(UserRegisterDto userRegisterDto);
    UserResponseDto toUserResponseDto(User user);
}
