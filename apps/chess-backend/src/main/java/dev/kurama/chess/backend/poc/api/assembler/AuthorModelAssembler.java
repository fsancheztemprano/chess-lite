package dev.kurama.chess.backend.poc.api.assembler;

import static dev.kurama.chess.backend.auth.utility.AuthorityUtils.hasAuthority;
import static dev.kurama.chess.backend.core.api.authority.AuthorAuthority.AUTHOR_CREATE;
import static dev.kurama.chess.backend.core.api.authority.AuthorAuthority.AUTHOR_DELETE;
import static dev.kurama.chess.backend.core.api.authority.AuthorAuthority.AUTHOR_UPDATE;
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
import org.springframework.hateoas.mediatype.Affordances;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;

@Component
public class AuthorModelAssembler implements DomainModelAssembler<AuthorModel> {

  @Override
  public Class<AuthorController> getClazz() {
    return AuthorController.class;
  }

  @Override
  public @NonNull AuthorModel toModel(@NonNull AuthorModel authorModel) {
    return authorModel
      .add(getModelSelfLink(authorModel.getId()))
      .add(getParentLink())
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
  public @NonNull CollectionModel<AuthorModel> toCollectionModel(
    @NonNull Iterable<? extends AuthorModel> entities) {
    return DomainModelAssembler.super.toCollectionModel(entities)
      .mapLinkIf(hasAuthority(AUTHOR_CREATE),
        LinkRelation.of("self"),
        link -> link.andAffordance(getCreateAffordance()))
      ;
  }

  private @NonNull Affordance getAddBookAffordance(Long id) {
    return afford(methodOn(getClazz()).addBook(id, null));
  }

  private @NonNull Affordance getCreateAffordance() {
    return afford(methodOn(getClazz()).create(null));
  }

  private @NonNull Affordance getDeleteAffordance(Long id) {
    return afford(methodOn(getClazz()).delete(id));
  }

  private @NonNull Affordance getUpdateAffordance(Long id) {
    return afford(methodOn(getClazz()).put(id, null));
  }

  private @NonNull Link getParentLink() {
    return Affordances.of(linkTo(methodOn(getClazz()).getAll()).withRel("authors"))
      .afford(HttpMethod.HEAD)
      .withName("wakaa").toLink();
  }
}
