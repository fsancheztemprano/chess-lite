package dev.kurama.api.core.hateoas.assembler;

import static dev.kurama.api.core.authority.UserAuthority.USER_CREATE;
import static dev.kurama.api.core.authority.UserAuthority.USER_READ;
import static dev.kurama.api.core.hateoas.relations.UserRelations.USERS_REL;
import static dev.kurama.api.core.utility.AuthorityUtils.hasAuthority;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.afford;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import dev.kurama.api.core.hateoas.model.UserModel;
import dev.kurama.api.core.rest.UserController;
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
public class UserModelAssembler extends DomainModelAssembler<UserModel> {

  @NonNull
  private final PagedResourcesAssembler<UserModel> pagedResourcesAssembler;

  @Override
  protected Class<UserController> getClazz() {
    return UserController.class;
  }

  public @NonNull
  PagedModel<UserModel> toPagedModel(Page<UserModel> entities) {
    PagedModel<UserModel> userModels = pagedResourcesAssembler.toModel(entities, this);
    return !hasAuthority(USER_READ) ? userModels : (PagedModel<UserModel>) userModels
      .add(getCollectionModelSelfLinkWithRel(getAllLink(), USERS_REL))
      .mapLinkIf(hasAuthority(USER_CREATE),
        LinkRelation.of(USERS_REL),
        link -> link.andAffordance(getCreateAffordance()))
      ;
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

  @SneakyThrows
  private @NonNull
  Affordance getCreateAffordance() {
    return afford(methodOn(getClazz()).create(null));
  }
}
