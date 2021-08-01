package dev.kurama.chess.backend.auth.repository;

import dev.kurama.chess.backend.auth.domain.Authority;
import java.util.Collection;
import java.util.Optional;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthorityRepository extends JpaRepository<Authority, Long> {

  Optional<Authority> findByName(String name);

  Optional<Authority> findAuthorityById(String id);

  Set<Authority> findAllByIdIn(Collection<String> authorityIds);

}
