package dev.kurama.api.ttt.move;

import dev.kurama.api.ttt.game.TicTacToeGameMapper;
import dev.kurama.api.ttt.game.TicTacToeGameModel;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TicTacToeGameMoveFacade {

  @NonNull
  private final TicTacToeGameMoveFacility facility;

  @NonNull
  private final TicTacToeGameMapper mapper;

  public TicTacToeGameModel move(String gameId, TicTacToeGameMoveInput input) {
    return mapper.ticTacToeGameToTicTacToeGameModel(facility.move(gameId, input));
  }

}
