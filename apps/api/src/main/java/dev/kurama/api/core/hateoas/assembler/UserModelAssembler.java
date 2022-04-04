package dev.kurama.api.core.hateoas.assembler;

import static dev.kurama.api.core.authority.UserAuthority.USER_CREATE;
import static dev.kurama.api.core.authority.UserAuthority.USER_READ;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.WEBSOCKET_REL;
import static dev.kurama.api.core.message.UserChangedMessageSender.USERS_CHANGED_CHANNEL;
import static dev.kurama.api.core.utility.AuthorityUtils.hasAuthority;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.afford;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import dev.kurama.api.core.hateoas.model.UserModel;
import dev.kurama.api.core.rest.UserController;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.data.domain.Page;
import org.springframework.hateoas.Affordance;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkRelation;
import org.springframework.hateoas.PagedModel;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserModelAssembler extends DomainModelAssembler<UserModel> {

  @Override
  public @NonNull PagedModel<UserModel> toPagedModel(Page<UserModel> entities) {
    return (PagedModel<UserModel>) super.toPagedModel(entities)
      .mapLinkIf(hasAuthority(USER_CREATE), LinkRelation.of(SELF), link -> link.andAffordance(getCreateAffordance()))
      .addIf(hasAuthority(USER_READ), this::getWebSocket);
  }

  @SneakyThrows
  private @NonNull Affordance getCreateAffordance() {
    return afford(methodOn(UserController.class).create(null));
  }

  private @NonNull Link getWebSocket() {
    return Link.of(USERS_CHANGED_CHANNEL).withRel(WEBSOCKET_REL);
  }
}
