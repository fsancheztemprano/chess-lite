package dev.kurama.chess.backend.core.api.assembler;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import dev.kurama.chess.backend.core.service.DomainController;
import lombok.NonNull;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.hateoas.mediatype.Affordances;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpMethod;

public abstract class DomainModelAssembler<T extends RepresentationModel<T>> implements
  RepresentationModelAssembler<T, T> {

  protected abstract Class<? extends DomainController<T>> getClazz();

  @Override
  public @NonNull T toModel(@NonNull T entity) {
    return entity;
  }

  @Override
  @NonNull
  public CollectionModel<T> toCollectionModel(@NonNull Iterable<? extends T> entities) {
    return RepresentationModelAssembler.super.toCollectionModel(entities);
  }

  @NonNull
  public CollectionModel<T> toSelfCollectionModel(@NonNull Iterable<? extends T> entities) {
    return toLinkedCollectionModel(entities, getAllLink());
  }

  @NonNull
  protected CollectionModel<T> toLinkedCollectionModel(@NonNull Iterable<? extends T> entities,
    WebMvcLinkBuilder link, String relationship) {
    return toCollectionModel(entities).add(getCollectionModelWithLink(link).withRel(relationship));
  }

  @NonNull
  protected CollectionModel<T> toLinkedCollectionModel(@NonNull Iterable<? extends T> entities,
    WebMvcLinkBuilder link) {
    return toCollectionModel(entities).add(getCollectionModelWithLink(link).withSelfRel());
  }

  @NonNull
  protected Link getModelSelfLink(@NonNull String id) {
    return Affordances.of(getSelfLink(id).withSelfRel())
      .afford(HttpMethod.HEAD)
      .withName("default").toLink();
  }

  @NonNull
  protected Link getCollectionModelWithLink(WebMvcLinkBuilder link) {
    return Affordances.of(link.withSelfRel())
      .afford(HttpMethod.HEAD)
      .withName("default").toLink();
  }

  protected WebMvcLinkBuilder getSelfLink(String id) {
    return linkTo(methodOn(getClazz()).get(id));
  }

  protected WebMvcLinkBuilder getAllLink() {
    return linkTo(methodOn(getClazz()).getAll());
  }

}
