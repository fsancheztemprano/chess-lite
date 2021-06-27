package dev.kurama.chess.backend.poc.rest;

import static org.springframework.http.ResponseEntity.created;
import static org.springframework.http.ResponseEntity.noContent;
import static org.springframework.http.ResponseEntity.ok;
import static org.springframework.web.servlet.support.ServletUriComponentsBuilder.fromCurrentRequestUri;

import dev.kurama.chess.backend.poc.api.assembler.AuthorDtoAssembler;
import dev.kurama.chess.backend.poc.api.domain.AuthorDTO;
import dev.kurama.chess.backend.poc.facade.AuthorFacade;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.CollectionModel;
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
  private final AuthorFacade authorFacade;

  @NonNull
  private final AuthorDtoAssembler authorDtoAssembler;


  @GetMapping()
  public ResponseEntity<CollectionModel<AuthorDTO>> getAll() {
    return ok().body(authorDtoAssembler.toCollectionModel(authorFacade.findAll()));
  }

  @PostMapping()
  public ResponseEntity<AuthorDTO> create(@RequestBody AuthorDTO authorDTO) {
    AuthorDTO authorDto = authorFacade.create(authorDTO);
    return created(fromCurrentRequestUri()
      .path("/user/{username}")
      .buildAndExpand(authorDto.getId()).toUri())
      .body(authorDtoAssembler.toModel(authorDto));
  }

  @GetMapping("/{id}")
  public ResponseEntity<AuthorDTO> get(@PathVariable("id") Long id) {
    return ok().body(authorDtoAssembler.toModel(authorFacade.findById(id)));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
    authorFacade.deleteById(id);
    return noContent().build();
  }

  @PatchMapping("/{id}/book/{bookId}")
  public ResponseEntity<AuthorDTO> addBook(@PathVariable("id") Long id,
    @PathVariable("bookId") Long bookId) {
    return ok().body(authorDtoAssembler.toModel(authorFacade.addBook(id, bookId)));
  }

}
