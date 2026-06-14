package com.vusal.authmonitorboot.controller;

import com.vusal.authmonitorboot.dto.DashBoardStatsDto;
import com.vusal.authmonitorboot.entity.LoginAttempt;
import com.vusal.authmonitorboot.entity.User;
import com.vusal.authmonitorboot.service.AdminService;
import com.vusal.authmonitorboot.service.LoginAttemptService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final LoginAttemptService loginAttemptService;
    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<DashBoardStatsDto> getDashboardStats(){
        return ResponseEntity.ok(adminService.getDashBoardStatsDto());
    }

    /**
     * Get recent 100 logs for the real-time log table
     */
    @GetMapping("/logs")
    public  ResponseEntity<List<LoginAttempt>> getRecentLogs(){
        return ResponseEntity.ok(loginAttemptService.getRecentLogs());
    }

    @GetMapping("/users")
    public  ResponseEntity<List<User>>getAllUsers(){
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{id}/block")
    public ResponseEntity<String> blockUser(@PathVariable Long id){
        adminService.blockUser(id);
        return ResponseEntity.ok("User has been blocked successfully");
    }

    @PutMapping("/users/{id}/unblock")
    public ResponseEntity<String> unblockUser(@PathVariable Long id){
        adminService.unblockUser(id);
        return ResponseEntity.ok("User has been unblocked successfully");
    }
}
