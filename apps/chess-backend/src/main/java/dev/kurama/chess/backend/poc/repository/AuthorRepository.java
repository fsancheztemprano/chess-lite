package dev.kurama.chess.backend.poc.repository;

import dev.kurama.chess.backend.poc.domain.Author;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface AuthorRepository extends JpaRepository<Author, Long> {

  @Transactional(readOnly = true)
  Optional<Author> findOneById(String id);

  @Transactional
  void deleteOneById(String id);

}
