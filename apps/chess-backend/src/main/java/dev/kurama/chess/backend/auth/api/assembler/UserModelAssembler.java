package dev.kurama.chess.backend.auth.api.assembler;

import static dev.kurama.chess.backend.auth.authority.UserAuthority.USER_DELETE;
import static dev.kurama.chess.backend.auth.authority.UserAuthority.USER_UPDATE;
import static dev.kurama.chess.backend.auth.utility.AuthorityUtils.hasAuthority;
import static dev.kurama.chess.backend.core.authority.AuthorAuthority.AUTHOR_CREATE;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.afford;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import dev.kurama.chess.backend.auth.api.domain.model.UserModel;
import dev.kurama.chess.backend.auth.rest.UserController;
import dev.kurama.chess.backend.core.api.assembler.DomainModelAssembler;
import lombok.NonNull;
import lombok.SneakyThrows;
import org.springframework.hateoas.Affordance;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkRelation;
import org.springframework.stereotype.Component;

@Component
public class UserModelAssembler extends DomainModelAssembler<UserModel> {

  @Override
  protected Class<UserController> getClazz() {
    return UserController.class;
  }

  @Override
  public @NonNull UserModel toModel(@NonNull UserModel userModel) {
    return userModel
      .add(getModelSelfLink(userModel.getId()))
      .add(getParentLink())
      .mapLinkIf(hasAuthority(USER_DELETE),
        LinkRelation.of("self"),
        link -> link.andAffordance(getDeleteAffordance(userModel.getUsername())))
      .mapLinkIf(hasAuthority(USER_UPDATE),
        LinkRelation.of("self"),
        link -> link.andAffordance(getUpdateAffordance(userModel.getUsername())))
      ;
  }

  @Override
  public @NonNull CollectionModel<UserModel> toSelfCollectionModel(
    @NonNull Iterable<? extends UserModel> entities) {
    return super.toSelfCollectionModel(entities)
      .mapLinkIf(hasAuthority(AUTHOR_CREATE),
        LinkRelation.of("self"),
        link -> link.andAffordance(getCreateAffordance()))
      ;
  }

  private @NonNull Link getParentLink() {
    return linkTo(methodOn(getClazz()).getAll()).withRel("users");
  }

  @SneakyThrows
  private @NonNull Affordance getCreateAffordance() {
    return afford(methodOn(getClazz()).create(null));
  }

  private @NonNull Affordance getDeleteAffordance(String username) {
    return afford(methodOn(getClazz()).delete(username));
  }

  @SneakyThrows
  private @NonNull Affordance getUpdateAffordance(String username) {
    return afford(methodOn(getClazz()).update(username, null));
  }
}
