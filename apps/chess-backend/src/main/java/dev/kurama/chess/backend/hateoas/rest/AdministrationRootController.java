package dev.kurama.chess.backend.hateoas.rest;

import static dev.kurama.chess.backend.auth.authority.AdminAuthority.ADMIN_ROOT;
import static dev.kurama.chess.backend.auth.authority.AdminAuthority.ADMIN_USER_MANAGEMENT_ROOT;
import static dev.kurama.chess.backend.auth.authority.UserAuthority.USER_CREATE;
import static dev.kurama.chess.backend.auth.utility.AuthorityUtils.hasAuthority;
import static org.springframework.hateoas.mediatype.Affordances.of;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.afford;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;
import static org.springframework.http.ResponseEntity.ok;
import static org.springframework.web.util.UriComponentsBuilder.fromUri;

import dev.kurama.chess.backend.auth.rest.RoleController;
import dev.kurama.chess.backend.auth.rest.UserController;
import dev.kurama.chess.backend.hateoas.domain.RootResource;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.data.web.HateoasPageableHandlerMethodArgumentResolver;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkRelation;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.hateoas.TemplateVariables;
import org.springframework.hateoas.UriTemplate;
import org.springframework.hateoas.mediatype.hal.HalModelBuilder;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

@RestController()
@RequiredArgsConstructor
@RequestMapping("/api/administration")
public class AdministrationRootController {

  public static final String USER_REL = "user";
  public static final String USERS_REL = "users";
  public static final String ROLES_REL = "roles";
  public static final String ROOT_REL = "root";
  public static final String USER_MANAGEMENT_ROOT_REL = "user-management";


  @NonNull
  private final HateoasPageableHandlerMethodArgumentResolver pageableResolver;

  @GetMapping()
  public ResponseEntity<RepresentationModel<?>> root() {
    HalModelBuilder rootModel = HalModelBuilder.emptyHalModel()
      .link(getSelfLink())
      .link(getParentLink());

    if (hasAuthority(ADMIN_ROOT) && hasAuthority(ADMIN_USER_MANAGEMENT_ROOT)) {
      rootModel.embed(getUserManagementResource(), LinkRelation.of(USER_MANAGEMENT_ROOT_REL));
    }

    return ok(rootModel.build());
  }

  private RepresentationModel<?> getUserManagementResource() {
    return HalModelBuilder.halModelOf(new RootResource())
      .link(getSelfLink())
      .link(getUserLink())
      .link(getUsersLink())
      .link(getRolesLink())
      .build();
  }

  private @NonNull Link getSelfLink() {
    return of(linkTo(methodOn(AdministrationRootController.class).root()).withSelfRel())
      .afford(HttpMethod.HEAD).withName("default").toLink();
  }

  private @NonNull Link getParentLink() {
    return of(linkTo(methodOn(RootController.class).root()).withRel(ROOT_REL))
      .afford(HttpMethod.HEAD).withName("default").toLink();
  }

  private @NonNull Link getUserLink() {
    return linkTo(methodOn(UserController.class).get(null)).withRel(USER_REL)
      .andAffordance(afford(methodOn(UserController.class).get(null)));
  }

  @SneakyThrows
  private @NonNull Link getUsersLink() {
    Link link = linkTo(methodOn(UserController.class).getAll(null)).withRel(USERS_REL);
    UriComponentsBuilder builder = fromUri(link.getTemplate().expand());
    TemplateVariables templateVariables = pageableResolver.getPaginationTemplateVariables(null, builder.build());
    UriTemplate template = UriTemplate.of(link.getHref()).with(templateVariables);
    Link usersLink = Link.of(template, link.getRel());
    if (hasAuthority(USER_CREATE)) {
      usersLink = usersLink.andAffordance(afford(methodOn(UserController.class).create(null)));
    }
    return usersLink;
  }

  @SneakyThrows
  private @NonNull Link getRolesLink() {
    return linkTo(methodOn(RoleController.class).getAll(null)).withRel(ROLES_REL);
  }
}
