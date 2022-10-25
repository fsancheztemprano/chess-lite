package dev.kurama.api.core.repository;

import dev.kurama.api.core.domain.Authority;
import java.util.Collection;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthorityRepository extends JpaRepository<Authority, String> {

  Set<Authority> findAllByIdIn(Collection<String> authorityIds);

}
