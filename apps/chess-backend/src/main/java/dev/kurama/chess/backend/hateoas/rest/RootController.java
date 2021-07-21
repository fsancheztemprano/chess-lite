package dev.kurama.chess.backend.hateoas.rest;

import static dev.kurama.chess.backend.auth.authority.AdminAuthority.ADMIN_ROOT;
import static dev.kurama.chess.backend.auth.utility.AuthorityUtils.getCurrentUsername;
import static dev.kurama.chess.backend.auth.utility.AuthorityUtils.hasAuthority;
import static dev.kurama.chess.backend.auth.utility.AuthorityUtils.isAuthenticated;
import static org.springframework.hateoas.mediatype.Affordances.of;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;
import static org.springframework.http.ResponseEntity.ok;

import dev.kurama.chess.backend.auth.rest.AuthenticationController;
import dev.kurama.chess.backend.auth.rest.UserController;
import dev.kurama.chess.backend.hateoas.domain.RootResource;
import lombok.NonNull;
import lombok.SneakyThrows;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.hateoas.mediatype.hal.HalModelBuilder;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequestMapping({"/api", "/api/root"})
public class RootController {

  public static final String LOGIN_REL = "login";
  public static final String SIGNUP_REL = "signup";

  public static final String CURRENT_USER_REL = "current-user";

  public static final String ADMINISTRATION_REL = "administration";

  @GetMapping()
  public ResponseEntity<RepresentationModel<?>> root() {
    HalModelBuilder rootModel = HalModelBuilder
      .halModelOf(new RootResource())
      .link(getSelfLink());

    if (isAuthenticated()) {
      if (hasAuthority(ADMIN_ROOT)) {
        rootModel.link(getAdministrationRootLink());
      }
      rootModel.link(getCurrentUserLink());
    } else {
      rootModel
        .link(getLoginLink())
        .link(getSignupLink());
    }
    return ok(rootModel.build());
  }

  private @NonNull Link getSelfLink() {
    return of(linkTo(methodOn(RootController.class).root()).withSelfRel())
      .afford(HttpMethod.HEAD).withName("default").toLink();
  }

  private @NonNull Link getCurrentUserLink() {
    return linkTo(methodOn(UserController.class).get(getCurrentUsername())).withRel(CURRENT_USER_REL);
  }

  private @NonNull Link getLoginLink() {
    return linkTo(methodOn(AuthenticationController.class).login(null)).withRel(LOGIN_REL);
  }

  @SneakyThrows
  private @NonNull Link getSignupLink() {
    return linkTo(methodOn(AuthenticationController.class).signup(null)).withRel(SIGNUP_REL);
  }

  private @NonNull Link getAdministrationRootLink() {
    return of(linkTo(methodOn(AdministrationRootController.class).root()).withRel(ADMINISTRATION_REL))
      .afford(HttpMethod.HEAD).withName("default").toLink();
  }
}
