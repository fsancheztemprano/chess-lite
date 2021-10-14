package dev.kurama.api.core.hateoas.processor;

import static org.springframework.hateoas.mediatype.Affordances.of;

import dev.kurama.api.core.hateoas.relations.HateoasRelations;
import lombok.NonNull;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.hateoas.server.RepresentationModelProcessor;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpMethod;

public abstract class DomainModelProcessor<T extends RepresentationModel<T>> implements
  RepresentationModelProcessor<T> {

  public abstract WebMvcLinkBuilder getSelfLink(String id);

  protected abstract Class<?> getClazz();

  @Override
  public @NonNull T process(@NonNull T model) {
    return model;
  }

  protected @NonNull Link getModelSelfLink(String id) {
    return of(getSelfLink(id).withSelfRel()).afford(HttpMethod.HEAD).withName(HateoasRelations.DEFAULT).toLink();
  }
}
