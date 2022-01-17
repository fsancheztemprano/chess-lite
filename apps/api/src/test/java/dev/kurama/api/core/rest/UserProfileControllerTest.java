package dev.kurama.api.core.rest;

import static dev.kurama.api.core.constant.RestPathConstant.USER_PROFILE_PATH;
import static org.hamcrest.Matchers.equalTo;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.kurama.api.core.exception.ExceptionHandlers;
import dev.kurama.api.core.exception.domain.not.found.UserNotFoundException;
import dev.kurama.api.core.facade.UserFacade;
import dev.kurama.api.core.facade.UserPreferencesFacade;
import dev.kurama.api.core.hateoas.model.UserModel;
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
  class GetUserProfileTests {

    @Test
    void should_get_user_profile() throws Exception {
      UserModel expected = UserModel.builder().id("u1").build();
      when(userFacade.findByUserId(expected.getId())).thenReturn(expected);
      try (MockedStatic<AuthorityUtils> utilities = Mockito.mockStatic(AuthorityUtils.class)) {
        utilities.when(AuthorityUtils::getCurrentUserId).thenReturn(expected.getId());

        mockMvc.perform(get(USER_PROFILE_PATH))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.id", equalTo(expected.getId())));
      }
    }

    @Test
    void should_throw_user_not_found() throws Exception {
      UserModel expected = UserModel.builder().id("u1").build();
      when(userFacade.findByUserId(expected.getId())).thenThrow(UserNotFoundException.class);
      try (MockedStatic<AuthorityUtils> utilities = Mockito.mockStatic(AuthorityUtils.class)) {
        utilities.when(AuthorityUtils::getCurrentUserId).thenReturn(expected.getId());

        mockMvc.perform(get(USER_PROFILE_PATH))
          .andExpect(status().isNotFound());
      }
    }
  }


  @Test
  void updateProfile() {
  }

  @Test
  void changePassword() {
  }

  @Test
  void uploadAvatar() {
  }

  @Test
  void deleteProfile() {
  }

  @Test
  void getPreferences() {
  }

  @Test
  void updatePreferences() {
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

