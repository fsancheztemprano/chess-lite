package dev.kurama.api.core.hateoas.processor;

import static dev.kurama.api.core.authority.ServiceLogsAuthority.SERVICE_LOGS_READ;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static dev.kurama.api.core.utility.AuthorityUtils.hasAuthority;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.afford;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import dev.kurama.api.core.hateoas.model.ServiceLogsModel;
import dev.kurama.api.core.rest.ServiceLogsController;
import lombok.NonNull;
import org.springframework.hateoas.Affordance;
import org.springframework.hateoas.LinkRelation;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Component;

@Component
public class ServiceLogsModelProcessor extends DomainModelProcessor<ServiceLogsModel> {

  @Override
  protected Class<ServiceLogsController> getClazz() {
    return ServiceLogsController.class;
  }

  @Override
  public @NonNull ServiceLogsModel process(@NonNull ServiceLogsModel entity) {
    return !hasAuthority(SERVICE_LOGS_READ) ? entity : entity
      .add(getModelSelfLink(""))
      .mapLinkIf(hasAuthority(SERVICE_LOGS_READ),
        LinkRelation.of(SELF),
        link -> link.andAffordance(getDeleteAffordance()))
      ;
  }

  @Override
  public WebMvcLinkBuilder getSelfLink(String id) {
    return linkTo(methodOn(getClazz()).getServiceLogs());
  }

  private @NonNull Affordance getDeleteAffordance() {
    return afford(methodOn(getClazz()).deleteServiceLogs());
  }
}
