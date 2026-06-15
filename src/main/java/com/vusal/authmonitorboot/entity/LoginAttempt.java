package com.vusal.authmonitorboot.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "login_attempts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LoginAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String username; // Daxil edilməyə çalışılan istifadəçi adı
    @Column(name = "id_address")
    String ipAddress; // Sorğunun gəldiyi IP ünvanı
    @Column(name = "attempt_time",updatable = false,nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    LocalDateTime attemptTime;
    @Column(name ="is_successful")
    boolean isSuccessful; // Giriş uğurludur (true) yoxsa uğursuz (false)
    @Column(name="fail_reason")
    String failReason; // Uğursuzdursa səbəbi (məs: "Bad credentials", "User blocked")

   @PrePersist
    protected void onCreate(){
       attemptTime = LocalDateTime.now();
   }

}
