package dev.kurama.api.core.rest;

import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;
import static org.springframework.http.ResponseEntity.noContent;
import static org.springframework.http.ResponseEntity.ok;

import dev.kurama.api.core.facade.UserFacade;
import dev.kurama.api.core.facade.UserPreferencesFacade;
import dev.kurama.api.core.hateoas.input.ChangeUserPasswordInput;
import dev.kurama.api.core.hateoas.input.UpdateUserProfileInput;
import dev.kurama.api.core.hateoas.input.UserPreferencesInput;
import dev.kurama.api.core.hateoas.model.UserModel;
import dev.kurama.api.core.hateoas.model.UserPreferencesModel;
import dev.kurama.api.core.utility.AuthorityUtils;
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
  private final UserPreferencesFacade userPreferencesFacade;

  @GetMapping()
  @PreAuthorize("hasAuthority('profile:read')")
  public ResponseEntity<UserModel> get() {
    return ok().body(userFacade.findByUsername(AuthorityUtils.getCurrentUsername()));
  }

  @PatchMapping()
  @PreAuthorize("hasAuthority('profile:update') ")
  public ResponseEntity<UserModel> updateProfile(@RequestBody UpdateUserProfileInput updateUserProfileInput) {
    return ok()
      .body(userFacade.updateProfile(AuthorityUtils.getCurrentUsername(), updateUserProfileInput));
  }

  @PatchMapping("/password")
  @PreAuthorize("hasAuthority('profile:update')")
  public ResponseEntity<UserModel> changePassword(@RequestBody ChangeUserPasswordInput changeUserPasswordInput) {
    return ok()
      .body(userFacade.changePassword(AuthorityUtils.getCurrentUsername(), changeUserPasswordInput));
  }

  @PatchMapping(value = "/avatar", consumes = MULTIPART_FORM_DATA_VALUE)
  @PreAuthorize("hasAuthority('profile:update')")
  public ResponseEntity<Object> uploadAvatar(@RequestPart("avatar") MultipartFile avatar) throws IOException {
    return ok().body(userFacade.uploadAvatar(AuthorityUtils.getCurrentUsername(), avatar));
  }

  @DeleteMapping()
  @PreAuthorize("hasAuthority('profile:delete')")
  public ResponseEntity<Void> deleteProfile() {
    userFacade.deleteByUsername(AuthorityUtils.getCurrentUsername());
    return noContent().build();
  }

  @GetMapping("/preferences")
  @PreAuthorize("hasAuthority('profile:update')")
  public ResponseEntity<UserPreferencesModel> getPreferences() {
    return ok().body(userPreferencesFacade.findByUsername(AuthorityUtils.getCurrentUsername()));
  }


  @PatchMapping("/preferences")
  @PreAuthorize("hasAuthority('profile:update')")
  public ResponseEntity<UserPreferencesModel> updatePreferences(
    @RequestBody UserPreferencesInput userPreferencesInput) {
    return ResponseEntity.ok()
      .body(userPreferencesFacade.updateByUsername(AuthorityUtils.getCurrentUsername(), userPreferencesInput));
  }
}
