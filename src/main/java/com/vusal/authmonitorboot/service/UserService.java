package com.vusal.authmonitorboot.service;

import com.vusal.authmonitorboot.entity.User;
import com.vusal.authmonitorboot.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User registerUser(User user){
        if (userRepository.existsByUsername(user.getUsername())){
            throw new RuntimeException("This username is already in use");
        }
        if (userRepository.existsByEmail(user.getEmail())){
            throw new RuntimeException("This email is already in use");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Transactional
    public void blockUser(Long userId){
        User user=userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setBlocked(true);
        userRepository.save(user);
    }

}
