package dev.kurama.api.core.hateoas.processor;

import static dev.kurama.api.core.authority.UserAuthority.PROFILE_READ;
import static dev.kurama.api.core.authority.UserAuthority.PROFILE_UPDATE;
import static dev.kurama.api.core.authority.UserAuthority.USER_READ;
import static dev.kurama.api.core.authority.UserPreferencesAuthority.USER_PREFERENCES_READ;
import static dev.kurama.api.core.authority.UserPreferencesAuthority.USER_PREFERENCES_UPDATE;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.WEBSOCKET_REL;
import static dev.kurama.api.core.hateoas.relations.UserRelations.CURRENT_USER_REL;
import static dev.kurama.api.core.hateoas.relations.UserRelations.USER_REL;
import static dev.kurama.api.core.message.UserPreferencesChangedMessageSender.USERS_PREFERENCES_CHANGED_CHANNEL;
import static dev.kurama.api.core.utility.AuthorityUtils.hasAnyAuthority;
import static dev.kurama.api.core.utility.AuthorityUtils.hasAuthority;
import static dev.kurama.api.core.utility.AuthorityUtils.isCurrentUserId;
import static dev.kurama.api.core.utility.HateoasUtils.withDefaultAffordance;
import static java.lang.String.format;
import static org.springframework.hateoas.mediatype.Affordances.of;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.afford;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import dev.kurama.api.core.hateoas.model.UserPreferencesModel;
import dev.kurama.api.core.hateoas.relations.HateoasRelations;
import dev.kurama.api.core.rest.UserController;
import dev.kurama.api.core.rest.UserPreferencesController;
import dev.kurama.api.core.rest.UserProfileController;
import lombok.NonNull;
import lombok.SneakyThrows;
import org.springframework.hateoas.Affordance;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkRelation;
import org.springframework.hateoas.server.RepresentationModelProcessor;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;

@Component
public class UserPreferencesModelProcessor implements RepresentationModelProcessor<UserPreferencesModel> {

  @Override
  public @NonNull UserPreferencesModel process(@NonNull UserPreferencesModel entity) {
    entity.add(getSelfLink(entity.getId()))
      .addIf(entity.getUser() != null, () -> getUserLink(entity.getUser().getId()))
      .mapLinkIf(hasAuthority(USER_PREFERENCES_UPDATE), LinkRelation.of(SELF),
        link -> link.andAffordance(getUpdateAffordance(entity.getId())))
      .addIf(hasAnyAuthority(USER_PREFERENCES_READ, PROFILE_READ), () -> getWebSocket(entity.getId()));
    if (entity.getUser() != null && isCurrentUserId(entity.getUser().getId())) {
      return entity.mapLinkIf(!hasAuthority(USER_PREFERENCES_READ) && hasAuthority(PROFILE_READ), LinkRelation.of(SELF),
          link -> getCurrentUserPreferencesSelfLink())
        .mapLinkIf(!hasAuthority(USER_READ) && hasAuthority(PROFILE_READ), LinkRelation.of(USER_REL),
          link -> getProfileLink())
        .mapLinkIf(hasAuthority(PROFILE_UPDATE), LinkRelation.of(SELF),
          link -> link.andAffordance(getUpdateCurrentUserPreferencesAffordance()));
    }
    return entity;
  }

  @SneakyThrows
  public Link getSelfLink(String id) {
    return withDefaultAffordance(linkTo(methodOn(UserPreferencesController.class).get(id)).withSelfRel());
  }

  @SneakyThrows
  private @NonNull Link getUserLink(String userId) {
    return linkTo(methodOn(UserController.class).get(userId)).withRel(USER_REL);
  }

  @SneakyThrows
  private @NonNull Link getProfileLink() {
    return linkTo(methodOn(UserProfileController.class).get()).withRel(CURRENT_USER_REL);
  }

  @SneakyThrows
  public Link getCurrentUserPreferencesSelfLink() {
    return of(linkTo(methodOn(UserProfileController.class).getPreferences()).withSelfRel()).afford(HttpMethod.HEAD)
      .withName(HateoasRelations.DEFAULT)
      .toLink();
  }

  @SneakyThrows
  private @NonNull Affordance getUpdateAffordance(String username) {
    return afford(methodOn(UserPreferencesController.class).update(username, null));
  }

  @SneakyThrows
  private @NonNull Affordance getUpdateCurrentUserPreferencesAffordance() {
    return afford(methodOn(UserProfileController.class).updatePreferences(null));
  }

  private @NonNull Link getWebSocket(String id) {
    return Link.of(format(USERS_PREFERENCES_CHANGED_CHANNEL, id)).withRel(WEBSOCKET_REL);
  }

}
