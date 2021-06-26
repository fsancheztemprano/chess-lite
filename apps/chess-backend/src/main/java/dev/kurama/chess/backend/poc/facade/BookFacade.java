package dev.kurama.chess.backend.poc.facade;

import dev.kurama.chess.backend.poc.api.domain.BookDTO;
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

  public List<BookDTO> findAll() {
    return bookMapper.booksToBookDTOs(bookService.findAll());
  }


  public BookDTO create(BookDTO bookDTO) {
    return bookMapper.bookToBookDTO(bookService.create(bookMapper.bookDTOToBook(bookDTO)));
  }

  public BookDTO findById(Long id) {
    return bookMapper.bookToBookDTO(bookService.findById(id));
  }

  public void deleteById(long id) {
    bookService.deleteById(id);
  }

  public BookDTO setAuthor(Long bookId, Long authorId) {
    return bookMapper.bookToBookDTO(bookService.setAuthor(bookId, authorId));
  }
}
