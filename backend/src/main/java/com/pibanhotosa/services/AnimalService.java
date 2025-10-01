package com.pibanhotosa.services;

import com.pibanhotosa.dto.PetRequest;
import com.pibanhotosa.dto.PetResponse;
import com.pibanhotosa.entities.Animal;
import com.pibanhotosa.entities.Usuario;
import com.pibanhotosa.exceptions.NotFoundException;
import com.pibanhotosa.repositories.AnimalRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AnimalService {

    private final AnimalRepository animalRepository;
    private final UsuarioService usuarioService;

    public AnimalService(AnimalRepository animalRepository, UsuarioService usuarioService) {
        this.animalRepository = animalRepository;
        this.usuarioService = usuarioService;
    }

    @Transactional
    public PetResponse criar(Long tutorId, PetRequest request) {
        Usuario tutor = usuarioService.buscarPorId(tutorId);

        Animal animal = Animal.builder()
                .nome(request.nome())
                .especie(request.especie())
                .porte(request.porte())
                .idade(request.idade())
                .observacoesSaude(request.observacoesSaude())
                .preferencias(request.preferencias())
                .tutor(tutor)
                .build();

        return toResponse(animalRepository.save(animal));
    }

    @Transactional(readOnly = true)
    public List<PetResponse> listarPorTutor(Long tutorId) {
        return animalRepository.findByTutorId(tutorId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public PetResponse atualizar(Long tutorId, Long petId, PetRequest request) {
        Animal animal = animalRepository.findByIdAndTutorId(petId, tutorId)
                .orElseThrow(() -> new NotFoundException("Pet não encontrado"));

        animal.setNome(request.nome());
        animal.setEspecie(request.especie());
        animal.setPorte(request.porte());
        animal.setIdade(request.idade());
        animal.setObservacoesSaude(request.observacoesSaude());
        animal.setPreferencias(request.preferencias());

        return toResponse(animal);
    }

    @Transactional
    public void remover(Long tutorId, Long petId) {
        Animal animal = animalRepository.findByIdAndTutorId(petId, tutorId)
                .orElseThrow(() -> new NotFoundException("Pet não encontrado"));
        animalRepository.delete(animal);
    }

    @Transactional(readOnly = true)
    public Animal buscarEntidade(Long tutorId, Long petId) {
        return animalRepository.findByIdAndTutorId(petId, tutorId)
                .orElseThrow(() -> new NotFoundException("Pet não encontrado"));
    }

    private PetResponse toResponse(Animal animal) {
        return new PetResponse(
                animal.getId(),
                animal.getNome(),
                animal.getEspecie(),
                animal.getPorte(),
                animal.getIdade(),
                animal.getObservacoesSaude(),
                animal.getPreferencias()
        );
    }
}
