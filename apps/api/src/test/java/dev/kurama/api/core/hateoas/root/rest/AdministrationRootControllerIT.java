package dev.kurama.api.core.hateoas.root.rest;

import static dev.kurama.api.core.authority.AdminAuthority.ADMIN_ROLE_MANAGEMENT_ROOT;
import static dev.kurama.api.core.authority.AdminAuthority.ADMIN_ROOT;
import static dev.kurama.api.core.authority.AdminAuthority.ADMIN_USER_MANAGEMENT_ROOT;
import static dev.kurama.api.core.authority.AuthorityAuthority.AUTHORITY_READ;
import static dev.kurama.api.core.authority.GlobalSettingsAuthority.GLOBAL_SETTINGS_READ;
import static dev.kurama.api.core.authority.RoleAuthority.ROLE_CREATE;
import static dev.kurama.api.core.authority.RoleAuthority.ROLE_READ;
import static dev.kurama.api.core.authority.ServiceLogsAuthority.SERVICE_LOGS_READ;
import static dev.kurama.api.core.authority.UserAuthority.USER_CREATE;
import static dev.kurama.api.core.authority.UserAuthority.USER_READ;
import static dev.kurama.api.core.constant.RestPathConstant.ADMINISTRATION_ROOT_PATH;
import static dev.kurama.api.core.constant.RestPathConstant.AUTHORITY_PATH;
import static dev.kurama.api.core.constant.RestPathConstant.BASE_PATH;
import static dev.kurama.api.core.constant.RestPathConstant.GLOBAL_SETTINGS_PATH;
import static dev.kurama.api.core.constant.RestPathConstant.ROLE_PATH;
import static dev.kurama.api.core.constant.RestPathConstant.SERVICE_LOGS_PATH;
import static dev.kurama.api.core.constant.RestPathConstant.USER_PATH;
import static dev.kurama.api.support.TestConstant.MOCK_MVC_HOST;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.hateoas.MediaTypes.HAL_FORMS_JSON_VALUE;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.kurama.api.core.hateoas.root.processor.AdministrationRootResourceAssembler;
import dev.kurama.api.core.utility.JWTTokenProvider;
import dev.kurama.api.support.ImportTestSecurityConfiguration;
import dev.kurama.api.support.TestUtils;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpMethod;
import org.springframework.test.web.servlet.MockMvc;


@ImportTestSecurityConfiguration
@WebMvcTest(controllers = AdministrationRootController.class)
@Import(AdministrationRootResourceAssembler.class)
class AdministrationRootControllerIT {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private JWTTokenProvider jwtTokenProvider;

  @Test
  void should_get_forbidden_without_administration_root_authorization() throws Exception {
    mockMvc.perform(get(ADMINISTRATION_ROOT_PATH)).andExpect(status().isForbidden());
  }

  @Test
  void should_get_administration_root_resource_with_administration_root_authorization() throws Exception {
    mockMvc.perform(get(ADMINISTRATION_ROOT_PATH).accept(HAL_FORMS_JSON_VALUE)
        .headers(TestUtils.getAuthorizationHeader(jwtTokenProvider, ADMIN_ROOT)))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$._links.*", hasSize(2)))
      .andExpect(jsonPath("$._links.self.href", equalTo(MOCK_MVC_HOST + ADMINISTRATION_ROOT_PATH)))
      .andExpect(jsonPath("$._links.root.href", equalTo(MOCK_MVC_HOST + BASE_PATH)))
      .andExpect(jsonPath("$._templates.*", hasSize(1)))
      .andExpect(jsonPath("$._templates.default.method", equalTo(HttpMethod.HEAD.toString())));
  }

  @Test
  void should_have_service_logs_link_with_service_logs_read_authority() throws Exception {
    mockMvc.perform(get(ADMINISTRATION_ROOT_PATH).accept(HAL_FORMS_JSON_VALUE)
        .headers(TestUtils.getAuthorizationHeader(jwtTokenProvider, ADMIN_ROOT, SERVICE_LOGS_READ)))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$._links.*", hasSize(3)))
      .andExpect(jsonPath("$._links.self.href", equalTo(MOCK_MVC_HOST + ADMINISTRATION_ROOT_PATH)))
      .andExpect(jsonPath("$._links.root.href", equalTo(MOCK_MVC_HOST + BASE_PATH)))
      .andExpect(jsonPath("$._links.service-logs.href", equalTo(MOCK_MVC_HOST + SERVICE_LOGS_PATH)));
  }

