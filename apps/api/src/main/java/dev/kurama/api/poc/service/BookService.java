package dev.kurama.api.poc.service;

import dev.kurama.api.poc.domain.Book;
import dev.kurama.api.poc.repository.AuthorRepository;
import dev.kurama.api.poc.repository.BookRepository;
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
    book.setRandomUUID();
    return bookRepository.save(book);
  }

  public Book findById(String id) {
    return bookRepository.findOneById(id).orElseThrow();
  }

  public void deleteById(String id) {
    bookRepository.deleteOneById(id);
  }

  public Book setAuthor(String bookId, String authorId) {
    var book = bookRepository.findOneById(bookId).orElseThrow();
    var author = authorRepository.findOneById(authorId).orElseThrow();
    author.getBooks().add(book);
    book.setAuthor(author);
    authorRepository.save(author);
    return bookRepository.save(book);
  }

  public Book put(String id, Book newBook) {
    var book = bookRepository.findOneById(id).orElseThrow();
    book.setIsbn(newBook.getIsbn());
    book.setTitle(newBook.getTitle());
    return bookRepository.save(book);
  }

  public List<Book> findAllByAuthorId(String id) {
    return bookRepository.findAllByAuthorId(id);
  }
}
