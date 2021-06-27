package dev.kurama.chess.backend.core.api.assembler;

import lombok.NonNull;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;

public interface RepresentationDtoAssembler<T extends RepresentationModel<T>> extends
    RepresentationModelAssembler<T, T> {


  @Override
  @NonNull
  default CollectionModel<T> toCollectionModel(@NonNull Iterable<? extends T> entities) {
    return RepresentationModelAssembler.super.toCollectionModel(entities).add(getCollectionModelSelfLink());
  }

  @NonNull
  Link getCollectionModelSelfLink();

  @NonNull
  Link getModelSelfLink(@NonNull Long id);
}
