package com.pibanhotosa.security;

import com.pibanhotosa.entities.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;

@Service
public class JwtService {

    private final Key key;
    private final Duration expiration;

    public JwtService(@Value("${app.jwt.secret}") String secret,
                      @Value("${app.jwt.expiration}") Duration expiration) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiration = expiration;
    }

    public String gerarToken(Usuario usuario) {
        Instant agora = Instant.now();
        Instant validade = agora.plus(expiration);

        return Jwts.builder()
                .setSubject(usuario.getId().toString())
                .setIssuedAt(Date.from(agora))
                .setExpiration(Date.from(validade))
                .claim("email", usuario.getEmail())
                .claim("role", usuario.getRole().name())
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean tokenValido(String token, String usuarioId) {
        String subject = recuperarSubject(token);
        return subject.equals(usuarioId) && !estaExpirado(token);
    }

    public String recuperarSubject(String token) {
        return parse(token).getBody().getSubject();
    }

    public boolean estaExpirado(String token) {
        Date expirationDate = parse(token).getBody().getExpiration();
        return expirationDate.before(new Date());
    }

    public Claims recuperarClaims(String token) {
        return parse(token).getBody();
    }

    private Jws<Claims> parse(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
    }
}
