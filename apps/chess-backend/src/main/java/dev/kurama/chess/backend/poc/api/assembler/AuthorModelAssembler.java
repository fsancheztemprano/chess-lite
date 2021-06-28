package dev.kurama.chess.backend.poc.api.assembler;

import static dev.kurama.chess.backend.core.api.authority.AuthorAuthority.AUTHOR_DELETE;
import static dev.kurama.chess.backend.core.api.authority.AuthorAuthority.AUTHOR_UPDATE;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.afford;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import dev.kurama.chess.backend.core.api.assembler.DomainModelAssembler;
import dev.kurama.chess.backend.poc.api.domain.output.AuthorModel;
import dev.kurama.chess.backend.poc.rest.AuthorResource;
import lombok.NonNull;
import org.springframework.hateoas.Affordance;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkRelation;
import org.springframework.hateoas.mediatype.Affordances;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;

@Component
public class AuthorModelAssembler implements DomainModelAssembler<AuthorModel> {

  private static final Class<AuthorResource> resourceClass = AuthorResource.class;

  @Override
  public @NonNull AuthorModel toModel(@NonNull AuthorModel authorModel) {
    return authorModel
      .add(getModelSelfLink(authorModel.getId()))
      .add(getParentLink())
      .mapLinkIf(hasAuthority(AUTHOR_DELETE),
        LinkRelation.of("self"),
        link -> link.andAffordance(getDeleteAffordance(authorModel.getId())))
      .mapLinkIf(hasAuthority(AUTHOR_UPDATE),
        LinkRelation.of("self"),
        link -> link.andAffordance(getUpdateAffordance(authorModel.getId())))
      ;
  }

  private @NonNull Link getParentLink() {
    return linkTo(methodOn(resourceClass).getAll()).withRel("authors");
  }

  private @NonNull Affordance getUpdateAffordance(Long id) {
    return afford(methodOn(resourceClass).put(id, null));
  }

  private @NonNull Affordance getDeleteAffordance(Long id) {
    return afford(methodOn(resourceClass).delete(id));
  }

  @Override
  public @NonNull Link getCollectionModelSelfLink() {
    return linkTo(methodOn(resourceClass).getAll()).withSelfRel();
  }

  @Override
  public @NonNull Link getModelSelfLink(@NonNull Long id) {
    Link link = linkTo(methodOn(resourceClass).get(id)).withSelfRel();

    var affordance = Affordances.of(link).afford(HttpMethod.HEAD).withName("default");

    return affordance.toLink();
  }

}
