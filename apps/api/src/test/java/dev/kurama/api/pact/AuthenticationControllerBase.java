package dev.kurama.api.pact;

import dev.kurama.api.core.hateoas.input.GlobalSettingsUpdateInput;
import dev.kurama.api.core.service.GlobalSettingsService;
import lombok.SneakyThrows;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;

public abstract class AuthenticationControllerBase extends PactBase {

  @Autowired
  private GlobalSettingsService globalSettingsService;

  @SneakyThrows
  @Override
  @BeforeEach
  void setUp() {
    super.setUp();

    globalSettingsService.updateGlobalSettings(GlobalSettingsUpdateInput.builder().signupOpen(true).build());
  }
}
