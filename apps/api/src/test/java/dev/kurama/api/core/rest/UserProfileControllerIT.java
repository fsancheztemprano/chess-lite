package dev.kurama.api.core.rest;

import static dev.kurama.api.core.authority.UserAuthority.PROFILE_DELETE;
import static dev.kurama.api.core.authority.UserAuthority.PROFILE_READ;
import static dev.kurama.api.core.authority.UserAuthority.PROFILE_UPDATE;
import static dev.kurama.api.core.constant.RestPathConstant.USER_PROFILE_PATH;
import static dev.kurama.api.core.rest.UserProfileController.USER_PROFILE_CHANGE_PASSWORD_PATH;
import static dev.kurama.api.core.rest.UserProfileController.USER_PROFILE_PREFERENCES;
import static dev.kurama.api.core.rest.UserProfileController.USER_PROFILE_UPLOAD_AVATAR_PATH;
import static dev.kurama.api.support.JsonUtils.asJsonString;
import static dev.kurama.api.support.TestConstant.MOCK_MVC_HOST;
import static dev.kurama.api.support.TestUtils.getAuthorizationHeader;
import static dev.kurama.api.support.TestUtils.getMockUser;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;
import static org.springframework.hateoas.MediaTypes.HAL_FORMS_JSON_VALUE;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.facade.UserFacade;
import dev.kurama.api.core.facade.UserPreferencesFacade;
import dev.kurama.api.core.hateoas.assembler.UserModelAssembler;
import dev.kurama.api.core.hateoas.input.ChangeUserPasswordInput;
import dev.kurama.api.core.hateoas.input.UserInput;
import dev.kurama.api.core.hateoas.input.UserPreferencesInput;
import dev.kurama.api.core.hateoas.input.UserProfileUpdateInput;
import dev.kurama.api.core.hateoas.processor.UserModelProcessor;
import dev.kurama.api.core.hateoas.processor.UserPreferencesModelProcessor;
import dev.kurama.api.core.service.AuthenticationFacility;
import dev.kurama.api.core.service.UserPreferencesService;
import dev.kurama.api.core.service.UserService;
import dev.kurama.api.core.utility.JWTTokenProvider;
import dev.kurama.api.support.ImportMappers;
import dev.kurama.api.support.ImportTestSecurityConfiguration;
import dev.kurama.api.support.MockAuthorizedUser;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@ActiveProfiles(value = "integration-test")
@ImportTestSecurityConfiguration
@WebMvcTest(controllers = UserProfileController.class)
@Import({UserFacade.class, UserPreferencesFacade.class, UserModelProcessor.class, UserModelAssembler.class,
  UserPreferencesModelProcessor.class})
@ImportMappers
class UserProfileControllerIT {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private JWTTokenProvider jwtTokenProvider;

  @MockBean
  private UserService userService;

  @MockBean
  private AuthenticationFacility authenticationFacility;

  @MockBean
  private UserPreferencesService userPreferencesService;

  private User expected;

  @BeforeEach
  void setUp() {
    expected = getMockUser();
  }

  @Nested
  class GetUserProfileITs {

    @Test
    void should_return_forbidden_without_profile_read_authority() throws Exception {
      mockMvc.perform(get(USER_PROFILE_PATH)).andExpect(status().isForbidden());

      mockMvc.perform(get(USER_PROFILE_PATH).headers(getAuthorizationHeader(jwtTokenProvider, "MOCK:AUTH")))
        .andExpect(status().isForbidden());
    }

