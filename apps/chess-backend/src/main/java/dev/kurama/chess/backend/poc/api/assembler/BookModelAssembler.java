package dev.kurama.chess.backend.poc.api.assembler;

import static dev.kurama.chess.backend.core.api.authority.BookAuthority.BOOK_DELETE;
import static dev.kurama.chess.backend.core.api.authority.BookAuthority.BOOK_UPDATE;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.afford;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import dev.kurama.chess.backend.core.api.assembler.DomainModelAssembler;
import dev.kurama.chess.backend.poc.api.domain.output.BookModel;
import dev.kurama.chess.backend.poc.rest.BookResource;
import lombok.NonNull;
import org.springframework.hateoas.Affordance;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkRelation;
import org.springframework.stereotype.Component;

@Component
public class BookModelAssembler implements DomainModelAssembler<BookModel> {

  private static final Class<BookResource> resourceClass = BookResource.class;

  @Override
  public @NonNull BookModel toModel(@NonNull BookModel bookModel) {
    return bookModel.add(getModelSelfLink(bookModel.getId()))
      .mapLinkIf(hasAuthority(BOOK_DELETE),
        LinkRelation.of("self"),
        link -> link.andAffordance(getDeleteAffordance(bookModel.getId())))
      .mapLinkIf(hasAuthority(BOOK_UPDATE),
        LinkRelation.of("self"),
        link -> link.andAffordance(getUpdateAffordance(bookModel.getId())))
      ;
  }


  @Override
  public @NonNull Link getModelSelfLink(@NonNull Long id) {
    return linkTo(methodOn(resourceClass).get(id)).withSelfRel();
  }

  @Override
  public @NonNull Link getCollectionModelSelfLink() {
    return linkTo(methodOn(resourceClass).getAll()).withSelfRel();
  }

  private @NonNull Affordance getDeleteAffordance(Long id) {
    return afford(methodOn(resourceClass).delete(id));
  }

  private @NonNull Affordance getUpdateAffordance(Long id) {
    return afford(methodOn(resourceClass).put(id, null));

  }
}
