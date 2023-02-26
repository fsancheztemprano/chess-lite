package dev.kurama.api.ttt.move;

import dev.kurama.api.ttt.game.TicTacToeGameMapper;
import dev.kurama.api.ttt.game.TicTacToeGameModel;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.CollectionModel;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TicTacToeGameMoveFacade {

  @NonNull
  private final TicTacToeGameMoveFacility facility;

  @NonNull
  private final TicTacToeGameMoveMapper mapper;

  @NonNull
  private final TicTacToeGameMoveModelAssembler assembler;

  @NonNull
  private final TicTacToeGameMapper ticTacToeGameMapper;

  public TicTacToeGameModel move(String gameId, TicTacToeGameMoveInput input) {
    return ticTacToeGameMapper.ticTacToeGameToTicTacToeGameModel(facility.move(gameId, input));
  }

  public CollectionModel<TicTacToeGameMoveModel> getAllGameMoves(String gameId) {
    return assembler.toCollectionModel(
      mapper.ticTacToeGameMoveCollectionToTicTacToeGameMoveCollectionModel(facility.getAllGameMoves(gameId)));
  }
}
