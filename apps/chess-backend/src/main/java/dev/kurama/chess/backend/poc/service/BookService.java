package dev.kurama.chess.backend.poc.service;

import dev.kurama.chess.backend.poc.domain.Book;
import dev.kurama.chess.backend.poc.repository.AuthorRepository;
import dev.kurama.chess.backend.poc.repository.BookRepository;
import java.util.List;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class BookService {

  @NonNull
  private final BookRepository bookRepository;
  @NonNull
  private final AuthorRepository authorRepository;

  public List<Book> findAll() {
    return bookRepository.findAll();
  }

  public Book create(Book book) {
    return bookRepository.save(book);
  }

  public Book findById(Long id) {
    return bookRepository.findById(id).orElseThrow();
  }

  public void deleteById(long id) {
    bookRepository.deleteById(id);
  }

  public Book setAuthor(long bookId, long authorId) {
    var book = bookRepository.findById(bookId).orElseThrow();
    var author = authorRepository.findById(authorId).orElseThrow();
    author.getBooks().add(book);
    book.setAuthor(author);
    authorRepository.save(author);
    bookRepository.save(book);
    return book;
  }
}
