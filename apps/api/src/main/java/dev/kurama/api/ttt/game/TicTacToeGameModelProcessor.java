package dev.kurama.api.ttt.game;

import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static dev.kurama.api.core.utility.AuthorityUtils.hasAuthority;
import static dev.kurama.api.core.utility.AuthorityUtils.isCurrentUserId;
import static dev.kurama.api.core.utility.HateoasUtils.withDefaultAffordance;
import static dev.kurama.api.ttt.core.TicTacToeAuthority.TIC_TAC_TOE_GAME_CREATE;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.afford;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import lombok.NonNull;
import org.springframework.hateoas.Affordance;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkRelation;
import org.springframework.hateoas.server.RepresentationModelProcessor;
import org.springframework.stereotype.Component;

@Component
public class TicTacToeGameModelProcessor implements RepresentationModelProcessor<TicTacToeGameModel> {

  public @NonNull TicTacToeGameModel process(@NonNull TicTacToeGameModel entity) {
    boolean canUpdateStatus = hasAuthority(TIC_TAC_TOE_GAME_CREATE) || isCurrentUserId(entity.getPlayerO().getId());
    return entity.add(getSelfLink(entity.getId()))
      .mapLinkIf(canUpdateStatus, LinkRelation.of(SELF),
        link -> link.andAffordance(getUpdateAffordance(entity.getId())));
  }

  private Link getSelfLink(String id) {
    return withDefaultAffordance(linkTo(methodOn(TicTacToeGameController.class).get(id)).withSelfRel());
  }

  private Affordance getUpdateAffordance(String gameId) {
    return afford(methodOn(TicTacToeGameController.class).status(gameId, null));
  }
}
