package com.pibanhotosa.repositories;

import com.pibanhotosa.entities.Usuario;
import com.pibanhotosa.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
    long countByRole(Role role);
}
