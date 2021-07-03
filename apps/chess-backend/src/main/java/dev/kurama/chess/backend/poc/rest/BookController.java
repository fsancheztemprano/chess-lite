package dev.kurama.chess.backend.poc.rest;

import static org.springframework.http.ResponseEntity.created;
import static org.springframework.http.ResponseEntity.noContent;
import static org.springframework.http.ResponseEntity.ok;
import static org.springframework.web.servlet.support.ServletUriComponentsBuilder.fromCurrentRequestUri;

import dev.kurama.chess.backend.core.service.DomainController;
import dev.kurama.chess.backend.poc.api.assembler.BookModelAssembler;
import dev.kurama.chess.backend.poc.api.domain.input.BookInput;
import dev.kurama.chess.backend.poc.api.domain.model.BookModel;
import dev.kurama.chess.backend.poc.facade.BookFacade;
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
@RequestMapping("/book")
@RequiredArgsConstructor
public class BookController implements DomainController<BookModel> {

  @NonNull
  private final BookFacade bookFacade;

  @NonNull
  private final BookModelAssembler bookModelAssembler;


  @GetMapping()
  public ResponseEntity<CollectionModel<BookModel>> getAll() {
    return ok().body(bookModelAssembler.toCollectionModel(bookFacade.findAll()));
  }

  @PostMapping()
  public ResponseEntity<BookModel> create(@RequestBody BookInput bookInput) {
    var bookModel = bookFacade.create(bookInput);
    return created(fromCurrentRequestUri()
      .path("/user/{username}")
      .buildAndExpand(bookModel.getId()).toUri())
      .body(bookModelAssembler.toModel(bookModel));
  }

  @GetMapping("/{id}")
  public ResponseEntity<BookModel> get(@PathVariable("id") String id) {
    return ok().body(bookModelAssembler.toModel(bookFacade.findById(id)));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable("id") String id) {
    bookFacade.deleteById(id);
    return noContent().build();
  }

  @PutMapping("/{id}")
  public ResponseEntity<BookModel> put(@PathVariable("id") String id, @RequestBody BookInput bookInput) {
    return ok().body(bookModelAssembler.toModel(bookFacade.put(id, bookInput)));
  }

  @PatchMapping("/{id}/author/{authorId}")
  public ResponseEntity<BookModel> setAuthor(@PathVariable("id") String id, @PathVariable("authorId") String authorId) {
    return ok().body(bookModelAssembler.toModel(bookFacade.setAuthor(id, authorId)));
  }
}
