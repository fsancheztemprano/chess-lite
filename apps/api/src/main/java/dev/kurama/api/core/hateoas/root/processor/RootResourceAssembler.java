package dev.kurama.api.core.hateoas.root.processor;

import static dev.kurama.api.core.authority.AdminAuthority.ADMIN_ROOT;
import static dev.kurama.api.core.authority.ProfileAuthority.PROFILE_READ;
import static dev.kurama.api.core.authority.TokenAuthority.TOKEN_REFRESH;
import static dev.kurama.api.core.hateoas.relations.AdministrationRelations.ADMINISTRATION_REL;
import static dev.kurama.api.core.hateoas.relations.ApplicationRelations.BUILD_INFO_REL;
import static dev.kurama.api.core.hateoas.relations.ApplicationRelations.THEME_REL;
import static dev.kurama.api.core.hateoas.relations.AuthenticationRelations.ACTIVATE_ACCOUNT_REL;
import static dev.kurama.api.core.hateoas.relations.AuthenticationRelations.ACTIVATION_TOKEN_REL;
import static dev.kurama.api.core.hateoas.relations.AuthenticationRelations.LOGIN_REL;
import static dev.kurama.api.core.hateoas.relations.AuthenticationRelations.SIGNUP_REL;
import static dev.kurama.api.core.hateoas.relations.AuthenticationRelations.TOKEN_REL;
import static dev.kurama.api.core.hateoas.relations.UserRelations.CURRENT_USER_REL;
import static dev.kurama.api.core.utility.HateoasUtils.withDefaultAffordance;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import dev.kurama.api.core.hateoas.root.model.RootResource;
import dev.kurama.api.core.hateoas.root.rest.AdministrationRootController;
import dev.kurama.api.core.hateoas.root.rest.RootController;
import dev.kurama.api.core.rest.AuthenticationController;
import dev.kurama.api.core.rest.BuildInfoController;
import dev.kurama.api.core.rest.ThemeController;
import dev.kurama.api.core.rest.UserProfileController;
import dev.kurama.api.core.utility.AuthorityUtils;
import lombok.NonNull;
import lombok.SneakyThrows;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.hateoas.mediatype.hal.HalModelBuilder;
import org.springframework.stereotype.Component;

@Component
public class RootResourceAssembler implements RootAssembler<RootResource> {

  public @NonNull RepresentationModel<RootResource> assemble() {
    HalModelBuilder rootModel = HalModelBuilder.halModelOf(new RootResource());

    rootModel.link(getSelfLink()).link(getBuildInfoLink()).link(getThemeLink());

    if (AuthorityUtils.isAuthenticated()) {
      if (AuthorityUtils.hasAuthority(TOKEN_REFRESH)) {
        rootModel.link(getRefreshTokenLink());
      }
      if (AuthorityUtils.hasAuthority(ADMIN_ROOT)) {
        rootModel.link(getAdministrationRootLink());
      }
      if (AuthorityUtils.hasAuthority(PROFILE_READ)) {
        rootModel.link(getCurrentUserLink());
      }
    } else {
      rootModel.link(getLoginLink())
        .link(getSignupLink())
        .link(getActivationTokenLink())
        .link(getAccountActivationLink());
    }
    return rootModel.build();
  }

  private @NonNull Link getSelfLink() {
    return withDefaultAffordance(linkTo(methodOn(RootController.class).root()).withSelfRel());
  }

  @SneakyThrows
  private @NonNull Link getCurrentUserLink() {
    return linkTo(methodOn(UserProfileController.class).get()).withRel(CURRENT_USER_REL);
  }

  @SneakyThrows
  private @NonNull Link getRefreshTokenLink() {
    return linkTo(methodOn(AuthenticationController.class).refreshToken()).withRel(TOKEN_REL);
  }

  @SneakyThrows
  private @NonNull Link getLoginLink() {
    return linkTo(methodOn(AuthenticationController.class).login(null)).withRel(LOGIN_REL);
  }

  @SneakyThrows
  private @NonNull Link getSignupLink() {
    return linkTo(methodOn(AuthenticationController.class).signup(null)).withRel(SIGNUP_REL);
  }

  @SneakyThrows
  private @NonNull Link getActivationTokenLink() {
    return linkTo(methodOn(AuthenticationController.class).requestActivationToken(null)).withRel(ACTIVATION_TOKEN_REL);
  }

  @SneakyThrows
  private @NonNull Link getAccountActivationLink() {
    return linkTo(methodOn(AuthenticationController.class).activateAccount(null)).withRel(ACTIVATE_ACCOUNT_REL);
  }

  private @NonNull Link getAdministrationRootLink() {
    return linkTo(methodOn(AdministrationRootController.class).root()).withRel(ADMINISTRATION_REL);
  }

  private @NonNull Link getBuildInfoLink() {
    return linkTo(methodOn(BuildInfoController.class).get()).withRel(BUILD_INFO_REL);
  }

  private @NonNull Link getThemeLink() {
    return linkTo(methodOn(ThemeController.class).get()).withRel(THEME_REL);
  }
}
