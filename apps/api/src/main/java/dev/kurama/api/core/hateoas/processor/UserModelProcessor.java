package dev.kurama.api.core.hateoas.processor;

import static dev.kurama.api.core.authority.UserAuthority.PROFILE_DELETE;
import static dev.kurama.api.core.authority.UserAuthority.PROFILE_READ;
import static dev.kurama.api.core.authority.UserAuthority.PROFILE_UPDATE;
import static dev.kurama.api.core.authority.UserAuthority.USER_DELETE;
import static dev.kurama.api.core.authority.UserAuthority.USER_READ;
import static dev.kurama.api.core.authority.UserAuthority.USER_UPDATE;
import static dev.kurama.api.core.authority.UserAuthority.USER_UPDATE_AUTHORITIES;
import static dev.kurama.api.core.authority.UserAuthority.USER_UPDATE_ROLE;
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
import org.springframework.hateoas.Affordance;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkRelation;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class UserModelProcessor extends DomainModelProcessor<UserModel> {

  @NonNull
  UserPreferencesModelProcessor userPreferencesModelProcessor;

  @Override
  protected Class<UserController> getClazz() {
    return UserController.class;
  }

  @Override
  public @NonNull UserModel process(@NonNull UserModel entity) {
    boolean isCurrentUser = AuthorityUtils.isCurrentUsername(entity.getUsername());
    boolean canUpdateOwnProfile = hasAuthority(PROFILE_UPDATE);
    userPreferencesModelProcessor.process(entity.getUserPreferences());
    return entity
      .add(getModelSelfLink(entity.getId()))
      .mapLinkIf(isCurrentUser && !hasAuthority(USER_READ) && hasAuthority(PROFILE_READ),
        LinkRelation.of(SELF),
        link -> getCurrentUserSelfLink())

      .addIf(hasAuthority(USER_READ), this::getParentLink)

      .add(getPreferencesLink(entity.getUserPreferences().getId()))
      .mapLinkIf(isCurrentUser && !hasAuthority(USER_PREFERENCES_READ) && hasAuthority(PROFILE_READ),
        LinkRelation.of(USER_PREFERENCES_REL),
        link -> getCurrentUserPreferencesSelfLink())

      .mapLinkIf(hasAuthority(USER_DELETE),
        LinkRelation.of(SELF),
        link -> link.andAffordance(getDeleteAffordance(entity.getId())))
      .mapLinkIf(hasAuthority(USER_UPDATE),
        LinkRelation.of(SELF),
        link -> link.andAffordance(getUpdateAffordance(entity.getId())))
      .mapLinkIf(hasAuthority(USER_UPDATE_ROLE),
        LinkRelation.of(SELF),
        link -> link.andAffordance(getUpdateRoleAffordance(entity.getId())))
      .mapLinkIf(hasAuthority(USER_UPDATE_AUTHORITIES),
        LinkRelation.of(SELF),
        link -> link.andAffordance(getUpdateAuthoritiesAffordance(entity.getId())))
      .mapLinkIf(hasAuthority(USER_UPDATE),
        LinkRelation.of(SELF),
        link -> link.andAffordance(getSendActivationTokenAffordance(entity.getId())))

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

  @SneakyThrows
  @Override
  public WebMvcLinkBuilder getSelfLink(String id) {
    return linkTo(methodOn(getClazz()).get(id));
  }

  private @NonNull
  Link getParentLink() {
    return linkTo(methodOn(getClazz()).getAll(null)).withRel(USERS_REL);
  }

  @SneakyThrows
  public Link getCurrentUserSelfLink() {
    return of(linkTo(methodOn(UserProfileController.class).get()).withSelfRel()).afford(HttpMethod.HEAD)
      .withName(HateoasRelations.DEFAULT).toLink();
  }

  @SneakyThrows
  private Link getPreferencesLink(String userPreferencesId) {
    return linkTo(methodOn(UserPreferencesController.class).get(userPreferencesId)).withRel(USER_PREFERENCES_REL);
  }

  public Link getCurrentUserPreferencesSelfLink() {
    return linkTo(methodOn(UserProfileController.class).getPreferences()).withRel(USER_PREFERENCES_REL);
  }

  @SneakyThrows
  private @NonNull Affordance getUpdateAffordance(String username) {
    return afford(methodOn(getClazz()).update(username, null));
  }

  @SneakyThrows
  private @NonNull Affordance getUpdateRoleAffordance(String username) {
    return afford(methodOn(getClazz()).updateRole(username, null));
  }

  @SneakyThrows
  private @NonNull Affordance getUpdateAuthoritiesAffordance(String username) {
    return afford(methodOn(getClazz()).updateAuthorities(username, null));
  }

  @SneakyThrows
  private @NonNull Affordance getDeleteAffordance(String userId) {
    return afford(methodOn(getClazz()).delete(userId));
  }

  @SneakyThrows
  private @NonNull Affordance getSendActivationTokenAffordance(String userId) {
    return afford(methodOn(getClazz()).requestActivationToken(userId));
  }

  @SneakyThrows
  private @NonNull Affordance getUpdateProfileAffordance() {
    return afford(methodOn(UserProfileController.class).updateProfile(null));
  }

  @SneakyThrows
  private @NonNull Affordance getChangePasswordAffordance() {
    return afford(methodOn(UserProfileController.class).changePassword(null));
  }

  @SneakyThrows
  private @NonNull Affordance getUploadAvatarAffordance() {
    return afford(methodOn(UserProfileController.class).uploadAvatar(null));
  }

  @SneakyThrows
  private @NonNull Affordance getDeleteProfileAffordance() {
    return afford(methodOn(UserProfileController.class).deleteProfile());
  }
}
