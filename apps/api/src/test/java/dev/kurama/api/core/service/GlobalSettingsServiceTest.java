package dev.kurama.api.core.service;

import static dev.kurama.api.core.domain.GlobalSettings.UNIQUE_ID;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import dev.kurama.api.core.domain.GlobalSettings;
import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.event.emitter.GlobalSettingsChangedEventEmitter;
import dev.kurama.api.core.exception.domain.not.found.RoleNotFoundException;
import dev.kurama.api.core.hateoas.input.GlobalSettingsUpdateInput;
import dev.kurama.api.core.repository.GlobalSettingsRepository;
import java.util.Optional;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class GlobalSettingsServiceTest {

  @InjectMocks
  private GlobalSettingsService globalSettingsService;

  @Mock
  private GlobalSettingsRepository globalSettingsRepository;

  @Mock
  private GlobalSettingsChangedEventEmitter globalSettingsChangedEventEmitter;

  @Mock
  private RoleService roleService;

  @Test
  void should_get_global_settings() {
    GlobalSettings globalSettings = GlobalSettings.builder()
      .setRandomUUID()
      .build();
    when(globalSettingsRepository.findById(UNIQUE_ID)).thenReturn(Optional.of(globalSettings));

    GlobalSettings actual = globalSettingsService.getGlobalSettings();

    verify(globalSettingsRepository).findById(UNIQUE_ID);
    assertEquals(globalSettings, actual);
  }

  @Nested
  class UpdateGlobalSettingsTests {

    @Test
    void should_update_global_settings_signup_open() throws RoleNotFoundException {
      Role defaultRole = Role.builder()
        .setRandomUUID()
        .name("role")
        .build();
      GlobalSettings globalSettings = GlobalSettings.builder()
        .setRandomUUID()
        .signupOpen(false)
        .defaultRole(defaultRole)
        .build();
      GlobalSettingsUpdateInput input = GlobalSettingsUpdateInput.builder()
        .signupOpen(true)
        .build();
      when(globalSettingsRepository.findById(UNIQUE_ID)).thenReturn(Optional.of(globalSettings));
      when(globalSettingsRepository.saveAndFlush(globalSettings)).thenReturn(globalSettings);

      GlobalSettings actual = globalSettingsService.updateGlobalSettings(input);

      verify(globalSettingsChangedEventEmitter).emitGlobalSettingsUpdatedEvent();
      verify(globalSettingsRepository).saveAndFlush(globalSettings);
      verifyNoInteractions(roleService);
      assertThat(actual).isNotNull();
      assertThat(actual.isSignupOpen()).isTrue();
    }

    @Test
    void should_update_global_settings_default_role() throws RoleNotFoundException {
      Role role1 = Role.builder()
        .setRandomUUID()
        .name("role1")
        .build();
      Role role2 = Role.builder()
        .setRandomUUID()
        .name("role2")
        .build();
      GlobalSettings globalSettings = GlobalSettings.builder()
        .setRandomUUID()
        .signupOpen(false)
        .defaultRole(role1)
        .build();
      GlobalSettingsUpdateInput input = GlobalSettingsUpdateInput.builder()
        .defaultRoleId(role2.getId())
        .build();
      when(globalSettingsRepository.findById(UNIQUE_ID)).thenReturn(Optional.of(globalSettings));
      when(globalSettingsRepository.saveAndFlush(globalSettings)).thenReturn(globalSettings);
      when(roleService.findRoleById(role2.getId())).thenReturn(Optional.of(role2));

      GlobalSettings actual = globalSettingsService.updateGlobalSettings(input);

      verify(globalSettingsChangedEventEmitter).emitGlobalSettingsUpdatedEvent();
      verify(globalSettingsRepository).saveAndFlush(globalSettings);
      assertThat(actual).isNotNull();
      assertThat(actual.getDefaultRole()).isNotNull();
      assertEquals(actual.getDefaultRole()
        .getId(), role2.getId());
    }

    @Test
    void should_not_save_nor_emit_event_if_global_settings_did_not_change() throws RoleNotFoundException {
      Role defaultRole = Role.builder()
        .setRandomUUID()
        .name("role")
        .build();
      GlobalSettings globalSettings = GlobalSettings.builder()
        .setRandomUUID()
        .signupOpen(false)
        .defaultRole(defaultRole)
        .build();
      GlobalSettingsUpdateInput input = GlobalSettingsUpdateInput.builder()
        .signupOpen(false)
        .defaultRoleId(defaultRole.getId())
        .build();
      when(globalSettingsRepository.findById(UNIQUE_ID)).thenReturn(Optional.of(globalSettings));

      globalSettingsService.updateGlobalSettings(input);

      verifyNoInteractions(roleService, globalSettingsChangedEventEmitter);
      verify(globalSettingsRepository, never()).saveAndFlush(any());
    }
  }
}
