package dev.kurama.api.core.hateoas.assembler;

import dev.kurama.api.core.hateoas.relations.HateoasRelations;
import lombok.NonNull;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpMethod;

import javax.annotation.Nullable;

import static org.springframework.hateoas.mediatype.Affordances.of;

public abstract class DomainModelAssembler<T extends RepresentationModel<T>> implements
                                                                             RepresentationModelAssembler<T, T> {
  // Model Assembler

  @Override
  public @NonNull T toModel(@NonNull T entity) {
    return entity;
  }

  public abstract WebMvcLinkBuilder getSelfLink(String id);

  protected @NonNull Link getModelDefaultLink(@NonNull String id) {
    return of(getSelfLink(id).withSelfRel()).afford(HttpMethod.HEAD)
                                            .withName(HateoasRelations.DEFAULT)
                                            .toLink();
  }

  // Collection Assembler

  @Override
  public @NonNull CollectionModel<T> toCollectionModel(@NonNull Iterable<? extends T> entities) {
    return RepresentationModelAssembler.super.toCollectionModel(entities);
  }

  public abstract WebMvcLinkBuilder getAllLink();


  protected @NonNull Link getCollectionDefaultLink(WebMvcLinkBuilder link, @Nullable String relation) {
    return of(relation == null ? link.withSelfRel() : link.withRel(relation)).afford(HttpMethod.HEAD)
                                                                             .withName(HateoasRelations.DEFAULT)
                                                                             .toLink();
  }
}
