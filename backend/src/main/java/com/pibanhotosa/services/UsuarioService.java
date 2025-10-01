package com.pibanhotosa.services;

import com.pibanhotosa.dto.RegisterRequest;
import com.pibanhotosa.entities.Usuario;
import com.pibanhotosa.enums.Role;
import com.pibanhotosa.exceptions.BusinessException;
import com.pibanhotosa.exceptions.NotFoundException;
import com.pibanhotosa.repositories.UsuarioRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Usuario criarCliente(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new BusinessException("Já existe um usuário cadastrado com este e-mail.");
        }

        Usuario usuario = Usuario.builder()
                .nome(request.nome())
                .telefone(request.telefone())
                .email(request.email())
                .senha(passwordEncoder.encode(request.senha()))
                .role(Role.CLIENTE)
                .ativo(true)
                .build();
        return usuarioRepository.save(usuario);
    }

    @Transactional(readOnly = true)
    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado"));
    }

    @Transactional(readOnly = true)
    public Usuario buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
    }

    @Transactional(readOnly = true)
    public Usuario buscarProfissionalPadrao() {
        return usuarioRepository.findByEmail("profissional@banhoetosa.com")
                .orElseThrow(() -> new NotFoundException("Nenhum profissional padrão cadastrado"));
    }

    @Transactional
    public Usuario criarProfissionalPadraoSeNecessario() {
        return usuarioRepository.findByEmail("profissional@banhoetosa.com")
                .orElseGet(() -> usuarioRepository.save(Usuario.builder()
                        .nome("Profissional Responsável")
                        .email("profissional@banhoetosa.com")
                        .telefone("(11) 90000-0000")
                        .senha(passwordEncoder.encode("profissional123"))
                        .role(Role.PROFISSIONAL)
                        .ativo(true)
                        .build()));
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return usuarioRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
    }
}
