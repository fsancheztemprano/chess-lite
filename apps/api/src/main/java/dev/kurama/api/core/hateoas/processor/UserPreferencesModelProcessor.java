package dev.kurama.api.core.hateoas.processor;

import static dev.kurama.api.core.authority.UserAuthority.PROFILE_READ;
import static dev.kurama.api.core.authority.UserAuthority.PROFILE_UPDATE;
import static dev.kurama.api.core.authority.UserAuthority.USER_READ;
import static dev.kurama.api.core.authority.UserPreferencesAuthority.USER_PREFERENCES_READ;
import static dev.kurama.api.core.authority.UserPreferencesAuthority.USER_PREFERENCES_UPDATE;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static dev.kurama.api.core.hateoas.relations.UserRelations.CURRENT_USER_REL;
import static dev.kurama.api.core.hateoas.relations.UserRelations.USER_REL;
import static dev.kurama.api.core.utility.AuthorityUtils.hasAuthority;
import static org.springframework.hateoas.mediatype.Affordances.of;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.afford;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import dev.kurama.api.core.hateoas.model.UserPreferencesModel;
import dev.kurama.api.core.hateoas.relations.HateoasRelations;
import dev.kurama.api.core.rest.UserController;
import dev.kurama.api.core.rest.UserPreferencesController;
import dev.kurama.api.core.rest.UserProfileController;
import dev.kurama.api.core.utility.AuthorityUtils;
import lombok.NonNull;
import lombok.SneakyThrows;
import org.springframework.hateoas.Affordance;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkRelation;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;

@Component
public class UserPreferencesModelProcessor extends DomainModelProcessor<UserPreferencesModel> {

  @Override
  protected Class<UserPreferencesController> getClazz() {
    return UserPreferencesController.class;
  }

  @Override
  public @NonNull UserPreferencesModel process(UserPreferencesModel userPreferencesModel) {
    boolean isCurrentUser = userPreferencesModel.getUser() != null && AuthorityUtils.isCurrentUsername(
      userPreferencesModel.getUser().getUsername());
    return userPreferencesModel
      .add(getModelSelfLink(userPreferencesModel.getId()))
      .mapLinkIf(isCurrentUser && !hasAuthority(USER_PREFERENCES_READ) && hasAuthority(PROFILE_READ),
        LinkRelation.of(SELF),
        link -> getCurrentUserPreferencesSelfLink())

      .addIf(userPreferencesModel.getUser() != null, () -> getUserLink(userPreferencesModel.getUser().getId()))
      .mapLinkIf(isCurrentUser && !hasAuthority(USER_READ) && hasAuthority(PROFILE_READ),
        LinkRelation.of(USER_REL),
        link -> getProfileLink())

      .mapLinkIf(hasAuthority(USER_PREFERENCES_UPDATE),
        LinkRelation.of(SELF),
        link -> link.andAffordance(getUpdateAffordance(userPreferencesModel.getId())))
      .mapLinkIf(isCurrentUser && hasAuthority(PROFILE_UPDATE),
        LinkRelation.of(SELF),
        link -> link.andAffordance(getUpdateCurrentUserPreferencesAffordance()))
      ;
  }

  @SneakyThrows
  @Override
  public WebMvcLinkBuilder getSelfLink(String id) {
    return linkTo(methodOn(getClazz()).get(id));
  }

  @SneakyThrows
  private @NonNull
  Link getUserLink(String userId) {
    return linkTo(methodOn(UserController.class).get(userId)).withRel(USER_REL);
  }

  @SneakyThrows
  private @NonNull
  Link getProfileLink() {
    return linkTo(methodOn(UserProfileController.class).get()).withRel(CURRENT_USER_REL);
  }

  public Link getCurrentUserPreferencesSelfLink() {
    return of(linkTo(methodOn(UserProfileController.class).getPreferences()).withSelfRel()).afford(HttpMethod.HEAD)
      .withName(HateoasRelations.DEFAULT).toLink();
  }

  @SneakyThrows
  private @NonNull
  Affordance getUpdateAffordance(String username) {
    return afford(methodOn(getClazz()).update(username, null));
  }

  private @NonNull
  Affordance getUpdateCurrentUserPreferencesAffordance() {
    return afford(methodOn(UserProfileController.class).updatePreferences(null));
  }
}
