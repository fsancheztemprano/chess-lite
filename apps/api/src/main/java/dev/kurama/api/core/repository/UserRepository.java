package dev.kurama.api.core.repository;

import dev.kurama.api.core.domain.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

  Optional<User> findUserByUsername(String username);

  Optional<User> findUserByEmail(String email);

}
