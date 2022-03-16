package dev.kurama.api.pact;

import static dev.kurama.api.pact.PactTemplate.pactUser;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;

import dev.kurama.api.core.domain.UserPreferences;
import dev.kurama.api.core.exception.domain.not.found.EntityNotFoundException;
import dev.kurama.api.core.facade.UserPreferencesFacade;
import dev.kurama.api.core.hateoas.processor.UserPreferencesModelProcessor;
import dev.kurama.api.core.rest.UserPreferencesController;
import dev.kurama.api.core.service.UserPreferencesService;
import dev.kurama.support.ImportMappers;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;

@WebMvcTest(controllers = UserPreferencesController.class)
@Import({UserPreferencesFacade.class, UserPreferencesModelProcessor.class})
@ImportMappers
public abstract class UserPreferencesControllerBase extends PactBase {

  @MockBean
  private UserPreferencesService userPreferencesService;


  @Override
  protected void beforeEach() throws Exception {
    UserPreferences pactUserPreferences = pactUser().getUserPreferences();

    doReturn(pactUserPreferences).when(userPreferencesService).findUserPreferencesById(pactUserPreferences.getId());
    doThrow(new EntityNotFoundException("notFoundId", UserPreferences.class)).when(userPreferencesService)
      .findUserPreferencesById("notFoundId");

    doReturn(pactUserPreferences).when(userPreferencesService)
      .updateUserPreferences(eq(pactUserPreferences.getId()), argThat(input -> input.getDarkMode().equals(true)));
    doThrow(new EntityNotFoundException("notFoundId", UserPreferences.class)).when(userPreferencesService)
      .updateUserPreferences(eq("notFoundId"), any());

  }
}
