package com.pibanhotosa.services;

import com.pibanhotosa.dto.AuthResponse;
import com.pibanhotosa.dto.LoginRequest;
import com.pibanhotosa.dto.RegisterRequest;
import com.pibanhotosa.dto.UsuarioResponse;
import com.pibanhotosa.entities.Usuario;
import com.pibanhotosa.exceptions.BusinessException;
import com.pibanhotosa.repositories.UsuarioRepository;
import com.pibanhotosa.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioService usuarioService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository usuarioRepository,
                       UsuarioService usuarioService,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioService = usuarioService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse registrar(RegisterRequest request) {
        Usuario usuario = usuarioService.criarCliente(request);
        String token = jwtService.gerarToken(usuario);
        return new AuthResponse(token, toResponse(usuario));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow(() -> new BusinessException("Credenciais inválidas"));

        if (!passwordEncoder.matches(request.senha(), usuario.getSenha())) {
            throw new BusinessException("Credenciais inválidas");
        }

        String token = jwtService.gerarToken(usuario);
        return new AuthResponse(token, toResponse(usuario));
    }

    private UsuarioResponse toResponse(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getTelefone(),
                usuario.getEmail(),
                usuario.getRole().name()
        );
    }
}
