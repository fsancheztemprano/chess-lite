package dev.kurama.api.core.repository;

import dev.kurama.api.core.domain.Role;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

  Optional<Role> findByName(String name);

  Optional<Role> findRoleById(String id);

  void deleteRoleById(String id);
}
