package dev.kurama.chess.backend.repository;

import dev.kurama.chess.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

  User findUserByUsername(String username);


  User findUserByEmail(String email);

  User deleteByUsername(String username);
}
