package dev.kurama.api.core.hateoas.processor;

import dev.kurama.api.core.hateoas.relations.HateoasRelations;
import lombok.NonNull;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.hateoas.server.RepresentationModelProcessor;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpMethod;

import static org.springframework.hateoas.mediatype.Affordances.of;

public abstract class DomainModelProcessor<T extends RepresentationModel<T>> implements
                                                                             RepresentationModelProcessor<T> {

  @Override
  public abstract @NonNull T process(@NonNull T model);

  protected abstract WebMvcLinkBuilder getSelfLink(String id);

  protected @NonNull Link getModelDefaultLink(String id) {
    return of(getSelfLink(id).withSelfRel()).afford(HttpMethod.HEAD)
                                            .withName(HateoasRelations.DEFAULT)
                                            .toLink();
  }
}
