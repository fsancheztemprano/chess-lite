package dev.kurama.api.core.rest;

import static org.springframework.beans.support.PagedListHolder.DEFAULT_PAGE_SIZE;
import static org.springframework.http.ResponseEntity.created;
import static org.springframework.http.ResponseEntity.noContent;
import static org.springframework.http.ResponseEntity.ok;
import static org.springframework.web.servlet.support.ServletUriComponentsBuilder.fromCurrentRequestUri;

import dev.kurama.api.core.api.domain.input.UserInput;
import dev.kurama.api.core.api.domain.model.UserModel;
import dev.kurama.api.core.exception.domain.EmailExistsException;
import dev.kurama.api.core.exception.domain.RoleNotFoundException;
import dev.kurama.api.core.exception.domain.UserNotFoundException;
import dev.kurama.api.core.exception.domain.UsernameExistsException;
import dev.kurama.api.core.facade.UserFacade;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class UserController {

  @NonNull
  private final UserFacade userFacade;

  @GetMapping("/{userId}")
  @PreAuthorize("hasAuthority('user:read')")
  public ResponseEntity<UserModel> get(@PathVariable("userId") String userId) {
    return ok().body(userFacade.findByUserId(userId));
  }

  @GetMapping()
  @PreAuthorize("hasAuthority('user:read')")
  public ResponseEntity<PagedModel<UserModel>> getAll(
    @PageableDefault(page = 0, size = DEFAULT_PAGE_SIZE) Pageable pageable) {
    return ok().body(userFacade.getAll(pageable));
  }

  @PostMapping()
  @PreAuthorize("hasAuthority('user:create')")
  public ResponseEntity<UserModel> create(@RequestBody UserInput userInput)
    throws UsernameExistsException, EmailExistsException {
    UserModel newUser = userFacade.create(userInput);
    return created(fromCurrentRequestUri().path("/user/{userId}").buildAndExpand(newUser.getId()).toUri())
      .body(newUser);
  }

  @PatchMapping("/{userId}")
  @PreAuthorize("hasAuthority('user:update')")
  public ResponseEntity<UserModel> update(@PathVariable("userId") String userId, @RequestBody UserInput userInput)
    throws UserNotFoundException, UsernameExistsException, EmailExistsException, RoleNotFoundException {
    return ok().body(userFacade.update(userId, userInput));
  }

  @DeleteMapping("/{userId}")
  @PreAuthorize("hasAuthority('user:delete')")
  public ResponseEntity<Void> delete(@PathVariable("userId") String userId) {
    userFacade.deleteById(userId);
    return noContent().build();
  }
}
