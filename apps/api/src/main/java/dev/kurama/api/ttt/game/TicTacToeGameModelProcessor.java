package dev.kurama.api.ttt.game;

import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.WEBSOCKET_REL;
import static dev.kurama.api.core.utility.AuthorityUtils.hasAuthority;
import static dev.kurama.api.core.utility.AuthorityUtils.isCurrentUserId;
import static dev.kurama.api.core.utility.HateoasUtils.withDefaultAffordance;
import static dev.kurama.api.ttt.core.TicTacToeAuthority.TIC_TAC_TOE_GAME_CREATE;
import static dev.kurama.api.ttt.core.TicTacToeAuthority.TIC_TAC_TOE_GAME_MOVE;
import static dev.kurama.api.ttt.core.TicTacToeUtils.getPossibleMoves;
import static dev.kurama.api.ttt.game.TicTacToeGameChangedMessageSender.TIC_TAC_TOE_GAME_CHANGED_CHANNEL;
import static java.lang.String.format;
import static org.springframework.hateoas.mediatype.Affordances.of;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.afford;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import dev.kurama.api.core.hateoas.payload.InputPayloadMetadataImpl;
import dev.kurama.api.core.hateoas.payload.PropertyMetadataImpl;
import dev.kurama.api.ttt.core.TicTacToeRelations;
import dev.kurama.api.ttt.game.TicTacToeGame.Status;
import dev.kurama.api.ttt.move.TicTacToeGameMoveController;
import dev.kurama.api.ttt.player.TicTacToePlayer;
import java.util.List;
import java.util.Optional;
import lombok.NonNull;
import org.springframework.hateoas.Affordance;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkRelation;
import org.springframework.hateoas.UriTemplate;
import org.springframework.hateoas.server.RepresentationModelProcessor;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;

@Component
public class TicTacToeGameModelProcessor implements RepresentationModelProcessor<TicTacToeGameModel> {

  public @NonNull TicTacToeGameModel process(@NonNull TicTacToeGameModel entity) {
    boolean canUpdateStatus = entity.getStatus() == Status.PENDING && (hasAuthority(TIC_TAC_TOE_GAME_CREATE)
      || isCurrentUserId(entity.getPlayerO().getId()));
    boolean canMove = entity.getStatus() == Status.IN_PROGRESS && (hasAuthority(TIC_TAC_TOE_GAME_MOVE)
      || isCurrentUserId(
      entity.getTurn().equals(TicTacToePlayer.Token.X) ? entity.getPlayerX().getId() : entity.getPlayerO().getId()));
    return entity.add(getSelfLink(entity.getId()))
      .mapLinkIf(canUpdateStatus, LinkRelation.of(SELF),
        link -> link.andAffordance(getUpdateAffordance(entity.getId())))
      .add(getMovesLink(entity.getId()))
      .mapLinkIf(canMove, LinkRelation.of(TicTacToeRelations.TIC_TAC_TOE_MOVES_REL),
        (link) -> getMoveAffordance(entity))
      .add(getGameWebsocketLink(entity.getId()));
  }

  private Link getSelfLink(String id) {
    return withDefaultAffordance(linkTo(methodOn(TicTacToeGameController.class).get(id)).withSelfRel());
  }

  private Link getMovesLink(String gameId) {
    return withDefaultAffordance(linkTo(methodOn(TicTacToeGameMoveController.class).getAllGameMoves(gameId)).withRel(
      TicTacToeRelations.TIC_TAC_TOE_MOVES_REL));
  }

  private Affordance getUpdateAffordance(String gameId) {
    return afford(methodOn(TicTacToeGameController.class).status(gameId, null));
  }

  private Link getMoveAffordance(@NonNull TicTacToeGameModel game) {
    InputPayloadMetadataImpl metadata = new InputPayloadMetadataImpl();
    List<String> possibleMoves = getPossibleMoves(game.getBoard());
    if (!possibleMoves.isEmpty()) {
      PropertyMetadataImpl propertyMetadata = PropertyMetadataImpl.builder()
        .name("cell")
        .required(true)
        .inputType("text")
        .pattern(Optional.of("^(" + String.join("|", possibleMoves) + ")$"))
        .build();
      metadata.addProperty(propertyMetadata);
    }
    Link link = linkTo(methodOn(TicTacToeGameMoveController.class).move(game.getId(), null)).withRel(
      TicTacToeRelations.TIC_TAC_TOE_MOVES_REL);
    return of(link).afford(HttpMethod.POST).withName("move").withTarget(link).withInput(metadata).build().toLink();
  }


  public @NonNull Link getGameWebsocketLink(String gameId) {
    return Link.of(UriTemplate.of(format(TIC_TAC_TOE_GAME_CHANGED_CHANNEL, gameId)), WEBSOCKET_REL);
  }

}
