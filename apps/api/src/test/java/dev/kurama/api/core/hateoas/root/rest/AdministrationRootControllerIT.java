package dev.kurama.api.core.hateoas.root.rest;

import dev.kurama.api.core.hateoas.root.processor.AdministrationRootResourceAssembler;
import dev.kurama.api.support.ImportTestSecurityConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@ActiveProfiles(value = "integration-test")
@ImportTestSecurityConfiguration
@WebMvcTest(controllers = AdministrationRootController.class)
@Import(AdministrationRootResourceAssembler.class)
class AdministrationRootControllerIT {

  @Autowired
  private MockMvc mockMvc;


}
