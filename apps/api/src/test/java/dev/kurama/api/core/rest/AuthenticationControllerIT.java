package dev.kurama.api.core.rest;

import static dev.kurama.api.core.constant.RestPathConstant.AUTHENTICATION_PATH;
import static dev.kurama.api.core.rest.AuthenticationController.SIGNUP_PATH;
import static dev.kurama.api.support.JsonUtils.asJsonString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.kurama.api.core.facade.AuthenticationFacade;
import dev.kurama.api.core.hateoas.input.SignupInput;
import dev.kurama.api.core.service.AuthenticationFacility;
import dev.kurama.api.core.service.UserService;
import dev.kurama.api.support.ImportMappers;
import dev.kurama.api.support.ImportTestSecurityConfiguration;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@ActiveProfiles(value = "integration-test")
@WebMvcTest(controllers = AuthenticationController.class)
@Import({AuthenticationFacade.class})
@ImportMappers
@ImportTestSecurityConfiguration
class AuthenticationControllerIT {

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private UserService userService;

  @MockBean
  private AuthenticationFacility authenticationFacility;

  @Test
  void should_signup_new_user() throws Exception {
    SignupInput input = SignupInput.builder()
      .firstname("firstname")
      .lastname("lastname")
      .username("username")
      .email("em@i.l")
      .build();

    mockMvc.perform(
        post(AUTHENTICATION_PATH + SIGNUP_PATH).accept(MediaType.APPLICATION_JSON)
          .contentType(MediaType.APPLICATION_JSON)
          .content(asJsonString(input)))
      .andExpect(status().isOk());

    verify(userService, times(1)).signup(input);
  }
}
