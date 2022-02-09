package dev.kurama.api.core.hateoas.root.rest;

import dev.kurama.api.core.hateoas.root.model.RootResource;
import dev.kurama.api.core.hateoas.root.processor.AdministrationRootResourceAssembler;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static dev.kurama.api.core.constant.RestPathConstant.ADMINISTRATION_ROOT_PATH;
import static org.springframework.http.ResponseEntity.ok;

@PreAuthorize("hasAuthority('admin:root')")
@RestController()
@RequiredArgsConstructor
@RequestMapping(ADMINISTRATION_ROOT_PATH)
public class AdministrationRootController {

  @NonNull
  private final AdministrationRootResourceAssembler administrationRootResourceAssembler;

  @GetMapping()
  public ResponseEntity<RepresentationModel<RootResource>> root() {
    return ok(administrationRootResourceAssembler.assemble());
  }
}
