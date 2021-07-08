package dev.kurama.chess.backend.game.rest;


import static dev.kurama.chess.backend.auth.utility.AuthorityUtils.getCurrentUsername;
import static dev.kurama.chess.backend.auth.utility.AuthorityUtils.isAuthenticated;
import static org.springframework.hateoas.mediatype.Affordances.of;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;
import static org.springframework.http.ResponseEntity.ok;

import dev.kurama.chess.backend.auth.rest.AuthenticationController;
import dev.kurama.chess.backend.auth.rest.UserController;
import lombok.NonNull;
import lombok.SneakyThrows;
import lombok.extern.flogger.Flogger;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Flogger
@RestController()
@RequestMapping("/api")
public class RootController {

  public static final String RELATION_LOGIN = "login";
  public static final String RELATION_SIGNUP = "signup";
  public static final String RELATION_USER = "user";

  @GetMapping()
  public ResponseEntity<RootResource> root() {
    var rootResource = new RootResource();

    rootResource.add(getSelfLink());

    if (isAuthenticated()) {
      rootResource.add(getUserLink());
    } else {
      rootResource
        .add(getLoginLink())
        .add(getSignUpLink());
    }
    return ok(rootResource);
  }


  private @NonNull Link getSelfLink() {
    return of(linkTo(methodOn(RootController.class).root()).withSelfRel())
      .afford(HttpMethod.HEAD).withName("default").toLink();
  }

  private @NonNull Link getLoginLink() {
    return linkTo(methodOn(AuthenticationController.class).login(null)).withRel(RELATION_LOGIN);
  }

  @SneakyThrows
  private @NonNull Link getSignUpLink() {
    return linkTo(methodOn(AuthenticationController.class).signup(null)).withRel(RELATION_SIGNUP);
  }

  private @NonNull Link getUserLink() {
    return linkTo(methodOn(UserController.class).get(getCurrentUsername())).withRel(RELATION_USER);
  }

  private static class RootResource extends RepresentationModel<RootResource> {

  }
}
