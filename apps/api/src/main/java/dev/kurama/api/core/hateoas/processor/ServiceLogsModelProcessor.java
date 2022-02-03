package dev.kurama.api.core.hateoas.processor;

import dev.kurama.api.core.hateoas.model.ServiceLogsModel;
import dev.kurama.api.core.rest.ServiceLogsController;
import lombok.NonNull;
import org.springframework.hateoas.Affordance;
import org.springframework.hateoas.LinkRelation;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Component;

import static dev.kurama.api.core.authority.ServiceLogsAuthority.SERVICE_LOGS_DELETE;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static dev.kurama.api.core.utility.AuthorityUtils.hasAuthority;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Component
public class ServiceLogsModelProcessor extends DomainModelProcessor<ServiceLogsModel> {

  @Override
  public @NonNull ServiceLogsModel process(@NonNull ServiceLogsModel entity) {
    return entity.add(getModelDefaultLink(null))
                 .mapLinkIf(hasAuthority(SERVICE_LOGS_DELETE), LinkRelation.of(SELF),
                   link -> link.andAffordance(getDeleteAffordance()));
  }

  @Override
  protected WebMvcLinkBuilder getSelfLink(String id) {
    return linkTo(methodOn(getControllerClass()).getServiceLogs());
  }

  private @NonNull Affordance getDeleteAffordance() {
    return afford(methodOn(getControllerClass()).deleteServiceLogs());
  }

  private Class<ServiceLogsController> getControllerClass() {
    return ServiceLogsController.class;
  }
}
