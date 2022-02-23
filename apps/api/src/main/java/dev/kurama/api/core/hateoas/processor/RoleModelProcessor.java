package dev.kurama.api.core.hateoas.processor;

import static dev.kurama.api.core.authority.RoleAuthority.ROLE_DELETE;
import static dev.kurama.api.core.authority.RoleAuthority.ROLE_UPDATE;
import static dev.kurama.api.core.authority.RoleAuthority.ROLE_UPDATE_CORE;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static dev.kurama.api.core.hateoas.relations.RoleRelations.ROLES_REL;
import static dev.kurama.api.core.utility.AuthorityUtils.hasAuthority;
import static dev.kurama.api.core.utility.HateoasUtils.withDefaultAffordance;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.afford;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import dev.kurama.api.core.hateoas.model.RoleModel;
import dev.kurama.api.core.rest.RoleController;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.hateoas.Affordance;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkRelation;
import org.springframework.hateoas.server.RepresentationModelProcessor;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class RoleModelProcessor implements RepresentationModelProcessor<RoleModel> {

  public @NonNull RoleModel process(@NonNull RoleModel entity) {
    boolean canUpdate = entity.isCoreRole() ? hasAuthority(ROLE_UPDATE_CORE) : hasAuthority(ROLE_UPDATE);
    return entity.add(getSelfLink(entity.getId()))
      .add(getParentLink())
      .mapLinkIf(!entity.isCoreRole() && hasAuthority(ROLE_DELETE), LinkRelation.of(SELF),
        link -> link.andAffordance(getDeleteAffordance(entity.getId())))
      .mapLinkIf(canUpdate, LinkRelation.of(SELF), link -> link.andAffordance(getUpdateAffordance(entity.getId())));
  }

  @SneakyThrows
  public Link getSelfLink(String id) {
    return withDefaultAffordance(linkTo(methodOn(RoleController.class).get(id)).withSelfRel());
  }

  private @NonNull Link getParentLink() {
    return linkTo(methodOn(RoleController.class).getAll(null, null)).withRel(ROLES_REL);
  }

  @SneakyThrows
  private @NonNull Affordance getUpdateAffordance(String username) {
    return afford(methodOn(RoleController.class).update(username, null));
  }

  @SneakyThrows
  private @NonNull Affordance getDeleteAffordance(String userId) {
    return afford(methodOn(RoleController.class).delete(userId));
  }
}
