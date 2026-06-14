package com.vusal.authmonitorboot.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @Column(nullable = false, unique = true)
    String username;
    @Column(nullable = false)
    String password;
    @Column(nullable = false, unique = true)
    String email;
    @Column(nullable = false, name = "is_blocked")
            @Builder.Default
    boolean isBlocked = false;
    @Column(name = "created_at")
    LocalDate createdAt;

    @Column(nullable = false)
    @Builder.Default
    String role="USER";

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDate.now();
    }

}
