package dev.kurama.api.core.api.assembler;

import static dev.kurama.api.core.api.domain.relations.AuthorityRelations.AUTHORITIES_REL;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import dev.kurama.api.core.api.domain.model.AuthorityModel;
import dev.kurama.api.core.rest.AuthorityController;
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
public class AuthorityModelAssembler extends DomainModelAssembler<AuthorityModel> {

  @Autowired
  private PagedResourcesAssembler<AuthorityModel> pagedResourcesAssembler;

  @Override
  protected Class<AuthorityController> getClazz() {
    return AuthorityController.class;
  }

  @Override
  public @NonNull
  AuthorityModel toModel(@NonNull AuthorityModel entity) {
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

  public @NonNull
  PagedModel<AuthorityModel> toPagedModel(Page<AuthorityModel> entities) {
    return (PagedModel<AuthorityModel>) pagedResourcesAssembler.toModel(entities, this)
      .add(getCollectionModelSelfLinkWithRel(getAllLink(), AUTHORITIES_REL))
      ;
  }

  private @NonNull
  Link getParentLink() {
    return linkTo(methodOn(getClazz()).getAll(null)).withRel(AUTHORITIES_REL);
  }
}
