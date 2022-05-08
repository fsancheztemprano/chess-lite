package dev.kurama.api.core.rest;

import static dev.kurama.api.core.constant.RestPathConstant.USER_PREFERENCES_PATH;

import dev.kurama.api.core.exception.domain.not.found.EntityNotFoundException;
import dev.kurama.api.core.facade.UserPreferencesFacade;
import dev.kurama.api.core.hateoas.input.UserPreferencesInput;
import dev.kurama.api.core.hateoas.model.UserPreferencesModel;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping(USER_PREFERENCES_PATH)
@PreAuthorize("isAuthenticated()")
public class UserPreferencesController {

  @NonNull
  private final UserPreferencesFacade userPreferencesFacade;


  @GetMapping("/{userPreferencesId}")
  @PreAuthorize("hasAuthority(@UserPreferencesAuthority.USER_PREFERENCES_READ)")
  public ResponseEntity<UserPreferencesModel> get(@PathVariable("userPreferencesId") String userPreferencesId)
    throws EntityNotFoundException {
    return ResponseEntity.ok().body(userPreferencesFacade.findById(userPreferencesId));
  }

  @PatchMapping("/{userPreferencesId}")
  @PreAuthorize("hasAuthority(@UserPreferencesAuthority.USER_PREFERENCES_UPDATE)")
  public ResponseEntity<UserPreferencesModel> update(@PathVariable("userPreferencesId") String userPreferencesId,
                                                     @RequestBody UserPreferencesInput userPreferencesInput)
    throws EntityNotFoundException {
    return ResponseEntity.ok().body(userPreferencesFacade.updateById(userPreferencesId, userPreferencesInput));
  }
}
