package dev.kurama.api.hateoas.rest;

import static dev.kurama.api.auth.api.domain.relations.AdministrationRelations.ADMINISTRATION_REL;
import static dev.kurama.api.auth.api.domain.relations.AuthenticationRelations.LOGIN_REL;
import static dev.kurama.api.auth.api.domain.relations.AuthenticationRelations.SIGNUP_REL;
import static dev.kurama.api.auth.api.domain.relations.UserRelations.CURRENT_USER_REL;
import static dev.kurama.api.auth.authority.AdminAuthority.ADMIN_ROOT;
import static dev.kurama.api.auth.authority.UserAuthority.PROFILE_READ;
import static dev.kurama.api.hateoas.domain.HateoasRelations.DEFAULT;
import static org.springframework.hateoas.mediatype.Affordances.of;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;
import static org.springframework.http.ResponseEntity.ok;

import dev.kurama.api.auth.rest.AuthenticationController;
import dev.kurama.api.auth.rest.UserProfileController;
import dev.kurama.api.auth.utility.AuthorityUtils;
import dev.kurama.api.hateoas.domain.RootResource;
import lombok.NonNull;
import lombok.SneakyThrows;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.hateoas.mediatype.hal.HalModelBuilder;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequestMapping({"/api", "/api/root"})
public class RootController {

  @GetMapping()
  public ResponseEntity<RepresentationModel<?>> root() {
    HalModelBuilder rootModel = HalModelBuilder
      .halModelOf(new RootResource())
      .link(getSelfLink());

    if (AuthorityUtils.isAuthenticated()) {
      if (AuthorityUtils.hasAuthority(ADMIN_ROOT)) {
        rootModel.link(getAdministrationRootLink());
      }
      if (AuthorityUtils.hasAuthority(PROFILE_READ)) {
        rootModel.link(getCurrentUserLink());
      }
    } else {
      rootModel
        .link(getLoginLink())
        .link(getSignupLink());
    }
    return ok(rootModel.build());
  }

  private @NonNull Link getSelfLink() {
    return of(linkTo(methodOn(RootController.class).root()).withSelfRel())
      .afford(HttpMethod.HEAD).withName(DEFAULT).toLink();
  }

  private @NonNull Link getCurrentUserLink() {
    return linkTo(methodOn(UserProfileController.class).get()).withRel(CURRENT_USER_REL);
  }

  private @NonNull Link getLoginLink() {
    return WebMvcLinkBuilder.linkTo(methodOn(AuthenticationController.class).login(null)).withRel(LOGIN_REL);
  }

  @SneakyThrows
  private @NonNull Link getSignupLink() {
    return linkTo(methodOn(AuthenticationController.class).signup(null)).withRel(SIGNUP_REL);
  }

  private @NonNull Link getAdministrationRootLink() {
    return of(linkTo(methodOn(AdministrationRootController.class).root()).withRel(ADMINISTRATION_REL))
      .afford(HttpMethod.HEAD).withName(DEFAULT).toLink();
  }
}
