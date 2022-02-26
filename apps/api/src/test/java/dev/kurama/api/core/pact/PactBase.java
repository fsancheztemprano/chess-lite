package dev.kurama.api.core.pact;

import static io.restassured.module.mockmvc.RestAssuredMockMvc.webAppContextSetup;

import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.context.WebApplicationContext;

@SpringBootTest
public abstract class PactBase {

  @Autowired
  protected WebApplicationContext context;

  @BeforeEach
  void setUp() {
    webAppContextSetup(context);
  }
}
