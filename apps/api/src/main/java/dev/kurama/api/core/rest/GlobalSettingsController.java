package dev.kurama.api.core.rest;

import dev.kurama.api.core.exception.domain.not.found.RoleNotFoundException;
import dev.kurama.api.core.facade.GlobalSettingsFacade;
import dev.kurama.api.core.hateoas.input.GlobalSettingsUpdateInput;
import dev.kurama.api.core.hateoas.model.GlobalSettingsModel;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/global-settings")
@PreAuthorize("isAuthenticated()")
public class GlobalSettingsController {

  @NonNull
  private final GlobalSettingsFacade globalSettingsFacade;

  @GetMapping()
  @PreAuthorize("hasAuthority('global-settings:read')")
  public ResponseEntity<GlobalSettingsModel> get() {
    return ResponseEntity.ok().body(globalSettingsFacade.getGlobalSettings());
  }

  @PatchMapping()
  @PreAuthorize("hasAuthority('global-settings:update')")
  public ResponseEntity<GlobalSettingsModel> update(@RequestBody GlobalSettingsUpdateInput globalSettingsUpdateInput)
    throws RoleNotFoundException {
    return ResponseEntity.ok().body(globalSettingsFacade.updateGlobalSettings(globalSettingsUpdateInput));
  }
}
