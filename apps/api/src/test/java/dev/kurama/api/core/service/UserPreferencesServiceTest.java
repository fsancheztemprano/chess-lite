package dev.kurama.api.core.service;

import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import dev.kurama.api.core.domain.UserPreferences;
import dev.kurama.api.core.event.emitter.UserPreferencesChangedEventEmitter;
import dev.kurama.api.core.exception.domain.not.found.DomainEntityNotFoundException;
import dev.kurama.api.core.hateoas.input.UserPreferencesInput;
import dev.kurama.api.core.repository.UserPreferencesRepository;
import java.util.Optional;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class UserPreferencesServiceTest {

  @Spy
  @InjectMocks
  private UserPreferencesService userPreferencesService;

  @Mock
  private UserPreferencesRepository userPreferencesRepository;

  @Mock
  private UserPreferencesChangedEventEmitter userPreferencesChangedEventEmitter;

  @Nested
  class FindUserPreferencesByIdTests {

    @Test
    void should_find_user_preferences_by_id() throws DomainEntityNotFoundException {
      String userPreferencesId = randomUUID();
      UserPreferences expected = UserPreferences.builder().setRandomUUID().build();
      when(userPreferencesRepository.findById(userPreferencesId)).thenReturn(Optional.of(expected));

      UserPreferences actual = userPreferencesService.findUserPreferencesById(userPreferencesId);

      verify(userPreferencesRepository).findById(userPreferencesId);
      assertEquals(expected, actual);
    }

    @Test
    void should_throw_if_user_preferences_is_not_found() {
      String userPreferencesId = randomUUID();
      when(userPreferencesRepository.findById(userPreferencesId)).thenReturn(Optional.empty());

      assertThrows(DomainEntityNotFoundException.class,
        () -> userPreferencesService.findUserPreferencesById(userPreferencesId));
    }
  }


  @Test
  void update_user_preferences() throws DomainEntityNotFoundException {
    UserPreferencesInput input = UserPreferencesInput.builder().darkMode(false).build();
    String userPreferencesId = randomUUID();
    UserPreferences expected = UserPreferences.builder().setRandomUUID().darkMode(true).build();
    when(userPreferencesRepository.findById(userPreferencesId)).thenReturn(Optional.of(expected));
    doReturn(expected).when(userPreferencesService).patchUserPreferences(expected, input);

    UserPreferences actual = userPreferencesService.updateUserPreferences(userPreferencesId, input);

    verify(userPreferencesRepository).findById(userPreferencesId);
    verify(userPreferencesService).patchUserPreferences(expected, input);
    assertEquals(expected, actual);
  }

  @Nested
  class FindUserPreferencesByUserIdTests {

    @Test
    void should_find_user_preferences_by_user_id() {
      String userId = randomUUID();
      UserPreferences expected = UserPreferences.builder().setRandomUUID().build();
      when(userPreferencesRepository.findUserPreferencesByUserId(userId)).thenReturn(Optional.of(expected));

      UserPreferences actual = userPreferencesService.findUserPreferencesByUserId(userId);

      verify(userPreferencesRepository).findUserPreferencesByUserId(userId);
      assertEquals(expected, actual);
    }

    @Test
    void find_user_preferences_by_user_id_should_throw_when_user_not_found() {
      String userId = randomUUID();
      when(userPreferencesRepository.findUserPreferencesByUserId(userId)).thenReturn(Optional.empty());

      assertThrows(UsernameNotFoundException.class, () -> userPreferencesService.findUserPreferencesByUserId(userId));
    }
  }

  @Test
  void update_user_preferences_by_user_id() {
    UserPreferencesInput input = UserPreferencesInput.builder().darkMode(false).build();
    String userId = randomUUID();
    UserPreferences expected = UserPreferences.builder().setRandomUUID().darkMode(true).build();
    when(userPreferencesRepository.findUserPreferencesByUserId(userId)).thenReturn(Optional.of(expected));
    doReturn(expected).when(userPreferencesService).patchUserPreferences(expected, input);

    UserPreferences actual = userPreferencesService.updateUserPreferencesByUserId(userId, input);

    verify(userPreferencesRepository).findUserPreferencesByUserId(userId);
    verify(userPreferencesService).patchUserPreferences(expected, input);
    assertEquals(expected, actual);
  }


  @Nested
  class PatchUserPreferencesTests {

    @Test
    void updateGlobalSettings() {
      UserPreferences expected = UserPreferences.builder().setRandomUUID().darkMode(true).contentLanguage("en").build();
      UserPreferencesInput input = UserPreferencesInput.builder().darkMode(false).contentLanguage("de").build();
      when(userPreferencesRepository.save(expected)).thenReturn(expected);

      UserPreferences actual = userPreferencesService.patchUserPreferences(expected, input);

      verify(userPreferencesRepository).save(expected);
      verify(userPreferencesChangedEventEmitter).emitUserPreferencesUpdatedEvent(expected.getId());
      assertThat(actual).isNotNull();
      assertThat(actual.isDarkMode()).isEqualTo(expected.isDarkMode());
      assertThat(actual.getContentLanguage()).isEqualTo(expected.getContentLanguage());
    }

    @Test
    void should_not_save_nor_emit_event_if_user_preferences_did_not_change() {
      UserPreferences expected = UserPreferences.builder().setRandomUUID().darkMode(true).contentLanguage("en").build();
      UserPreferencesInput input = UserPreferencesInput.builder()
        .darkMode(expected.isDarkMode())
        .contentLanguage(expected.getContentLanguage())
        .build();

      UserPreferences actual = userPreferencesService.patchUserPreferences(expected, input);

      verifyNoInteractions(userPreferencesRepository, userPreferencesChangedEventEmitter);
      assertEquals(expected, actual);

    }
  }
}
