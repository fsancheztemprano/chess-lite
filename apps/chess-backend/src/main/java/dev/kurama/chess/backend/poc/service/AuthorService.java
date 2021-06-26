package dev.kurama.chess.backend.poc.service;

import dev.kurama.chess.backend.poc.domain.Author;
import dev.kurama.chess.backend.poc.repository.AuthorRepository;
import dev.kurama.chess.backend.poc.repository.BookRepository;
import java.util.List;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AuthorService {

  @NonNull
  private final AuthorRepository authorRepository;

  @NonNull
  private final BookRepository bookRepository;

  public List<Author> findAll() {
    return authorRepository.findAll();
  }

  public Author create(Author author) {
    return authorRepository.save(author);
  }

  public Author findById(Long id) {
    return authorRepository.findById(id).orElseThrow();
  }

  public void deleteById(long id) {
    authorRepository.deleteById(id);
  }

  public Author addBook(Long authorId, Long bookId) {
    var author = authorRepository.findById(authorId).orElseThrow();
    var book = bookRepository.findById(bookId).orElseThrow();
    author.getBooks().add(book);
    book.setAuthor(author);
    authorRepository.save(author);
    bookRepository.save(book);
    return author;
  }
}
