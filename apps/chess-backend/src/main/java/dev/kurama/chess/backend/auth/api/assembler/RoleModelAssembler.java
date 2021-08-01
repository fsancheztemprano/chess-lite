package dev.kurama.chess.backend.auth.api.assembler;

import static dev.kurama.chess.backend.auth.api.domain.relations.RoleRelations.ROLES_REL;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import dev.kurama.chess.backend.auth.api.domain.model.RoleModel;
import dev.kurama.chess.backend.auth.rest.RoleController;
import dev.kurama.chess.backend.core.api.assembler.DomainModelAssembler;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.PagedModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RoleModelAssembler extends DomainModelAssembler<RoleModel> {

  @Autowired
  private PagedResourcesAssembler<RoleModel> pagedResourcesAssembler;

  @Override
  protected Class<RoleController> getClazz() {
    return RoleController.class;
  }

  @Override
  public @NonNull RoleModel toModel(@NonNull RoleModel entity) {
    return entity
      .add(getModelSelfLink(entity.getId()))
      .add(getParentLink());
  }

  @Override
  public WebMvcLinkBuilder getSelfLink(String id) {
    return linkTo(methodOn(getClazz()).get(id));
  }

  @Override
  public WebMvcLinkBuilder getAllLink() {
    return linkTo(methodOn(getClazz()).getAll(null));
  }

  public @NonNull PagedModel<RoleModel> toPagedModel(Page<RoleModel> entities) {
    return (PagedModel<RoleModel>) pagedResourcesAssembler.toModel(entities, this)
      .add(getCollectionModelSelfLinkWithRel(getAllLink(), ROLES_REL))
      ;
  }

  private @NonNull Link getParentLink() {
    return linkTo(methodOn(getClazz()).getAll(null)).withRel(ROLES_REL);
  }
}
