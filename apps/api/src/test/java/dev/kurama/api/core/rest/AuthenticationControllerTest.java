package dev.kurama.api.core.rest;

import static dev.kurama.api.core.constant.RestPathConstant.AUTHENTICATION_PATH;
import static dev.kurama.api.core.rest.AuthenticationController.ACTIVATE_PATH;
import static dev.kurama.api.core.rest.AuthenticationController.LOGIN_PATH;
import static dev.kurama.api.core.rest.AuthenticationController.SIGNUP_PATH;
import static dev.kurama.api.core.rest.AuthenticationController.TOKEN_PATH;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static dev.kurama.api.framework.JsonUtils.asJsonString;
import static org.hamcrest.Matchers.equalTo;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.kurama.api.core.constant.SecurityConstant;
import dev.kurama.api.core.domain.excerpts.AuthenticatedUserExcerpt;
import dev.kurama.api.core.exception.ExceptionHandlers;
import dev.kurama.api.core.facade.AuthenticationFacade;
import dev.kurama.api.core.hateoas.input.AccountActivationInput;
import dev.kurama.api.core.hateoas.input.LoginInput;
import dev.kurama.api.core.hateoas.input.RequestActivationTokenInput;
import dev.kurama.api.core.hateoas.input.SignupInput;
import dev.kurama.api.core.hateoas.model.UserModel;
import dev.kurama.api.core.rest.AuthenticationControllerTest.AuthenticationControllerConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = {AuthenticationController.class})
@Import(AuthenticationControllerConfig.class)
class AuthenticationControllerTest {

  @Autowired
  private AuthenticationFacade facade;

  @Autowired
  private AuthenticationController controller;

  private MockMvc mockMvc;

  @BeforeEach
  void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(controller).setControllerAdvice(new ExceptionHandlers()).build();
  }


  @Test
  void should_signup() throws Exception {
    SignupInput input = SignupInput.builder().firstname("firstname").lastname("lastname").username("username")
      .email("em@i.l").build();

    mockMvc.perform(
      post(AUTHENTICATION_PATH + SIGNUP_PATH).accept(MediaType.APPLICATION_JSON).contentType(MediaType.APPLICATION_JSON)
        .content(asJsonString(input))).andExpect(status().isOk());

    verify(facade).signup(input);
  }


  @Test
  void should_login() throws Exception {
    LoginInput input = LoginInput.builder().username("username").password("password").build();
    UserModel user = UserModel.builder().id(randomUUID()).build();
    String token = randomUUID();
    var headers = new HttpHeaders();
    headers.add(SecurityConstant.JWT_TOKEN_HEADER, token);
    AuthenticatedUserExcerpt expected = AuthenticatedUserExcerpt.builder().userModel(user).headers(headers).build();
    when(facade.login(input)).thenReturn(expected);

    mockMvc.perform(
        post(AUTHENTICATION_PATH + LOGIN_PATH).accept(MediaType.APPLICATION_JSON).contentType(MediaType.APPLICATION_JSON)
          .content(asJsonString(input))).andExpect(status().isOk()).andExpect(jsonPath("$.id", equalTo(user.getId())))
      .andExpect(header().stringValues(SecurityConstant.JWT_TOKEN_HEADER, token));
  }

  @Test
  void should_request_activation_token() throws Exception {
    RequestActivationTokenInput input = RequestActivationTokenInput.builder().email("em@i.l").build();

    mockMvc.perform(
      post(AUTHENTICATION_PATH + TOKEN_PATH).accept(MediaType.APPLICATION_JSON).contentType(MediaType.APPLICATION_JSON)
        .content(asJsonString(input))).andExpect(status().isOk());

    verify(facade).requestActivationToken(input.getEmail());
  }

  @Test
  void should_activate_account() throws Exception {
    AccountActivationInput input = AccountActivationInput.builder().email("em@i.l").password("password")
      .token(randomUUID()).build();

    mockMvc.perform(post(AUTHENTICATION_PATH + ACTIVATE_PATH).accept(MediaType.APPLICATION_JSON)
      .contentType(MediaType.APPLICATION_JSON).content(asJsonString(input))).andExpect(status().isOk());

    verify(facade).activateAccount(input);
  }

  @TestConfiguration
  protected static class AuthenticationControllerConfig {

    @Bean
    public AuthenticationFacade authenticationFacade() {
      return Mockito.mock(AuthenticationFacade.class);
    }
  }
}
