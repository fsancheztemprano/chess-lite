package dev.kurama.chess.backend.auth.api.assembler;

import static dev.kurama.chess.backend.auth.authority.UserAuthority.PROFILE_DELETE;
import static dev.kurama.chess.backend.auth.authority.UserAuthority.PROFILE_UPDATE;
import static dev.kurama.chess.backend.auth.authority.UserAuthority.USER_CREATE;
import static dev.kurama.chess.backend.auth.authority.UserAuthority.USER_DELETE;
import static dev.kurama.chess.backend.auth.authority.UserAuthority.USER_UPDATE;
import static dev.kurama.chess.backend.auth.utility.AuthorityUtils.hasAuthority;
import static dev.kurama.chess.backend.auth.utility.AuthorityUtils.isCurrentUsername;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.afford;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import dev.kurama.chess.backend.auth.api.domain.model.UserModel;
import dev.kurama.chess.backend.auth.rest.UserController;
import dev.kurama.chess.backend.auth.rest.UserProfileController;
import dev.kurama.chess.backend.core.api.assembler.DomainModelAssembler;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.Affordance;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkRelation;
import org.springframework.hateoas.PagedModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserModelAssembler extends DomainModelAssembler<UserModel> {


  @Autowired
  private PagedResourcesAssembler<UserModel> pagedResourcesAssembler;

  @Override
  protected Class<UserController> getClazz() {
    return UserController.class;
  }

  @Override
  public @NonNull UserModel toModel(@NonNull UserModel userModel) {
    boolean isCurrentUser = isCurrentUsername(userModel.getUsername());
    boolean canUpdateOwnProfile = hasAuthority(PROFILE_UPDATE);
    return userModel
      .add(getModelSelfLink(userModel.getId()))
      .add(getParentLink())
      .mapLinkIf(hasAuthority(USER_DELETE),
        LinkRelation.of("self"),
        link -> link.andAffordance(getDeleteAffordance(userModel.getUsername())))
      .mapLinkIf(hasAuthority(USER_UPDATE),
        LinkRelation.of("self"),
        link -> link.andAffordance(getUpdateAffordance(userModel.getUsername())))

      .mapLinkIf((isCurrentUser && canUpdateOwnProfile),
        LinkRelation.of("self"),
        link -> link.andAffordance(getUpdateProfileAffordance()))
      .mapLinkIf((isCurrentUser && canUpdateOwnProfile),
        LinkRelation.of("self"),
        link -> link.andAffordance(getChangePasswordAffordance()))
      .mapLinkIf((isCurrentUser && canUpdateOwnProfile),
        LinkRelation.of("self"),
        link -> link.andAffordance(getUploadAvatarAffordance()))
      .mapLinkIf((isCurrentUser && hasAuthority(PROFILE_DELETE)),
        LinkRelation.of("self"),
        link -> link.andAffordance(getDeleteProfileAffordance()))
      ;
  }

  @Override
  public @NonNull CollectionModel<UserModel> toSelfCollectionModel(
    @NonNull Iterable<? extends UserModel> entities) {
    return super.toSelfCollectionModel(entities)
      .mapLinkIf(hasAuthority(USER_CREATE),
        LinkRelation.of("self"),
        link -> link.andAffordance(getCreateAffordance()))
      ;
  }

  public @NonNull PagedModel<UserModel> toPagedModel(Page<UserModel> entities) {
    return (PagedModel<UserModel>) pagedResourcesAssembler.toModel(entities, this)
      .add(getCollectionModelWithLink(getAllLink()).withSelfRel())
      .mapLinkIf(hasAuthority(USER_CREATE),
        LinkRelation.of("self"),
        link -> link.andAffordance(getCreateAffordance()))
      ;
  }

  @Override
  public WebMvcLinkBuilder getSelfLink(String id) {
    return linkTo(methodOn(getClazz()).get(id));
  }

  @Override
  public WebMvcLinkBuilder getAllLink() {
    return linkTo(methodOn(getClazz()).getAll(null));
  }

  private @NonNull Link getParentLink() {
    return linkTo(methodOn(getClazz()).getAll(null)).withRel("users");
  }

  @SneakyThrows
  private @NonNull Affordance getCreateAffordance() {
    return afford(methodOn(getClazz()).create(null));
  }

  @SneakyThrows
  private @NonNull Affordance getUpdateAffordance(String username) {
    return afford(methodOn(getClazz()).update(username, null));
  }

  private @NonNull Affordance getDeleteAffordance(String username) {
    return afford(methodOn(getClazz()).delete(username));
  }

  private @NonNull Affordance getUpdateProfileAffordance() {
    return afford(methodOn(UserProfileController.class).updateProfile(null));
  }

  private @NonNull Affordance getChangePasswordAffordance() {
    return afford(methodOn(UserProfileController.class).changePassword(null));
  }

  @SneakyThrows
  private @NonNull Affordance getUploadAvatarAffordance() {
    return afford(methodOn(UserProfileController.class).uploadAvatar(null));
  }

  private @NonNull Affordance getDeleteProfileAffordance() {
    return afford(methodOn(UserProfileController.class).deleteProfile());
  }
}
