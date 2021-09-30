package dev.kurama.api.core.facade;

import dev.kurama.api.core.hateoas.assembler.UserPreferencesModelAssembler;
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

  @NonNull
  private final UserPreferencesModelAssembler userPreferencesModelAssembler;


  public UserPreferencesModel findById(String userPreferencesId) {
    return userPreferencesModelAssembler.toModel(
      userPreferencesMapper.userPreferencesToUserPreferencesModel(
        userPreferencesService.findUserPreferencesById(userPreferencesId).orElseThrow()));
  }

  public UserPreferencesModel findByUsername(String username) {
    return userPreferencesModelAssembler.toModel(
      userPreferencesMapper.userPreferencesToUserPreferencesModel(
        userPreferencesService.findUserPreferencesByUsername(username).orElseThrow()));
  }

  public UserPreferencesModel updateById(String userPreferencesId, UserPreferencesInput userPreferencesInput) {
    return userPreferencesModelAssembler.toModel(
      userPreferencesMapper.userPreferencesToUserPreferencesModel(
        userPreferencesService.updateUserPreferences(userPreferencesId, userPreferencesInput)));
  }

  public UserPreferencesModel updateByUsername(String username, UserPreferencesInput userPreferencesInput) {
    return userPreferencesModelAssembler.toModel(
      userPreferencesMapper.userPreferencesToUserPreferencesModel(
        userPreferencesService.updateUserPreferencesByUsername(username, userPreferencesInput)));
  }
}
