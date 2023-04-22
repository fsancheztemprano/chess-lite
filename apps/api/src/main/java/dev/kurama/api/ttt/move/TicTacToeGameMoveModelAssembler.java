package dev.kurama.api.ttt.move;

import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import dev.kurama.api.core.hateoas.assembler.DomainModelAssembler;
import dev.kurama.api.ttt.core.TicTacToeRelations;
import dev.kurama.api.ttt.game.TicTacToeGameController;
import lombok.NonNull;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.Link;
import org.springframework.stereotype.Component;

@Component
public class TicTacToeGameMoveModelAssembler extends DomainModelAssembler<TicTacToeGameMoveModel> {

  public @NonNull CollectionModel<TicTacToeGameMoveModel> toCollectionModel(@NonNull Iterable<?
    extends TicTacToeGameMoveModel> entities,
                                                                            String gameId) {
    return super.toCollectionModel(entities).add(getSelfLink(gameId)).add(getGameLink(gameId));
  }

  @NonNull
  private static Link getSelfLink(String gameId) {
    return linkTo(methodOn(TicTacToeGameMoveController.class).getAllGameMoves(gameId)).withRel(SELF);
  }

  @NonNull
  private static Link getGameLink(String gameId) {
    return linkTo(methodOn(TicTacToeGameController.class).get(gameId)).withRel(TicTacToeRelations.TIC_TAC_TOE_GAME_REL);
  }
}
