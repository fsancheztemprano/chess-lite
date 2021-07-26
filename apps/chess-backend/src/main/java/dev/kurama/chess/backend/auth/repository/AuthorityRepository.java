package dev.kurama.chess.backend.auth.repository;

import dev.kurama.chess.backend.auth.domain.Authority;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthorityRepository extends JpaRepository<Authority, Long> {

  Authority findByName(String name);

}
