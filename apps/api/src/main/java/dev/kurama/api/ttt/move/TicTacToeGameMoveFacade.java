package dev.kurama.api.ttt.move;

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


  public TicTacToeGameMoveModel move(String gameId, TicTacToeGameMoveInput input) {
    return mapper.ticTacToeGameMoveToTicTacToeGameMoveModel(facility.move(gameId, input));
  }

  public CollectionModel<TicTacToeGameMoveModel> getAllGameMoves(String gameId) {
    return assembler.toCollectionModel(
      mapper.ticTacToeGameMoveCollectionToTicTacToeGameMoveCollectionModel(facility.getAllGameMoves(gameId)), gameId);
  }
}
