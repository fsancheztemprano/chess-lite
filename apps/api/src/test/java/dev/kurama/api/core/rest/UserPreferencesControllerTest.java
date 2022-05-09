package dev.kurama.api.core.rest;

import static dev.kurama.api.core.constant.RestPathConstant.USER_PREFERENCES_PATH;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static dev.kurama.support.JsonUtils.asJsonString;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.hamcrest.Matchers.equalTo;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.kurama.api.core.exception.ExceptionHandlers;
import dev.kurama.api.core.exception.domain.not.found.EntityNotFoundException;
import dev.kurama.api.core.facade.UserPreferencesFacade;
import dev.kurama.api.core.hateoas.input.UserPreferencesInput;
import dev.kurama.api.core.hateoas.model.UserPreferencesModel;
import dev.kurama.api.core.rest.UserPreferencesControllerTest.UserPreferencesControllerConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.hateoas.MediaTypes;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = {UserPreferencesController.class})
@Import(UserPreferencesControllerConfig.class)
class UserPreferencesControllerTest {

  @Autowired
  private UserPreferencesFacade facade;

  @Autowired
  private UserPreferencesController controller;

  private MockMvc mockMvc;

  @BeforeEach
  void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(controller).setControllerAdvice(new ExceptionHandlers()).build();
  }

  @Nested
  class GetUserPreferencesTests {

    @Test
    void should_get_user_preferences_by_id() throws Exception {
      UserPreferencesModel expected = UserPreferencesModel.builder()
        .id(randomUUID())
        .darkMode(true)
        .contentLanguage(randomAlphanumeric(2))
        .build();
      when(facade.findById(expected.getId())).thenReturn(expected);

      mockMvc.perform(get(USER_PREFERENCES_PATH + "/" + expected.getId()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", equalTo(expected.getId())));
    }

    @Test
    void should_throw_getting_user_preferences_if_id_does_not_exist() throws Exception {
      String notFoundId = randomUUID();
      doThrow(EntityNotFoundException.class).when(facade).findById(notFoundId);

      mockMvc.perform(get(USER_PREFERENCES_PATH + "/" + notFoundId)).andExpect(status().isNotFound());

    }
  }

  @Nested
  class UpdateUserPreferencesTests {

    @Test
    void should_update_user_preferences() throws Exception {
      UserPreferencesInput input = UserPreferencesInput.builder()
        .darkMode(false)
        .contentLanguage(randomAlphanumeric(2))
        .build();
      UserPreferencesModel expected = UserPreferencesModel.builder()
        .id(randomUUID())
        .darkMode(true)
        .contentLanguage(randomAlphanumeric(2))
        .build();
      when(facade.updateById(expected.getId(), input)).thenReturn(expected);

      mockMvc.perform(patch(USER_PREFERENCES_PATH + "/" + expected.getId()).accept(MediaTypes.HAL_FORMS_JSON_VALUE)
          .contentType(MediaType.APPLICATION_JSON)
          .content(asJsonString(input)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", equalTo(expected.getId())));

    }

    @Test
    void should_throw_updating_user_preferences_if_id_does_not_exist() throws Exception {
      String notFoundId = randomUUID();
      UserPreferencesInput input = UserPreferencesInput.builder()
        .darkMode(false)
        .contentLanguage(randomAlphanumeric(2))
        .build();
      doThrow(EntityNotFoundException.class).when(facade).updateById(notFoundId, input);

      mockMvc.perform(patch(USER_PREFERENCES_PATH + "/" + notFoundId).accept(MediaTypes.HAL_FORMS_JSON_VALUE)
        .contentType(MediaType.APPLICATION_JSON)
        .content(asJsonString(input))).andExpect(status().isNotFound());

    }
  }

  @TestConfiguration
  protected static class UserPreferencesControllerConfig {

    @Bean
    public UserPreferencesFacade userPreferencesFacade() {
      return Mockito.mock(UserPreferencesFacade.class);
    }
  }
}
