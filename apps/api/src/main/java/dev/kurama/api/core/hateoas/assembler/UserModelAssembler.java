package dev.kurama.api.core.hateoas.assembler;

import static dev.kurama.api.core.authority.UserAuthority.PROFILE_DELETE;
import static dev.kurama.api.core.authority.UserAuthority.PROFILE_READ;
import static dev.kurama.api.core.authority.UserAuthority.PROFILE_UPDATE;
import static dev.kurama.api.core.authority.UserAuthority.USER_CREATE;
import static dev.kurama.api.core.authority.UserAuthority.USER_DELETE;
import static dev.kurama.api.core.authority.UserAuthority.USER_READ;
import static dev.kurama.api.core.authority.UserAuthority.USER_UPDATE;
import static dev.kurama.api.core.authority.UserPreferencesAuthority.USER_PREFERENCES_READ;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static dev.kurama.api.core.hateoas.relations.UserRelations.USERS_REL;
import static dev.kurama.api.core.hateoas.relations.UserRelations.USER_PREFERENCES_REL;
import static dev.kurama.api.core.utility.AuthorityUtils.hasAuthority;
import static org.springframework.hateoas.mediatype.Affordances.of;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.afford;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import dev.kurama.api.core.hateoas.model.UserModel;
import dev.kurama.api.core.hateoas.relations.HateoasRelations;
import dev.kurama.api.core.rest.UserController;
import dev.kurama.api.core.rest.UserPreferencesController;
import dev.kurama.api.core.rest.UserProfileController;
import dev.kurama.api.core.utility.AuthorityUtils;
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
import org.springframework.http.HttpMethod;
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
  public @NonNull
  UserModel toModel(@NonNull UserModel userModel) {
    boolean isCurrentUser = AuthorityUtils.isCurrentUsername(userModel.getUsername());
    boolean canUpdateOwnProfile = hasAuthority(PROFILE_UPDATE);
    return userModel
      .add(getModelSelfLink(userModel.getId()))
      .mapLinkIf(isCurrentUser && !hasAuthority(USER_READ) && hasAuthority(PROFILE_READ),
        LinkRelation.of(SELF),
        link -> getCurrentUserSelfLink())

      .addIf(hasAuthority(USER_READ), this::getParentLink)

      .add(getPreferencesLink(userModel.getUserPreferencesId()))
      .mapLinkIf(isCurrentUser && !hasAuthority(USER_PREFERENCES_READ) && hasAuthority(PROFILE_READ),
        LinkRelation.of(USER_PREFERENCES_REL),
        link -> getCurrentUserPreferencesSelfLink())

      .mapLinkIf(hasAuthority(USER_DELETE),
        LinkRelation.of(SELF),
        link -> link.andAffordance(getDeleteAffordance(userModel.getId())))
      .mapLinkIf(hasAuthority(USER_UPDATE),
        LinkRelation.of(SELF),
        link -> link.andAffordance(getUpdateAffordance(userModel.getId())))

      .mapLinkIf((isCurrentUser && canUpdateOwnProfile),
        LinkRelation.of(SELF),
        link -> link.andAffordance(getUpdateProfileAffordance()))
      .mapLinkIf((isCurrentUser && canUpdateOwnProfile),
        LinkRelation.of(SELF),
        link -> link.andAffordance(getChangePasswordAffordance()))
      .mapLinkIf((isCurrentUser && canUpdateOwnProfile),
        LinkRelation.of(SELF),
        link -> link.andAffordance(getUploadAvatarAffordance()))
      .mapLinkIf((isCurrentUser && hasAuthority(PROFILE_DELETE)),
        LinkRelation.of(SELF),
        link -> link.andAffordance(getDeleteProfileAffordance()))
      ;
  }

  @Override
  public @NonNull
  CollectionModel<UserModel> toSelfCollectionModel(
    @NonNull Iterable<? extends UserModel> entities) {
    return super.toSelfCollectionModel(entities)
      .mapLinkIf(hasAuthority(USER_CREATE),
        LinkRelation.of(SELF),
        link -> link.andAffordance(getCreateAffordance()))
      ;
  }

  public @NonNull
  PagedModel<UserModel> toPagedModel(Page<UserModel> entities) {
    return (PagedModel<UserModel>) pagedResourcesAssembler.toModel(entities, this)
      .add(getCollectionModelSelfLinkWithRel(getAllLink(), USERS_REL))
      .mapLinkIf(hasAuthority(USER_CREATE),
        LinkRelation.of(USERS_REL),
        link -> link.andAffordance(getCreateAffordance()))
      ;
  }

  @Override
  public WebMvcLinkBuilder getSelfLink(String id) {
    return linkTo(methodOn(getClazz()).get(id));
  }

  public Link getCurrentUserSelfLink() {
    return of(linkTo(methodOn(UserProfileController.class).get()).withSelfRel()).afford(HttpMethod.HEAD)
      .withName(HateoasRelations.DEFAULT).toLink();
  }

  private Link getPreferencesLink(String userPreferencesId) {
    return linkTo(methodOn(UserPreferencesController.class).get(userPreferencesId)).withRel(USER_PREFERENCES_REL);
  }

  public Link getCurrentUserPreferencesSelfLink() {
    return linkTo(methodOn(UserProfileController.class).getPreferences()).withRel(USER_PREFERENCES_REL);
  }

  @Override
  public WebMvcLinkBuilder getAllLink() {
    return linkTo(methodOn(getClazz()).getAll(null));
  }

  private @NonNull
  Link getParentLink() {
    return linkTo(methodOn(getClazz()).getAll(null)).withRel(USERS_REL);
  }

  @SneakyThrows
  private @NonNull
  Affordance getCreateAffordance() {
    return afford(methodOn(getClazz()).create(null));
  }

  @SneakyThrows
  private @NonNull
  Affordance getUpdateAffordance(String username) {
    return afford(methodOn(getClazz()).update(username, null));
  }

  private @NonNull
  Affordance getDeleteAffordance(String userId) {
    return afford(methodOn(getClazz()).delete(userId));
  }

  private @NonNull
  Affordance getUpdateProfileAffordance() {
    return afford(methodOn(UserProfileController.class).updateProfile(null));
  }

  private @NonNull
  Affordance getChangePasswordAffordance() {
    return afford(methodOn(UserProfileController.class).changePassword(null));
  }

  @SneakyThrows
  private @NonNull
  Affordance getUploadAvatarAffordance() {
    return afford(methodOn(UserProfileController.class).uploadAvatar(null));
  }

  private @NonNull
  Affordance getDeleteProfileAffordance() {
    return afford(methodOn(UserProfileController.class).deleteProfile());
  }
}
