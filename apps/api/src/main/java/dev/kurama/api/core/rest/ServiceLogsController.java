package dev.kurama.api.core.rest;

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
@RequestMapping("/api/administration/service-logs")
@PreAuthorize("isAuthenticated()")
public class ServiceLogsController {

  private final ServiceLogsFacade serviceLogsFacade;

  @GetMapping()
  @PreAuthorize("hasAuthority('service-logs:read')")
  public ResponseEntity<ServiceLogsModel> getServiceLogs() {
    return ok().body(serviceLogsFacade.getServiceLogs());
  }

  @DeleteMapping()
  @PreAuthorize("hasAuthority('service-logs:delete')")
  public ResponseEntity<ServiceLogsModel> deleteServiceLogs() {
    return ok().body(serviceLogsFacade.deleteServiceLogs());
  }
}
