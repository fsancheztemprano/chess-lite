package dev.kurama.api.pact;

import dev.kurama.api.core.hateoas.root.processor.AdministrationRootResourceAssembler;
import dev.kurama.api.core.hateoas.root.rest.AdministrationRootController;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;

@WebMvcTest(controllers = AdministrationRootController.class)
@Import(AdministrationRootResourceAssembler.class)
public abstract class AdministrationRootControllerBase extends PactBase {

}
