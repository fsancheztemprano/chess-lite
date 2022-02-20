package dev.kurama.api.core.rest;

import static com.google.common.collect.Lists.newArrayList;
import static dev.kurama.api.core.authority.UserAuthority.USER_CREATE;
import static dev.kurama.api.core.authority.UserAuthority.USER_DELETE;
import static dev.kurama.api.core.authority.UserAuthority.USER_READ;
import static dev.kurama.api.core.authority.UserAuthority.USER_UPDATE;
import static dev.kurama.api.core.authority.UserAuthority.USER_UPDATE_AUTHORITIES;
import static dev.kurama.api.core.authority.UserAuthority.USER_UPDATE_ROLE;
import static dev.kurama.api.core.constant.RestPathConstant.USER_PATH;
import static dev.kurama.api.core.constant.RestPathConstant.USER_PREFERENCES_PATH;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static dev.kurama.api.support.JsonUtils.asJsonString;
import static dev.kurama.api.support.TestConstant.MOCK_MVC_HOST;
import static dev.kurama.api.support.TokenTestUtils.getAuthorizationHeader;
import static java.lang.String.format;
import static org.apache.commons.compress.utils.Sets.newHashSet;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.startsWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;
import static org.springframework.hateoas.MediaTypes.HAL_FORMS_JSON_VALUE;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.kurama.api.core.domain.Authority;
import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.domain.UserPreferences;
import dev.kurama.api.core.facade.UserFacade;
import dev.kurama.api.core.hateoas.assembler.UserModelAssembler;
import dev.kurama.api.core.hateoas.input.UserAuthoritiesInput;
import dev.kurama.api.core.hateoas.input.UserInput;
import dev.kurama.api.core.hateoas.input.UserRoleInput;
import dev.kurama.api.core.hateoas.processor.UserModelProcessor;
import dev.kurama.api.core.hateoas.processor.UserPreferencesModelProcessor;
import dev.kurama.api.core.service.AuthenticationFacility;
import dev.kurama.api.core.service.UserService;
import dev.kurama.api.core.utility.JWTTokenProvider;
import dev.kurama.api.support.ImportMappers;
import dev.kurama.api.support.ImportTestSecurityConfiguration;
import java.util.ArrayList;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@ActiveProfiles(value = "integration-test")
@ImportTestSecurityConfiguration
@WebMvcTest(controllers = UserController.class)
@Import({UserFacade.class, UserModelProcessor.class, UserModelAssembler.class, UserPreferencesModelProcessor.class})
@ImportMappers
class UserControllerIT {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private JWTTokenProvider jwtTokenProvider;

  @MockBean
  private UserService userService;

  @MockBean
  private AuthenticationFacility authenticationFacility;

  private User expected;

  @BeforeEach
  void setUp() {
    expected = getMockUser();
  }

  @Nested
  class GetOneUserITs {

    @Test
    void should_return_forbidden_without_user_read_authority() throws Exception {
      mockMvc.perform(get(USER_PATH + "/id")).andExpect(status().isForbidden());

      mockMvc.perform(get(USER_PATH + "/id").headers(getAuthorizationHeader(jwtTokenProvider, "MOCK:AUTH")))
        .andExpect(status().isForbidden());
    }

