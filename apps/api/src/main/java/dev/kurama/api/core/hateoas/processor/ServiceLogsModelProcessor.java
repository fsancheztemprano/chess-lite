package dev.kurama.api.core.hateoas.processor;

import static dev.kurama.api.core.authority.ServiceLogsAuthority.SERVICE_LOGS_DELETE;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static dev.kurama.api.core.utility.AuthorityUtils.hasAuthority;
import static dev.kurama.api.core.utility.HateoasUtils.withDefaultAffordance;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.afford;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import dev.kurama.api.core.hateoas.model.ServiceLogsModel;
import dev.kurama.api.core.rest.ServiceLogsController;
import lombok.NonNull;
import org.springframework.hateoas.Affordance;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkRelation;
import org.springframework.hateoas.server.RepresentationModelProcessor;
import org.springframework.stereotype.Component;

@Component
public class ServiceLogsModelProcessor implements RepresentationModelProcessor<ServiceLogsModel> {

  @Override
  public @NonNull
  ServiceLogsModel process(@NonNull ServiceLogsModel entity) {
    return entity.add(getSelfLink())
      .mapLinkIf(hasAuthority(SERVICE_LOGS_DELETE), LinkRelation.of(SELF),
        link -> link.andAffordance(getDeleteAffordance()));
  }

  protected Link getSelfLink() {
    return withDefaultAffordance(linkTo(methodOn(ServiceLogsController.class).getServiceLogs()).withSelfRel());
  }

  private @NonNull
  Affordance getDeleteAffordance() {
    return afford(methodOn(ServiceLogsController.class).deleteServiceLogs());
  }

}
