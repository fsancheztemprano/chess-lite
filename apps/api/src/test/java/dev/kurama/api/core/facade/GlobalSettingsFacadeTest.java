package dev.kurama.api.core.facade;

import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import dev.kurama.api.core.domain.GlobalSettings;
import dev.kurama.api.core.exception.domain.not.found.RoleNotFoundException;
import dev.kurama.api.core.hateoas.input.GlobalSettingsUpdateInput;
import dev.kurama.api.core.hateoas.model.GlobalSettingsModel;
import dev.kurama.api.core.mapper.GlobalSettingsMapper;
import dev.kurama.api.core.service.GlobalSettingsService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class GlobalSettingsFacadeTest {

  @InjectMocks
  private GlobalSettingsFacade globalSettingsFacade;

  @Mock
  private GlobalSettingsService globalSettingsService;

  @Mock
  private GlobalSettingsMapper globalSettingsMapper;

  @Test
  void should_get_global_settings_from_service() {
    GlobalSettings globalSettings = GlobalSettings.builder().setRandomUUID().build();
    GlobalSettingsModel expected = GlobalSettingsModel.builder().build();
    when(globalSettingsService.getGlobalSettings()).thenReturn(globalSettings);
    when(globalSettingsMapper.globalSettingsToGlobalSettingsModel(globalSettings)).thenReturn(expected);

    GlobalSettingsModel actual = globalSettingsFacade.getGlobalSettings();

    verify(globalSettingsService).getGlobalSettings();
    verify(globalSettingsMapper).globalSettingsToGlobalSettingsModel(globalSettings);
    assertThat(actual).isNotNull().isEqualTo(expected);
  }

  @Test
  void should_update_global_settings_from_service() throws RoleNotFoundException {
    GlobalSettingsUpdateInput globalSettingsUpdateInput = GlobalSettingsUpdateInput.builder()
      .defaultRoleId(randomUUID())
      .build();
    GlobalSettings globalSettings = GlobalSettings.builder().setRandomUUID().build();
    GlobalSettingsModel expected = GlobalSettingsModel.builder().build();
    when(globalSettingsService.updateGlobalSettings(globalSettingsUpdateInput)).thenReturn(globalSettings);
    when(globalSettingsMapper.globalSettingsToGlobalSettingsModel(globalSettings)).thenReturn(expected);

    GlobalSettingsModel actual = globalSettingsFacade.updateGlobalSettings(globalSettingsUpdateInput);

    verify(globalSettingsService).updateGlobalSettings(globalSettingsUpdateInput);
    verify(globalSettingsMapper).globalSettingsToGlobalSettingsModel(globalSettings);
    assertThat(actual).isNotNull().isEqualTo(expected);
  }
}