    @Test
    void should_get_user_profile() throws Exception {
      doReturn(Optional.of(expected)).when(userService).findUserById(expected.getId());

      mockMvc.perform(get(USER_PROFILE_PATH).accept(HAL_FORMS_JSON_VALUE)
          .headers(MockAuthorizedUser.builder()
            .username(expected.getUsername())
            .id(expected.getId())
            .authorities(PROFILE_READ)
            .buildAuthorizationHeader(jwtTokenProvider)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", equalTo(expected.getId())))
        .andExpect(jsonPath("$.role.id", equalTo(expected.getRole().getId())))
        .andExpect(jsonPath("$.userPreferences.id", equalTo(expected.getUserPreferences().getId())))
        .andExpect(jsonPath("$._links.*", hasSize(2)))
        .andExpect(jsonPath("$._links.self.href", equalTo(MOCK_MVC_HOST + USER_PROFILE_PATH)))
        .andExpect(jsonPath("$._links.user-preferences.href",
          equalTo(MOCK_MVC_HOST + USER_PROFILE_PATH + USER_PROFILE_PREFERENCES)))
        .andExpect(jsonPath("$._templates.*", hasSize(1)))
        .andExpect(jsonPath("$._templates.default.method", equalTo(HttpMethod.HEAD.toString())));
    }

    @Test
    void should_get_user_profile_with_update_templates_given_user_profile_update_authority() throws Exception {
      doReturn(Optional.of(expected)).when(userService).findUserById(expected.getId());

      mockMvc.perform(get(USER_PROFILE_PATH).accept(HAL_FORMS_JSON_VALUE)
          .headers(MockAuthorizedUser.builder()
            .username(expected.getUsername())
            .id(expected.getId())
            .authorities(PROFILE_READ, PROFILE_UPDATE)
            .buildAuthorizationHeader(jwtTokenProvider)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", equalTo(expected.getId())))
        .andExpect(jsonPath("$._templates.*", hasSize(4)))
        .andExpect(jsonPath("$._templates.default.method", equalTo(HttpMethod.HEAD.toString())))
        .andExpect(jsonPath("$._templates.updateProfile.method", equalTo(HttpMethod.PATCH.toString())))
        .andExpect(jsonPath("$._templates.uploadAvatar.method", equalTo(HttpMethod.PATCH.toString())))
        .andExpect(jsonPath("$._templates.uploadAvatar.target",
          equalTo(MOCK_MVC_HOST + USER_PROFILE_PATH + USER_PROFILE_UPLOAD_AVATAR_PATH)))
        .andExpect(jsonPath("$._templates.changePassword.method", equalTo(HttpMethod.PATCH.toString())))
        .andExpect(jsonPath("$._templates.changePassword.target",
          equalTo(MOCK_MVC_HOST + USER_PROFILE_PATH + USER_PROFILE_CHANGE_PASSWORD_PATH)));
    }

    @Test
    void should_get_user_profile_with_delete_templates_given_user_profile_delete_authority() throws Exception {
      doReturn(Optional.of(expected)).when(userService).findUserById(expected.getId());

      mockMvc.perform(get(USER_PROFILE_PATH).accept(HAL_FORMS_JSON_VALUE)
          .headers(MockAuthorizedUser.builder()
            .username(expected.getUsername())
            .id(expected.getId())
            .authorities(PROFILE_READ, PROFILE_DELETE)
            .buildAuthorizationHeader(jwtTokenProvider)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", equalTo(expected.getId())))
        .andExpect(jsonPath("$._templates.*", hasSize(2)))
        .andExpect(jsonPath("$._templates.default.method", equalTo(HttpMethod.HEAD.toString())))
        .andExpect(jsonPath("$._templates.deleteProfile.method", equalTo(HttpMethod.DELETE.toString())));
    }
  }

  @Nested
  class UpdateProfileITs {

    UserProfileUpdateInput input = UserProfileUpdateInput.builder()
      .firstname(randomAlphanumeric(8))
      .lastname(randomAlphanumeric(8))
      .build();

    @Test
    void should_return_forbidden_without_profile_update_authority() throws Exception {
      mockMvc.perform(patch(USER_PROFILE_PATH).contentType(APPLICATION_JSON_VALUE)
        .accept(HAL_FORMS_JSON_VALUE)
        .content(asJsonString(input))).andExpect(status().isForbidden());

      mockMvc.perform(patch(USER_PROFILE_PATH).contentType(APPLICATION_JSON_VALUE)
        .accept(HAL_FORMS_JSON_VALUE)
        .content(asJsonString(input))
        .headers(getAuthorizationHeader(jwtTokenProvider, PROFILE_READ))).andExpect(status().isForbidden());
    }

    @Test
    void should_update_profile() throws Exception {
      doReturn(expected).when(userService).updateUser(eq(expected.getId()), any(UserInput.class));

      mockMvc.perform(patch(USER_PROFILE_PATH).contentType(APPLICATION_JSON_VALUE)
          .accept(HAL_FORMS_JSON_VALUE)
          .content(asJsonString(input))
          .headers(MockAuthorizedUser.builder()
            .username(expected.getUsername())
            .id(expected.getId())
            .authorities(PROFILE_UPDATE)
            .buildAuthorizationHeader(jwtTokenProvider)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", equalTo(expected.getId())));
    }
  }

  @Nested
  class ChangeProfilePasswordITs {

    ChangeUserPasswordInput input = ChangeUserPasswordInput.builder()
      .password(randomAlphanumeric(8))
      .newPassword(randomAlphanumeric(8))
      .build();

    @Test
    void should_return_forbidden_without_profile_update_authority() throws Exception {
      mockMvc.perform(patch(USER_PROFILE_PATH + USER_PROFILE_CHANGE_PASSWORD_PATH).contentType(APPLICATION_JSON_VALUE)
        .accept(HAL_FORMS_JSON_VALUE)
        .content(asJsonString(input))).andExpect(status().isForbidden());

      mockMvc.perform(patch(USER_PROFILE_PATH + USER_PROFILE_CHANGE_PASSWORD_PATH).contentType(APPLICATION_JSON_VALUE)
        .accept(HAL_FORMS_JSON_VALUE)
        .content(asJsonString(input))
        .headers(getAuthorizationHeader(jwtTokenProvider, PROFILE_READ))).andExpect(status().isForbidden());
    }

    @Test
    void should_change_password() throws Exception {
      doReturn(Optional.of(expected)).when(userService).findUserById(expected.getId());
      doReturn(expected).when(userService).updateUser(eq(expected.getId()), any(UserInput.class));

      mockMvc.perform(patch(USER_PROFILE_PATH + USER_PROFILE_CHANGE_PASSWORD_PATH).contentType(APPLICATION_JSON_VALUE)
          .accept(HAL_FORMS_JSON_VALUE)
          .content(asJsonString(input))
          .headers(MockAuthorizedUser.builder()
            .username(expected.getUsername())
            .id(expected.getId())
            .authorities(PROFILE_UPDATE)
            .buildAuthorizationHeader(jwtTokenProvider)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", equalTo(expected.getId())));
    }
  }

  @Nested
  class UploadProfileAvatarITs {

    MockMultipartFile avatar = new MockMultipartFile("avatar", "avatar.png", "image/png", "avatar_file".getBytes());

    @Test
    void should_return_forbidden_without_profile_update_authority() throws Exception {
      mockMvc.perform(multipart(USER_PROFILE_PATH + USER_PROFILE_UPLOAD_AVATAR_PATH).file(avatar).with(request -> {
        request.setMethod(HttpMethod.PATCH.toString());
        return request;
      })).andExpect(status().isForbidden());

      mockMvc.perform(multipart(USER_PROFILE_PATH + USER_PROFILE_UPLOAD_AVATAR_PATH).file(avatar).with(request -> {
        request.setMethod(HttpMethod.PATCH.toString());
        return request;
      }).headers(getAuthorizationHeader(jwtTokenProvider, PROFILE_READ))).andExpect(status().isForbidden());
    }

    @Test
    void should_upload_avatar() throws Exception {
      doReturn(expected).when(userService).updateUser(eq(expected.getId()), any(UserInput.class));

      mockMvc.perform(multipart(USER_PROFILE_PATH + USER_PROFILE_UPLOAD_AVATAR_PATH).file(avatar)
          .with(request -> {
            request.setMethod(HttpMethod.PATCH.toString());
            return request;
          })
          .accept(HAL_FORMS_JSON_VALUE)
          .contentType(MediaType.MULTIPART_FORM_DATA_VALUE)
          .headers(MockAuthorizedUser.builder()
            .username(expected.getUsername())
            .id(expected.getId())
            .authorities(PROFILE_UPDATE)
            .buildAuthorizationHeader(jwtTokenProvider)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", equalTo(expected.getId())));
    }
  }

  @Nested
  class DeleteProfileITs {

    @Test
    void should_return_forbidden_without_profile_update_authority() throws Exception {
      mockMvc.perform(delete(USER_PROFILE_PATH).accept(HAL_FORMS_JSON_VALUE)).andExpect(status().isForbidden());

      mockMvc.perform(delete(USER_PROFILE_PATH).accept(HAL_FORMS_JSON_VALUE)
        .headers(getAuthorizationHeader(jwtTokenProvider, PROFILE_READ))).andExpect(status().isForbidden());
    }

    @Test
    void should_delete_profile() throws Exception {
      mockMvc.perform(delete(USER_PROFILE_PATH).accept(HAL_FORMS_JSON_VALUE)
        .headers(MockAuthorizedUser.builder()
          .username(expected.getUsername())
          .id(expected.getId())
          .authorities(PROFILE_DELETE)
          .buildAuthorizationHeader(jwtTokenProvider))).andExpect(status().isNoContent());

      verify(userService).deleteUserById(expected.getId());
    }
  }

  @Nested
  class ProfilePreferencesITs {

    @Nested
    class GetProfilePreferencesITs {

      @Test
      void should_return_forbidden_without_profile_update_authority() throws Exception {
        mockMvc.perform(get(USER_PROFILE_PATH + USER_PROFILE_PREFERENCES)).andExpect(status().isForbidden());

        mockMvc.perform(get(USER_PROFILE_PATH + USER_PROFILE_PREFERENCES).headers(
          getAuthorizationHeader(jwtTokenProvider, "MOCK:AUTH"))).andExpect(status().isForbidden());
      }

      @Test
      void should_get_preferences() throws Exception {
        doReturn(expected.getUserPreferences()).when(userPreferencesService)
          .findUserPreferencesByUserId(expected.getId());

        mockMvc.perform(get(USER_PROFILE_PATH + USER_PROFILE_PREFERENCES).accept(HAL_FORMS_JSON_VALUE)
            .headers(MockAuthorizedUser.builder()
              .username(expected.getUsername())
              .id(expected.getId())
              .authorities(PROFILE_READ)
              .buildAuthorizationHeader(jwtTokenProvider)))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.id", equalTo(expected.getUserPreferences().getId())));
      }
    }

    @Nested
    class UpdateProfilePreferencesITs {

      private final UserPreferencesInput userPreferencesInput = UserPreferencesInput.builder()
        .contentLanguage(randomAlphanumeric(2))
        .darkMode(true)
        .build();

      @Test
      void should_return_forbidden_without_profile_update_authority() throws Exception {
        mockMvc.perform(patch(USER_PROFILE_PATH + USER_PROFILE_PREFERENCES).contentType(APPLICATION_JSON_VALUE)
          .content(asJsonString(userPreferencesInput))
          .accept(HAL_FORMS_JSON_VALUE)).andExpect(status().isForbidden());

        mockMvc.perform(patch(USER_PROFILE_PATH + USER_PROFILE_PREFERENCES).contentType(APPLICATION_JSON_VALUE)
          .content(asJsonString(userPreferencesInput))
          .accept(HAL_FORMS_JSON_VALUE)
          .headers(getAuthorizationHeader(jwtTokenProvider, PROFILE_READ))).andExpect(status().isForbidden());
      }

      @Test
      void should_update_preferences() throws Exception {
        doReturn(expected.getUserPreferences()).when(userPreferencesService)
          .updateUserPreferencesByUserId(expected.getId(), userPreferencesInput);

        mockMvc.perform(patch(USER_PROFILE_PATH + USER_PROFILE_PREFERENCES).contentType(APPLICATION_JSON_VALUE)
            .content(asJsonString(userPreferencesInput))
            .accept(HAL_FORMS_JSON_VALUE)
            .headers(MockAuthorizedUser.builder()
              .username(expected.getUsername())
              .id(expected.getId())
              .authorities(PROFILE_UPDATE)
              .buildAuthorizationHeader(jwtTokenProvider)))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.id", equalTo(expected.getUserPreferences().getId())));
      }
    }
  }
}
