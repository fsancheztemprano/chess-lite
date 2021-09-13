package dev.kurama.api.core.facade;

import dev.kurama.api.core.hateoas.assembler.ServiceLogsModelAssembler;
import dev.kurama.api.core.hateoas.model.ServiceLogsModel;
import dev.kurama.api.core.service.ServiceLogsService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ServiceLogsFacade {

  @NonNull
  private final ServiceLogsService serviceLogsService;

  @NonNull
  private final ServiceLogsModelAssembler serviceLogsModelAssembler;

  public ServiceLogsModel getServiceLogs() {
    return serviceLogsModelAssembler.toModel(serviceLogsService.getServiceLogs());
  }

  public ServiceLogsModel deleteServiceLogs() {
    return serviceLogsModelAssembler.toModel(serviceLogsService.deleteServiceLogs());
  }
}
