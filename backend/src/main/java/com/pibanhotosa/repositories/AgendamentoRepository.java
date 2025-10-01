package com.pibanhotosa.repositories;

import com.pibanhotosa.entities.Agendamento;
import com.pibanhotosa.enums.StatusAgendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    List<Agendamento> findByClienteIdOrderByDataHoraAsc(Long clienteId);

    List<Agendamento> findByProfissionalIdOrderByDataHoraAsc(Long profissionalId);

    Optional<Agendamento> findByIdAndClienteId(Long id, Long clienteId);

    Optional<Agendamento> findByIdAndProfissionalId(Long id, Long profissionalId);

    @Query("select a from Agendamento a where a.profissional.id = :profissionalId and a.dataHora between :inicio and :fim and a.status in :status")
    List<Agendamento> buscarPorProfissionalEPeriodo(@Param("profissionalId") Long profissionalId,
                                                    @Param("inicio") LocalDateTime inicio,
                                                    @Param("fim") LocalDateTime fim,
                                                    @Param("status") Collection<StatusAgendamento> status);

    @Query("select a from Agendamento a where a.profissional.id = :profissionalId and a.dataHora between :inicio and :fim and a.status <> com.pibanhotosa.enums.StatusAgendamento.CANCELADO")
    List<Agendamento> buscarAtivosPorProfissionalEPeriodo(@Param("profissionalId") Long profissionalId,
                                                          @Param("inicio") LocalDateTime inicio,
                                                          @Param("fim") LocalDateTime fim);
}
