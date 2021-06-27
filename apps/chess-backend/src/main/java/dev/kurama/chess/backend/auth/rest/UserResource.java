package dev.kurama.chess.backend.auth.rest;

import static org.springframework.http.ResponseEntity.created;
import static org.springframework.http.ResponseEntity.noContent;
import static org.springframework.http.ResponseEntity.ok;
import static org.springframework.web.servlet.support.ServletUriComponentsBuilder.fromCurrentRequestUri;

import dev.kurama.chess.backend.auth.domain.User;
import dev.kurama.chess.backend.auth.exception.domain.EmailExistsException;
import dev.kurama.chess.backend.auth.exception.domain.UserNotFoundException;
import dev.kurama.chess.backend.auth.exception.domain.UsernameExistsException;
import dev.kurama.chess.backend.auth.facade.UserFacade;
import dev.kurama.chess.backend.auth.rest.input.UserInput;
import java.util.List;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
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
public class UserResource {

  @NonNull
  private final UserFacade userFacade;

  @GetMapping()
  @PreAuthorize("hasAnyAuthority('user:read')")
  public ResponseEntity<List<User>> getAllUsers(Authentication user) {
    return ok().body(userFacade.getAllUsers());
  }

  @PostMapping()
  @PreAuthorize("hasAnyAuthority('user:create')")
  public ResponseEntity<User> createUser(@RequestBody UserInput user)
    throws UserNotFoundException, UsernameExistsException, EmailExistsException {
    return created(fromCurrentRequestUri().path("/user/{username}").buildAndExpand(user.getUsername()).toUri())
      .body(userFacade.createUser(user));
  }

  @GetMapping("/{username}")
  @PreAuthorize("hasAnyAuthority('user:read')")
  public ResponseEntity<User> getUser(@PathVariable("username") String username) {
    return ok().body(userFacade.getUser(username));
  }

  @PatchMapping("/{username}")
  @PreAuthorize("hasAnyAuthority('user:update')")
  public ResponseEntity<User> patchUser(@PathVariable("username") String username, @RequestBody UserInput user)
    throws UserNotFoundException, UsernameExistsException, EmailExistsException {
    return ok().body(userFacade.updateUser(username, user));
  }

  @PutMapping("/{username}")
  @PreAuthorize("hasAnyAuthority('user:update')")
  public ResponseEntity<User> updateUser(@PathVariable("username") String username, @RequestBody UserInput user)
    throws UserNotFoundException, UsernameExistsException, EmailExistsException {
    return ok().body(userFacade.updateUser(username, user));
  }

  @DeleteMapping("/{username}")
  @PreAuthorize("hasAnyAuthority('user:delete')")
  public ResponseEntity<Void> deleteUser(@PathVariable("username") String username) {
    userFacade.deleteUser(username);
    return noContent().build();
  }
}
