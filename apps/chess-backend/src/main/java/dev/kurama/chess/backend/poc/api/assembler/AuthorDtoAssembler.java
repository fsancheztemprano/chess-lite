package dev.kurama.chess.backend.poc.api.assembler;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import dev.kurama.chess.backend.core.api.assembler.RepresentationDtoAssembler;
import dev.kurama.chess.backend.poc.api.domain.AuthorDTO;
import dev.kurama.chess.backend.poc.rest.AuthorResource;
import lombok.NonNull;
import org.springframework.hateoas.Link;
import org.springframework.stereotype.Component;

@Component
public class AuthorDtoAssembler implements RepresentationDtoAssembler<AuthorDTO> {

  private static final Class<AuthorResource> resourceClass = AuthorResource.class;

  @Override
  public @NonNull AuthorDTO toModel(@NonNull AuthorDTO authorDTO) {
    return authorDTO.add(getModelSelfLink(authorDTO.getId()));
  }

  @Override
  public @NonNull Link getCollectionModelSelfLink() {
    return linkTo(methodOn(resourceClass).getAll()).withSelfRel();
  }

  @Override
  public @NonNull Link getModelSelfLink(@NonNull Long id) {
    return linkTo(methodOn(resourceClass).get(id)).withSelfRel();
  }

}
