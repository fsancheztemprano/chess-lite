package dev.kurama.api.zypress;


import static org.assertj.core.api.Assertions.assertThat;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;
import java.util.logging.Level;
import lombok.extern.flogger.Flogger;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.Testcontainers;
import org.testcontainers.containers.BindMode;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.output.OutputFrame;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles({"integration-test", "e2e"})
@Flogger
public class CypressE2E {

  @LocalServerPort
  private int port;

  private static final int MAX_TOTAL_TEST_TIME_IN_MINUTES = 15;

  @Test
  void runCypressTests() throws InterruptedException {
    Testcontainers.exposeHostPorts(port);
    CountDownLatch countDownLatch = new CountDownLatch(1);
    try (GenericContainer container = createCypressContainer()) {
      container.withLogConsumer((Consumer<OutputFrame>) outputFrame -> {
        String output = outputFrame.getUtf8String().replace("\n", "").replace("?", "-");
        switch (outputFrame.getType()) {
          case STDOUT:
            if (!output.contains("┐")
              && !output.contains("┘")
              && !output.contains("39m─────────────────────")
              && (!output.contains("-----------------") || output.contains("----------------------------------"))) {
              log.at(Level.INFO).log(output);
            }
            break;
          case STDERR:
            log.at(Level.WARNING).log(output);
            break;
          case END:
            log.at(Level.INFO).log(outputFrame.getType().name());
            countDownLatch.countDown();
            break;
        }
      });
      container.start();
      countDownLatch.await(MAX_TOTAL_TEST_TIME_IN_MINUTES, TimeUnit.MINUTES);

      assertThat(container.getLogs().replace("?", "-")).contains("All specs passed!");
    }
  }

  private GenericContainer createCypressContainer() {
    return new GenericContainer("cypress/included:10.5.0")
      //
      .withFileSystemBind("../../", "/e2e", BindMode.READ_WRITE)
      .withWorkingDirectory("/e2e/apps/app-e2e")
      .withEnv("CYPRESS_baseUrl", String.format("http://%s:%d/app", GenericContainer.INTERNAL_HOST_HOSTNAME, port))
      .withEnv("CYPRESS_apiUrl", String.format("http://%s:%d/api", GenericContainer.INTERNAL_HOST_HOSTNAME, port));
  }
}
