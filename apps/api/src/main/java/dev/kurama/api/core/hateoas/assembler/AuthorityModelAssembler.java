package dev.kurama.api.core.hateoas.assembler;

import dev.kurama.api.core.hateoas.model.AuthorityModel;
import dev.kurama.api.core.rest.AuthorityController;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.data.domain.Page;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.stereotype.Component;

import static dev.kurama.api.core.authority.AuthorityAuthority.AUTHORITY_READ;
import static dev.kurama.api.core.hateoas.relations.AuthorityRelations.AUTHORITIES_REL;
import static dev.kurama.api.core.utility.AuthorityUtils.hasAuthority;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Component
@RequiredArgsConstructor
public class AuthorityModelAssembler extends DomainModelAssembler<AuthorityModel> {

  @NonNull
  private final PagedResourcesAssembler<AuthorityModel> pagedResourcesAssembler;

  protected Class<AuthorityController> getClazz() {
    return AuthorityController.class;
  }

  @SneakyThrows
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
                                                               .addIf(hasAuthority(AUTHORITY_READ),
                                                                 () -> getCollectionDefaultLink(getAllLink(),
                                                                   AUTHORITIES_REL))
      ;
  }
}
