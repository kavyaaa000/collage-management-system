//package com.college.erp.security;
//
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.SignatureAlgorithm;
//import io.jsonwebtoken.io.Decoders;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.stereotype.Component;
//
//import javax.crypto.SecretKey;
//import java.security.Key;
//import java.util.Date;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//import java.util.function.Function;
//
///**
// * Unified JWT Utility for all modules
// * Supports both simple username-based tokens and complex tokens with userId and roles
// */
//@Component
//public class UnifiedJwtUtil {
//
//    @Value("${jwt.secret}")
//    private String secret;
//
//    @Value("${jwt.expiration:86400000}") // 24 hours default
//    private Long expiration;
//
//    // ==================== Key Generation ====================
//
//    private Key getSigningKey() {
//        byte[] keyBytes = Decoders.BASE64.decode(secret);
//        return Keys.hmacShaKeyFor(keyBytes);
//    }
//
//    private SecretKey getSigningKeyV2() {
//        return Keys.hmacShaKeyFor(secret.getBytes());
//    }
//
//    // ==================== Token Extraction ====================
//
//    /**
//     * Extract username/email from token
//     */
//    public String extractUsername(String token) {
//        return extractClaim(token, Claims::getSubject);
//    }
//
//    /**
//     * Extract email (alias for extractUsername for module compatibility)
//     */
//    public String extractEmail(String token) {
//        return extractUsername(token);
//    }
//
//    /**
//     * Extract user ID from token (for modules that store userId in claims)
//     */
//    public Long extractUserId(String token) {
//        return extractClaim(token, claims -> {
//            Object userId = claims.get("userId");
//            if (userId instanceof Integer) {
//                return ((Integer) userId).longValue();
//            } else if (userId instanceof Long) {
//                return (Long) userId;
//            }
//            return null;
//        });
//    }
//
//    /**
//     * Extract roles from token (for modules that store roles in claims)
//     */
//    @SuppressWarnings("unchecked")
//    public List<String> extractRoles(String token) {
//        return extractClaim(token, claims -> (List<String>) claims.get("roles"));
//    }
//
//    /**
//     * Extract expiration date
//     */
//    public Date extractExpiration(String token) {
//        return extractClaim(token, Claims::getExpiration);
//    }
//
//    /**
//     * Generic claim extractor
//     */
//    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
//        final Claims claims = extractAllClaims(token);
//        return claimsResolver.apply(claims);
//    }
//
//    /**
//     * Extract all claims from token
//     */
//    private Claims extractAllClaims(String token) {
//        try {
//            // Try new parser first (for jjwt 0.12.x)
//            return Jwts.parser()
//                    .verifyWith(getSigningKeyV2())
//                    .build()
//                    .parseSignedClaims(token)
//                    .getPayload();
//        } catch (Exception e) {
//            // Fallback to old parser (for jjwt 0.11.x)
//            return Jwts.parserBuilder()
//                    .setSigningKey(getSigningKey())
//                    .build()
//                    .parseClaimsJws(token)
//                    .getBody();
//        }
//    }
//
//    // ==================== Token Generation ====================
//
//    /**
//     * Generate simple token with UserDetails (Module 1 & 2 style)
//     */
//    public String generateToken(UserDetails userDetails) {
//        return generateToken(new HashMap<>(), userDetails);
//    }
//
//    /**
//     * Generate token with extra claims and UserDetails
//     */
//    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
//        return buildToken(extraClaims, userDetails.getUsername(), expiration);
//    }
//
//    /**
//     * Generate token with userId and roles (Module 3 style - College Connect)
//     */
//    public String generateToken(Long userId, String email, List<String> roles) {
//        Map<String, Object> claims = new HashMap<>();
//        claims.put("userId", userId);
//        claims.put("roles", roles);
//        return buildToken(claims, email, expiration);
//    }
//
//    /**
//     * Build token with claims, subject, and expiration
//     */
//    private String buildToken(Map<String, Object> extraClaims, String subject, long expiration) {
//        Date now = new Date(System.currentTimeMillis());
//        Date expiryDate = new Date(now.getTime() + expiration);
//
//        try {
//            // Try new builder first (for jjwt 0.12.x)
//            return Jwts.builder()
//                    .claims(extraClaims)
//                    .subject(subject)
//                    .issuedAt(now)
//                    .expiration(expiryDate)
//                    .signWith(getSigningKeyV2())
//                    .compact();
//        } catch (Exception e) {
//            // Fallback to old builder (for jjwt 0.11.x)
//            return Jwts.builder()
//                    .setClaims(extraClaims)
//                    .setSubject(subject)
//                    .setIssuedAt(now)
//                    .setExpiration(expiryDate)
//                    .signWith(getSigningKey(), SignatureAlgorithm.HS256)
//                    .compact();
//        }
//    }
//
//    // ==================== Token Validation ====================
//
//    /**
//     * Validate token against UserDetails (Module 1 & 2 style)
//     */
//    public boolean isTokenValid(String token, UserDetails userDetails) {
//        final String username = extractUsername(token);
//        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
//    }
//
//    /**
//     * Validate token against username/email (Module 3 style)
//     */
//    public boolean validateToken(String token, UserDetails userDetails) {
//        return isTokenValid(token, userDetails);
//    }
//
//    /**
//     * Validate token against email string (Module 3 alternative style)
//     */
//    public Boolean validateToken(String token, String email) {
//        final String extractedEmail = extractEmail(token);
//        return (extractedEmail.equals(email) && !isTokenExpired(token));
//    }
//
//    /**
//     * Check if token is expired
//     */
//    private boolean isTokenExpired(String token) {
//        return extractExpiration(token).before(new Date());
//    }
//
//    // ==================== Utility Methods ====================
//
//    /**
//     * Get token expiration time in milliseconds
//     */
//    public Long getExpirationTime() {
//        return expiration;
//    }
//
//    /**
//     * Check if token is valid (without user details)
//     */
//    public boolean isTokenValid(String token) {
//        try {
//            extractAllClaims(token);
//            return !isTokenExpired(token);
//        } catch (Exception e) {
//            return false;
//        }
//    }
//}


