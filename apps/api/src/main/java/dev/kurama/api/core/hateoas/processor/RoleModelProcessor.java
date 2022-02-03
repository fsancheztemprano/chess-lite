package dev.kurama.api.core.hateoas.processor;

import dev.kurama.api.core.hateoas.model.RoleModel;
import dev.kurama.api.core.rest.RoleController;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.hateoas.Affordance;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkRelation;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Component;

import static dev.kurama.api.core.authority.RoleAuthority.*;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static dev.kurama.api.core.hateoas.relations.RoleRelations.ROLES_REL;
import static dev.kurama.api.core.utility.AuthorityUtils.hasAuthority;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@RequiredArgsConstructor
@Component
public class RoleModelProcessor extends DomainModelProcessor<RoleModel> {

  protected Class<RoleController> getClazz() {
    return RoleController.class;
  }

  public @NonNull RoleModel process(@NonNull RoleModel entity) {
    boolean canUpdate = entity.isCoreRole() ? hasAuthority(ROLE_UPDATE_CORE) : hasAuthority(ROLE_UPDATE);
    return entity.add(getModelDefaultLink(entity.getId()))
                 .add(getParentLink())
                 .mapLinkIf(!entity.isCoreRole() && hasAuthority(ROLE_DELETE), LinkRelation.of(SELF),
                   link -> link.andAffordance(getDeleteAffordance(entity.getId())))
                 .mapLinkIf(canUpdate, LinkRelation.of(SELF),
                   link -> link.andAffordance(getUpdateAffordance(entity.getId())));
  }

  @SneakyThrows
  @Override
  public WebMvcLinkBuilder getSelfLink(String id) {
    return linkTo(methodOn(getClazz()).get(id));
  }

  private @NonNull Link getParentLink() {
    return linkTo(methodOn(getClazz()).getAll(null, null)).withRel(ROLES_REL);
  }

  @SneakyThrows
  private @NonNull Affordance getUpdateAffordance(String username) {
    return afford(methodOn(getClazz()).update(username, null));
  }

  @SneakyThrows
  private @NonNull Affordance getDeleteAffordance(String userId) {
    return afford(methodOn(getClazz()).delete(userId));
  }
}
