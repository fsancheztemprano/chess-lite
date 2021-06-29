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
import org.springframework.http.HttpMethod;

public interface DomainModelAssembler<T extends RepresentationModel<T>> extends
  RepresentationModelAssembler<T, T> {

  Class<? extends DomainController<T>> getClazz();

  @Override
  @NonNull
  default CollectionModel<T> toCollectionModel(@NonNull Iterable<? extends T> entities) {
    return RepresentationModelAssembler.super.toCollectionModel(entities).add(getCollectionModelSelfLink());
  }

  @NonNull
  default Link getModelSelfLink(@NonNull Long id) {
    return Affordances.of(linkTo(methodOn(getClazz()).get(id)).withSelfRel())
      .afford(HttpMethod.HEAD)
      .withName("default").toLink();
  }

  @NonNull
  default Link getCollectionModelSelfLink() {
    return Affordances.of(linkTo(methodOn(getClazz()).getAll()).withSelfRel())
      .afford(HttpMethod.HEAD)
      .withName("default").toLink();
  }

}
