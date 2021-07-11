package dev.kurama.chess.backend.hateoas.rest;

import static dev.kurama.chess.backend.auth.utility.AuthorityUtils.isAuthenticated;
import static org.springframework.hateoas.mediatype.Affordances.of;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;
import static org.springframework.http.ResponseEntity.ok;

import dev.kurama.chess.backend.auth.rest.AuthenticationController;
import dev.kurama.chess.backend.hateoas.domain.RootResource;
import lombok.NonNull;
import lombok.SneakyThrows;
import org.springframework.hateoas.Link;
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
  public static final String USER_ROOT_REL = "user-root";

  @GetMapping()
  public ResponseEntity<RootResource> root() {
    var rootResource = new RootResource();

    rootResource.add(getSelfLink());

    if (isAuthenticated()) {
      rootResource.add(getUsersLink());
    } else {
      rootResource
        .add(getLoginLink())
        .add(getSignupLink());
    }
    return ok(rootResource);
  }

  private @NonNull Link getSelfLink() {
    return of(linkTo(methodOn(RootController.class).root()).withSelfRel())
      .afford(HttpMethod.HEAD).withName("default").toLink();
  }

  private @NonNull Link getLoginLink() {
    return linkTo(methodOn(AuthenticationController.class).login(null)).withRel(LOGIN_REL);
  }

  @SneakyThrows
  private @NonNull Link getSignupLink() {
    return linkTo(methodOn(AuthenticationController.class).signup(null)).withRel(SIGNUP_REL);
  }

  private @NonNull Link getUsersLink() {
    return linkTo(methodOn(UserRootController.class).root()).withRel(USER_ROOT_REL);
  }

}
