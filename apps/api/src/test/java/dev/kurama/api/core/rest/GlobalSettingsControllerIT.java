package dev.kurama.api.core.rest;

import static dev.kurama.api.core.authority.GlobalSettingsAuthority.GLOBAL_SETTINGS_READ;
import static dev.kurama.api.core.authority.GlobalSettingsAuthority.GLOBAL_SETTINGS_UPDATE;
import static dev.kurama.api.core.constant.RestPathConstant.GLOBAL_SETTINGS_PATH;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static dev.kurama.api.support.JsonUtils.asJsonString;
import static dev.kurama.api.support.TestConstant.MOCK_MVC_HOST;
import static dev.kurama.api.support.TestUtils.getAuthorizationHeader;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.doReturn;
import static org.springframework.hateoas.MediaTypes.HAL_FORMS_JSON_VALUE;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.kurama.api.core.domain.GlobalSettings;
import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.facade.GlobalSettingsFacade;
import dev.kurama.api.core.hateoas.input.GlobalSettingsUpdateInput;
import dev.kurama.api.core.hateoas.processor.GlobalSettingsModelProcessor;
import dev.kurama.api.core.service.GlobalSettingsService;
import dev.kurama.api.core.utility.JWTTokenProvider;
import dev.kurama.api.support.ImportMappers;
import dev.kurama.api.support.ImportTestSecurityConfiguration;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;


@ImportTestSecurityConfiguration
@WebMvcTest(controllers = GlobalSettingsController.class)
@Import({GlobalSettingsFacade.class, GlobalSettingsModelProcessor.class})
@ImportMappers
class GlobalSettingsControllerIT {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private JWTTokenProvider jwtTokenProvider;

  @MockBean
  private GlobalSettingsService globalSettingsService;

  @Nested
  class GetGlobalSettingsITs {

    @Test
    void should_return_forbidden_without_authentication() throws Exception {
      mockMvc.perform(get(GLOBAL_SETTINGS_PATH)).andExpect(status().isForbidden());
    }


    @Test
    void should_return_unauthorized_without_global_settings_read_authorization() throws Exception {
      mockMvc.perform(get(GLOBAL_SETTINGS_PATH).headers(getAuthorizationHeader(jwtTokenProvider, "MOCK:AUTH")))
        .andExpect(status().isUnauthorized());
    }

    @Test
    void should_get_global_settings() throws Exception {
      GlobalSettings expected = GlobalSettings.builder()
        .setRandomUUID()
        .signupOpen(false)
        .defaultRole(Role.builder().setRandomUUID().build())
        .build();
      doReturn(expected).when(globalSettingsService).getGlobalSettings();

      mockMvc.perform(get(GLOBAL_SETTINGS_PATH).accept(HAL_FORMS_JSON_VALUE)
          .headers(getAuthorizationHeader(jwtTokenProvider, GLOBAL_SETTINGS_READ)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.signupOpen", equalTo(expected.isSignupOpen())))
        .andExpect(jsonPath("$.defaultRole.id", equalTo(expected.getDefaultRole().getId())))
        .andExpect(jsonPath("$._links.*", hasSize(1)))
        .andExpect(jsonPath("$._links.self.href", equalTo(MOCK_MVC_HOST + GLOBAL_SETTINGS_PATH)))
        .andExpect(jsonPath("$._templates.*", hasSize(1)))
        .andExpect(jsonPath("$._templates.default.method", equalTo(HttpMethod.HEAD.toString())));
    }

    @Test
    void should_get_global_settings_with_update_template_given_update_global_settings_authority() throws Exception {
      GlobalSettings expected = GlobalSettings.builder()
        .setRandomUUID()
        .signupOpen(false)
        .defaultRole(Role.builder().setRandomUUID().build())
        .build();
      doReturn(expected).when(globalSettingsService).getGlobalSettings();

      mockMvc.perform(get(GLOBAL_SETTINGS_PATH).accept(HAL_FORMS_JSON_VALUE)
          .headers(getAuthorizationHeader(jwtTokenProvider, GLOBAL_SETTINGS_READ, GLOBAL_SETTINGS_UPDATE)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$._templates.*", hasSize(2)))
        .andExpect(jsonPath("$._templates.default.method", equalTo(HttpMethod.HEAD.toString())))
        .andExpect(jsonPath("$._templates.update.method", equalTo(HttpMethod.PATCH.toString())));
    }
  }

  @Nested
  class UpdateGlobalSettingsITs {

    private final GlobalSettingsUpdateInput input = GlobalSettingsUpdateInput.builder()
      .signupOpen(true)
      .defaultRoleId(randomUUID())
      .build();

    @Test
    void should_return_forbidden_without_authentication() throws Exception {
      mockMvc.perform(patch(GLOBAL_SETTINGS_PATH).contentType(MediaType.APPLICATION_JSON).content(asJsonString(input)))
        .andExpect(status().isForbidden());
    }


    @Test
    void should_return_unauthorized_without_global_settings_update_authorization() throws Exception {
      mockMvc.perform(
        patch(GLOBAL_SETTINGS_PATH).headers(getAuthorizationHeader(jwtTokenProvider, GLOBAL_SETTINGS_READ))
          .contentType(MediaType.APPLICATION_JSON)
          .content(asJsonString(input))).andExpect(status().isUnauthorized());
    }

    @Test
    void should_update_global_settings_given_global_settings_update_authority() throws Exception {
      GlobalSettings expected = GlobalSettings.builder()
        .setRandomUUID()
        .signupOpen(false)
        .defaultRole(Role.builder().id(input.getDefaultRoleId()).build())
        .build();
      doReturn(expected).when(globalSettingsService).updateGlobalSettings(input);

      mockMvc.perform(patch(GLOBAL_SETTINGS_PATH).contentType(MediaType.APPLICATION_JSON)
          .accept(HAL_FORMS_JSON_VALUE)
          .headers(getAuthorizationHeader(jwtTokenProvider, GLOBAL_SETTINGS_READ, GLOBAL_SETTINGS_UPDATE))
          .content(asJsonString(input)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.signupOpen", equalTo(expected.isSignupOpen())))
        .andExpect(jsonPath("$.defaultRole.id", equalTo(expected.getDefaultRole().getId())))
        .andExpect(jsonPath("$._links.*", hasSize(1)))
        .andExpect(jsonPath("$._links.self.href", equalTo(MOCK_MVC_HOST + GLOBAL_SETTINGS_PATH)))
        .andExpect(jsonPath("$._templates.*", hasSize(2)))
        .andExpect(jsonPath("$._templates.default.method", equalTo(HttpMethod.HEAD.toString())))
        .andExpect(jsonPath("$._templates.update.method", equalTo(HttpMethod.PATCH.toString())));
    }
  }
}
