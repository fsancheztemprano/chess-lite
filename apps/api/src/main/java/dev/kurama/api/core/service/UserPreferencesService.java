package dev.kurama.api.core.service;

import static org.springframework.data.mapping.Alias.ofNullable;

import dev.kurama.api.core.domain.UserPreferences;
import dev.kurama.api.core.event.emitter.UserPreferencesChangedEventEmitter;
import dev.kurama.api.core.exception.domain.not.found.EntityNotFoundException;
import dev.kurama.api.core.exception.domain.not.found.UserNotFoundException;
import dev.kurama.api.core.hateoas.input.UserPreferencesInput;
import dev.kurama.api.core.repository.UserPreferencesRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserPreferencesService {

  @NonNull
  private final UserPreferencesRepository userPreferencesRepository;

  @NonNull
  private final UserPreferencesChangedEventEmitter userPreferencesChangedEventEmitter;


  public UserPreferences findUserPreferencesById(String userPreferencesId) throws EntityNotFoundException {
    return userPreferencesRepository.findById(userPreferencesId)
      .orElseThrow(() -> new EntityNotFoundException(userPreferencesId, UserPreferences.class));
  }

  public UserPreferences updateUserPreferences(String userPreferencesId, UserPreferencesInput userPreferencesInput)
    throws EntityNotFoundException {
    var userPreferences = findUserPreferencesById(userPreferencesId);
    return patchUserPreferences(userPreferences, userPreferencesInput);
  }

  public UserPreferences findUserPreferencesByUserId(String userId) throws UserNotFoundException {
    return userPreferencesRepository.findUserPreferencesByUserId(userId)
      .orElseThrow(() -> new UserNotFoundException(userId));
  }

  public UserPreferences updateUserPreferencesByUserId(String username, UserPreferencesInput userPreferencesInput)
    throws UserNotFoundException {
    var userPreferences = findUserPreferencesByUserId(username);
    return patchUserPreferences(userPreferences, userPreferencesInput);
  }

  public UserPreferences patchUserPreferences(UserPreferences userPreferences,
                                              UserPreferencesInput userPreferencesInput) {
    var changes = false;
    if (ofNullable(userPreferencesInput.getDarkMode()).isPresent() && !userPreferencesInput.getDarkMode()
      .equals(userPreferences.isDarkMode())) {
      userPreferences.setDarkMode(userPreferencesInput.getDarkMode());
      changes = true;
    }
    if (ofNullable(userPreferencesInput.getContentLanguage()).isPresent() && !userPreferencesInput.getContentLanguage()
      .equals(userPreferences.getContentLanguage())) {
      userPreferences.setContentLanguage(userPreferencesInput.getContentLanguage());
      changes = true;
    }
    if (changes) {
      userPreferences = userPreferencesRepository.save(userPreferences);
      userPreferencesChangedEventEmitter.emitUserPreferencesUpdatedEvent(userPreferences.getId());
    }
    return userPreferences;
  }
}
