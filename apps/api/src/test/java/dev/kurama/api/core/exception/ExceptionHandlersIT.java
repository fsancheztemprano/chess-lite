package dev.kurama.api.core.exception;

import static com.google.common.collect.Lists.newArrayList;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.auth0.jwt.exceptions.TokenExpiredException;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.exception.domain.ForbiddenException;
import dev.kurama.api.core.exception.domain.ImmutableRoleException;
import dev.kurama.api.core.exception.domain.RoleCanNotLoginException;
import dev.kurama.api.core.exception.domain.SignupClosedException;
import dev.kurama.api.core.exception.domain.exists.EntityExistsException;
import dev.kurama.api.core.exception.domain.not.found.EntityNotFoundException;
import dev.kurama.support.ImportTestSecurityConfiguration;
import java.io.IOException;
import java.util.NoSuchElementException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.NoHandlerFoundException;


@RunWith(SpringRunner.class)
@ImportTestSecurityConfiguration
@WebMvcTest(controllers = ExceptionHandlersIT.ExceptionHandlersTestController.class)
@WithMockUser
class ExceptionHandlersIT {

  private MockMvc mockMvc;

  @BeforeEach
  void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(new ExceptionHandlersTest.ExceptionHandlersTestController())
      .setControllerAdvice(new ExceptionHandlers())
      .build();
  }

  @Test
  void ok_request_should_return_200() throws Exception {
    mockMvc.perform(get("/ok")).andExpect(status().isOk());
  }

  @Test
  void null_pointer_exception_should_return_bad_request() throws Exception {
    mockMvc.perform(get("/NullPointerException")).andExpect(status().isBadRequest());
  }

  @Test
  void illegal_argument_exception_should_return_bad_request() throws Exception {
    mockMvc.perform(get("/IllegalArgumentException")).andExpect(status().isBadRequest());
  }

  @Test
  void account_disabled_exception_should_return_bad_request() throws Exception {
    mockMvc.perform(get("/accountDisabledException")).andExpect(status().isBadRequest());
  }

  @Test
  void bad_credentials_exception_should_return_bad_request() throws Exception {
    mockMvc.perform(get("/badCredentialsException")).andExpect(status().isBadRequest());
  }

  @Test
  void locked_exception_should_return_unauthorized() throws Exception {
    mockMvc.perform(get("/lockedException")).andExpect(status().isUnauthorized());
  }

  @Test
  void role_can_not_login_exception_should_return_unauthorized() throws Exception {
    mockMvc.perform(get("/roleCanNotLoginException")).andExpect(status().isUnauthorized());
  }

  @Test
  void token_expired_exception_should_return_unauthorized() throws Exception {
    mockMvc.perform(get("/tokenExpiredException")).andExpect(status().isUnauthorized());
  }

  @Test
  void immutable_role_exception_should_return_forbidden() throws Exception {
    mockMvc.perform(get("/immutableRoleException")).andExpect(status().isForbidden());
  }

  @Test
  void signup_closed_exception_should_return_forbidden() throws Exception {
    mockMvc.perform(get("/signupClosedException")).andExpect(status().isForbidden());
  }

  @Test
  void entity_exists_exception_should_return_conflict() throws Exception {
    mockMvc.perform(get("/entityExistsException")).andExpect(status().isConflict());
  }

  @Test
  void entity_not_found_exception_should_return_not_found() throws Exception {
    mockMvc.perform(get("/entityNotFoundException")).andExpect(status().isNotFound());
  }

  @Test
  void not_found_exception_should_return_not_found() throws Exception {
    mockMvc.perform(get("/notFoundException")).andExpect(status().isNotFound());
  }


  @Test
  void method_not_supported_exception_should_return_method_not_allowed() throws Exception {
    mockMvc.perform(get("/methodNotSupportedException")).andExpect(status().isMethodNotAllowed());
  }

  @Test
  void i_o_exception_should_return_internal_server_error() throws Exception {
    mockMvc.perform(get("/iOException")).andExpect(status().isInternalServerError());
  }

  @Test
  void no_handler_found_exception_should_return_bad_request() throws Exception {
    mockMvc.perform(get("/noHandlerFoundException")).andExpect(status().isBadRequest());
  }

  @RestController
  protected static class ExceptionHandlersTestController {

    @ResponseStatus(HttpStatus.OK)
    @GetMapping(path = "/ok")
    public void ok() {
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping(path = "/accountDisabledException")
    public void accountDisabledException() {
      throw new DisabledException(null);
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping(path = "/NullPointerException")
    public void NullPointerException() {
      throw new NullPointerException(null);
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping(path = "/IllegalArgumentException")
    public void IllegalArgumentException() {
      throw new IllegalArgumentException();
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping(path = "/badCredentialsException")
    public void badCredentialsException() {
      throw new BadCredentialsException(null);
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping(path = "/lockedException")
    public void lockedException() {
      throw new LockedException(null);
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping(path = "/roleCanNotLoginException")
    public void roleCanNotLoginException() throws RoleCanNotLoginException {
      throw new RoleCanNotLoginException(null);
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping(path = "/tokenExpiredException")
    public void tokenExpiredException() {
      throw new TokenExpiredException(null, null);
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping(path = "/immutableRoleException")
    public void immutableRoleException() throws ImmutableRoleException {
      throw new ImmutableRoleException(null);
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping(path = "/signupClosedException")
    public void signupClosedException() throws SignupClosedException {
      throw new SignupClosedException();
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping(path = "/forbiddenException")
    public void forbiddenException() throws ForbiddenException {
      throw new ForbiddenException("id");
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping(path = "/entityExistsException")
    public void entityExistsException() throws EntityExistsException {
      throw new EntityExistsException("id", User.class);
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping(path = "/entityNotFoundException")
    public void entityNotFoundException() throws EntityNotFoundException {
      throw new EntityNotFoundException("id", User.class);
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping(path = "/notFoundException")
    public void notFoundException() {
      throw new NoSuchElementException();
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping(path = "/methodNotSupportedException")
    public void methodNotSupportedException() throws HttpRequestMethodNotSupportedException {
      throw new HttpRequestMethodNotSupportedException("TRACE", newArrayList("GET", "POST"));
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping(path = "/iOException")
    public void iOException() throws IOException {
      throw new IOException();
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping(path = "/noHandlerFoundException")
    public void noHandlerFoundException() throws NoHandlerFoundException {
      throw new NoHandlerFoundException("TRACE", "localhost:8080", new HttpHeaders());
    }
  }
}
