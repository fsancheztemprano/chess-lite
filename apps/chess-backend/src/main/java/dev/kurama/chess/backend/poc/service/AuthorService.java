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
    author.setRandomUUID();
    return authorRepository.save(author);
  }

  public Author findById(String id) {
    return authorRepository.findOneById(id).orElseThrow();
  }

  public void deleteById(String id) {
    authorRepository.deleteOneById(id);
  }

  public Author addBook(String authorId, String bookId) {
    var author = authorRepository.findOneById(authorId).orElseThrow();
    var book = bookRepository.findOneById(bookId).orElseThrow();
    author.getBooks().add(book);
    book.setAuthor(author);
    bookRepository.save(book);
    return authorRepository.save(author);
  }

  public Author put(String id, Author newAuthor) {
    var author = authorRepository.findOneById(id).orElseThrow();
    author.setName(newAuthor.getName());
    author.setCity(newAuthor.getCity());
    return authorRepository.save(author);
  }
}
