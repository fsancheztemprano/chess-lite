package dev.kurama.api.core.hateoas.assembler;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import dev.kurama.api.core.hateoas.model.ServiceLogsModel;
import dev.kurama.api.core.rest.AdministrationController;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ServiceLogsModelAssembler extends DomainModelAssembler<ServiceLogsModel> {

  @Override
  protected Class<AdministrationController> getClazz() {
    return AdministrationController.class;
  }

  @Override
  public @NonNull
  ServiceLogsModel toModel(@NonNull ServiceLogsModel entity) {
    return entity
      .add(getModelSelfLink(""));
  }

  @Override
  public WebMvcLinkBuilder getSelfLink(String id) {
    return linkTo(methodOn(getClazz()).getServiceLogs());
  }

}
