package com.vusal.authmonitorboot.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
    @Value("${spring.application.security.jwt.access-secret-key}")
    private String accessSecretKey;

    @Value("${spring.application.security.jwt.refresh-secret-key}")
    private String refreshSecretKey;

    @Value("${spring.application.security.jwt.access-expiration}")
    private Long accessExpiration;

    @Value("${spring.application.security.jwt.refresh-expiration}")
    private Long refreshExpiration;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);

    }
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    public String generateAccessToken(UserDetails userDetails){
        return buildToken(new HashMap<>(), userDetails, accessExpiration, getAccessSignInKey());
    }

    private  String buildToken(Map<String,Object> extraClaims, UserDetails userDetails, long expiration, Key signInKey){
        return
                Jwts.builder()
                        .setClaims(extraClaims)
                        .setSubject(userDetails.getUsername())
                        .setIssuedAt(new Date(System.currentTimeMillis()))
                        .setExpiration(new Date(System.currentTimeMillis()+expiration))
                        .signWith(signInKey, SignatureAlgorithm.HS256)
                        .compact();
    }
    public  boolean isTokenValid(String token, UserDetails userDetails){
        final String username=extractUsername(token);
        return (username.equals(userDetails.getUsername()))&& !isTokenExpired(token);
    }

    public boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }
    private Date extractExpiration(String token){
        return extractClaim(token, Claims::getExpiration);
    }

    private  Claims extractAllClaims(String token){
        return
                Jwts.parserBuilder()
                        .setSigningKey(getAccessSignInKey())
                        .build()
                        .parseClaimsJws(token)
                        .getBody();
    }

    private Key getAccessSignInKey(){
        byte [] keyBytes= Decoders.BASE64.decode(accessSecretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
    private  Key getRefreshSignInKey(){
        byte [] keyBytes= Decoders.BASE64.decode(refreshSecretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }


}