  @Test
  void should_have_global_Settings_link_with_global_settings_read_authority() throws Exception {
    mockMvc.perform(get(ADMINISTRATION_ROOT_PATH).accept(HAL_FORMS_JSON_VALUE)
        .headers(TestUtils.getAuthorizationHeader(jwtTokenProvider, ADMIN_ROOT, GLOBAL_SETTINGS_READ)))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$._links.*", hasSize(3)))
      .andExpect(jsonPath("$._links.self.href", equalTo(MOCK_MVC_HOST + ADMINISTRATION_ROOT_PATH)))
      .andExpect(jsonPath("$._links.root.href", equalTo(MOCK_MVC_HOST + BASE_PATH)))
      .andExpect(jsonPath("$._links.global-settings.href", equalTo(MOCK_MVC_HOST + GLOBAL_SETTINGS_PATH)));
  }

  @Nested
  class UserManagementEmbeddedITs {

    @Test
    void should_get_user_management_embedded_resource_with_admin_user_management_root_authorization() throws Exception {
      mockMvc.perform(get(ADMINISTRATION_ROOT_PATH).accept(HAL_FORMS_JSON_VALUE)
          .headers(TestUtils.getAuthorizationHeader(jwtTokenProvider, ADMIN_ROOT, ADMIN_USER_MANAGEMENT_ROOT)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$._links.*", hasSize(2)))
        .andExpect(jsonPath("$._embedded.*", hasSize(1)))
        .andExpect(jsonPath("$._embedded.user-management._links.*", hasSize(1)))
        .andExpect(
          jsonPath("$._embedded.user-management._links.self.href", equalTo(MOCK_MVC_HOST + ADMINISTRATION_ROOT_PATH)));
    }

    @Test
    void should_get_user_management_user_links_with_user_read_authorization() throws Exception {
      mockMvc.perform(get(ADMINISTRATION_ROOT_PATH).accept(HAL_FORMS_JSON_VALUE)
          .headers(TestUtils.getAuthorizationHeader(jwtTokenProvider, ADMIN_ROOT, ADMIN_USER_MANAGEMENT_ROOT,
            USER_READ)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$._links.*", hasSize(2)))
        .andExpect(jsonPath("$._embedded.*", hasSize(1)))
        .andExpect(jsonPath("$._embedded.user-management._links.*", hasSize(3)))
        .andExpect(
          jsonPath("$._embedded.user-management._links.self.href", equalTo(MOCK_MVC_HOST + ADMINISTRATION_ROOT_PATH)))
        .andExpect(
          jsonPath("$._embedded.user-management._links.user.href", equalTo(MOCK_MVC_HOST + USER_PATH + "/{userId}")))
        .andExpect(jsonPath("$._embedded.user-management._links.users.href",
          equalTo(MOCK_MVC_HOST + USER_PATH + "{?search,page,size,sort}")));
    }

    @Test
    void should_get_user_management_user_create_template_with_user_create_authorization() throws Exception {
      mockMvc.perform(get(ADMINISTRATION_ROOT_PATH).accept(HAL_FORMS_JSON_VALUE)
          .headers(TestUtils.getAuthorizationHeader(jwtTokenProvider, ADMIN_ROOT, ADMIN_USER_MANAGEMENT_ROOT, USER_READ,
            USER_CREATE)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$._links.*", hasSize(2)))
        .andExpect(jsonPath("$._embedded.*", hasSize(1)))
        .andExpect(jsonPath("$._embedded.user-management._links.*", hasSize(3)))
        .andExpect(jsonPath("$._embedded.user-management._templates.*", hasSize(2)))
        .andExpect(
          jsonPath("$._embedded.user-management._templates.create.method", equalTo(HttpMethod.POST.toString())))
        .andExpect(
          jsonPath("$._embedded.user-management._templates.create.target", equalTo(MOCK_MVC_HOST + USER_PATH)));
    }
  }

  @Nested
  class RoleManagementEmbeddedITs {

    @Test
    void should_get_role_management_embedded_resource_with_admin_role_management_root_authorization() throws Exception {
      mockMvc.perform(get(ADMINISTRATION_ROOT_PATH).accept(HAL_FORMS_JSON_VALUE)
          .headers(TestUtils.getAuthorizationHeader(jwtTokenProvider, ADMIN_ROOT, ADMIN_ROLE_MANAGEMENT_ROOT)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$._links.*", hasSize(2)))
        .andExpect(jsonPath("$._embedded.*", hasSize(1)))
        .andExpect(jsonPath("$._embedded.role-management._links.*", hasSize(1)))
        .andExpect(
          jsonPath("$._embedded.role-management._links.self.href", equalTo(MOCK_MVC_HOST + ADMINISTRATION_ROOT_PATH)));
    }

    @Test
    void should_get_role_management_authorities_links_with_authority_read_authorization() throws Exception {
      mockMvc.perform(get(ADMINISTRATION_ROOT_PATH).accept(HAL_FORMS_JSON_VALUE)
          .headers(
            TestUtils.getAuthorizationHeader(jwtTokenProvider, ADMIN_ROOT, ADMIN_ROLE_MANAGEMENT_ROOT, AUTHORITY_READ)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$._links.*", hasSize(2)))
        .andExpect(jsonPath("$._embedded.*", hasSize(1)))
        .andExpect(jsonPath("$._embedded.role-management._links.*", hasSize(2)))
        .andExpect(
          jsonPath("$._embedded.role-management._links.self.href", equalTo(MOCK_MVC_HOST + ADMINISTRATION_ROOT_PATH)))
        .andExpect(jsonPath("$._embedded.role-management._links.authorities.href",
          equalTo(MOCK_MVC_HOST + AUTHORITY_PATH + "{?page,size,sort}")));
    }

    @Test
    void should_get_role_management_role_links_with_role_read_authorization() throws Exception {
      mockMvc.perform(get(ADMINISTRATION_ROOT_PATH).accept(HAL_FORMS_JSON_VALUE)
          .headers(TestUtils.getAuthorizationHeader(jwtTokenProvider, ADMIN_ROOT, ADMIN_ROLE_MANAGEMENT_ROOT,
            ROLE_READ)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$._links.*", hasSize(2)))
        .andExpect(jsonPath("$._embedded.*", hasSize(1)))
        .andExpect(jsonPath("$._embedded.role-management._links.*", hasSize(3)))
        .andExpect(
          jsonPath("$._embedded.role-management._links.self.href", equalTo(MOCK_MVC_HOST + ADMINISTRATION_ROOT_PATH)))
        .andExpect(
          jsonPath("$._embedded.role-management._links.role.href", equalTo(MOCK_MVC_HOST + ROLE_PATH + "/{roleId}")))
        .andExpect(jsonPath("$._embedded.role-management._links.roles.href",
          equalTo(MOCK_MVC_HOST + ROLE_PATH + "{?search,page,size,sort}")));
    }

    @Test
    void should_get_role_management_role_create_template_with_role_create_authorization() throws Exception {
      mockMvc.perform(get(ADMINISTRATION_ROOT_PATH).accept(HAL_FORMS_JSON_VALUE)
          .headers(TestUtils.getAuthorizationHeader(jwtTokenProvider, ADMIN_ROOT, ADMIN_ROLE_MANAGEMENT_ROOT, ROLE_READ,
            ROLE_CREATE)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$._links.*", hasSize(2)))
        .andExpect(jsonPath("$._embedded.*", hasSize(1)))
        .andExpect(jsonPath("$._embedded.role-management._links.*", hasSize(3)))
        .andExpect(jsonPath("$._embedded.role-management._templates.*", hasSize(2)))
        .andExpect(
          jsonPath("$._embedded.role-management._templates.create.method", equalTo(HttpMethod.POST.toString())))
        .andExpect(
          jsonPath("$._embedded.role-management._templates.create.target", equalTo(MOCK_MVC_HOST + ROLE_PATH)));
    }
  }
}
