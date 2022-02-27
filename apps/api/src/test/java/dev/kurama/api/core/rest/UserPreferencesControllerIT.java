package dev.kurama.api.core.rest;

import static dev.kurama.api.core.authority.UserAuthority.PROFILE_READ;
import static dev.kurama.api.core.authority.UserAuthority.PROFILE_UPDATE;
import static dev.kurama.api.core.authority.UserPreferencesAuthority.USER_PREFERENCES_READ;
import static dev.kurama.api.core.authority.UserPreferencesAuthority.USER_PREFERENCES_UPDATE;
import static dev.kurama.api.core.constant.RestPathConstant.USER_PATH;
import static dev.kurama.api.core.constant.RestPathConstant.USER_PREFERENCES_PATH;
import static dev.kurama.api.core.constant.RestPathConstant.USER_PROFILE_PATH;
import static dev.kurama.api.core.rest.UserProfileController.USER_PROFILE_PREFERENCES;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static dev.kurama.api.support.JsonUtils.asJsonString;
import static dev.kurama.api.support.TestConstant.MOCK_MVC_HOST;
import static dev.kurama.api.support.TestUtils.getAuthorizationHeader;
import static java.lang.String.format;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.doReturn;
import static org.springframework.hateoas.MediaTypes.HAL_FORMS_JSON_VALUE;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.domain.UserPreferences;
import dev.kurama.api.core.facade.UserPreferencesFacade;
import dev.kurama.api.core.hateoas.input.UserPreferencesInput;
import dev.kurama.api.core.hateoas.processor.UserPreferencesModelProcessor;
import dev.kurama.api.core.service.UserPreferencesService;
import dev.kurama.api.core.utility.JWTTokenProvider;
import dev.kurama.api.support.ImportMappers;
import dev.kurama.api.support.ImportTestSecurityConfiguration;
import dev.kurama.api.support.MockAuthorizedUser;
import org.junit.jupiter.api.BeforeEach;
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
@WebMvcTest(controllers = UserPreferencesController.class)
@Import({UserPreferencesFacade.class, UserPreferencesModelProcessor.class})
@ImportMappers
class UserPreferencesControllerIT {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private JWTTokenProvider jwtTokenProvider;

  @MockBean
  private UserPreferencesService userPreferencesService;

  private UserPreferences expected;

  @BeforeEach
  void setUp() {
    expected = UserPreferences.builder()
      .setRandomUUID()
      .darkMode(false)
      .contentLanguage("es")
      .user(User.builder().setRandomUUID().username(randomUUID()).build())
      .build();
  }

  @Nested
  class GetUserPreferencesITs {

    @Test
    void should_return_forbidden_without_authentication() throws Exception {
      mockMvc.perform(get(USER_PREFERENCES_PATH + "/id")).andExpect(status().isForbidden());
    }

    @Test
    void should_return_unauthorized_without_user_preferences_read_authority() throws Exception {
      mockMvc.perform(get(USER_PREFERENCES_PATH + "/id").headers(getAuthorizationHeader(jwtTokenProvider, "MOCK:AUTH")))
        .andExpect(status().isUnauthorized());
    }