package com.college.erp.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

/**
 * Unified JWT Utility for all modules
 * Compatible with JJWT 0.12.x ONLY
 */
@Component
public class UnifiedJwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration:86400000}") // 24 hours
    private Long expiration;

    // ======================================================
    // 🔐 SIGNING KEY (JJWT 0.12.x)
    // ======================================================

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // ======================================================
    // 📤 TOKEN EXTRACTION
    // ======================================================

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractEmail(String token) {
        return extractUsername(token);
    }

    public Long extractUserId(String token) {
        return extractClaim(token, claims -> {
            Object userId = claims.get("userId");
            if (userId instanceof Integer) {
                return ((Integer) userId).longValue();
            }
            if (userId instanceof Long) {
                return (Long) userId;
            }
            return null;
        });
    }

    @SuppressWarnings("unchecked")
    public List<String> extractRoles(String token) {
        return extractClaim(token, claims -> (List<String>) claims.get("roles"));
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        return resolver.apply(extractAllClaims(token));
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // ======================================================
    // 🧱 TOKEN GENERATION
    // ======================================================

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails.getUsername());
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return generateToken(extraClaims, userDetails.getUsername());
    }

    public String generateToken(Long userId, String email, List<String> roles) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("roles", roles);
        return generateToken(claims, email);
    }
    // Add this method to the UnifiedJwtUtil class
    public String generateToken(Map<String, Object> claims, String subject) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(getSigningKey())
                .compact();
    }
//    private String generateToken(Map<String, Object> claims, String subject) {
//        Date now = new Date();
//        Date expiry = new Date(now.getTime() + expiration);
//
//        return Jwts.builder()
//                .claims(claims)
//                .subject(subject)
//                .issuedAt(now)
//                .expiration(expiry)
//                .signWith(getSigningKey())
//                .compact();
//    }

    // ======================================================
    // ✅ TOKEN VALIDATION
    // ======================================================

    public boolean isTokenValid(String token, UserDetails userDetails) {
        return extractUsername(token).equals(userDetails.getUsername())
                && !isTokenExpired(token);
    }

    public boolean validateToken(String token, String email) {
        return extractEmail(token).equals(email) && !isTokenExpired(token);
    }

    public boolean isTokenValid(String token) {
        try {
            extractAllClaims(token);
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // ======================================================
    // ℹ️ UTILITY
    // ======================================================

    public Long getExpirationTime() {
        return expiration;
    }
}
