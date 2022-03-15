package dev.kurama.api.pact;

import static dev.kurama.api.pact.PactTemplate.pactUser;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;

import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.exception.domain.not.found.UserNotFoundException;
import dev.kurama.api.core.facade.UserFacade;
import dev.kurama.api.core.facade.UserPreferencesFacade;
import dev.kurama.api.core.hateoas.assembler.UserModelAssembler;
import dev.kurama.api.core.hateoas.processor.UserModelProcessor;
import dev.kurama.api.core.hateoas.processor.UserPreferencesModelProcessor;
import dev.kurama.api.core.rest.UserProfileController;
import dev.kurama.api.core.service.AuthenticationFacility;
import dev.kurama.api.core.service.UserPreferencesService;
import dev.kurama.api.core.service.UserService;
import dev.kurama.support.ImportMappers;
import java.util.Optional;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;

@WebMvcTest(controllers = UserProfileController.class)
@Import({UserFacade.class, UserPreferencesFacade.class, UserModelProcessor.class, UserModelAssembler.class,
  UserPreferencesModelProcessor.class})
@ImportMappers
public class UserProfileControllerBase extends PactBase {

  @MockBean
  private UserService userService;

  @MockBean
  private AuthenticationFacility authenticationFacility;

  @MockBean
  private UserPreferencesService userPreferencesService;

  @Override
  protected void beforeEach() throws Exception {
    User pactUser = pactUser();

    doReturn(Optional.of(pactUser)).when(userService).findUserById("pactUserId");
    doReturn(pactUser).when(userService)
      .updateUser(eq("pactUserId"), argThat(input -> input.getFirstname().equals("pactUserFirstname")));
    doThrow(new UserNotFoundException("notFoundId")).when(userService).updateUser(eq("notFoundId"), any());
  }
}
