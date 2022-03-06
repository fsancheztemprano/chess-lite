package dev.kurama.api.pact;

import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Import;

@Import(PactDataLoader.class)
@EnableAutoConfiguration()
public abstract class GlobalSettingsControllerBase extends PactBase {

  @Autowired
  private PactDataLoader dataLoader;

  @Override
  @BeforeEach
  void setUp() throws Exception {
    super.setUp();
    dataLoader.initialize();
  }

}
