package dev.kurama.api.core.rest;

import static dev.kurama.api.core.constant.RestPathConstant.USER_PROFILE_PATH;
import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;
import static org.springframework.http.ResponseEntity.noContent;
import static org.springframework.http.ResponseEntity.ok;

import dev.kurama.api.core.exception.domain.exists.UserExistsException;
import dev.kurama.api.core.exception.domain.not.found.RoleNotFoundException;
import dev.kurama.api.core.exception.domain.not.found.UserNotFoundException;
import dev.kurama.api.core.facade.UserFacade;
import dev.kurama.api.core.facade.UserPreferencesFacade;
import dev.kurama.api.core.hateoas.input.ChangeUserPasswordInput;
import dev.kurama.api.core.hateoas.input.UserPreferencesInput;
import dev.kurama.api.core.hateoas.input.UserProfileUpdateInput;
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
@RequestMapping(USER_PROFILE_PATH)
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class UserProfileController {

  public static final String USER_PROFILE_CHANGE_PASSWORD_PATH = "/password";
  public static final String USER_PROFILE_UPLOAD_AVATAR_PATH = "/avatar";
  public static final String USER_PROFILE_PREFERENCES = "/preferences";

  @NonNull
  private final UserFacade userFacade;

  @NonNull
  private final UserPreferencesFacade userPreferencesFacade;

  @GetMapping()
  @PreAuthorize("hasAuthority(@ProfileAuthority.PROFILE_READ)")
  public ResponseEntity<UserModel> get() throws UserNotFoundException {
    return ok().body(userFacade.findByUserId(AuthorityUtils.getCurrentUserId()));
  }

  @PatchMapping()
  @PreAuthorize("hasAuthority(@ProfileAuthority.PROFILE_UPDATE) ")
  public ResponseEntity<UserModel> updateProfile(@RequestBody UserProfileUpdateInput userProfileUpdateInput)
    throws UserNotFoundException, RoleNotFoundException, UserExistsException {
    return ok().body(userFacade.updateProfile(AuthorityUtils.getCurrentUserId(), userProfileUpdateInput));
  }

  @PatchMapping(USER_PROFILE_CHANGE_PASSWORD_PATH)
  @PreAuthorize("hasAuthority(@ProfileAuthority.PROFILE_UPDATE)")
  public ResponseEntity<UserModel> changePassword(@RequestBody ChangeUserPasswordInput changeUserPasswordInput)
    throws UserNotFoundException, RoleNotFoundException, UserExistsException {
    return ok().body(userFacade.changePassword(AuthorityUtils.getCurrentUserId(), changeUserPasswordInput));
  }

  @PatchMapping(value = USER_PROFILE_UPLOAD_AVATAR_PATH, consumes = MULTIPART_FORM_DATA_VALUE)
  @PreAuthorize("hasAuthority(@ProfileAuthority.PROFILE_UPDATE)")
  public ResponseEntity<UserModel> uploadAvatar(@RequestPart("avatar") MultipartFile avatar)
    throws IOException, UserNotFoundException, RoleNotFoundException, UserExistsException {
    return ok().body(userFacade.uploadAvatar(AuthorityUtils.getCurrentUserId(), avatar));
  }

  @DeleteMapping()
  @PreAuthorize("hasAuthority(@ProfileAuthority.PROFILE_DELETE)")
  public ResponseEntity<Void> deleteProfile() throws UserNotFoundException {
    userFacade.deleteById(AuthorityUtils.getCurrentUserId());
    return noContent().build();
  }

  @GetMapping(USER_PROFILE_PREFERENCES)
  @PreAuthorize("hasAuthority(@ProfileAuthority.PROFILE_READ)")
  public ResponseEntity<UserPreferencesModel> getPreferences() throws UserNotFoundException {
    return ok().body(userPreferencesFacade.findByUserId(AuthorityUtils.getCurrentUserId()));
  }


  @PatchMapping(USER_PROFILE_PREFERENCES)
  @PreAuthorize("hasAuthority(@ProfileAuthority.PROFILE_UPDATE)")
  public ResponseEntity<UserPreferencesModel> updatePreferences(@RequestBody UserPreferencesInput userPreferencesInput)
    throws UserNotFoundException {
    return ResponseEntity.ok()
      .body(userPreferencesFacade.updateByUserId(AuthorityUtils.getCurrentUserId(), userPreferencesInput));
  }
}
