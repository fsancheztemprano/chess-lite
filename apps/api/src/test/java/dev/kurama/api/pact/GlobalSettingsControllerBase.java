package dev.kurama.api.pact;

import static com.google.common.collect.Sets.newHashSet;
import static org.mockito.Mockito.doReturn;

import dev.kurama.api.core.domain.Authority;
import dev.kurama.api.core.domain.GlobalSettings;
import dev.kurama.api.core.domain.Role;
import dev.kurama.api.core.facade.GlobalSettingsFacade;
import dev.kurama.api.core.hateoas.input.GlobalSettingsUpdateInput;
import dev.kurama.api.core.hateoas.processor.GlobalSettingsModelProcessor;
import dev.kurama.api.core.rest.GlobalSettingsController;
import dev.kurama.api.core.service.GlobalSettingsService;
import dev.kurama.support.ImportMappers;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;

@WebMvcTest(controllers = GlobalSettingsController.class)
@Import({GlobalSettingsFacade.class, GlobalSettingsModelProcessor.class})
@ImportMappers
public abstract class GlobalSettingsControllerBase extends PactBase {

  @MockBean
  private GlobalSettingsService globalSettingsService;

  @Override
  @BeforeEach
  void setUp() throws Exception {
    super.setUp();

    GlobalSettings globalSettings = GlobalSettings.builder()
      .defaultRole(Role.builder()
        .id("defaultPactRoleId")
        .name("DEFAULT_PACT_ROLE")
        .coreRole(false)
        .canLogin(true)
        .authorities(newHashSet(Authority.builder().setRandomUUID().name("pact:update").build(),
          Authority.builder().setRandomUUID().name("pact:read").build(),
          Authority.builder().setRandomUUID().name("pact:delete").build()))
        .build())
      .signupOpen(true)
      .build();

    doReturn(globalSettings).when(globalSettingsService).getGlobalSettings();
    doReturn(globalSettings).when(globalSettingsService)
      .updateGlobalSettings(GlobalSettingsUpdateInput.builder().signupOpen(true).build());
  }
}
