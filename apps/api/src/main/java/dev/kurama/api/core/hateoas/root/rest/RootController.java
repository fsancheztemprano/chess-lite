package dev.kurama.api.core.hateoas.root.rest;

import dev.kurama.api.core.hateoas.root.model.RootResource;
import dev.kurama.api.core.hateoas.root.processor.RootResourceAssembler;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.ResponseEntity.ok;

@RequiredArgsConstructor
@RestController()
@RequestMapping({"/api", "/api/root"})
public class RootController {

  @NonNull
  private final RootResourceAssembler assembler;

  @GetMapping()
  public ResponseEntity<RepresentationModel<RootResource>> root() {
    return ok(assembler.assemble());
  }
}
