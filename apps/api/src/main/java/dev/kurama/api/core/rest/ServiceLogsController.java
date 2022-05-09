package dev.kurama.api.core.rest;

import static dev.kurama.api.core.constant.RestPathConstant.SERVICE_LOGS_PATH;
import static org.springframework.http.ResponseEntity.ok;

import dev.kurama.api.core.facade.ServiceLogsFacade;
import dev.kurama.api.core.hateoas.model.ServiceLogsModel;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping(SERVICE_LOGS_PATH)
@PreAuthorize("isAuthenticated()")
public class ServiceLogsController {

  private final ServiceLogsFacade serviceLogsFacade;

  @GetMapping()
  @PreAuthorize("hasAuthority(@ServiceLogsAuthority.SERVICE_LOGS_READ)")
  public ResponseEntity<ServiceLogsModel> getServiceLogs() {
    return ok().body(serviceLogsFacade.getServiceLogs());
  }

  @DeleteMapping()
  @PreAuthorize("hasAuthority(@ServiceLogsAuthority.SERVICE_LOGS_DELETE)")
  public ResponseEntity<ServiceLogsModel> deleteServiceLogs() {
    return ok().body(serviceLogsFacade.deleteServiceLogs());
  }
}
