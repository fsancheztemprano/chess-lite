package dev.kurama.chess.backend.poc.rest;

import static org.springframework.http.ResponseEntity.created;
import static org.springframework.http.ResponseEntity.noContent;
import static org.springframework.http.ResponseEntity.ok;
import static org.springframework.web.servlet.support.ServletUriComponentsBuilder.fromCurrentRequestUri;

import dev.kurama.chess.backend.poc.api.domain.BookDTO;
import dev.kurama.chess.backend.poc.facade.BookFacade;
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
  private final BookFacade bookFacade;


  @GetMapping()
  public ResponseEntity<List<BookDTO>> getAll() {
    return ok().body(bookFacade.findAll());
  }

  @PostMapping()
  public ResponseEntity<BookDTO> create(@RequestBody BookDTO bookDTO) {
    BookDTO bookDto = bookFacade.create(bookDTO);
    return created(fromCurrentRequestUri()
      .path("/user/{username}")
      .buildAndExpand(bookDto.getId()).toUri())
      .body(bookDto);
  }

  @GetMapping("/{id}")
  public ResponseEntity<BookDTO> get(@PathVariable("id") Long id) {
    return ok().body(bookFacade.findById(id));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable("id") String id) {
    bookFacade.deleteById(Long.parseLong(id));
    return noContent().build();
  }

  @PutMapping("/{id}/author/{authorId}")
  public ResponseEntity<BookDTO> setAuthor(@PathVariable("id") Long id, @PathVariable("authorId") Long authorId) {
    return ok().body(bookFacade.setAuthor(id, authorId));
  }
}
