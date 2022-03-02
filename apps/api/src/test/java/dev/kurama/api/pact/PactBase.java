package dev.kurama.api.pact;

import static io.restassured.module.mockmvc.RestAssuredMockMvc.webAppContextSetup;

import org.junit.jupiter.api.BeforeAll;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.context.WebApplicationContext;

@ActiveProfiles("pact-test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public abstract class PactBase {

  @Autowired
  protected WebApplicationContext context;

  @BeforeAll
  static void beforeAll(@Autowired WebApplicationContext context) {
    webAppContextSetup(context);
  }
}
