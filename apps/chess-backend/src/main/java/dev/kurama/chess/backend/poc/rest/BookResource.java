package dev.kurama.chess.backend.poc.rest;

import static org.springframework.http.ResponseEntity.created;
import static org.springframework.http.ResponseEntity.noContent;
import static org.springframework.http.ResponseEntity.ok;
import static org.springframework.web.servlet.support.ServletUriComponentsBuilder.fromCurrentRequestUri;

import dev.kurama.chess.backend.poc.api.domain.BookDTO;
import dev.kurama.chess.backend.poc.api.mapper.BookMapper;
import dev.kurama.chess.backend.poc.domain.Author;
import dev.kurama.chess.backend.poc.domain.Book;
import dev.kurama.chess.backend.poc.repository.AuthorRepository;
import dev.kurama.chess.backend.poc.repository.BookRepository;
import java.util.List;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/book")
@RequiredArgsConstructor
public class BookResource {

  @NonNull
  private final BookRepository bookRepository;

  @NonNull
  private final AuthorRepository authorRepository;

  @NonNull
  private final BookMapper bookMapper;


  @GetMapping()
  public ResponseEntity<List<BookDTO>> getAll() {
    return ok().body(bookMapper.booksToBookDTOs(bookRepository.findAll()));
  }

  @PostMapping()
  public ResponseEntity<BookDTO> create(@RequestBody BookDTO bookDTO) {
    Book book = bookRepository.save(bookMapper.bookDTOToBook(bookDTO));
    return created(fromCurrentRequestUri().path("/user/{username}").buildAndExpand(book.getId()).toUri())
      .body(bookMapper.bookToBookDTO(book));
  }

  @GetMapping("/{id}")
  public ResponseEntity<BookDTO> get(@PathVariable("id") Long id) {
    return ok().body(bookMapper.bookToBookDTO(bookRepository.findById(id).orElseThrow()));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable("id") String id) {
    bookRepository.deleteById(Long.parseLong(id));
    return noContent().build();
  }

  @PutMapping("/{id}/author/{authorId}")
  public ResponseEntity<BookDTO> setAuthor(@PathVariable("id") String id, @PathVariable("authorId") String authorId) {
    Book book = bookRepository.findById(Long.parseLong(id)).orElseThrow();
    Author author = authorRepository.findById(Long.parseLong(authorId)).orElseThrow();
    author.getBooks().add(book);
    book.setAuthor(author);
    authorRepository.save(author);
    bookRepository.save(book);
    return ok().body(bookMapper.bookToBookDTO(book));
  }
}
