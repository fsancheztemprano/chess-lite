package dev.kurama.api.core.hateoas.assembler;

import static dev.kurama.api.core.authority.RoleAuthority.ROLE_CREATE;
import static dev.kurama.api.core.authority.RoleAuthority.ROLE_READ;
import static dev.kurama.api.core.hateoas.relations.RoleRelations.ROLES_REL;
import static dev.kurama.api.core.utility.AuthorityUtils.hasAuthority;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.afford;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import dev.kurama.api.core.hateoas.model.RoleModel;
import dev.kurama.api.core.rest.RoleController;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.data.domain.Page;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.Affordance;
import org.springframework.hateoas.LinkRelation;
import org.springframework.hateoas.PagedModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RoleModelAssembler extends DomainModelAssembler<RoleModel> {

  @NonNull
  private final PagedResourcesAssembler<RoleModel> pagedResourcesAssembler;

  @Override
  protected Class<RoleController> getClazz() {
    return RoleController.class;
  }

  @SneakyThrows
  @Override
  public WebMvcLinkBuilder getSelfLink(String id) {
    return linkTo(methodOn(getClazz()).get(id));
  }

  @Override
  public WebMvcLinkBuilder getAllLink() {
    return linkTo(methodOn(getClazz()).getAll(null, null));
  }

  public @NonNull
  PagedModel<RoleModel> toPagedModel(Page<RoleModel> entities) {
    PagedModel<RoleModel> roleModels = pagedResourcesAssembler.toModel(entities, this);
    return !hasAuthority(ROLE_READ) ? roleModels : (PagedModel<RoleModel>) roleModels
      .add(getCollectionModelSelfLinkWithRel(getAllLink(), ROLES_REL))
      .mapLinkIf(hasAuthority(ROLE_CREATE),
        LinkRelation.of(ROLES_REL),
        link -> link.andAffordance(getCreateAffordance()))
      ;
  }

  @SneakyThrows
  private @NonNull
  Affordance getCreateAffordance() {
    return afford(methodOn(getClazz()).create(null));
  }
}
