package com.pibanhotosa.repositories;

import com.pibanhotosa.entities.Animal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AnimalRepository extends JpaRepository<Animal, Long> {
    List<Animal> findByTutorId(Long tutorId);
    Optional<Animal> findByIdAndTutorId(Long id, Long tutorId);
}
