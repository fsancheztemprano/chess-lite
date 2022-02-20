package dev.kurama.api.core.hateoas.assembler;

import static dev.kurama.api.core.authority.RoleAuthority.ROLE_CREATE;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static dev.kurama.api.core.utility.AuthorityUtils.hasAuthority;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.afford;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import dev.kurama.api.core.hateoas.model.RoleModel;
import dev.kurama.api.core.rest.RoleController;
import lombok.NonNull;
import lombok.SneakyThrows;
import org.springframework.data.domain.Page;
import org.springframework.hateoas.Affordance;
import org.springframework.hateoas.LinkRelation;
import org.springframework.hateoas.PagedModel;
import org.springframework.stereotype.Component;

@Component
public class RoleModelAssembler extends DomainModelAssembler<RoleModel> {

  @Override
  public @NonNull PagedModel<RoleModel> toPagedModel(Page<RoleModel> entities) {
    return (PagedModel<RoleModel>) super.toPagedModel(entities)
      .mapLinkIf(hasAuthority(ROLE_CREATE), LinkRelation.of(SELF), link -> link.andAffordance(getCreateAffordance()));
  }

  @SneakyThrows
  private @NonNull Affordance getCreateAffordance() {
    return afford(methodOn(RoleController.class).create(null));
  }
}
