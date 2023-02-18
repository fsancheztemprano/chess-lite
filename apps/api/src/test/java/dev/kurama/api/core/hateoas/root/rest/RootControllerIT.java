package dev.kurama.api.core.hateoas.root.rest;

import static dev.kurama.api.core.authority.AdminAuthority.ADMIN_ROOT;
import static dev.kurama.api.core.authority.ProfileAuthority.PROFILE_READ;
import static dev.kurama.api.core.authority.TokenAuthority.TOKEN_REFRESH;
import static dev.kurama.api.core.constant.RestPathConstant.ADMINISTRATION_ROOT_PATH;
import static dev.kurama.api.core.constant.RestPathConstant.AUTHENTICATION_PATH;
import static dev.kurama.api.core.constant.RestPathConstant.BASE_PATH;
import static dev.kurama.api.core.constant.RestPathConstant.BUILD_INFO_PATH;
import static dev.kurama.api.core.constant.RestPathConstant.THEME_PATH;
import static dev.kurama.api.core.constant.RestPathConstant.USER_PROFILE_PATH;
import static dev.kurama.api.core.rest.AuthenticationController.ACTIVATE_PATH;
import static dev.kurama.api.core.rest.AuthenticationController.LOGIN_PATH;
import static dev.kurama.api.core.rest.AuthenticationController.SIGNUP_PATH;
import static dev.kurama.api.core.rest.AuthenticationController.TOKEN_PATH;
import static dev.kurama.support.TestConstant.MOCK_MVC_HOST;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.hateoas.MediaTypes.HAL_FORMS_JSON_VALUE;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.kurama.api.core.hateoas.root.processor.RootResourceAssembler;
import dev.kurama.api.core.utility.JWTTokenProvider;
import dev.kurama.support.ImportTestSecurityConfiguration;
import dev.kurama.support.TestUtils;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpMethod;
import org.springframework.test.web.servlet.MockMvc;


@ImportTestSecurityConfiguration
@WebMvcTest(controllers = RootController.class)
@Import({RootResourceAssembler.class})
class RootControllerIT {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private JWTTokenProvider jwtTokenProvider;


  @Test
  void should_get_root_resource_as_unauthenticated_user() throws Exception {
    mockMvc.perform(get(BASE_PATH).accept(HAL_FORMS_JSON_VALUE))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$._links.*", hasSize(7)))
      .andExpect(jsonPath("$._links.self.href", equalTo(MOCK_MVC_HOST + BASE_PATH)))
      .andExpect(jsonPath("$._links.build-info.href", equalTo(MOCK_MVC_HOST + BUILD_INFO_PATH)))
      .andExpect(jsonPath("$._links.theme.href", equalTo(MOCK_MVC_HOST + THEME_PATH)))
      .andExpect(jsonPath("$._links.login.href", equalTo(MOCK_MVC_HOST + AUTHENTICATION_PATH + LOGIN_PATH)))
      .andExpect(jsonPath("$._links.signup.href", equalTo(MOCK_MVC_HOST + AUTHENTICATION_PATH + SIGNUP_PATH)))
      .andExpect(jsonPath("$._links.activation-token.href", equalTo(MOCK_MVC_HOST + AUTHENTICATION_PATH + TOKEN_PATH)))
      .andExpect(
        jsonPath("$._links.activate-account.href", equalTo(MOCK_MVC_HOST + AUTHENTICATION_PATH + ACTIVATE_PATH)))
      .andExpect(jsonPath("$._templates.default.method", equalTo(HttpMethod.HEAD.toString())))
      .andExpect(jsonPath("$._templates.login.method", equalTo(HttpMethod.POST.toString())))
      .andExpect(jsonPath("$._templates.login.target", equalTo(MOCK_MVC_HOST + AUTHENTICATION_PATH + LOGIN_PATH)))
      .andExpect(jsonPath("$._templates.signup.method", equalTo(HttpMethod.POST.toString())))
      .andExpect(jsonPath("$._templates.signup.target", equalTo(MOCK_MVC_HOST + AUTHENTICATION_PATH + SIGNUP_PATH)))
      .andExpect(jsonPath("$._templates.requestActivationToken.method", equalTo(HttpMethod.POST.toString())))
      .andExpect(jsonPath("$._templates.requestActivationToken.target",
        equalTo(MOCK_MVC_HOST + AUTHENTICATION_PATH + TOKEN_PATH)))
      .andExpect(jsonPath("$._templates.activateAccount.method", equalTo(HttpMethod.POST.toString())))
      .andExpect(
        jsonPath("$._templates.activateAccount.target", equalTo(MOCK_MVC_HOST + AUTHENTICATION_PATH + ACTIVATE_PATH)));
  }

