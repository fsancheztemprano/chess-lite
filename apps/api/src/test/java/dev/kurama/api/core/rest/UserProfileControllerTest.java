package dev.kurama.api.core.rest;

import static dev.kurama.api.core.constant.RestPathConstant.USER_PROFILE_PATH;
import static dev.kurama.api.core.rest.UserProfileController.USER_PROFILE_CHANGE_PASSWORD_PATH;
import static dev.kurama.api.core.rest.UserProfileController.USER_PROFILE_PREFERENCES;
import static dev.kurama.api.core.rest.UserProfileController.USER_PROFILE_UPLOAD_AVATAR_PATH;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static dev.kurama.api.framework.JsonUtils.asJsonString;
import static org.hamcrest.Matchers.equalTo;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.kurama.api.core.exception.ExceptionHandlers;
import dev.kurama.api.core.exception.domain.not.found.UserNotFoundException;
import dev.kurama.api.core.facade.UserFacade;
import dev.kurama.api.core.facade.UserPreferencesFacade;
import dev.kurama.api.core.hateoas.input.ChangeUserPasswordInput;
import dev.kurama.api.core.hateoas.input.UserPreferencesInput;
import dev.kurama.api.core.hateoas.input.UserProfileUpdateInput;
import dev.kurama.api.core.hateoas.model.UserModel;
import dev.kurama.api.core.hateoas.model.UserPreferencesModel;
import dev.kurama.api.core.rest.UserProfileControllerTest.UserProfileControllerConfig;
import dev.kurama.api.core.utility.AuthorityUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = {UserProfileController.class})
@Import(UserProfileControllerConfig.class)
class UserProfileControllerTest {

  @Autowired
  private UserFacade userFacade;

  @Autowired
  private UserPreferencesFacade userPreferencesFacade;

  @Autowired
  private UserProfileController controller;

  private MockMvc mockMvc;

