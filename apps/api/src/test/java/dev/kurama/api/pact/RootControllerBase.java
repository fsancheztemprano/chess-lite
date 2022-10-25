package dev.kurama.api.pact;

import dev.kurama.api.core.hateoas.root.processor.RootResourceAssembler;
import dev.kurama.api.core.hateoas.root.rest.RootController;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;

@WebMvcTest(controllers = RootController.class)
@Import({RootResourceAssembler.class})
public abstract class RootControllerBase extends PactBase {

}
