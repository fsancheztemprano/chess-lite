package dev.kurama.api.pact;

import dev.kurama.support.PactDataLoader;
import org.junit.jupiter.api.BeforeAll;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;

@Import(PactDataLoader.class)
public abstract class AuthenticationControllerBase extends PactBase {

  @BeforeAll
  static void beforeAll(@Autowired PactDataLoader dataLoader) {
    dataLoader.initialize();
  }
}
