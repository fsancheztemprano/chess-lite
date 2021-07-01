package dev.kurama.chess.backend.poc.repository;

import dev.kurama.chess.backend.poc.domain.Book;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

  @Transactional(readOnly = true)
  Optional<Book> findOneById(String id);

  @Transactional
  void deleteOneById(String id);

  @Transactional(readOnly = true)
  List<Book> findAllByAuthorId(String id);
}
