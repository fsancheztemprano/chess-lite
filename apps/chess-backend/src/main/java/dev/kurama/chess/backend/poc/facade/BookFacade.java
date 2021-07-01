package dev.kurama.chess.backend.poc.facade;

import dev.kurama.chess.backend.poc.api.domain.input.BookInput;
import dev.kurama.chess.backend.poc.api.domain.model.BookModel;
import dev.kurama.chess.backend.poc.api.mapper.BookMapper;
import dev.kurama.chess.backend.poc.service.BookService;
import java.util.List;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class BookFacade {

  @NonNull
  private final BookService bookService;

  @NonNull
  private final BookMapper bookMapper;

  public List<BookModel> findAll() {
    return bookMapper.booksToBookModels(bookService.findAll());
  }


  public BookModel create(BookInput bookInput) {
    return bookMapper.bookToBookModel(bookService.create(bookMapper.bookInputToBook(bookInput)));
  }

  public BookModel findById(String id) {
    return bookMapper.bookToBookModel(bookService.findById(id));
  }

  public void deleteById(String id) {
    bookService.deleteById(id);
  }

  public BookModel setAuthor(String bookId, String authorId) {
    return bookMapper.bookToBookModel(bookService.setAuthor(bookId, authorId));
  }

  public BookModel put(String id, BookInput bookInput) {
    return bookMapper.bookToBookModel(bookService.put(id, bookMapper.bookInputToBook(bookInput)));
  }

  public List<BookModel> findAllByAuthorId(String id) {
    return bookMapper.booksToBookModels(bookService.findAllByAuthorId(id));
  }
}
