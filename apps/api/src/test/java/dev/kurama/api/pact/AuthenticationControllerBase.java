package dev.kurama.api.pact;

import static io.restassured.module.mockmvc.RestAssuredMockMvc.webAppContextSetup;

import dev.kurama.api.core.hateoas.input.GlobalSettingsUpdateInput;
import dev.kurama.api.core.hateoas.input.UserInput;
import dev.kurama.api.core.service.GlobalSettingsService;
import dev.kurama.api.core.service.UserService;
import lombok.SneakyThrows;
import org.junit.jupiter.api.BeforeAll;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.WebApplicationContext;

public abstract class AuthenticationControllerBase extends PactBase {

  @SneakyThrows
  @BeforeAll
  static void beforeAll(@Autowired WebApplicationContext context,
                        @Autowired GlobalSettingsService globalSettingsService,
                        @Autowired UserService userService) {
    webAppContextSetup(context);
    globalSettingsService.updateGlobalSettings(GlobalSettingsUpdateInput.builder().signupOpen(true).build());

    userService.createUser(
      UserInput.builder().username("username1").email("username1@example.com").password("username1").build());
  }
}