  @Nested
  class RootAsAuthenticatedUserITs {

    @Test
    void should_get_root_resource_as_authenticated_user() throws Exception {
      mockMvc.perform(get(BASE_PATH).accept(HAL_FORMS_JSON_VALUE)
          .headers(TestUtils.getAuthorizationHeader(jwtTokenProvider, "AUTHORIZED")))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$._links.*", hasSize(3)))
        .andExpect(jsonPath("$._links.self.href", equalTo(MOCK_MVC_HOST + BASE_PATH)))
        .andExpect(jsonPath("$._links.build-info.href", equalTo(MOCK_MVC_HOST + BUILD_INFO_PATH)))
        .andExpect(jsonPath("$._links.theme.href", equalTo(MOCK_MVC_HOST + THEME_PATH)))
        .andExpect(jsonPath("$._templates.*", hasSize(1)))
        .andExpect(jsonPath("$._templates.default.method", equalTo(HttpMethod.HEAD.toString())));
    }

    @Test
    void should_get_root_resource_with_refresh_token_link_given_token_refresh_authority() throws Exception {
      mockMvc.perform(get(BASE_PATH).accept(HAL_FORMS_JSON_VALUE)
          .headers(TestUtils.getAuthorizationHeader(jwtTokenProvider, TOKEN_REFRESH)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$._links.*", hasSize(4)))
        .andExpect(jsonPath("$._links.self.href", equalTo(MOCK_MVC_HOST + BASE_PATH)))
        .andExpect(jsonPath("$._links.build-info.href", equalTo(MOCK_MVC_HOST + BUILD_INFO_PATH)))
        .andExpect(jsonPath("$._links.theme.href", equalTo(MOCK_MVC_HOST + THEME_PATH)))
        .andExpect(jsonPath("$._links.token.href", equalTo(MOCK_MVC_HOST + AUTHENTICATION_PATH + TOKEN_PATH)))
        .andExpect(jsonPath("$._templates.*", hasSize(1)))
        .andExpect(jsonPath("$._templates.default.method", equalTo(HttpMethod.HEAD.toString())));
    }

    @Test
    void should_get_root_resource_with_profile_link_given_profile_read_authority() throws Exception {
      mockMvc.perform(get(BASE_PATH).accept(HAL_FORMS_JSON_VALUE)
          .headers(TestUtils.getAuthorizationHeader(jwtTokenProvider, PROFILE_READ)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$._links.*", hasSize(4)))
        .andExpect(jsonPath("$._links.self.href", equalTo(MOCK_MVC_HOST + BASE_PATH)))
        .andExpect(jsonPath("$._links.build-info.href", equalTo(MOCK_MVC_HOST + BUILD_INFO_PATH)))
        .andExpect(jsonPath("$._links.theme.href", equalTo(MOCK_MVC_HOST + THEME_PATH)))
        .andExpect(jsonPath("$._links.current-user.href", equalTo(MOCK_MVC_HOST + USER_PROFILE_PATH)))
        .andExpect(jsonPath("$._templates.*", hasSize(1)))
        .andExpect(jsonPath("$._templates.default.method", equalTo(HttpMethod.HEAD.toString())));
    }

    @Test
    void should_get_root_resource_with_administration_link_given_admin_root_authority() throws Exception {
      mockMvc.perform(get(BASE_PATH).accept(HAL_FORMS_JSON_VALUE)
          .headers(TestUtils.getAuthorizationHeader(jwtTokenProvider, ADMIN_ROOT)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$._links.*", hasSize(4)))
        .andExpect(jsonPath("$._links.self.href", equalTo(MOCK_MVC_HOST + BASE_PATH)))
        .andExpect(jsonPath("$._links.build-info.href", equalTo(MOCK_MVC_HOST + BUILD_INFO_PATH)))
        .andExpect(jsonPath("$._links.theme.href", equalTo(MOCK_MVC_HOST + THEME_PATH)))
        .andExpect(jsonPath("$._links.administration.href", equalTo(MOCK_MVC_HOST + ADMINISTRATION_ROOT_PATH)))
        .andExpect(jsonPath("$._templates.*", hasSize(1)))
        .andExpect(jsonPath("$._templates.default.method", equalTo(HttpMethod.HEAD.toString())));
    }
  }
}
