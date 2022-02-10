package dev.kurama.api.core.hateoas.processor;

import dev.kurama.api.core.hateoas.model.AuthorityModel;
import dev.kurama.api.core.rest.AuthorityController;
import lombok.NonNull;
import lombok.SneakyThrows;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.RepresentationModelProcessor;
import org.springframework.stereotype.Component;

import static dev.kurama.api.core.authority.AuthorityAuthority.AUTHORITY_READ;
import static dev.kurama.api.core.hateoas.relations.AuthorityRelations.AUTHORITIES_REL;
import static dev.kurama.api.core.utility.AuthorityUtils.hasAuthority;
import static dev.kurama.api.core.utility.HateoasUtils.withDefaultAffordance;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Component
public class AuthorityModelProcessor implements RepresentationModelProcessor<AuthorityModel> {

  @Override
  public @NonNull AuthorityModel process(@NonNull AuthorityModel entity) {
    return !hasAuthority(AUTHORITY_READ) ? entity : entity
      .add(getSelfLink(entity.getId()))
      .add(getParentLink());
  }

  @SneakyThrows
  public Link getSelfLink(String id) {
    return withDefaultAffordance(linkTo(methodOn(AuthorityController.class).get(id)).withSelfRel());
  }

  private @NonNull Link getParentLink() {
    return linkTo(methodOn(AuthorityController.class).getAll(null)).withRel(AUTHORITIES_REL);
  }
}
