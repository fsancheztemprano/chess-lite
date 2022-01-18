package dev.kurama.api;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles(value = "integration-test")
class BackendApplicationIT {

  @Test
  void contextLoads() {
  }

}
