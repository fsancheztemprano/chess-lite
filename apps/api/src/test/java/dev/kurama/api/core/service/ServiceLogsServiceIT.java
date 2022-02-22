package dev.kurama.api.core.service;

import static dev.kurama.api.core.service.ServiceLogsService.LOGS_FILE;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import dev.kurama.api.core.hateoas.model.ServiceLogsModel;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class ServiceLogsServiceIT {

  @InjectMocks
  private ServiceLogsService serviceLogsService;

  String log = randomUUID();

  @BeforeEach
  void setUp() {
    writeTextToLogsFile(log);
  }

  @Test
  void get_service_logs() {
    ServiceLogsModel serviceLogs = serviceLogsService.getServiceLogs();

    assertThat(serviceLogs.getLogs()).isEqualTo(log + "\n");
  }

  @Test
  void delete_service_logs() {
    ServiceLogsModel serviceLogs = serviceLogsService.deleteServiceLogs();

    assertThat(serviceLogs.getLogs()).isEmpty();
  }

  private void writeTextToLogsFile(String text) {
    File file = new File(LOGS_FILE);
    try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
      writer.write(text);
      writer.flush();
    } catch (IOException ignored) {
    }
  }
}
