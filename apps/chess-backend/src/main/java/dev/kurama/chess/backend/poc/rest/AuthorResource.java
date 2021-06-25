package dev.kurama.chess.backend.poc.rest;

import static org.springframework.http.ResponseEntity.created;
import static org.springframework.http.ResponseEntity.noContent;
import static org.springframework.http.ResponseEntity.ok;
import static org.springframework.web.servlet.support.ServletUriComponentsBuilder.fromCurrentRequestUri;

import dev.kurama.chess.backend.poc.api.domain.AuthorDTO;
import dev.kurama.chess.backend.poc.api.mapper.AuthorMapper;
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
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/author")
@RequiredArgsConstructor
public class AuthorResource {

  @NonNull
  private final AuthorRepository authorRepository;

  @NonNull
  private final BookRepository bookRepository;

  @NonNull
  private final AuthorMapper authorMapper;

  @GetMapping()
  public ResponseEntity<List<AuthorDTO>> getAll() {
    return ok().body(authorMapper.authorsToAuthorDTOs(authorRepository.findAll()));
  }

  @PostMapping()
  public ResponseEntity<AuthorDTO> create(@RequestBody AuthorDTO authorDTO) {
    Author author = authorRepository.save(authorMapper.authorDTOToAuthor(authorDTO));
    return created(fromCurrentRequestUri().path("/user/{username}").buildAndExpand(author.getId()).toUri())
      .body(authorMapper.authorToAuthorDTO(author));
  }

  @GetMapping("/{id}")
  public ResponseEntity<AuthorDTO> get(@PathVariable("id") Long id) {
    return ok().body(authorMapper.authorToAuthorDTO(authorRepository.findById(id).orElseThrow()));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable("id") String id) {
    authorRepository.deleteById(Long.parseLong(id));
    return noContent().build();
  }

  @PatchMapping("/{authorId}/book/{bookId}")
  public ResponseEntity<AuthorDTO> addBook(@PathVariable("authorId") Long authorId,
    @PathVariable("bookId") Long bookId) {
    Author author = authorRepository.findById(authorId).orElseThrow();
    Book book = bookRepository.findById(bookId).orElseThrow();
    author.getBooks().add(book);
    book.setAuthor(author);
    authorRepository.save(author);
    bookRepository.save(book);
    return ok().body(authorMapper.authorToAuthorDTO(author));

  }
}
