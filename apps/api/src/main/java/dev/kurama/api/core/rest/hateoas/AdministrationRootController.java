package dev.kurama.api.core.rest.hateoas;

import static dev.kurama.api.core.authority.AdminAuthority.ADMIN_ROLE_MANAGEMENT_ROOT;
import static dev.kurama.api.core.authority.AdminAuthority.ADMIN_USER_MANAGEMENT_ROOT;
import static dev.kurama.api.core.authority.RoleAuthority.ROLE_CREATE;
import static dev.kurama.api.core.authority.ServiceLogsAuthority.SERVICE_LOGS_READ;
import static dev.kurama.api.core.authority.UserAuthority.USER_CREATE;
import static dev.kurama.api.core.hateoas.relations.AdministrationRelations.ROLE_MANAGEMENT_ROOT_REL;
import static dev.kurama.api.core.hateoas.relations.AdministrationRelations.SERVICE_LOGS_REL;
import static dev.kurama.api.core.hateoas.relations.AdministrationRelations.USER_MANAGEMENT_ROOT_REL;
import static dev.kurama.api.core.hateoas.relations.AuthorityRelations.AUTHORITIES_REL;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.DEFAULT;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.ROOT_REL;
import static dev.kurama.api.core.hateoas.relations.RoleRelations.ROLES_REL;
import static dev.kurama.api.core.hateoas.relations.RoleRelations.ROLE_REL;
import static dev.kurama.api.core.hateoas.relations.UserRelations.USERS_REL;
import static dev.kurama.api.core.hateoas.relations.UserRelations.USER_REL;
import static dev.kurama.api.core.utility.AuthorityUtils.hasAuthority;
import static org.springframework.hateoas.mediatype.Affordances.of;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.afford;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;
import static org.springframework.http.ResponseEntity.ok;
import static org.springframework.web.util.UriComponentsBuilder.fromUri;

import dev.kurama.api.core.hateoas.model.RootResource;
import dev.kurama.api.core.rest.AuthorityController;
import dev.kurama.api.core.rest.RoleController;
import dev.kurama.api.core.rest.ServiceLogsController;
import dev.kurama.api.core.rest.UserController;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

@PreAuthorize("hasAuthority('admin:root')")
@RestController()
@RequiredArgsConstructor
@RequestMapping("/api/administration")
public class AdministrationRootController {

  @NonNull
  private final HateoasPageableHandlerMethodArgumentResolver pageableResolver;

  @GetMapping()
  public ResponseEntity<RepresentationModel<?>> root() {
    HalModelBuilder rootModel = HalModelBuilder.emptyHalModel()
      .link(getSelfLink())
      .link(getParentLink());

    if (hasAuthority(SERVICE_LOGS_READ)) {
      rootModel.link(getServiceLogsLink());
    }

    if (hasAuthority(ADMIN_USER_MANAGEMENT_ROOT)) {
      rootModel.embed(getUserManagementResource(), LinkRelation.of(USER_MANAGEMENT_ROOT_REL));
    }

    if (hasAuthority(ADMIN_ROLE_MANAGEMENT_ROOT)) {
      rootModel.embed(getRoleManagementResource(), LinkRelation.of(ROLE_MANAGEMENT_ROOT_REL));
    }

    return ok(rootModel.build());
  }

  private RepresentationModel<?> getUserManagementResource() {
    return HalModelBuilder.halModelOf(new RootResource())
      .link(getSelfLink())
      .link(getUserLink())
      .link(getUsersLink())
      .build();
  }

  private RepresentationModel<?> getRoleManagementResource() {
    return HalModelBuilder.halModelOf(new RootResource())
      .link(getSelfLink())
      .link(getRoleLink())
      .link(getRolesLink())
      .link(getAuthoritiesLink())
      .build();
  }

  private @NonNull
  Link getSelfLink() {
    return of(linkTo(methodOn(AdministrationRootController.class).root()).withSelfRel())
      .afford(HttpMethod.HEAD).withName(DEFAULT).toLink();
  }

  private @NonNull
  Link getParentLink() {
    return of(linkTo(methodOn(RootController.class).root()).withRel(ROOT_REL))
      .afford(HttpMethod.HEAD).withName(DEFAULT).toLink();
  }

  private Link getServiceLogsLink() {
    return of(linkTo(methodOn(ServiceLogsController.class).getServiceLogs()).withRel(SERVICE_LOGS_REL))
      .afford(HttpMethod.HEAD).withName(DEFAULT).toLink();
  }

  @SneakyThrows
  private @NonNull
  Link getUserLink() {
    return linkTo(methodOn(UserController.class).get(null)).withRel(USER_REL);
  }

  @SneakyThrows
  private @NonNull
  Link getUsersLink() {
    Link link = linkTo(methodOn(UserController.class).getAll(null)).withRel(USERS_REL);
    Link usersLink = getExpandedLink(link);
    if (hasAuthority(USER_CREATE)) {
      usersLink = usersLink.andAffordance(afford(methodOn(UserController.class).create(null)));
    }
    return usersLink;
  }

  @SneakyThrows
  private @NonNull
  Link getRoleLink() {
    return linkTo(methodOn(RoleController.class).get(null)).withRel(ROLE_REL);
  }

  @SneakyThrows
  private @NonNull
  Link getRolesLink() {
    Link link = linkTo(methodOn(RoleController.class).getAll(null)).withRel(ROLES_REL);
    Link rolesLink = getExpandedLink(link);
    if (hasAuthority(ROLE_CREATE)) {
      rolesLink = rolesLink.andAffordance(afford(methodOn(RoleController.class).create(null)));
    }
    return rolesLink;
  }

  @SneakyThrows
  private @NonNull
  Link getAuthoritiesLink() {
    return getExpandedLink(
      linkTo(methodOn(AuthorityController.class).getAll(null)).withRel(AUTHORITIES_REL));
  }

  private Link getExpandedLink(Link link) {
    UriComponentsBuilder builder = fromUri(link.getTemplate().expand());
    TemplateVariables templateVariables = pageableResolver.getPaginationTemplateVariables(null, builder.build());
    UriTemplate template = UriTemplate.of(link.getHref()).with(templateVariables);
    return Link.of(template, link.getRel());
  }
}
