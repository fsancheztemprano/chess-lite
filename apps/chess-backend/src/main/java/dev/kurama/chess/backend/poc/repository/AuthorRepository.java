package dev.kurama.chess.backend.poc.repository;

import dev.kurama.chess.backend.poc.domain.Author;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthorRepository extends JpaRepository<Author, Long> {

}
