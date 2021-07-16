package dev.kurama.chess.backend.auth.rest;

import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;
import static org.springframework.http.ResponseEntity.created;
import static org.springframework.http.ResponseEntity.noContent;
import static org.springframework.http.ResponseEntity.ok;
import static org.springframework.web.servlet.support.ServletUriComponentsBuilder.fromCurrentRequestUri;

import dev.kurama.chess.backend.auth.api.assembler.UserModelAssembler;
import dev.kurama.chess.backend.auth.api.domain.input.ChangeUserPasswordInput;
import dev.kurama.chess.backend.auth.api.domain.input.UpdateUserProfileInput;
import dev.kurama.chess.backend.auth.api.domain.input.UserInput;
import dev.kurama.chess.backend.auth.api.domain.model.UserModel;
import dev.kurama.chess.backend.auth.exception.domain.EmailExistsException;
import dev.kurama.chess.backend.auth.exception.domain.UserNotFoundException;
import dev.kurama.chess.backend.auth.exception.domain.UsernameExistsException;
import dev.kurama.chess.backend.auth.facade.UserFacade;
import dev.kurama.chess.backend.core.service.DomainController;
import java.io.IOException;
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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController implements DomainController<UserModel> {

  @NonNull
  private final UserFacade userFacade;

  @NonNull
  private final UserModelAssembler userModelAssembler;

  @GetMapping()
  @PreAuthorize("hasAuthority('user:read')")
  public ResponseEntity<CollectionModel<UserModel>> getAll() {
    return ok().body(userModelAssembler.toSelfCollectionModel(userFacade.getAll()));
  }

  @PostMapping()
  @PreAuthorize("hasAuthority('user:create')")
  public ResponseEntity<UserModel> create(@RequestBody UserInput userInput)
    throws UsernameExistsException, EmailExistsException {
    return created(fromCurrentRequestUri().path("/user/{username}").buildAndExpand(userInput.getUsername()).toUri())
      .body(userModelAssembler.toModel(userFacade.create(userInput)));
  }

  @GetMapping("/{username}")
  @PreAuthorize("hasAuthority('user:read') or @userEvaluator.isCurrentUser(#username)")
  public ResponseEntity<UserModel> get(@PathVariable("username") String username) {
    return ok().body(userModelAssembler.toModel(userFacade.findByUsername(username)));
  }

  @PatchMapping("/{username}")
  @PreAuthorize("hasAuthority('user:update')")
  public ResponseEntity<UserModel> patch(@PathVariable("username") String username, @RequestBody UserInput userInput)
    throws UserNotFoundException, UsernameExistsException, EmailExistsException {
    return ok().body(userModelAssembler.toModel(userFacade.update(username, userInput)));
  }

  @PutMapping("/{username}")
  @PreAuthorize("hasAuthority('user:update')")
  public ResponseEntity<UserModel> update(@PathVariable("username") String username, @RequestBody UserInput userInput)
    throws UserNotFoundException, UsernameExistsException, EmailExistsException {
    return ok().body(userModelAssembler.toModel(userFacade.update(username, userInput)));
  }

  @DeleteMapping("/{username}")
  @PreAuthorize("hasAuthority('user:delete') or @userEvaluator.isCurrentUser(#username)")
  public ResponseEntity<Void> delete(@PathVariable("username") String username) {
    userFacade.deleteByUsername(username);
    return noContent().build();
  }

  @PatchMapping("/{username}/profile")
  @PreAuthorize("hasAuthority('user:update') or @userEvaluator.isCurrentUser(#username)")
  public ResponseEntity<UserModel> updateProfile(@PathVariable("username") String username,
    @RequestBody UpdateUserProfileInput updateUserProfileInput) {
    return ok().body(userModelAssembler.toModel(userFacade.updateProfile(username, updateUserProfileInput)));
  }

  @PatchMapping("/{username}/password")
  @PreAuthorize("hasAuthority('user:update') or @userEvaluator.isCurrentUser(#username)")
  public ResponseEntity<UserModel> changePassword(@PathVariable("username") String username,
    @RequestBody ChangeUserPasswordInput changeUserPasswordInput) {
    return ok().body(userModelAssembler.toModel(userFacade.changePassword(username, changeUserPasswordInput)));
  }

  @PatchMapping(value = "/{username}/avatar", consumes = MULTIPART_FORM_DATA_VALUE)
  @PreAuthorize("hasAuthority('user:update') or @userEvaluator.isCurrentUser(#username)")
  public ResponseEntity<Object> uploadAvatar(@PathVariable("username") String username,
    @RequestPart("avatar") MultipartFile avatar) throws IOException {
    return ok().body(userModelAssembler.toModel(userFacade.uploadAvatar(username, avatar)));
  }
}
