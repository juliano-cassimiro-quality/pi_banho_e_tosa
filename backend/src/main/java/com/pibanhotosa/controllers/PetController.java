package com.pibanhotosa.controllers;

import com.pibanhotosa.dto.PetRequest;
import com.pibanhotosa.dto.PetResponse;
import com.pibanhotosa.entities.Usuario;
import com.pibanhotosa.enums.Role;
import com.pibanhotosa.exceptions.BusinessException;
import com.pibanhotosa.services.AnimalService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/pets")
public class PetController {

    private final AnimalService animalService;

    public PetController(AnimalService animalService) {
        this.animalService = animalService;
    }

    @GetMapping
    public ResponseEntity<List<PetResponse>> listar(@AuthenticationPrincipal Usuario usuario,
                                                    @RequestParam(name = "tutorId", required = false) Long tutorId) {
        Long idTutor = tutorId;
        if (idTutor == null) {
            idTutor = usuario.getId();
        } else if (!usuario.getRole().equals(Role.PROFISSIONAL) && !usuario.getId().equals(tutorId)) {
            throw new BusinessException("Você não tem permissão para visualizar os pets deste cliente");
        }

        return ResponseEntity.ok(animalService.listarPorTutor(idTutor));
    }

    @PostMapping
    public ResponseEntity<PetResponse> criar(@AuthenticationPrincipal Usuario usuario,
                                             @Valid @RequestBody PetRequest request) {
        if (usuario.getRole() != Role.CLIENTE) {
            throw new BusinessException("Somente clientes podem cadastrar pets");
        }
        return ResponseEntity.ok(animalService.criar(usuario.getId(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PetResponse> atualizar(@AuthenticationPrincipal Usuario usuario,
                                                 @PathVariable Long id,
                                                 @Valid @RequestBody PetRequest request) {
        if (usuario.getRole() != Role.CLIENTE) {
            throw new BusinessException("Somente clientes podem atualizar pets");
        }
        return ResponseEntity.ok(animalService.atualizar(usuario.getId(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@AuthenticationPrincipal Usuario usuario,
                                        @PathVariable Long id) {
        if (usuario.getRole() != Role.CLIENTE) {
            throw new BusinessException("Somente clientes podem remover pets");
        }
        animalService.remover(usuario.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
