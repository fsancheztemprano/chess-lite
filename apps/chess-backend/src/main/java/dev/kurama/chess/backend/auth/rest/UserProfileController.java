package dev.kurama.chess.backend.auth.rest;

import static dev.kurama.chess.backend.auth.utility.AuthorityUtils.getCurrentUsername;
import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;
import static org.springframework.http.ResponseEntity.noContent;
import static org.springframework.http.ResponseEntity.ok;

import dev.kurama.chess.backend.auth.api.assembler.UserModelAssembler;
import dev.kurama.chess.backend.auth.api.domain.input.ChangeUserPasswordInput;
import dev.kurama.chess.backend.auth.api.domain.input.UpdateUserProfileInput;
import dev.kurama.chess.backend.auth.api.domain.model.UserModel;
import dev.kurama.chess.backend.auth.facade.UserFacade;
import java.io.IOException;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/user/profile")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class UserProfileController {

  @NonNull
  private final UserFacade userFacade;

  @NonNull
  private final UserModelAssembler userModelAssembler;

  @GetMapping()
  @PreAuthorize("hasAuthority('profile:read')")
  public ResponseEntity<UserModel> get() {
    return ok().body(userModelAssembler.toModel(userFacade.findByUsername(getCurrentUsername())));
  }

  @PatchMapping()
  @PreAuthorize("hasAuthority('profile:update') ")
  public ResponseEntity<UserModel> updateProfile(@RequestBody UpdateUserProfileInput updateUserProfileInput) {
    return ok()
      .body(userModelAssembler.toModel(userFacade.updateProfile(getCurrentUsername(), updateUserProfileInput)));
  }

  @PatchMapping("/password")
  @PreAuthorize("hasAuthority('profile:update')")
  public ResponseEntity<UserModel> changePassword(@RequestBody ChangeUserPasswordInput changeUserPasswordInput) {
    return ok()
      .body(userModelAssembler.toModel(userFacade.changePassword(getCurrentUsername(), changeUserPasswordInput)));
  }

  @PatchMapping(value = "/avatar", consumes = MULTIPART_FORM_DATA_VALUE)
  @PreAuthorize("hasAuthority('profile:update')")
  public ResponseEntity<Object> uploadAvatar(@RequestPart("avatar") MultipartFile avatar) throws IOException {
    return ok().body(userModelAssembler.toModel(userFacade.uploadAvatar(getCurrentUsername(), avatar)));
  }


  @DeleteMapping()
  @PreAuthorize("hasAuthority('profile:delete')")
  public ResponseEntity<Void> delete() {
    userFacade.deleteByUsername(getCurrentUsername());
    return noContent().build();
  }

}
