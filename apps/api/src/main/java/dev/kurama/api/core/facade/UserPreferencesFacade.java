package dev.kurama.api.core.facade;

import dev.kurama.api.core.hateoas.input.UserPreferencesInput;
import dev.kurama.api.core.hateoas.model.UserPreferencesModel;
import dev.kurama.api.core.mapper.UserPreferencesMapper;
import dev.kurama.api.core.service.UserPreferencesService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserPreferencesFacade {

  @NonNull
  private final UserPreferencesService userPreferencesService;

  @NonNull
  private final UserPreferencesMapper userPreferencesMapper;

  public UserPreferencesModel findById(String userPreferencesId) {
    return userPreferencesMapper.userPreferencesToUserPreferencesModel(
      userPreferencesService.findUserPreferencesById(userPreferencesId).orElseThrow());
  }

  public UserPreferencesModel updateById(String userPreferencesId, UserPreferencesInput userPreferencesInput) {
    return userPreferencesMapper.userPreferencesToUserPreferencesModel(
      userPreferencesService.updateUserPreferences(userPreferencesId, userPreferencesInput));
  }

  public UserPreferencesModel findByUserId(String userId) {
    return userPreferencesMapper.userPreferencesToUserPreferencesModel(
      userPreferencesService.findUserPreferencesByUserId(userId));
  }

  public UserPreferencesModel updateByUserId(String userId, UserPreferencesInput userPreferencesInput) {
    return userPreferencesMapper.userPreferencesToUserPreferencesModel(
      userPreferencesService.updateUserPreferencesByUserId(userId, userPreferencesInput));
  }
}
