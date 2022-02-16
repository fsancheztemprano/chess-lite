package dev.kurama.api.core.hateoas.assembler;

import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;

import dev.kurama.api.core.utility.HateoasUtils;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.LinkRelation;
import org.springframework.hateoas.PagedModel;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;

public abstract class DomainModelAssembler<T extends RepresentationModel<T>> implements
                                                                             RepresentationModelAssembler<T, T> {

  // Collection Assembler
  protected PagedResourcesAssembler<T> pagedResourcesAssembler;

  @Autowired
  public final void setPagedResourcesAssembler(PagedResourcesAssembler<T> pagedResourcesAssembler) {
    this.pagedResourcesAssembler = pagedResourcesAssembler;
  }

  public @NonNull
  PagedModel<T> toPagedModel(Page<T> entities) {
    return (PagedModel<T>) pagedResourcesAssembler
      .toModel(entities, this)
      .mapLink(LinkRelation.of(SELF), HateoasUtils::withDefaultAffordance);
  }

  @Override
  public @NonNull
  CollectionModel<T> toCollectionModel(@NonNull Iterable<? extends T> entities) {
    return RepresentationModelAssembler.super.toCollectionModel(entities);
  }

  // Model Assembler

  @Override
  public @NonNull
  T toModel(@NonNull T entity) {
    return entity;
  }
}
