package dev.kurama.chess.backend.poc.api.assembler;

import static dev.kurama.chess.backend.core.api.authority.BookAuthority.BOOK_DELETE;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.afford;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import dev.kurama.chess.backend.core.api.assembler.RepresentationDtoAssembler;
import dev.kurama.chess.backend.poc.api.domain.BookDTO;
import dev.kurama.chess.backend.poc.rest.BookResource;
import lombok.NonNull;
import org.springframework.hateoas.Affordance;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkRelation;
import org.springframework.stereotype.Component;

@Component
public class BookDtoAssembler implements RepresentationDtoAssembler<BookDTO> {

  private static final Class<BookResource> resourceClass = BookResource.class;

  @Override
  public @NonNull BookDTO toModel(@NonNull BookDTO bookDto) {
    return bookDto.add(getModelSelfLink(bookDto.getId()))
      .mapLinkIf(hasAuthority(BOOK_DELETE),
        LinkRelation.of("self"),
        link -> link.andAffordance(getDeleteAffordance(bookDto.getId())));
  }


  @Override
  public @NonNull Link getModelSelfLink(@NonNull Long id) {
    return linkTo(methodOn(resourceClass).get(id, null)).withSelfRel();
  }

  @Override
  public @NonNull Link getCollectionModelSelfLink() {
    return linkTo(methodOn(resourceClass).getAll(null)).withSelfRel();
  }

  private @NonNull Affordance getDeleteAffordance(Long id) {
    return afford(methodOn(resourceClass).delete(id));
  }
}
