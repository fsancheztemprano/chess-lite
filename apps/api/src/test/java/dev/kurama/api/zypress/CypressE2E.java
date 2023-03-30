package dev.kurama.api.zypress;


import static org.apache.commons.lang3.StringUtils.isEmpty;
import static org.assertj.core.api.Assertions.assertThat;

import com.google.common.collect.Lists;
import dev.kurama.api.core.service.UserService;
import java.util.ArrayList;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import lombok.extern.flogger.Flogger;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junitpioneer.jupiter.DisableIfTestFails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.Testcontainers;
import org.testcontainers.containers.BindMode;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.wait.strategy.Wait;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.utility.DockerImageName;

@DisableIfTestFails
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@org.testcontainers.junit.jupiter.Testcontainers()
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles({"integration-test", "e2e"})
@Flogger
class CypressE2E {

  @LocalServerPort
  private int port;

  @Autowired
  private UserService userService;

  @Value("${CYPRESS_RECORD_KEY:#{null}}")
  private String CYPRESS_RECORD_KEY;

  @Value("${CYPRESS_SAVE_VIDEO:#{false}}")
  private Boolean CYPRESS_SAVE_VIDEO;

  private static final int MAX_TOTAL_TEST_TIME_IN_MINUTES = 15;

  @Container
  static GenericContainer mailHogContainer = new GenericContainer<>(
    DockerImageName.parse("mailhog/mailhog:v1.0.1")).waitingFor(Wait.forLogMessage(".*Serving under.*", 1))
    .withExposedPorts(1025, 8025);

  @DynamicPropertySource
  static void configureMailHost(DynamicPropertyRegistry registry) {
    registry.add("spring.mail.host", mailHogContainer::getHost);
    registry.add("spring.mail.port", mailHogContainer::getFirstMappedPort);
  }

  @BeforeEach
  void setUp() {
    Testcontainers.exposeHostPorts(port);
    Testcontainers.exposeHostPorts(mailHogContainer.getMappedPort(1025));
    Testcontainers.exposeHostPorts(mailHogContainer.getMappedPort(8025));
    this.userService.setHost(String.format("http://%s:%d/app", GenericContainer.INTERNAL_HOST_HOSTNAME, port));
  }

  @Test
  void runElectronTests() throws InterruptedException {
    CountDownLatch countDownLatch = new CountDownLatch(1);
    try (GenericContainer container = createCypressContainer(countDownLatch)) {

      container.start();
      countDownLatch.await(MAX_TOTAL_TEST_TIME_IN_MINUTES, TimeUnit.MINUTES);

      assertThat(container.getLogs()).contains("(Run Finished)");
      String[] formattedOutput = container.getLogs().replace("?", "-").split("\\(Run Finished\\)\n\n");
      assertThat(formattedOutput).hasSize(2);
      assertThat(formattedOutput[1]).contains("All specs passed!");
    }
  }


  @Disabled
  @Test
  void runChromeTests() throws InterruptedException {
    CountDownLatch countDownLatch = new CountDownLatch(1);
    try (GenericContainer container = createCypressContainer(countDownLatch, "chrome")) {

      container.start();
      countDownLatch.await(MAX_TOTAL_TEST_TIME_IN_MINUTES, TimeUnit.MINUTES);

      assertThat(container.getLogs()).contains("(Run Finished)");
      String[] formattedOutput = container.getLogs().replace("?", "-").split("\\(Run Finished\\)\n\n");
      assertThat(formattedOutput).hasSize(2);
      assertThat(formattedOutput[1]).contains("All specs passed!");
    }
  }


  @Disabled
  @Test
  void runEdgeTests() throws InterruptedException {
    CountDownLatch countDownLatch = new CountDownLatch(1);
    try (GenericContainer container = createCypressContainer(countDownLatch, "edge")) {

      container.start();
      countDownLatch.await(MAX_TOTAL_TEST_TIME_IN_MINUTES, TimeUnit.MINUTES);

      assertThat(container.getLogs()).contains("(Run Finished)");
      String[] formattedOutput = container.getLogs().replace("?", "-").split("\\(Run Finished\\)\n\n");
      assertThat(formattedOutput).hasSize(2);
      assertThat(formattedOutput[1]).contains("All specs passed!");
    }
  }

  @Disabled
  @Test
  void runFirefoxTests() throws InterruptedException {
    CountDownLatch countDownLatch = new CountDownLatch(1);
//  try (GenericContainer container =
//            createCypressContainer(countDownLatch, "firefox", "src/e2e/**/role-management.cy.ts")) {
    try (GenericContainer container = createCypressContainer(countDownLatch, "firefox")) {
      container.start();
      countDownLatch.await(MAX_TOTAL_TEST_TIME_IN_MINUTES, TimeUnit.MINUTES);

      assertThat(container.getLogs()).contains("(Run Finished)");
      String[] formattedOutput = container.getLogs().replace("?", "-").split("\\(Run Finished\\)\n\n");
      assertThat(formattedOutput).hasSize(2);
      assertThat(formattedOutput[1]).contains("All specs passed!");
    }
  }

  private GenericContainer createCypressContainer(CountDownLatch countDownLatch, String browser, String specPattern) {
    GenericContainer genericContainer = new GenericContainer<>("cypress/included:12.8.1")
      //
      .withCommand("--browser", !isEmpty(browser) ? browser : "electron")
      .withAccessToHost(true)
      .withFileSystemBind("../../", "/e2e", BindMode.READ_WRITE)
      .withWorkingDirectory("/e2e/apps/app-e2e")
      .withEnv("CYPRESS_baseUrl", String.format("http://%s:%d/app", GenericContainer.INTERNAL_HOST_HOSTNAME, port))
      .withEnv("CYPRESS_apiUrl", String.format("http://%s:%d/api", GenericContainer.INTERNAL_HOST_HOSTNAME, port))
      .withEnv("CYPRESS_emailUrl",
        String.format("http://%s:%d", GenericContainer.INTERNAL_HOST_HOSTNAME, mailHogContainer.getMappedPort(8025)))
      .withLogConsumer(outputFrame -> {
        String output = outputFrame.getUtf8String().replace("\n", "").replace("?", "-");
        switch (outputFrame.getType()) {
          case STDOUT -> {
            ArrayList<String> skippedLines = Lists.newArrayList("┐", "┘", "┤", "39m─────────────────────");
            if (!isEmpty(output) //
              && skippedLines.stream().noneMatch(output::contains)//
              && (!output.contains("-----------------") || output.contains("----------------------------------"))) {
              log.at(Level.INFO).log(output);
            }
          }
          case STDERR -> log.at(Level.WARNING).log(output);
          case END -> {
            log.at(Level.INFO).log(outputFrame.getType().name());
            countDownLatch.countDown();
          }
        }
      });

    if (!isEmpty(specPattern)) {
      genericContainer.withCommand("--spec", specPattern);
    }
    if (!isEmpty(CYPRESS_RECORD_KEY)) {
      genericContainer.withCommand("--record").withEnv("CYPRESS_RECORD_KEY", CYPRESS_RECORD_KEY);
    }
    if (CYPRESS_SAVE_VIDEO) {
      genericContainer.withEnv("CYPRESS_video", "true");
    }
    return genericContainer;
  }

  private GenericContainer createCypressContainer(CountDownLatch countDownLatch, String browser) {
    return createCypressContainer(countDownLatch, browser, null);
  }

  private GenericContainer createCypressContainer(CountDownLatch countDownLatch) {
    return createCypressContainer(countDownLatch, null, null);
  }
}
