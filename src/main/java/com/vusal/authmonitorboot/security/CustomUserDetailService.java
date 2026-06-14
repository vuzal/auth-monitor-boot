package com.vusal.authmonitorboot.security;

import com.vusal.authmonitorboot.entity.User;
import com.vusal.authmonitorboot.exception.UserAccountBlockedException;
import com.vusal.authmonitorboot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {
    private final UserRepository userRepository;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Bizim bazadan istifadəçini axtarırıq
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        if (user.isBlocked()) {
            throw new UserAccountBlockedException("User account is blocked!");
        }
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities(new ArrayList<>())
                .accountLocked(user.isBlocked())
                .build();
    }
}
