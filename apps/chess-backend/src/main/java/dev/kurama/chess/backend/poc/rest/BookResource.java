package dev.kurama.chess.backend.poc.rest;

import static org.springframework.http.ResponseEntity.created;
import static org.springframework.http.ResponseEntity.noContent;
import static org.springframework.http.ResponseEntity.ok;
import static org.springframework.web.servlet.support.ServletUriComponentsBuilder.fromCurrentRequestUri;

import dev.kurama.chess.backend.poc.api.assembler.BookDtoAssembler;
import dev.kurama.chess.backend.poc.api.domain.BookDTO;
import dev.kurama.chess.backend.poc.facade.BookFacade;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.CollectionModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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

  @NonNull
  private final BookDtoAssembler bookDtoAssembler;


  @GetMapping()
  public ResponseEntity<CollectionModel<BookDTO>> getAll(Authentication user) {
    return ok().body(bookDtoAssembler.toCollectionModel(bookFacade.findAll()));
  }

  @PostMapping()
  public ResponseEntity<BookDTO> create(@RequestBody BookDTO bookDTO) {
    BookDTO bookDto = bookFacade.create(bookDTO);
    return created(fromCurrentRequestUri()
      .path("/user/{username}")
      .buildAndExpand(bookDto.getId()).toUri())
      .body(bookDtoAssembler.toModel(bookDto));
  }

  @GetMapping("/{id}")
  public ResponseEntity<BookDTO> get(@PathVariable("id") Long id, Authentication user) {
    return ok().body(bookDtoAssembler.toModel(bookFacade.findById(id)));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
    bookFacade.deleteById(id);
    return noContent().build();
  }

  @PutMapping("/{id}/author/{authorId}")
  public ResponseEntity<BookDTO> setAuthor(@PathVariable("id") Long id, @PathVariable("authorId") Long authorId) {
    return ok().body(bookDtoAssembler.toModel(bookFacade.setAuthor(id, authorId)));
  }
}
