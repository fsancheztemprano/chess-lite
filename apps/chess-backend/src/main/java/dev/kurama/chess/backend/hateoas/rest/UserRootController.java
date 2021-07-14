package dev.kurama.chess.backend.hateoas.rest;

import static dev.kurama.chess.backend.auth.utility.AuthorityUtils.getCurrentUsername;
import static dev.kurama.chess.backend.auth.utility.AuthorityUtils.isAuthenticated;
import static dev.kurama.chess.backend.hateoas.rest.RootController.LOGIN_REL;
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
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequestMapping("/api/root/user")
public class UserRootController {

  public static final String CURRENT_USER_REL = "current-user";
  public static final String USER_REL = "user";
  public static final String USERS_REL = "users";

  @GetMapping()
  public ResponseEntity<RootResource> root() {
    var rootResource = new RootResource();

    rootResource.add(getSelfLink());

    if (isAuthenticated()) {
      rootResource.add(getCurrentUserLink());
      rootResource.add(getUserLink());
      rootResource.add(getUsersLink());
    } else {
      rootResource.add(getLoginLink());
    }
    return ok(rootResource);
  }

  private @NonNull Link getSelfLink() {
    return of(linkTo(methodOn(UserRootController.class).root()).withSelfRel())
      .afford(HttpMethod.HEAD).withName("default").toLink();
  }

  private @NonNull Link getCurrentUserLink() {
    return linkTo(methodOn(UserController.class).get(getCurrentUsername())).withRel(CURRENT_USER_REL);
  }

  private @NonNull Link getUserLink() {
    return linkTo(methodOn(UserController.class).get(null)).withRel(USER_REL);
  }

  @SneakyThrows
  private @NonNull Link getUsersLink() {
    return linkTo(methodOn(UserController.class).getAll()).withRel(USERS_REL);
  }

  private @NonNull Link getLoginLink() {
    return linkTo(methodOn(AuthenticationController.class).login(null)).withRel(LOGIN_REL);
  }
}
