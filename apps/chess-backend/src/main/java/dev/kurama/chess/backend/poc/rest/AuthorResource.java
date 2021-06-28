package dev.kurama.chess.backend.poc.rest;

import static org.springframework.http.ResponseEntity.created;
import static org.springframework.http.ResponseEntity.noContent;
import static org.springframework.http.ResponseEntity.ok;
import static org.springframework.web.servlet.support.ServletUriComponentsBuilder.fromCurrentRequestUri;

import dev.kurama.chess.backend.poc.api.assembler.AuthorModelAssembler;
import dev.kurama.chess.backend.poc.api.domain.input.AuthorInput;
import dev.kurama.chess.backend.poc.api.domain.output.AuthorModel;
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
import org.springframework.web.bind.annotation.PutMapping;
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
  private final AuthorModelAssembler authorModelAssembler;


  @GetMapping()
  public ResponseEntity<CollectionModel<AuthorModel>> getAll() {
    return ok().body(authorModelAssembler.toCollectionModel(authorFacade.findAll()));
  }

  @PostMapping()
  public ResponseEntity<AuthorModel> create(@RequestBody AuthorInput authorInput) {
    AuthorModel newAuthorModel = authorFacade.create(authorInput);
    return created(fromCurrentRequestUri()
      .path("/user/{username}")
      .buildAndExpand(newAuthorModel.getId()).toUri())
      .body(authorModelAssembler.toModel(newAuthorModel));
  }

  @GetMapping("/{id}")
  public ResponseEntity<AuthorModel> get(@PathVariable("id") Long id) {
    return ok().body(authorModelAssembler.toModel(authorFacade.findById(id)));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
    authorFacade.deleteById(id);
    return noContent().build();
  }


  @PutMapping("/{id}")
  public ResponseEntity<AuthorModel> put(@PathVariable("id") Long id, @RequestBody AuthorInput authorInput) {
    return ok().body(authorModelAssembler.toModel(authorFacade.put(id, authorInput)));
  }


  @PatchMapping("/{id}/book/{bookId}")
  public ResponseEntity<AuthorModel> addBook(@PathVariable("id") Long id,
    @PathVariable("bookId") Long bookId) {
    return ok().body(authorModelAssembler.toModel(authorFacade.addBook(id, bookId)));
  }

}
