package com.vusal.authmonitorboot.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DashBoardStatsDto {
    long totalUsers;
    long totalLoginAttempts;
    long successAttempts;
    long failureAttempts;


}
