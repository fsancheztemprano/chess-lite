package dev.kurama.api.core.facade;

import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import dev.kurama.api.core.domain.UserPreferences;
import dev.kurama.api.core.exception.domain.not.found.EntityNotFoundException;
import dev.kurama.api.core.hateoas.input.UserPreferencesInput;
import dev.kurama.api.core.hateoas.model.UserPreferencesModel;
import dev.kurama.api.core.mapper.UserPreferencesMapper;
import dev.kurama.api.core.service.UserPreferencesService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class UserPreferencesFacadeTest {

  @InjectMocks
  private UserPreferencesFacade userPreferencesFacade;

  @Mock
  private UserPreferencesService userPreferencesService;

  @Mock
  private UserPreferencesMapper userPreferencesMapper;

  @Test
  void should_find_by_id() throws EntityNotFoundException {
    UserPreferences preferences = UserPreferences.builder().setRandomUUID().darkMode(true).build();
    UserPreferencesModel expected = UserPreferencesModel.builder().id(preferences.getId()).darkMode(true).build();
    when(userPreferencesService.findUserPreferencesById(preferences.getId())).thenReturn(preferences);
    when(userPreferencesMapper.userPreferencesToUserPreferencesModel(preferences)).thenReturn(expected);

    UserPreferencesModel actual = userPreferencesFacade.findById(preferences.getId());

    verify(userPreferencesService).findUserPreferencesById(preferences.getId());
    verify(userPreferencesMapper).userPreferencesToUserPreferencesModel(preferences);
    assertEquals(expected, actual);
  }

  @Test
  void should_update_by_id() throws EntityNotFoundException {
    UserPreferencesInput input = UserPreferencesInput.builder().darkMode(true).build();
    UserPreferences preferences = UserPreferences.builder().setRandomUUID().darkMode(true).build();
    UserPreferencesModel expected = UserPreferencesModel.builder().id(preferences.getId()).darkMode(true).build();
    when(userPreferencesService.updateUserPreferences(preferences.getId(), input)).thenReturn(preferences);
    when(userPreferencesMapper.userPreferencesToUserPreferencesModel(preferences)).thenReturn(expected);

    UserPreferencesModel actual = userPreferencesFacade.updateById(preferences.getId(), input);

    verify(userPreferencesService).updateUserPreferences(preferences.getId(), input);
    verify(userPreferencesMapper).userPreferencesToUserPreferencesModel(preferences);
    assertEquals(expected, actual);
  }

  @Test
  void should_find_by_user_id() {
    String userId = randomUUID();
    UserPreferences preferences = UserPreferences.builder().setRandomUUID().darkMode(true).build();
    UserPreferencesModel expected = UserPreferencesModel.builder().id(preferences.getId()).darkMode(true).build();
    when(userPreferencesService.findUserPreferencesByUserId(userId)).thenReturn(preferences);
    when(userPreferencesMapper.userPreferencesToUserPreferencesModel(preferences)).thenReturn(expected);

    UserPreferencesModel actual = userPreferencesFacade.findByUserId(userId);

    verify(userPreferencesService).findUserPreferencesByUserId(userId);
    verify(userPreferencesMapper).userPreferencesToUserPreferencesModel(preferences);
    assertEquals(expected, actual);
  }

  @Test
  void should_update_by_user_id() {
    UserPreferencesInput input = UserPreferencesInput.builder().darkMode(true).build();
    UserPreferences preferences = UserPreferences.builder().setRandomUUID().darkMode(true).build();
    UserPreferencesModel expected = UserPreferencesModel.builder().id(preferences.getId()).darkMode(true).build();
    when(userPreferencesService.updateUserPreferencesByUserId(preferences.getId(), input)).thenReturn(preferences);
    when(userPreferencesMapper.userPreferencesToUserPreferencesModel(preferences)).thenReturn(expected);

    UserPreferencesModel actual = userPreferencesFacade.updateByUserId(preferences.getId(), input);

    verify(userPreferencesService).updateUserPreferencesByUserId(preferences.getId(), input);
    verify(userPreferencesMapper).userPreferencesToUserPreferencesModel(preferences);
    assertEquals(expected, actual);
  }
}
