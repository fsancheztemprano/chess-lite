package dev.kurama.api.core.rest;

import static dev.kurama.api.core.constant.RestPathConstant.GLOBAL_SETTINGS_PATH;
import static dev.kurama.api.support.JsonUtils.asJsonString;
import static org.hamcrest.Matchers.equalTo;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.kurama.api.core.exception.ExceptionHandlers;
import dev.kurama.api.core.exception.domain.not.found.RoleNotFoundException;
import dev.kurama.api.core.facade.GlobalSettingsFacade;
import dev.kurama.api.core.hateoas.input.GlobalSettingsUpdateInput;
import dev.kurama.api.core.hateoas.model.GlobalSettingsModel;
import dev.kurama.api.core.hateoas.model.RoleModel;
import dev.kurama.api.core.rest.GlobalSettingsControllerTest.GlobalSettingsControllerConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = {GlobalSettingsController.class})
@Import(GlobalSettingsControllerConfig.class)
class GlobalSettingsControllerTest {

  @Autowired
  private GlobalSettingsFacade facade;

  @Autowired
  private GlobalSettingsController controller;

  private MockMvc mockMvc;

  @BeforeEach
  void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(controller)
      .setControllerAdvice(new ExceptionHandlers())
      .build();
  }

  @Test
  void should_get_global_settings() throws Exception {
    GlobalSettingsModel expected = GlobalSettingsModel.builder()
      .defaultRole(RoleModel.builder()
        .id("r1")
        .canLogin(true)
        .build())
      .signupOpen(false)
      .build();
    when(facade.getGlobalSettings()).thenReturn(expected);

    mockMvc.perform(get(GLOBAL_SETTINGS_PATH))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.signupOpen", equalTo(expected.isSignupOpen())))
      .andExpect(jsonPath("$.defaultRole.id", equalTo(expected.getDefaultRole()
        .getId())))
      .andExpect(jsonPath("$.defaultRole.canLogin", equalTo(expected.getDefaultRole()
        .isCanLogin())));
  }

  @Nested
  class UpdateGlobalSettingsTests {

    @Test
    void should_update_global_settings() throws Exception {
      GlobalSettingsModel expected = GlobalSettingsModel.builder()
        .defaultRole(RoleModel.builder()
          .id("r1")
          .canLogin(true)
          .build())
        .signupOpen(false)
        .build();
      GlobalSettingsUpdateInput input = GlobalSettingsUpdateInput.builder()
        .signupOpen(false)
        .defaultRoleId("r1")
        .build();

      when(facade.updateGlobalSettings(input)).thenReturn(expected);

      mockMvc.perform(patch(GLOBAL_SETTINGS_PATH)
          .accept(MediaType.APPLICATION_JSON)
          .contentType(MediaType.APPLICATION_JSON)
          .content(asJsonString(input)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.signupOpen", equalTo(expected.isSignupOpen())))
        .andExpect(jsonPath("$.defaultRole.id", equalTo(expected.getDefaultRole()
          .getId())))
        .andExpect(jsonPath("$.defaultRole.canLogin", equalTo(expected.getDefaultRole()
          .isCanLogin())));
    }

    @Test
    void should_throw_when_updating_global_settings_role_not_found() throws Exception {
      GlobalSettingsUpdateInput input = GlobalSettingsUpdateInput.builder()
        .signupOpen(false)
        .defaultRoleId("r2")
        .build();
      when(facade.updateGlobalSettings(input)).thenThrow(RoleNotFoundException.class);

      mockMvc.perform(patch(GLOBAL_SETTINGS_PATH)
          .accept(MediaType.APPLICATION_JSON)
          .contentType(MediaType.APPLICATION_JSON)
          .content(asJsonString(input)))
        .andExpect(status().isNotFound());
    }
  }

  @TestConfiguration
  protected static class GlobalSettingsControllerConfig {

    @Bean
    public GlobalSettingsFacade globalSettingsFacade() {
      return Mockito.mock(GlobalSettingsFacade.class);
    }
  }
}
