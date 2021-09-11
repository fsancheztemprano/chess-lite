package dev.kurama.api.core.facade;

import dev.kurama.api.core.hateoas.assembler.ServiceLogsModelAssembler;
import dev.kurama.api.core.hateoas.model.ServiceLogsModel;
import dev.kurama.api.core.service.AdministrationService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdministrationFacade {

  @NonNull
  private final AdministrationService administrationService;

  @NonNull
  private final ServiceLogsModelAssembler serviceLogsModelAssembler;

  public ServiceLogsModel getServiceLogs() {
    return serviceLogsModelAssembler.toModel(administrationService.getServiceLogs());
  }
}
