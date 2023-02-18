package dev.kurama.api.core.rest;

import static dev.kurama.api.core.authority.ThemeAuthority.THEME_UPDATE;
import static dev.kurama.api.core.constant.RestPathConstant.THEME_PATH;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static dev.kurama.support.JsonUtils.asJsonString;
import static dev.kurama.support.TestConstant.MOCK_MVC_HOST;
import static dev.kurama.support.TestUtils.getAuthorizationHeader;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.doReturn;
import static org.springframework.hateoas.MediaTypes.HAL_FORMS_JSON_VALUE;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.kurama.api.core.domain.Theme;
import dev.kurama.api.core.facade.ThemeFacade;
import dev.kurama.api.core.hateoas.input.ThemeUpdateInput;
import dev.kurama.api.core.hateoas.processor.ThemeModelProcessor;
import dev.kurama.api.core.service.ThemeService;
import dev.kurama.api.core.utility.JWTTokenProvider;
import dev.kurama.support.ImportMappers;
import dev.kurama.support.ImportTestSecurityConfiguration;
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
@WebMvcTest(controllers = ThemeController.class)
@Import({ThemeFacade.class, ThemeModelProcessor.class})
@ImportMappers
class ThemeControllerIT {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private JWTTokenProvider jwtTokenProvider;

  @MockBean
  private ThemeService themeService;

  @Nested
  class GetThemeITs {


    @Test
    void should_get_theme() throws Exception {
      Theme expected = Theme.builder().primaryColor(randomUUID()).build();
      doReturn(expected).when(themeService).getTheme();

      mockMvc.perform(get(THEME_PATH).accept(HAL_FORMS_JSON_VALUE))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.primaryColor", equalTo(expected.getPrimaryColor())))
        .andExpect(jsonPath("$._links.*", hasSize(1)))
        .andExpect(jsonPath("$._links.self.href", equalTo(MOCK_MVC_HOST + THEME_PATH)))
        .andExpect(jsonPath("$._templates.*", hasSize(1)))
        .andExpect(jsonPath("$._templates.default.method", equalTo(HttpMethod.HEAD.toString())));
    }

    @Test
    void should_get_theme_with_update_template_given_update_theme_authority() throws Exception {
      Theme expected = Theme.builder().primaryColor(randomUUID()).build();
      doReturn(expected).when(themeService).getTheme();

      mockMvc.perform(
          get(THEME_PATH).accept(HAL_FORMS_JSON_VALUE).headers(getAuthorizationHeader(jwtTokenProvider, THEME_UPDATE)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$._templates.*", hasSize(2)))
        .andExpect(jsonPath("$._templates.default.method", equalTo(HttpMethod.HEAD.toString())))
        .andExpect(jsonPath("$._templates.update.method", equalTo(HttpMethod.PATCH.toString())));
    }
  }

  @Nested
  class UpdateThemeITs {

    private final ThemeUpdateInput input = ThemeUpdateInput.builder()
      .primaryColor(randomUUID())
      .accentColor(randomUUID())
      .warnColor(randomUUID())
      .build();

    @Test
    void should_return_forbidden_without_authentication() throws Exception {
      mockMvc.perform(patch(THEME_PATH).contentType(MediaType.APPLICATION_JSON).content(asJsonString(input)))
        .andExpect(status().isForbidden());
    }


    @Test
    void should_return_unauthorized_without_theme_update_authorization() throws Exception {
      mockMvc.perform(patch(THEME_PATH).headers(getAuthorizationHeader(jwtTokenProvider))
        .contentType(MediaType.APPLICATION_JSON)
        .content(asJsonString(input))).andExpect(status().isUnauthorized());
    }

    @Test
    void should_update_theme_given_theme_update_authority() throws Exception {
      Theme expected = Theme.builder().primaryColor(randomUUID()).build();
      doReturn(expected).when(themeService).updateTheme(input);

      mockMvc.perform(patch(THEME_PATH).contentType(MediaType.APPLICATION_JSON)
          .accept(HAL_FORMS_JSON_VALUE)
          .headers(getAuthorizationHeader(jwtTokenProvider, THEME_UPDATE))
          .content(asJsonString(input)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.primaryColor", equalTo(expected.getPrimaryColor())))
        .andExpect(jsonPath("$._links.*", hasSize(1)))
        .andExpect(jsonPath("$._links.self.href", equalTo(MOCK_MVC_HOST + THEME_PATH)))
        .andExpect(jsonPath("$._templates.*", hasSize(2)))
        .andExpect(jsonPath("$._templates.default.method", equalTo(HttpMethod.HEAD.toString())))
        .andExpect(jsonPath("$._templates.update.method", equalTo(HttpMethod.PATCH.toString())));
    }
  }
}
