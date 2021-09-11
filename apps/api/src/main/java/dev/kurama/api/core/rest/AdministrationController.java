package dev.kurama.api.core.rest;

import static org.springframework.http.ResponseEntity.ok;

import dev.kurama.api.core.facade.AdministrationFacade;
import dev.kurama.api.core.hateoas.model.ServiceLogsModel;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/administration/service-logs")
@PreAuthorize("isAuthenticated()")
public class AdministrationController {

  private final AdministrationFacade administrationFacade;

  @GetMapping()
  @PreAuthorize("hasAuthority('admin:service-logs:read')")
  public ResponseEntity<ServiceLogsModel> getServiceLogs() {
    return ok().body(administrationFacade.getServiceLogs());
  }
}
