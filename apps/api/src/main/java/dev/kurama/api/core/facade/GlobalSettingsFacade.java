package dev.kurama.api.core.facade;

import dev.kurama.api.core.exception.domain.not.found.RoleNotFoundException;
import dev.kurama.api.core.hateoas.input.GlobalSettingsUpdateInput;
import dev.kurama.api.core.hateoas.model.GlobalSettingsModel;
import dev.kurama.api.core.mapper.GlobalSettingsMapper;
import dev.kurama.api.core.service.GlobalSettingsService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GlobalSettingsFacade {

  @NonNull
  private final GlobalSettingsService globalSettingsService;

  @NonNull
  private final GlobalSettingsMapper globalSettingsMapper;

  public GlobalSettingsModel getGlobalSettings() {
    return globalSettingsMapper.globalSettingsToGlobalSettingsModel(globalSettingsService.getGlobalSettings());
  }

  public GlobalSettingsModel updateGlobalSettings(GlobalSettingsUpdateInput globalSettingsUpdateInput)
    throws RoleNotFoundException {
    return globalSettingsMapper.globalSettingsToGlobalSettingsModel(
      globalSettingsService.updateGlobalSettings(globalSettingsUpdateInput));
  }
}
