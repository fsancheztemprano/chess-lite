package dev.kurama.api.pact;

import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.doThrow;

import dev.kurama.api.core.exception.domain.exists.UserExistsException;
import dev.kurama.api.core.facade.AuthenticationFacade;
import dev.kurama.api.core.rest.AuthenticationController;
import dev.kurama.api.core.service.AuthenticationFacility;
import dev.kurama.api.core.service.UserService;
import dev.kurama.support.ImportMappers;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;

@WebMvcTest(controllers = AuthenticationController.class)
@Import({AuthenticationFacade.class})
@ImportMappers
public abstract class AuthenticationControllerBase extends PactBase {

  @MockBean
  private UserService userService;

  @MockBean
  private AuthenticationFacility authenticationFacility;

  @Override
  @BeforeEach
  void setUp() throws Exception {
    super.setUp();

    doThrow(new UserExistsException("johnDoe@example.com")).when(userService)
      .signup(argThat(input -> input.getEmail().equals("johnDoe@example.com")));

  }
}
