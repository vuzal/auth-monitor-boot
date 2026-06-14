package com.vusal.authmonitorboot.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.ManyToAny;

import java.time.Instant;

@Table(name = "refresh_tokens")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @Column(nullable = false, unique = true)
    String token;

    @ManyToOne(fetch = FetchType.LAZY)
            @JoinColumn(name = "user_id",nullable = false)
    User user;

    @Column(nullable = false,name = "expiry_date")
    Instant expiryDate;

    @Column(nullable = false,name = "is_revoked")
    @Builder.Default
    boolean isRevoked = false;

}
