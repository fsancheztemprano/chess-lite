package dev.kurama.api.core.hateoas.processor;

import static dev.kurama.api.core.authority.RoleAuthority.ROLE_READ;
import static dev.kurama.api.core.hateoas.relations.RoleRelations.ROLES_REL;
import static dev.kurama.api.core.utility.AuthorityUtils.hasAuthority;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import dev.kurama.api.core.hateoas.model.RoleModel;
import dev.kurama.api.core.rest.RoleController;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class RoleModelProcessor extends DomainModelProcessor<RoleModel> {

  @Override
  public @NonNull RoleModel process(@NonNull RoleModel entity) {
    return entity
      .addIf(hasAuthority(ROLE_READ), () -> getModelSelfLink(entity.getId()))
      .addIf(hasAuthority(ROLE_READ), this::getParentLink);
  }

  @Override
  protected Class<RoleController> getClazz() {
    return RoleController.class;
  }

  @Override
  public WebMvcLinkBuilder getSelfLink(String id) {
    return linkTo(methodOn(getClazz()).get(id));
  }

  private @NonNull Link getParentLink() {
    return linkTo(methodOn(getClazz()).getAll(null)).withRel(ROLES_REL);
  }
}
