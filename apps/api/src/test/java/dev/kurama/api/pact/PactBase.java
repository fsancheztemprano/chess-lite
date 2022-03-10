package dev.kurama.api.pact;

import static io.restassured.module.mockmvc.RestAssuredMockMvc.webAppContextSetup;

import dev.kurama.support.ImportTestSecurityConfiguration;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.web.context.WebApplicationContext;

@EnableSpringDataWebSupport
@ImportTestSecurityConfiguration
public abstract class PactBase {

  @Autowired
  protected WebApplicationContext context;

  @BeforeEach
  void setUp() throws Exception {
    webAppContextSetup(context);
  }
}
