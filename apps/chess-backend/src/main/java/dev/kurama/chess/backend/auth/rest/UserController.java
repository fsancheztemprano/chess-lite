package dev.kurama.chess.backend.auth.rest;

import static org.springframework.http.ResponseEntity.created;
import static org.springframework.http.ResponseEntity.noContent;
import static org.springframework.http.ResponseEntity.ok;
import static org.springframework.web.servlet.support.ServletUriComponentsBuilder.fromCurrentRequestUri;

import dev.kurama.chess.backend.auth.api.assembler.UserModelAssembler;
import dev.kurama.chess.backend.auth.api.domain.input.UserInput;
import dev.kurama.chess.backend.auth.api.domain.model.UserModel;
import dev.kurama.chess.backend.auth.exception.domain.EmailExistsException;
import dev.kurama.chess.backend.auth.exception.domain.UserNotFoundException;
import dev.kurama.chess.backend.auth.exception.domain.UsernameExistsException;
import dev.kurama.chess.backend.auth.facade.UserFacade;
import dev.kurama.chess.backend.core.service.DomainController;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.CollectionModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController implements DomainController<UserModel> {

  @NonNull
  private final UserFacade userFacade;

  @NonNull
  private final UserModelAssembler userModelAssembler;

  @GetMapping()
  @PreAuthorize("hasAnyAuthority('user:read')")
  public ResponseEntity<CollectionModel<UserModel>> getAll() {
    return ok().body(userModelAssembler.toSelfCollectionModel(userFacade.getAll()));
  }

  @PostMapping()
  @PreAuthorize("hasAnyAuthority('user:create')")
  public ResponseEntity<UserModel> create(@RequestBody UserInput userInput)
    throws UsernameExistsException, EmailExistsException {
    return created(fromCurrentRequestUri().path("/user/{username}").buildAndExpand(userInput.getUsername()).toUri())
      .body(userModelAssembler.toModel(userFacade.create(userInput)));
  }

  @GetMapping("/{username}")
  @PreAuthorize("hasAnyAuthority('user:read')")
  public ResponseEntity<UserModel> get(@PathVariable("username") String username) {
    return ok().body(userModelAssembler.toModel(userFacade.findByUsername(username)));
  }

  @PatchMapping("/{username}")
  @PreAuthorize("hasAnyAuthority('user:update')")
  public ResponseEntity<UserModel> patch(@PathVariable("username") String username, @RequestBody UserInput userInput)
    throws UserNotFoundException, UsernameExistsException, EmailExistsException {
    return ok().body(userModelAssembler.toModel(userFacade.update(username, userInput)));
  }

  @PutMapping("/{username}")
  @PreAuthorize("hasAnyAuthority('user:update')")
  public ResponseEntity<UserModel> update(@PathVariable("username") String username, @RequestBody UserInput userInput)
    throws UserNotFoundException, UsernameExistsException, EmailExistsException {
    return ok().body(userModelAssembler.toModel(userFacade.update(username, userInput)));
  }

  @DeleteMapping("/{username}")
  @PreAuthorize("hasAnyAuthority('user:delete')")
  public ResponseEntity<Void> delete(@PathVariable("username") String username) {
    userFacade.deleteByUsername(username);
    return noContent().build();
  }
}