  @BeforeEach
  void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(controller).setControllerAdvice(new ExceptionHandlers()).build();
  }

  @Nested
  class UserProfileTests {

    UserModel expected = UserModel.builder().id(randomUUID()).build();

    @Nested
    class GetUserProfileTests {

      @Test
      void should_get_user_profile() throws Exception {
        when(userFacade.findByUserId(expected.getId())).thenReturn(expected);
        try (MockedStatic<AuthorityUtils> utilities = Mockito.mockStatic(AuthorityUtils.class)) {
          utilities.when(AuthorityUtils::getCurrentUserId).thenReturn(expected.getId());

          mockMvc.perform(get(USER_PROFILE_PATH)).andExpect(status().isOk())
            .andExpect(jsonPath("$.id", equalTo(expected.getId())));
        }
      }

      @Test
      void should_throw_user_not_found() throws Exception {
        when(userFacade.findByUserId(expected.getId())).thenThrow(UserNotFoundException.class);
        try (MockedStatic<AuthorityUtils> utilities = Mockito.mockStatic(AuthorityUtils.class)) {
          utilities.when(AuthorityUtils::getCurrentUserId).thenReturn(expected.getId());

          mockMvc.perform(get(USER_PROFILE_PATH)).andExpect(status().isNotFound());
        }
      }
    }

    @Nested
    class UpdateProfileTests {

      UserProfileUpdateInput input = UserProfileUpdateInput.builder().firstname("first name").lastname("last name")
        .build();

      @Test
      void should_update_user_profile() throws Exception {
        when(userFacade.updateProfile(expected.getId(), input)).thenReturn(expected);
        try (MockedStatic<AuthorityUtils> utilities = Mockito.mockStatic(AuthorityUtils.class)) {
          utilities.when(AuthorityUtils::getCurrentUserId).thenReturn(expected.getId());

          mockMvc.perform(
              patch(USER_PROFILE_PATH).accept(MediaType.APPLICATION_JSON).contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(input))).andExpect(status().isOk())
            .andExpect(jsonPath("$.id", equalTo(expected.getId())));
        }
      }

      @Test
      void should_throw_user_not_found() throws Exception {
        when(userFacade.updateProfile(expected.getId(), input)).thenThrow(UserNotFoundException.class);
        try (MockedStatic<AuthorityUtils> utilities = Mockito.mockStatic(AuthorityUtils.class)) {
          utilities.when(AuthorityUtils::getCurrentUserId).thenReturn(expected.getId());

          mockMvc.perform(
            patch(USER_PROFILE_PATH).accept(MediaType.APPLICATION_JSON).contentType(MediaType.APPLICATION_JSON)
              .content(asJsonString(input))).andExpect(status().isNotFound());
        }
      }
    }

    @Nested
    class ChangePasswordTests {

      ChangeUserPasswordInput input = ChangeUserPasswordInput.builder().password("old-password")
        .newPassword("new-password").build();

      @Test
      void should_change_user_password() throws Exception {
        when(userFacade.changePassword(expected.getId(), input)).thenReturn(expected);
        try (MockedStatic<AuthorityUtils> utilities = Mockito.mockStatic(AuthorityUtils.class)) {
          utilities.when(AuthorityUtils::getCurrentUserId).thenReturn(expected.getId());

          mockMvc.perform(
              patch(USER_PROFILE_PATH + USER_PROFILE_CHANGE_PASSWORD_PATH).accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON).content(asJsonString(input))).andExpect(status().isOk())
            .andExpect(jsonPath("$.id", equalTo(expected.getId())));
        }
      }

      @Test
      void should_throw_user_not_found() throws Exception {
        when(userFacade.changePassword(expected.getId(), input)).thenThrow(UserNotFoundException.class);
        try (MockedStatic<AuthorityUtils> utilities = Mockito.mockStatic(AuthorityUtils.class)) {
          utilities.when(AuthorityUtils::getCurrentUserId).thenReturn(expected.getId());

          mockMvc.perform(
            patch(USER_PROFILE_PATH + USER_PROFILE_CHANGE_PASSWORD_PATH).accept(MediaType.APPLICATION_JSON)
              .contentType(MediaType.APPLICATION_JSON).content(asJsonString(input))).andExpect(status().isNotFound());
        }
      }
    }

    @Nested
    class UploadAvatarTests {

      MockMultipartFile avatar = new MockMultipartFile("avatar", "avatar.png", "image/png", "avatar_file".getBytes());

      @Test
      void should_upload_avatar() throws Exception {
        when(userFacade.uploadAvatar(expected.getId(), avatar)).thenReturn(expected);
        try (MockedStatic<AuthorityUtils> utilities = Mockito.mockStatic(AuthorityUtils.class)) {
          utilities.when(AuthorityUtils::getCurrentUserId).thenReturn(expected.getId());

          mockMvc.perform(multipart(USER_PROFILE_PATH + USER_PROFILE_UPLOAD_AVATAR_PATH).file(avatar).with(request -> {
              request.setMethod(HttpMethod.PATCH.toString());
              return request;
            }).accept(MediaType.APPLICATION_JSON).contentType(MediaType.MULTIPART_FORM_DATA_VALUE))
            .andExpect(status().isOk()).andExpect(jsonPath("$.id", equalTo(expected.getId())));
        }
      }

      @Test
      void should_throw_user_not_found() throws Exception {
        when(userFacade.uploadAvatar(expected.getId(), avatar)).thenThrow(UserNotFoundException.class);
        try (MockedStatic<AuthorityUtils> utilities = Mockito.mockStatic(AuthorityUtils.class)) {
          utilities.when(AuthorityUtils::getCurrentUserId).thenReturn(expected.getId());

          mockMvc.perform(multipart(USER_PROFILE_PATH + USER_PROFILE_UPLOAD_AVATAR_PATH).file(avatar).with(request -> {
              request.setMethod(HttpMethod.PATCH.toString());
              return request;
            }).accept(MediaType.APPLICATION_JSON).contentType(MediaType.MULTIPART_FORM_DATA_VALUE))
            .andExpect(status().isNotFound());
        }
      }
    }

    @Nested
    class DeleteProfileTests {

      @Test
      void should_delete_profile() throws Exception {
        try (MockedStatic<AuthorityUtils> utilities = Mockito.mockStatic(AuthorityUtils.class)) {
          utilities.when(AuthorityUtils::getCurrentUserId).thenReturn(expected.getId());

          mockMvc.perform(delete(USER_PROFILE_PATH)).andExpect(status().isNoContent());

          verify(userFacade).deleteById(expected.getId());
        }
      }

      @Test
      void should_throw_user_not_found() throws Exception {
        doThrow(UserNotFoundException.class).when(userFacade).deleteById(expected.getId());
        try (MockedStatic<AuthorityUtils> utilities = Mockito.mockStatic(AuthorityUtils.class)) {
          utilities.when(AuthorityUtils::getCurrentUserId).thenReturn(expected.getId());

          mockMvc.perform(delete(USER_PROFILE_PATH)).andExpect(status().isNotFound());
        }
      }
    }
  }

  @Nested
  class UserProfilePreferencesTests {

    UserPreferencesModel expected = UserPreferencesModel.builder().id(randomUUID()).darkMode(false)
      .contentLanguage("de").build();

    @Nested
    class GetUserPreferencesTests {

      @Test
      void should_get_preferences() throws Exception {
        when(userPreferencesFacade.findByUserId(expected.getId())).thenReturn(expected);
        try (MockedStatic<AuthorityUtils> utilities = Mockito.mockStatic(AuthorityUtils.class)) {
          utilities.when(AuthorityUtils::getCurrentUserId).thenReturn(expected.getId());

          mockMvc.perform(get(USER_PROFILE_PATH + USER_PROFILE_PREFERENCES)).andExpect(status().isOk())
            .andExpect(jsonPath("$.id", equalTo(expected.getId())))
            .andExpect(jsonPath("$.darkMode", equalTo(expected.isDarkMode())))
            .andExpect(jsonPath("$.contentLanguage", equalTo(expected.getContentLanguage())));
        }
      }

      @Test
      void should_update_user_preferences() throws Exception {
        UserPreferencesInput input = UserPreferencesInput.builder().darkMode(true).contentLanguage("en").build();
        when(userPreferencesFacade.updateByUserId(expected.getId(), input)).thenReturn(expected);
        try (MockedStatic<AuthorityUtils> utilities = Mockito.mockStatic(AuthorityUtils.class)) {
          utilities.when(AuthorityUtils::getCurrentUserId).thenReturn(expected.getId());

          mockMvc.perform(patch(USER_PROFILE_PATH + USER_PROFILE_PREFERENCES).accept(MediaType.APPLICATION_JSON)
              .contentType(MediaType.APPLICATION_JSON).content(asJsonString(input))).andExpect(status().isOk())
            .andExpect(jsonPath("$.id", equalTo(expected.getId())))
            .andExpect(jsonPath("$.darkMode", equalTo(expected.isDarkMode())))
            .andExpect(jsonPath("$.contentLanguage", equalTo(expected.getContentLanguage())));
        }
      }
    }
  }

  @TestConfiguration
  protected static class UserProfileControllerConfig {

    @Bean
    public UserFacade userFacade() {
      return Mockito.mock(UserFacade.class);
    }

    @Bean
    public UserPreferencesFacade userPreferencesFacade() {
      return Mockito.mock(UserPreferencesFacade.class);
    }
  }
}

