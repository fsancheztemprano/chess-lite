package dev.kurama.api.core.hateoas.assembler;

import static org.springframework.hateoas.mediatype.Affordances.of;

import dev.kurama.api.core.hateoas.relations.HateoasRelations;
import lombok.NonNull;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpMethod;

public abstract class DomainModelAssembler<T extends RepresentationModel<T>> implements
  RepresentationModelAssembler<T, T> {

  public abstract WebMvcLinkBuilder getSelfLink(String id);

  public abstract WebMvcLinkBuilder getAllLink();

  protected abstract Class<?> getClazz();

  @Override
  public @NonNull T toModel(@NonNull T entity) {
    return entity;
  }

  @Override
  public @NonNull CollectionModel<T> toCollectionModel(@NonNull Iterable<? extends T> entities) {
    return RepresentationModelAssembler.super.toCollectionModel(entities);
  }

  public @NonNull CollectionModel<T> toSelfCollectionModel(@NonNull Iterable<? extends T> entities) {
    return toLinkedCollectionModel(entities, getAllLink());
  }

  protected @NonNull CollectionModel<T> toLinkedCollectionModelWithRel(@NonNull Iterable<? extends T> entities,
    WebMvcLinkBuilder link, String relationship) {
    return toCollectionModel(entities).add(getCollectionModelSelfLinkWithRel(link, relationship).withRel(relationship));
  }

  protected @NonNull CollectionModel<T> toLinkedCollectionModel(@NonNull Iterable<? extends T> entities,
    WebMvcLinkBuilder link) {
    return toCollectionModel(entities).add(getCollectionModelSelfLink(link).withSelfRel());
  }

  protected @NonNull Link getModelSelfLink(@NonNull String id) {
    return of(getSelfLink(id).withSelfRel()).afford(HttpMethod.HEAD).withName(HateoasRelations.DEFAULT).toLink();
  }

  protected @NonNull Link getCollectionModelSelfLink(WebMvcLinkBuilder link) {
    return of(link.withSelfRel()).afford(HttpMethod.HEAD).withName(HateoasRelations.DEFAULT).toLink();
  }

  protected @NonNull Link getCollectionModelSelfLinkWithRel(WebMvcLinkBuilder link, String relation) {
    return of(link.withRel(relation)).afford(HttpMethod.HEAD).withName(HateoasRelations.DEFAULT).toLink();
  }
}
