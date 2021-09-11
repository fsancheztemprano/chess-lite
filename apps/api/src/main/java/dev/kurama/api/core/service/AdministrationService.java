package dev.kurama.api.core.service;

import dev.kurama.api.core.hateoas.model.ServiceLogsModel;
import dev.kurama.api.core.hateoas.model.ServiceLogsModel.ServiceLogsModelBuilder;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.Date;
import org.springframework.stereotype.Service;

@Service
public class AdministrationService {

  public ServiceLogsModel getServiceLogs() {
    ServiceLogsModelBuilder serviceLogsModelBuilder = ServiceLogsModel.builder().timestamp(new Date());
    File file = new File(new File("").getAbsolutePath() + "/logs/logs.log");
    try (BufferedReader bufferedReader = new BufferedReader(new FileReader(file))) {

      StringBuilder serviceLogs = new StringBuilder();
      String newLine;
      while ((newLine = bufferedReader.readLine()) != null) {
        serviceLogs.append(newLine);
        serviceLogs.append("\n");
      }
      serviceLogsModelBuilder.logs(serviceLogs.toString());
    } catch (IOException e) {
      serviceLogsModelBuilder.logs("No Service Logs are Available");
    }
    return serviceLogsModelBuilder.build();
  }
}