    @Test
    void should_get_one_user() throws Exception {
      doReturn(Optional.of(expected)).when(userService).findUserById(expected.getId());

      mockMvc.perform(get(format("%s/%s", USER_PATH, expected.getId())).accept(HAL_FORMS_JSON_VALUE)
          .headers(getAuthorizationHeader(jwtTokenProvider, USER_READ)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", equalTo(expected.getId())))
        .andExpect(jsonPath("$.username", equalTo(expected.getUsername())))
        .andExpect(jsonPath("$.email", equalTo(expected.getEmail())))
        .andExpect(jsonPath("$.firstname", equalTo(expected.getFirstname())))
        .andExpect(jsonPath("$.lastname", equalTo(expected.getLastname())))
        .andExpect(jsonPath("$.userPreferences.id", equalTo(expected.getUserPreferences().getId())))
        .andExpect(jsonPath("$.role.id", equalTo(expected.getRole().getId())))
        .andExpect(jsonPath("$.authorities.*", hasSize(2)))
        .andExpect(jsonPath("$._links.*", hasSize(3)))
        .andExpect(
          jsonPath("$._links.self.href", equalTo(MOCK_MVC_HOST + format("%s/%s", USER_PATH, expected.getId()))))
        .andExpect(jsonPath("$._links.user-preferences.href",
          equalTo(MOCK_MVC_HOST + format("%s/%s", USER_PREFERENCES_PATH, expected.getUserPreferences().getId()))))
        .andExpect(jsonPath("$._links.users.href", startsWith(MOCK_MVC_HOST + USER_PATH)))
        .andExpect(jsonPath("$._templates.*", hasSize(1)))
        .andExpect(jsonPath("$._templates.default.method", equalTo(HttpMethod.HEAD.toString())));
    }

    @Test
    void should_get_one_user_with_user_delete_template_given_user_delete_authority() throws Exception {
      doReturn(Optional.of(expected)).when(userService).findUserById(expected.getId());

      mockMvc.perform(get(format("%s/%s", USER_PATH, expected.getId())).accept(HAL_FORMS_JSON_VALUE)
          .headers(getAuthorizationHeader(jwtTokenProvider, USER_READ, USER_DELETE)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$._templates.*", hasSize(2)))
        .andExpect(jsonPath("$._templates.default.method", equalTo(HttpMethod.HEAD.toString())))
        .andExpect(jsonPath("$._templates.delete.method", equalTo(HttpMethod.DELETE.toString())));
    }

    @Test
    void should_get_one_user_with_user_update_templates_given_user_update_authority() throws Exception {
      doReturn(Optional.of(expected)).when(userService).findUserById(expected.getId());

      mockMvc.perform(get(format("%s/%s", USER_PATH, expected.getId())).accept(HAL_FORMS_JSON_VALUE)
          .headers(getAuthorizationHeader(jwtTokenProvider, USER_READ, USER_UPDATE)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$._templates.*", hasSize(3)))
        .andExpect(jsonPath("$._templates.default.method", equalTo(HttpMethod.HEAD.toString())))
        .andExpect(jsonPath("$._templates.update.method", equalTo(HttpMethod.PATCH.toString())))
        .andExpect(jsonPath("$._templates.requestActivationToken.method", equalTo(HttpMethod.POST.toString())));
    }

    @Test
    void should_get_one_user_with_user_update_role_template_given_user_update_role_authority() throws Exception {
      doReturn(Optional.of(expected)).when(userService).findUserById(expected.getId());

      mockMvc.perform(get(format("%s/%s", USER_PATH, expected.getId())).accept(HAL_FORMS_JSON_VALUE)
          .headers(getAuthorizationHeader(jwtTokenProvider, USER_READ, USER_UPDATE_ROLE)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$._templates.*", hasSize(2)))
        .andExpect(jsonPath("$._templates.default.method", equalTo(HttpMethod.HEAD.toString())))
        .andExpect(jsonPath("$._templates.updateRole.method", equalTo(HttpMethod.PATCH.toString())))
        .andExpect(jsonPath("$._templates.updateRole.target",
          equalTo(format("%s%s/%s/role", MOCK_MVC_HOST, USER_PATH, expected.getId()))));
    }

    @Test
    void should_get_one_user_with_user_update_authorities_template_given_user_update_authorities_authority()
      throws Exception {
      doReturn(Optional.of(expected)).when(userService).findUserById(expected.getId());

      mockMvc.perform(get(format("%s/%s", USER_PATH, expected.getId())).accept(HAL_FORMS_JSON_VALUE)
          .headers(getAuthorizationHeader(jwtTokenProvider, USER_READ, USER_UPDATE_AUTHORITIES)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$._templates.*", hasSize(2)))
        .andExpect(jsonPath("$._templates.default.method", equalTo(HttpMethod.HEAD.toString())))
        .andExpect(jsonPath("$._templates.updateAuthorities.method", equalTo(HttpMethod.PATCH.toString())))
        .andExpect(jsonPath("$._templates.updateAuthorities.target",
          equalTo(format("%s%s/%s/authorities", MOCK_MVC_HOST, USER_PATH, expected.getId()))));
    }
  }

  @Nested
  class GetAllUsersITs {

    @Test
    void should_return_forbidden_without_user_read_authority() throws Exception {
      mockMvc.perform(get(USER_PATH)).andExpect(status().isForbidden());

      mockMvc.perform(get(USER_PATH).headers(getAuthorizationHeader(jwtTokenProvider, "MOCK:AUTH")))
        .andExpect(status().isForbidden());
    }

    @Test
    void should_get_all_users() throws Exception {
      ArrayList<User> users = newArrayList(getMockUser(), getMockUser());
      Page<User> expected = new PageImpl<User>(users, PageRequest.of(2, 2), 6);
      doReturn(expected).when(userService).getAllUsers(any(), any());

      mockMvc.perform(
          get(USER_PATH).accept(HAL_FORMS_JSON_VALUE).headers(getAuthorizationHeader(jwtTokenProvider, USER_READ)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$._links.*", hasSize(4)))
        .andExpect(jsonPath("$._links..href", everyItem(startsWith(MOCK_MVC_HOST + USER_PATH))))
        .andExpect(jsonPath("$._embedded.userModels", hasSize(2)))
        .andExpect(
          jsonPath("$._embedded.userModels[*].id", allOf(contains(users.get(0).getId(), users.get(1).getId()))))
        .andExpect(jsonPath("$._templates.*", hasSize(1)))
        .andExpect(jsonPath("$._templates.default.method", equalTo(HttpMethod.HEAD.toString())));
    }

    @Test
    void should_get_all_users_with_create_template_given_user_create_authority() throws Exception {
      Page<Role> expected = new PageImpl<Role>(newArrayList(), PageRequest.of(1, 1), 0);
      doReturn(expected).when(userService).getAllUsers(any(), any());

      mockMvc.perform(get(USER_PATH).accept(HAL_FORMS_JSON_VALUE)
          .headers(getAuthorizationHeader(jwtTokenProvider, USER_READ, USER_CREATE)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$._links.*", hasSize(4)))
        .andExpect(jsonPath("$._templates.*", hasSize(2)))
        .andExpect(jsonPath("$._templates.default.method", equalTo(HttpMethod.HEAD.toString())))
        .andExpect(jsonPath("$._templates.create.method", equalTo(HttpMethod.POST.toString())))
        .andExpect(jsonPath("$._templates.create.target", equalTo(MOCK_MVC_HOST + USER_PATH)));
    }
  }

  private final UserInput userInput = UserInput.builder()
    .username(randomAlphanumeric(8))
    .email(randomAlphanumeric(8))
    .firstname(randomAlphanumeric(8))
    .lastname(randomAlphanumeric(8))
    .build();

  @Nested
  class CreateUserITs {

    @Test
    void should_return_forbidden_without_user_create_authority() throws Exception {
      mockMvc.perform(post(USER_PATH).contentType(MediaType.APPLICATION_JSON).content(asJsonString(userInput)))
        .andExpect(status().isForbidden());

      mockMvc.perform(post(USER_PATH).contentType(MediaType.APPLICATION_JSON)
        .content(asJsonString(userInput))
        .headers(getAuthorizationHeader(jwtTokenProvider, USER_READ))).andExpect(status().isForbidden());
    }

    @Test
    void should_create_user() throws Exception {
      doReturn(expected).when(userService).createUser(userInput);

      mockMvc.perform(post(USER_PATH).accept(HAL_FORMS_JSON_VALUE)
        .contentType(MediaType.APPLICATION_JSON)
        .content(asJsonString(userInput))
        .headers(getAuthorizationHeader(jwtTokenProvider, USER_CREATE))).andExpect(status().isCreated());
    }
  }

  @Nested
  class UpdateUserITs {

    @Test
    void should_return_forbidden_without_user_update_authority() throws Exception {
      mockMvc.perform(patch(format("%s/%s", USER_PATH, expected.getId())).contentType(MediaType.APPLICATION_JSON)
        .content(asJsonString(userInput))).andExpect(status().isForbidden());

      mockMvc.perform(patch(format("%s/%s", USER_PATH, expected.getId())).contentType(MediaType.APPLICATION_JSON)
        .content(asJsonString(userInput))
        .headers(getAuthorizationHeader(jwtTokenProvider, USER_READ))).andExpect(status().isForbidden());
    }

    @Test
    void should_update_user() throws Exception {
      doReturn(expected).when(userService).updateUser(expected.getId(), userInput);

      mockMvc.perform(patch(format("%s/%s", USER_PATH, expected.getId())).accept(HAL_FORMS_JSON_VALUE)
          .contentType(MediaType.APPLICATION_JSON)
          .content(asJsonString(userInput))
          .headers(getAuthorizationHeader(jwtTokenProvider, USER_UPDATE)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", equalTo(expected.getId())));
    }
  }

  @Nested
  class UpdateUserRoleITs {

    private final UserRoleInput input = UserRoleInput.builder().roleId(randomUUID()).build();

    @Test
    void should_return_forbidden_without_user_update_role_authority() throws Exception {
      mockMvc.perform(patch(format("%s/%s/role", USER_PATH, expected.getId())).contentType(MediaType.APPLICATION_JSON)
        .content(asJsonString(input))).andExpect(status().isForbidden());

      mockMvc.perform(patch(format("%s/%s/role", USER_PATH, expected.getId())).contentType(MediaType.APPLICATION_JSON)
        .content(asJsonString(input))
        .headers(getAuthorizationHeader(jwtTokenProvider, USER_READ))).andExpect(status().isForbidden());
    }

    @Test
    void should_update_user_role() throws Exception {
      doReturn(expected).when(userService).updateUser(eq(expected.getId()), any(UserInput.class));

      mockMvc.perform(patch(format("%s/%s/role", USER_PATH, expected.getId())).accept(HAL_FORMS_JSON_VALUE)
          .contentType(MediaType.APPLICATION_JSON)
          .content(asJsonString(input))
          .headers(getAuthorizationHeader(jwtTokenProvider, USER_UPDATE_ROLE)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", equalTo(expected.getId())));
    }
  }

  @Nested
  class UpdateUserAuthoritiesITs {

    private final UserAuthoritiesInput input = UserAuthoritiesInput.builder()
      .authorityIds(newHashSet(randomUUID(), randomUUID()))
      .build();

    @Test
    void should_return_forbidden_without_user_update_authorities_authority() throws Exception {
      mockMvc.perform(
        patch(format("%s/%s/authorities", USER_PATH, expected.getId())).contentType(MediaType.APPLICATION_JSON)
          .content(asJsonString(input))).andExpect(status().isForbidden());

      mockMvc.perform(
        patch(format("%s/%s/authorities", USER_PATH, expected.getId())).contentType(MediaType.APPLICATION_JSON)
          .content(asJsonString(input))
          .headers(getAuthorizationHeader(jwtTokenProvider, USER_READ))).andExpect(status().isForbidden());
    }

    @Test
    void should_update_user_authorities() throws Exception {
      doReturn(expected).when(userService).updateUser(eq(expected.getId()), any(UserInput.class));

      mockMvc.perform(patch(format("%s/%s/authorities", USER_PATH, expected.getId())).accept(HAL_FORMS_JSON_VALUE)
          .contentType(MediaType.APPLICATION_JSON)
          .content(asJsonString(input))
          .headers(getAuthorizationHeader(jwtTokenProvider, USER_UPDATE_AUTHORITIES)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", equalTo(expected.getId())));
    }
  }

  @Nested
  class DeleteUserITs {

    @Test
    void should_return_forbidden_without_user_delete_authority() throws Exception {
      mockMvc.perform(delete(format("%s/%s", USER_PATH, expected.getId())).contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isForbidden());

      mockMvc.perform(delete(format("%s/%s", USER_PATH, expected.getId())).contentType(MediaType.APPLICATION_JSON)
        .headers(getAuthorizationHeader(jwtTokenProvider, USER_READ))).andExpect(status().isForbidden());
    }

    @Test
    void should_delete_user() throws Exception {
      mockMvc.perform(delete(format("%s/%s", USER_PATH, expected.getId())).contentType(MediaType.APPLICATION_JSON)
        .headers(getAuthorizationHeader(jwtTokenProvider, USER_DELETE))).andExpect(status().isNoContent());

      verify(userService).deleteUserById(expected.getId());
    }

  }

  @Nested
  class RequestActivationTokenITs {

    @Test
    void should_return_forbidden_without_user_update_authority() throws Exception {
      mockMvc.perform(post(format("%s/%s", USER_PATH, expected.getId())).contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isForbidden());

      mockMvc.perform(post(format("%s/%s", USER_PATH, expected.getId())).contentType(MediaType.APPLICATION_JSON)
        .headers(getAuthorizationHeader(jwtTokenProvider, USER_READ))).andExpect(status().isForbidden());
    }

    @Test
    void should_request_activation_token() throws Exception {
      mockMvc.perform(post(format("%s/%s", USER_PATH, expected.getId())).contentType(MediaType.APPLICATION_JSON)
        .headers(getAuthorizationHeader(jwtTokenProvider, USER_UPDATE))).andExpect(status().isNoContent());

      verify(userService).requestActivationTokenById(expected.getId());
    }

  }

  private User getMockUser() {
    return User.builder()
      .setRandomUUID()
      .username(randomAlphanumeric(8))
      .email(randomAlphanumeric(8))
      .firstname(randomAlphanumeric(8))
      .lastname(randomAlphanumeric(8))
      .userPreferences(UserPreferences.builder().setRandomUUID().build())
      .role(Role.builder().setRandomUUID().build())
      .authorities(newHashSet(Authority.builder().setRandomUUID().name(randomAlphanumeric(4)).build(),
        Authority.builder().setRandomUUID().name(randomAlphanumeric(4)).build()))
      .build();
  }
}
