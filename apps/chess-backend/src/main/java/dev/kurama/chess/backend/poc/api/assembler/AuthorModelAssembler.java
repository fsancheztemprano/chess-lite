package dev.kurama.chess.backend.poc.api.assembler;

import static dev.kurama.chess.backend.auth.utility.AuthorityUtils.hasAuthority;
import static dev.kurama.chess.backend.core.authority.AuthorAuthority.AUTHOR_CREATE;
import static dev.kurama.chess.backend.core.authority.AuthorAuthority.AUTHOR_DELETE;
import static dev.kurama.chess.backend.core.authority.AuthorAuthority.AUTHOR_UPDATE;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.afford;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import dev.kurama.chess.backend.core.api.assembler.DomainModelAssembler;
import dev.kurama.chess.backend.poc.api.domain.model.AuthorModel;
import dev.kurama.chess.backend.poc.rest.AuthorController;
import lombok.NonNull;
import org.springframework.hateoas.Affordance;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkRelation;
import org.springframework.stereotype.Component;

@Component
public class AuthorModelAssembler extends DomainModelAssembler<AuthorModel> {

  protected Class<AuthorController> getClazz() {
    return AuthorController.class;
  }

  @Override
  public @NonNull AuthorModel toModel(@NonNull AuthorModel authorModel) {
    return authorModel
      .add(getModelSelfLink(authorModel.getId()))
      .add(getParentLink())
      .add(getBooksLink(authorModel))
      .mapLinkIf(hasAuthority(AUTHOR_DELETE),
        LinkRelation.of("self"),
        link -> link.andAffordance(getDeleteAffordance(authorModel.getId())))
      .mapLinkIf(hasAuthority(AUTHOR_UPDATE),
        LinkRelation.of("self"),
        link -> link.andAffordance(getUpdateAffordance(authorModel.getId())))
      .mapLinkIf(hasAuthority(AUTHOR_UPDATE),
        LinkRelation.of("self"),
        link -> link.andAffordance(getAddBookAffordance(authorModel.getId())))
      ;
  }

  @Override
  public @NonNull CollectionModel<AuthorModel> toSelfCollectionModel(
    @NonNull Iterable<? extends AuthorModel> entities) {
    return super.toSelfCollectionModel(entities)
      .mapLinkIf(hasAuthority(AUTHOR_CREATE),
        LinkRelation.of("self"),
        link -> link.andAffordance(getCreateAffordance()))
      ;
  }

  private @NonNull Affordance getAddBookAffordance(String id) {
    return afford(methodOn(getClazz()).addBook(id, null));
  }

  private @NonNull Affordance getCreateAffordance() {
    return afford(methodOn(getClazz()).create(null));
  }

  private @NonNull Affordance getDeleteAffordance(String id) {
    return afford(methodOn(getClazz()).delete(id));
  }

  private @NonNull Affordance getUpdateAffordance(String id) {
    return afford(methodOn(getClazz()).put(id, null));
  }

  private Link getBooksLink(AuthorModel authorModel) {
    return linkTo(methodOn(getClazz()).getAuthorBooks(authorModel.getId())).withRel("books");
  }

  private @NonNull Link getParentLink() {
    return linkTo(methodOn(getClazz()).getAll()).withRel("authors");
  }
}
