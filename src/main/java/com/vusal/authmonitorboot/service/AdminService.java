package com.vusal.authmonitorboot.service;

import com.vusal.authmonitorboot.dto.DashBoardStatsDto;
import com.vusal.authmonitorboot.entity.User;
import com.vusal.authmonitorboot.exception.UserNotFoundException;
import com.vusal.authmonitorboot.repository.LoginAttemptRepository;
import com.vusal.authmonitorboot.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final LoginAttemptRepository loginAttemptRepository;

    public DashBoardStatsDto getDashBoardStatsDto() {
        long totalUsers=userRepository.count();
        long totalAttempts=loginAttemptRepository.count();

        long successAttempts=loginAttemptRepository.findAll().stream()
                .filter(l->l.isSuccessful()).count();
        long failedAttempts=totalAttempts-successAttempts;

        return DashBoardStatsDto.builder()
                .totalUsers(totalUsers)
                .totalLoginAttempts(totalAttempts)
                .successAttempts(successAttempts)
                .failureAttempts(failedAttempts).build();
    }

    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    @Transactional
    public void  blockUser(Long userId){
        User user=userRepository.findById(userId)
                .orElseThrow(()->new UserNotFoundException("User not found with id: "+userId));
        user.setBlocked(true);
        userRepository.save(user);
    }

    @Transactional
    public void  unblockUser(Long userId){
        User user=userRepository.findById(userId)
                .orElseThrow(()->new UserNotFoundException("User not found with id: "+userId));
        user.setBlocked(false);
        userRepository.save(user);
    }
}
