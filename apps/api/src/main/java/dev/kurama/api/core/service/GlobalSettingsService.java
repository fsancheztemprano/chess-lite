package dev.kurama.api.core.service;

import static dev.kurama.api.core.domain.GlobalSettings.UNIQUE_ID;
import static java.util.Optional.ofNullable;

import dev.kurama.api.core.authority.DefaultAuthority;
import dev.kurama.api.core.domain.GlobalSettings;
import dev.kurama.api.core.event.emitter.GlobalSettingsChangedEventEmitter;
import dev.kurama.api.core.exception.domain.not.found.RoleNotFoundException;
import dev.kurama.api.core.hateoas.input.GlobalSettingsUpdateInput;
import dev.kurama.api.core.repository.GlobalSettingsRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GlobalSettingsService {

  @NonNull
  private final GlobalSettingsRepository globalSettingsRepository;

  @NonNull
  private final GlobalSettingsChangedEventEmitter globalSettingsChangedEventEmitter;

  @NonNull
  private final RoleService roleService;

  public GlobalSettings getGlobalSettings() {
    return globalSettingsRepository.findById(UNIQUE_ID).orElseGet(this::createGlobalSettings);
  }

  public GlobalSettings updateGlobalSettings(GlobalSettingsUpdateInput globalSettingsUpdateInput)
    throws RoleNotFoundException {
    var globalSettings = getGlobalSettings();

    var changed = false;
    if (ofNullable(globalSettingsUpdateInput.getSignupOpen()).isPresent() && !globalSettingsUpdateInput.getSignupOpen()
      .equals(globalSettings.isSignupOpen())) {
      globalSettings.setSignupOpen(globalSettingsUpdateInput.getSignupOpen());
      changed = true;
    }

    if (ofNullable(globalSettingsUpdateInput.getDefaultRoleId()).isPresent()
      && !globalSettingsUpdateInput.getDefaultRoleId().equals(globalSettings.getDefaultRole().getId())) {
      var role = roleService.findRoleById(globalSettingsUpdateInput.getDefaultRoleId())
        .orElseThrow(() -> new RoleNotFoundException(globalSettingsUpdateInput.getDefaultRoleId()));
      globalSettings.setDefaultRole(role);
      changed = true;
    }

    if (changed) {
      globalSettings = globalSettingsRepository.saveAndFlush(globalSettings);
      globalSettingsChangedEventEmitter.emitGlobalSettingsUpdatedEvent();
    }
    return globalSettings;
  }

  private GlobalSettings createGlobalSettings() {
    var defaultRole = roleService.findByName(DefaultAuthority.DEFAULT_ROLE).orElseThrow();
    return this.globalSettingsRepository.saveAndFlush(
      GlobalSettings.builder().id(UNIQUE_ID).signupOpen(false).defaultRole(defaultRole).build());
  }
}
