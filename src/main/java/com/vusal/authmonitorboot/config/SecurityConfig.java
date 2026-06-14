package com.vusal.authmonitorboot.config;

import com.vusal.authmonitorboot.security.CustomUserDetailService;
import com.vusal.authmonitorboot.security.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private  final CustomUserDetailService userDetailService;
    private  final PasswordEncoder passwordEncoder;
    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                //REST API-larda sessiya saxlanmadığı və JWT istifadə olunacağı üçün CSRF ləğv edilir
                .csrf(AbstractHttpConfigurer::disable)

                .authorizeHttpRequests(auth->auth
                        .requestMatchers("/api/users/register","/api/auth/login","/api/auth/refresh").permitAll()
                        .anyRequest().authenticated()
                )

                .sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .exceptionHandling(exception -> exception
                        // Əgər istifadəçi anonimdirsə (token göndərməyibsə), avtomatik 401 Unauthorized qaytar
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"Full authentication is required to access this resource.\"}");
                        })
                )
                // Detal: Bizim xüsusi JWT filtrimizi standart UsernamePasswordAuthenticationFilter-dən ÖNCƏ icra olunması üçün zəncirə daxil edirik
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();

    }
}
