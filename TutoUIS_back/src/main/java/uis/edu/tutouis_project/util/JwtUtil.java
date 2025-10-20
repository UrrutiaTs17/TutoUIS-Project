package uis.edu.tutouis_project.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secret;
    @Value("${jwt.expiration}")
    private Long expiration;

    /**
     * Crea la SecretKey a partir del secret
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String codigo) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);
        SecretKey key = getSigningKey();
        
        String token = Jwts.builder()
                .subject(codigo)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
        
        System.out.println("✅ Token generado para: " + codigo);
        return token;
    }

    public String getCodigoFromToken(String token) {
        try {
            SecretKey key = getSigningKey();
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return claims.getSubject();
        } catch (Exception e) {
            System.out.println("❌ Error al extraer código: " + e.getMessage());
            return null;
        }
    }

    public boolean validateToken(String token) {
        try {
            SecretKey key = getSigningKey();
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            System.out.println("✅ Token válido");
            return true;
        } catch (ExpiredJwtException e) {
            System.out.println("⚠️ Token expirado");
            return false;
        } catch (JwtException e) {
            System.out.println("❌ Token JWT inválido: " + e.getMessage());
            return false;
        } catch (Exception e) {
            System.out.println("❌ Error validando token: " + e.getMessage());
            return false;
        }
    }

    public boolean isTokenExpired(String token) {
        try {
            SecretKey key = getSigningKey();
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            
            boolean expired = claims.getExpiration().before(new Date());
            if (expired) {
                System.out.println("⚠️ Token expirado");
            }
            return expired;
        } catch (ExpiredJwtException e) {
            System.out.println("⚠️ Token expirado (ExpiredJwtException)");
            return true;
        } catch (Exception e) {
            System.out.println("❌ Error verificando expiración: " + e.getMessage());
            return true;
        }
    }
}