    @Test
    void should_get_user_preferences() throws Exception {
      doReturn(expected).when(userPreferencesService).findUserPreferencesById(expected.getId());

      mockMvc.perform(get(format("%s/%s", USER_PREFERENCES_PATH, expected.getId())).accept(HAL_FORMS_JSON_VALUE)
          .headers(getAuthorizationHeader(jwtTokenProvider, USER_PREFERENCES_READ)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", equalTo(expected.getId())))
        .andExpect(jsonPath("$.darkMode", equalTo(expected.isDarkMode())))
        .andExpect(jsonPath("$.contentLanguage", equalTo(expected.getContentLanguage())))
        .andExpect(jsonPath("$._links.*", hasSize(2)))
        .andExpect(jsonPath("$._links.self.href",
          equalTo(MOCK_MVC_HOST + format("%s/%s", USER_PREFERENCES_PATH, expected.getId()))))
        .andExpect(jsonPath("$._links.user.href",
          equalTo(MOCK_MVC_HOST + format("%s/%s", USER_PATH, expected.getUser().getId()))))
        .andExpect(jsonPath("$._templates.*", hasSize(1)))
        .andExpect(jsonPath("$._templates.default.method", equalTo(HttpMethod.HEAD.toString())));
    }

    @Test
    void should_get_user_preferences_with_update_template_given_user_preferences_update_authority() throws Exception {
      doReturn(expected).when(userPreferencesService).findUserPreferencesById(expected.getId());

      mockMvc.perform(get(format("%s/%s", USER_PREFERENCES_PATH, expected.getId())).accept(HAL_FORMS_JSON_VALUE)
          .headers(getAuthorizationHeader(jwtTokenProvider, USER_PREFERENCES_READ, USER_PREFERENCES_UPDATE)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", equalTo(expected.getId())))
        .andExpect(jsonPath("$._templates.*", hasSize(2)))
        .andExpect(jsonPath("$._templates.default.method", equalTo(HttpMethod.HEAD.toString())))
        .andExpect(jsonPath("$._templates.update.method", equalTo(HttpMethod.PATCH.toString())));
    }

    @Test
    void should_get_user_preferences_with_user_profile_link_given_profile_read_authority() throws Exception {
      doReturn(expected).when(userPreferencesService).findUserPreferencesById(expected.getId());

      mockMvc.perform(get(format("%s/%s", USER_PREFERENCES_PATH, expected.getId())).accept(HAL_FORMS_JSON_VALUE)
          .headers(MockAuthorizedUser.builder()
            .username(expected.getUser().getUsername())
            .authorities(USER_PREFERENCES_READ, PROFILE_READ)
            .buildAuthorizationHeader(jwtTokenProvider)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", equalTo(expected.getId())))
        .andExpect(jsonPath("$._links.*", hasSize(2)))
        .andExpect(jsonPath("$._links.self.href",
          equalTo(MOCK_MVC_HOST + format("%s/%s", USER_PREFERENCES_PATH, expected.getId()))))
        .andExpect(jsonPath("$._links.current-user.href", equalTo(MOCK_MVC_HOST + USER_PROFILE_PATH)));
    }

    @Test
    void should_get_user_preferences_with_update_profile_preferences_template_given_profile_update_authority()
      throws Exception {
      doReturn(expected).when(userPreferencesService).findUserPreferencesById(expected.getId());

      mockMvc.perform(get(format("%s/%s", USER_PREFERENCES_PATH, expected.getId())).accept(HAL_FORMS_JSON_VALUE)
          .headers(MockAuthorizedUser.builder()
            .username(expected.getUser().getUsername())
            .authorities(USER_PREFERENCES_READ, PROFILE_UPDATE)
            .buildAuthorizationHeader(jwtTokenProvider)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", equalTo(expected.getId())))
        .andExpect(jsonPath("$._links.*", hasSize(2)))
        .andExpect(jsonPath("$._templates.*", hasSize(2)))
        .andExpect(jsonPath("$._templates.default.method", equalTo(HttpMethod.HEAD.toString())))
        .andExpect(jsonPath("$._templates.updatePreferences.method", equalTo(HttpMethod.PATCH.toString())))
        .andExpect(jsonPath("$._templates.updatePreferences.target",
          equalTo(MOCK_MVC_HOST + USER_PROFILE_PATH + USER_PROFILE_PREFERENCES)));
    }
  }

  @Nested
  class UpdateUserPreferencesITs {

    UserPreferencesInput input = UserPreferencesInput.builder().contentLanguage("jp").darkMode(true).build();

    @Test
    void should_return_forbidden_without_authentication() throws Exception {
      mockMvc.perform(
          patch(USER_PREFERENCES_PATH + "/id").contentType(MediaType.APPLICATION_JSON).content(asJsonString(input)))
        .andExpect(status().isForbidden());
    }

    @Test
    void should_return_unauthorized_without_user_preferences_update_authority() throws Exception {
      mockMvc.perform(patch(USER_PREFERENCES_PATH + "/id").contentType(MediaType.APPLICATION_JSON)
        .content(asJsonString(input))
        .headers(getAuthorizationHeader(jwtTokenProvider, USER_PREFERENCES_READ))).andExpect(status().isUnauthorized());
    }

    @Test
    void should_update_user_preferences_given_user_preferences_update_authority() throws Exception {
      doReturn(expected).when(userPreferencesService).updateUserPreferences(expected.getId(), input);

      mockMvc.perform(
          patch(format("%s/%s", USER_PREFERENCES_PATH, expected.getId())).contentType(MediaType.APPLICATION_JSON)
            .content(asJsonString(input))
            .headers(getAuthorizationHeader(jwtTokenProvider, USER_PREFERENCES_UPDATE))
            .accept(HAL_FORMS_JSON_VALUE))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", equalTo(expected.getId())));
    }
  }
}
